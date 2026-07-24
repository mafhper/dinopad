import { z } from 'zod';
import { AnotacaoLeituraSchema, type AnotacaoLeitura } from '../../content/schema';

const DB_NAME = 'dinopad-study';
const DB_VERSION = 1;
const STORE_PROGRESS = 'progressos';
const STORE_FAVORITES = 'favoritos';
const STORE_ANNOTATIONS = 'anotacoes';
const STORE_METADATA = 'metadados';
export const STUDY_DATA_CHANGED_EVENT = 'dinopad:study-data-changed';

type Progress = {
  id: string;
  publicacaoId: string;
  camada: 'essencial' | 'aprofundar';
  percentual: number;
  marcadorBlocoId?: string;
  marcadorTitulo?: string;
  abertoEm: string;
  updatedAt: string;
};

type Favorite = {
  id: string;
  tipo: 'publicacao' | 'organismo' | 'dossie';
  entidadeId: string;
  updatedAt: string;
};

type Metadata = {
  id: string;
  value: unknown;
  updatedAt: string;
};

const ProgressSchema = z.object({
  id: z.string(),
  publicacaoId: z.string(),
  camada: z.enum(['essencial', 'aprofundar']),
  percentual: z.number().min(0).max(100),
  marcadorBlocoId: z.string().optional(),
  marcadorTitulo: z.string().optional(),
  abertoEm: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
const FavoriteSchema = z.object({
  id: z.string(),
  tipo: z.enum(['publicacao', 'organismo', 'dossie']),
  entidadeId: z.string(),
  updatedAt: z.string().datetime(),
});
const MetadataSchema = z.object({ id: z.string(), value: z.unknown(), updatedAt: z.string().datetime() });
const StudyExportSchema = z.object({
  versao: z.literal(1),
  exportadoEm: z.string().datetime(),
  progressos: z.array(ProgressSchema),
  favoritos: z.array(FavoriteSchema),
  anotacoes: z.array(AnotacaoLeituraSchema),
  metadados: z.array(MetadataSchema),
});

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      for (const name of [STORE_PROGRESS, STORE_FAVORITES, STORE_ANNOTATIONS, STORE_METADATA]) {
        if (!db.objectStoreNames.contains(name)) db.createObjectStore(name, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getAll<T>(storeName: string): Promise<T[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const request = transaction.objectStore(storeName).getAll();
    request.onsuccess = () => resolve(request.result as T[]);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
  });
}

async function put<T>(storeName: string, value: T): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    transaction.objectStore(storeName).put(value);
    transaction.oncomplete = () => { db.close(); resolve(); };
    transaction.onerror = () => reject(transaction.error);
  });
}

async function remove(storeName: string, id: string): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    transaction.objectStore(storeName).delete(id);
    transaction.oncomplete = () => { db.close(); resolve(); };
    transaction.onerror = () => reject(transaction.error);
  });
}

function notifyStudyDataChanged() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(STUDY_DATA_CHANGED_EVENT));
}

export const studyDb = {
  progressos: () => getAll<Progress>(STORE_PROGRESS),
  favoritos: () => getAll<Favorite>(STORE_FAVORITES),
  anotacoes: () => getAll<AnotacaoLeitura>(STORE_ANNOTATIONS),
  metadados: () => getAll<Metadata>(STORE_METADATA),
  async salvarProgresso(value: Progress) {
    await put(STORE_PROGRESS, value);
    notifyStudyDataChanged();
  },
  async salvarFavorito(value: Favorite) {
    await put(STORE_FAVORITES, value);
    notifyStudyDataChanged();
  },
  async removerFavorito(id: string) {
    await remove(STORE_FAVORITES, id);
    notifyStudyDataChanged();
  },
  async salvarAnotacao(value: AnotacaoLeitura) {
    await put(STORE_ANNOTATIONS, AnotacaoLeituraSchema.parse(value));
    notifyStudyDataChanged();
  },
  async removerAnotacao(id: string) {
    await remove(STORE_ANNOTATIONS, id);
    notifyStudyDataChanged();
  },
  async salvarMetadata(value: Metadata) {
    await put(STORE_METADATA, value);
    notifyStudyDataChanged();
  },
  async exportar() {
    return StudyExportSchema.parse({
      versao: 1,
      exportadoEm: new Date().toISOString(),
      progressos: await this.progressos(),
      favoritos: await this.favoritos(),
      anotacoes: await this.anotacoes(),
      metadados: await this.metadados(),
    });
  },
  async importar(raw: unknown) {
    const data = StudyExportSchema.parse(raw);
    const collections = [
      [STORE_PROGRESS, data.progressos],
      [STORE_FAVORITES, data.favoritos],
      [STORE_ANNOTATIONS, data.anotacoes],
      [STORE_METADATA, data.metadados],
    ] as const;
    const timestamp = (item: { updatedAt?: string; atualizadaEm?: string }) => item.updatedAt ?? item.atualizadaEm ?? '';
    for (const [storeName, incoming] of collections) {
      const existing = new Map((await getAll<{ id: string; updatedAt?: string; atualizadaEm?: string }>(storeName)).map((item) => [item.id, item]));
      for (const item of incoming) {
        const current = existing.get(item.id);
        if (!current || timestamp(item) >= timestamp(current)) await put(storeName, item);
      }
    }
    notifyStudyDataChanged();
    return data;
  },
};

export type { Favorite, Metadata, Progress };
