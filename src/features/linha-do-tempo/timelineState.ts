export type CamadaTempo = 'vida' | 'fanerozoico' | 'mesozoico' | 'periodo' | 'organismo';
export type FiltroTempo = 'todos' | 'fauna' | 'flora' | 'marcos';
export interface TimelineView { inicioMa: number; fimMa: number; camada: CamadaTempo; item: string | null; filtro: FiltroTempo }

export const DOMINIOS: Record<Exclude<CamadaTempo, 'periodo' | 'organismo'>, [number, number]> = {
  vida: [4031, 0],
  fanerozoico: [538.8, 0],
  mesozoico: [251.902, 66],
};
export const DEFAULT_TIMELINE_VIEW: TimelineView = { inicioMa: DOMINIOS.mesozoico[0], fimMa: DOMINIOS.mesozoico[1], camada: 'mesozoico', item: null, filtro: 'todos' };
const CAMADAS: CamadaTempo[] = ['vida', 'fanerozoico', 'mesozoico', 'periodo', 'organismo'];
const FILTROS: FiltroTempo[] = ['todos', 'fauna', 'flora', 'marcos'];

export function parseTimelineSearch(search: URLSearchParams): { view: TimelineView; valid: boolean } {
  if ([...search.keys()].length === 0) return { view: DEFAULT_TIMELINE_VIEW, valid: true };
  const inicioMa = Number(search.get('inicioMa'));
  const fimMa = Number(search.get('fimMa'));
  const camadaParam = search.get('camada');
  const camada = (camadaParam === 'criatura' ? 'organismo' : camadaParam) as CamadaTempo | null;
  const filtroParam = search.get('filtro') as FiltroTempo | null;
  const filtro = filtroParam && FILTROS.includes(filtroParam) ? filtroParam : 'todos';
  const item = search.get('item');
  const valid = Number.isFinite(inicioMa) && Number.isFinite(fimMa) && inicioMa > fimMa && inicioMa <= 4031 && fimMa >= 0 && camada !== null && CAMADAS.includes(camada) && (camada !== 'organismo' || Boolean(item)) && (!filtroParam || FILTROS.includes(filtroParam));
  return valid ? { view: { inicioMa, fimMa, camada, item, filtro }, valid: true } : { view: DEFAULT_TIMELINE_VIEW, valid: false };
}

export function encodeTimelineView(view: TimelineView): Record<string, string> {
  const result: Record<string, string> = { inicioMa: String(Number(view.inicioMa.toFixed(4))), fimMa: String(Number(view.fimMa.toFixed(4))), camada: view.camada, filtro: view.filtro };
  if (view.item) result.item = view.item;
  return result;
}

export function intervaloComMargem(inicioMa: number, fimMa: number, margem = 0.35): [number, number] {
  const amplitude = Math.max(inicioMa - fimMa, 1);
  return [Math.min(4031, inicioMa + amplitude * margem), Math.max(0, fimMa - amplitude * margem)];
}

export function tempoParaPosicao(tempoMa: number, inicioMa: number, fimMa: number, altura: number): number {
  if (inicioMa <= fimMa) throw new Error('O início do domínio deve ser mais antigo que o fim.');
  return ((inicioMa - tempoMa) / (inicioMa - fimMa)) * altura;
}

export function agruparMarcas<T extends { id: string; y: number }>(marcas: T[], distancia = 34): T[][] {
  const ordenadas = [...marcas].sort((a, b) => a.y - b.y);
  const grupos: T[][] = [];
  for (const marca of ordenadas) {
    const ultimo = grupos.at(-1);
    if (!ultimo || marca.y - ultimo.at(-1)!.y > distancia) grupos.push([marca]);
    else ultimo.push(marca);
  }
  return grupos;
}
