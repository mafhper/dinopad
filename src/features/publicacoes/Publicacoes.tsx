import { type FormEvent, type ReactNode, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  IconeBiblioteca,
  IconeComentario,
  IconeConcluido,
  IconeDestaque,
  IconeFavorito,
  IconeFechar,
  IconeMarcador,
  IconeSeta,
  IconeVoltar,
} from '../../components/Icons';
import type {
  AnotacaoLeitura,
  BlocoEditorial,
  Publicacao,
  TextQuoteSelector,
} from '../../content/schema';
import { useAtlas } from '../../hooks/useAtlas';
import { studyDb, type Progress } from '../estudo/study-db';
import { reanchorTextQuote } from '../estudo/text-quote';

const publicationModeLabels: Record<Publicacao['modo'], string> = {
  'sintese-dinopad': 'Síntese Dinopad',
  'traducao-autorizada': 'Tradução autorizada',
  'leitura-guiada': 'Leitura guiada',
};

function blockText(block: BlocoEditorial) {
  return block.texto ?? block.itens?.join(' · ') ?? '';
}

type PendingSelection = {
  blockId: string;
  selector: TextQuoteSelector;
};

function selectionFromBlock(blockId: string): PendingSelection | undefined {
  const selection = window.getSelection();
  const range = selection?.rangeCount ? selection.getRangeAt(0) : undefined;
  const content = document.querySelector<HTMLElement>(`[data-reader-content="${blockId}"]`);
  if (!selection || !range || selection.isCollapsed || !content) return undefined;
  if (!content.contains(range.startContainer) || !content.contains(range.endContainer)) return undefined;

  const raw = range.toString();
  const exact = raw.trim();
  if (!exact) return undefined;

  const before = range.cloneRange();
  before.selectNodeContents(content);
  before.setEnd(range.startContainer, range.startOffset);
  const leadingWhitespace = raw.length - raw.trimStart().length;
  const start = before.toString().length + leadingWhitespace;
  const fullText = content.textContent ?? '';
  return {
    blockId,
    selector: {
      exact,
      prefix: fullText.slice(Math.max(0, start - 32), start),
      suffix: fullText.slice(start + exact.length, start + exact.length + 32),
    },
  };
}

function HighlightedText({ block, annotations }: { block: BlocoEditorial; annotations: AnotacaoLeitura[] }) {
  const text = blockText(block);
  const anchored = annotations
    .filter((item) => item.blockId === block.id)
    .map((item) => ({ item, index: reanchorTextQuote(text, item.seletor) }))
    .filter(({ index }) => index >= 0)
    .sort((a, b) => a.index - b.index);
  if (!anchored.length) return <>{text}</>;
  const parts: ReactNode[] = [];
  let cursor = 0;
  for (const { item, index } of anchored) {
    if (index < cursor) continue;
    parts.push(text.slice(cursor, index));
    parts.push(<mark key={item.id} title={item.nota || 'Destaque salvo'}>{item.seletor.exact}</mark>);
    cursor = index + item.seletor.exact.length;
  }
  parts.push(text.slice(cursor));
  return <>{parts}</>;
}

function SummaryBlock({ block }: { block: BlocoEditorial }) {
  return (
    <section>
      {block.titulo && <h3>{block.titulo}</h3>}
      {block.itens
        ? <ul>{block.itens.map((item) => <li key={item}>{item}</li>)}</ul>
        : block.texto && <p>{block.texto}</p>}
    </section>
  );
}

function ReaderBlock({
  active,
  annotations,
  block,
  bookmarked,
  pendingSelection,
  onActivate,
  onBookmark,
  onComment,
  onHighlight,
  onRemoveAnnotation,
  onSelection,
}: {
  active: boolean;
  annotations: AnotacaoLeitura[];
  block: BlocoEditorial;
  bookmarked: boolean;
  pendingSelection?: PendingSelection;
  onActivate: () => void;
  onBookmark: () => void;
  onComment: (selector: TextQuoteSelector, note: string) => Promise<void>;
  onHighlight: (selector: TextQuoteSelector) => Promise<void>;
  onRemoveAnnotation: (id: string) => Promise<void>;
  onSelection: (selection?: PendingSelection) => void;
}) {
  const [commenting, setCommenting] = useState(false);
  const [note, setNote] = useState('');
  const content = block.texto && <HighlightedText annotations={annotations} block={block} />;
  const selectedHere = pendingSelection?.blockId === block.id ? pendingSelection.selector : undefined;
  const blockAnnotations = annotations.filter((item) => item.blockId === block.id);
  const captureSelection = () => {
    const next = selectionFromBlock(block.id);
    if (next) {
      onSelection(next);
      onActivate();
    }
  };
  const submitComment = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedHere || !note.trim()) return;
    await onComment(selectedHere, note.trim());
    setNote('');
    setCommenting(false);
  };

  return (
    <section
      className={`reader-block reader-block-${block.tipo}${bookmarked ? ' is-bookmarked' : ''}${active ? ' is-tools-active' : ''}`}
      data-block-id={block.id}
      id={`reader-block-${block.id}`}
      onFocus={onActivate}
      onPointerDown={(event) => {
        if (!(event.target as HTMLElement).closest('button, textarea')) onActivate();
      }}
      tabIndex={-1}
    >
      <div className="reader-block-heading">
        {block.titulo && <h2>{block.titulo}</h2>}
        <div aria-label="Ações deste trecho" className="reader-block-tools" role="toolbar">
          <button
            aria-label={bookmarked ? 'Remover ponto de leitura' : 'Continuar daqui depois'}
            aria-pressed={bookmarked}
            onClick={onBookmark}
            title={bookmarked ? 'Remover ponto de leitura' : 'Continuar daqui depois'}
            type="button"
          >
            <IconeMarcador size={18} />
          </button>
          <button
            aria-label="Destacar o texto selecionado"
            disabled={!selectedHere}
            onClick={() => selectedHere && void onHighlight(selectedHere)}
            title={selectedHere ? 'Destacar seleção' : 'Selecione um trecho primeiro'}
            type="button"
          >
            <IconeDestaque size={18} />
          </button>
          <button
            aria-label="Comentar o texto selecionado"
            disabled={!selectedHere}
            onClick={() => setCommenting(Boolean(selectedHere))}
            title={selectedHere ? 'Adicionar comentário' : 'Selecione um trecho primeiro'}
            type="button"
          >
            <IconeComentario size={18} />
          </button>
        </div>
      </div>
      {block.itens
        ? <ul data-reader-content={block.id} onKeyUp={captureSelection} onPointerUp={captureSelection}>{block.itens.map((item) => <li key={item}>{item}</li>)}</ul>
        : block.tipo === 'citacao'
          ? <blockquote data-reader-content={block.id} onKeyUp={captureSelection} onPointerUp={captureSelection}>{content}</blockquote>
          : block.texto && <p data-reader-content={block.id} onKeyUp={captureSelection} onPointerUp={captureSelection}>{content}</p>}
      {active && !selectedHere && <p className="reader-block-tool-hint">Selecione uma frase para destacar ou comentar.</p>}
      {commenting && selectedHere && (
        <form className="reader-note-editor" onSubmit={submitComment}>
          <span>“{selectedHere.exact}”</span>
          <label htmlFor={`reader-note-${block.id}`}>Comentário</label>
          <textarea
            autoFocus
            id={`reader-note-${block.id}`}
            onChange={(event) => setNote(event.target.value)}
            placeholder="O que você quer lembrar sobre este trecho?"
            rows={3}
            value={note}
          />
          <div>
            <button onClick={() => setCommenting(false)} type="button">Cancelar</button>
            <button disabled={!note.trim()} type="submit">Salvar comentário</button>
          </div>
        </form>
      )}
      {blockAnnotations.length > 0 && (
        <ul aria-label="Destaques e comentários deste trecho" className="reader-annotation-list">
          {blockAnnotations.map((annotation) => (
            <li key={annotation.id}>
              <span>{annotation.nota ? 'Comentário' : 'Destaque'}</span>
              <q>{annotation.seletor.exact}</q>
              {annotation.nota && <p>{annotation.nota}</p>}
              <button aria-label="Remover anotação" onClick={() => void onRemoveAnnotation(annotation.id)} type="button"><IconeFechar size={16} /></button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function EditorialDiagram({ publicationId }: { publicationId: string }) {
  if (publicationId === 'arvore-ou-escada') {
    return (
      <figure className="reader-concept-figure">
        <svg aria-label="Uma linhagem que se ramifica em várias espécies, em contraste com uma escada linear" role="img" viewBox="0 0 720 290">
          <g className="diagram-muted">
            <path d="M70 235 190 185 310 135 430 85 550 35" />
            <circle cx="70" cy="235" r="8" /><circle cx="190" cy="185" r="8" /><circle cx="310" cy="135" r="8" /><circle cx="430" cy="85" r="8" /><circle cx="550" cy="35" r="8" />
            <text x="55" y="270">escada: uma fila única</text>
          </g>
          <g className="diagram-primary">
            <path d="M70 150H205M205 150C250 150 255 65 310 65M205 150C250 150 255 150 310 150M205 150C250 150 255 235 310 235M310 65H475M310 150H475M310 235H475" />
            <circle cx="70" cy="150" r="8" /><circle cx="205" cy="150" r="8" /><circle cx="310" cy="65" r="8" /><circle cx="310" cy="150" r="8" /><circle cx="310" cy="235" r="8" />
            <text x="335" y="58">ramo A</text><text x="335" y="143">ramo B</text><text x="335" y="228">ramo C</text>
            <text x="55" y="28">árvore: separações e coexistência</text>
          </g>
        </svg>
        <figcaption>Galhos mostram hipóteses de parentesco. A posição mais alta ou mais à direita não significa “mais evoluído”.</figcaption>
      </figure>
    );
  }

  if (publicationId === 'familia-humana') {
    return (
      <figure className="reader-concept-figure">
        <svg aria-label="Grupos taxonômicos aninhados da família dos hominídeos até o gênero Homo" role="img" viewBox="0 0 720 290">
          <g className="diagram-primary">
            <rect height="220" rx="24" width="620" x="50" y="35" />
            <rect height="160" rx="20" width="460" x="160" y="75" />
            <rect height="100" rx="16" width="285" x="285" y="115" />
            <rect height="52" rx="12" width="125" x="405" y="139" />
          </g>
          <g className="diagram-labels">
            <text x="75" y="68">Hominidae</text><text x="185" y="108">Homininae</text><text x="310" y="148">Hominini</text><text x="435" y="172">Homo</text>
          </g>
        </svg>
        <figcaption>Os nomes indicam grupos dentro de grupos; não são degraus de inteligência ou de progresso.</figcaption>
      </figure>
    );
  }

  if (publicationId === 'eva-mitocondrial-explicada' || publicationId === 'leitura-cann-1987') {
    return (
      <figure className="reader-concept-figure">
        <svg aria-label="Várias linhagens de DNA mitocondrial atuais convergindo em uma ancestral comum" role="img" viewBox="0 0 720 290">
          <g className="diagram-primary">
            <path d="M100 55C100 125 310 115 350 235M230 55C230 125 330 135 350 235M360 55C360 135 360 170 350 235M490 55C490 135 390 135 350 235M620 55C620 125 410 115 350 235" />
            <circle cx="100" cy="50" r="8" /><circle cx="230" cy="50" r="8" /><circle cx="360" cy="50" r="8" /><circle cx="490" cy="50" r="8" /><circle cx="620" cy="50" r="8" /><circle cx="350" cy="235" r="11" />
          </g>
          <g className="diagram-labels"><text x="260" y="275">ancestral comum desta linhagem genética</text><text x="285" y="28">amostras atuais</text></g>
        </svg>
        <figcaption>O ponto de coalescência pertence a uma linha de herança. Muitas outras pessoas viveram no mesmo período e também deixaram descendentes.</figcaption>
      </figure>
    );
  }

  if (publicationId === 'migracoes-e-encontros' || publicationId === 'leitura-green-2010' || publicationId === 'leitura-reich-2010') {
    return (
      <figure className="reader-concept-figure">
        <svg aria-label="Três populações humanas se separando e voltando a trocar genes" role="img" viewBox="0 0 720 290">
          <g className="diagram-primary">
            <path d="M75 145H210C265 145 265 65 325 65H640M210 145C265 145 265 145 325 145H640M210 145C265 145 265 225 325 225H640" />
            <path className="diagram-dashed" d="M425 65C455 110 455 110 485 145M505 145C535 185 535 185 565 225" />
            <circle cx="75" cy="145" r="9" /><circle cx="210" cy="145" r="9" />
          </g>
          <g className="diagram-labels"><text x="335" y="56">Neandertais</text><text x="335" y="136">H. sapiens</text><text x="335" y="216">Denisovanos</text><text x="475" y="112">fluxo gênico</text></g>
        </svg>
        <figcaption>As linhas tracejadas representam encontros e fluxo gênico; elas não transformam as populações em uma única espécie nem em novos galhos principais.</figcaption>
      </figure>
    );
  }

  if (publicationId === 'fosseis-e-dna-antigo' || publicationId === 'leitura-berger-2015') {
    return (
      <figure className="reader-concept-figure">
        <svg aria-label="Fluxo de investigação: contexto, fóssil, laboratório, comparação e revisão" role="img" viewBox="0 0 720 290">
          <g className="diagram-primary">
            <path d="M80 145H640" />
            <circle cx="95" cy="145" r="28" /><circle cx="225" cy="145" r="28" /><circle cx="355" cy="145" r="28" /><circle cx="485" cy="145" r="28" /><circle cx="615" cy="145" r="28" />
          </g>
          <g className="diagram-labels">
            <text x="68" y="150">sítio</text><text x="202" y="150">fóssil</text><text x="326" y="150">medidas</text><text x="458" y="150">testes</text><text x="582" y="150">revisão</text>
          </g>
        </svg>
        <figcaption>Uma conclusão forte nasce da concordância entre contexto geológico, anatomia, datação, genética quando disponível e comparação com outros achados.</figcaption>
      </figure>
    );
  }

  return null;
}

function PublicationIllustration({ publication }: { publication: Publicacao }) {
  const { mediaPorId, organismosPorId } = useAtlas();
  const diagram = <EditorialDiagram publicationId={publication.id} />;
  const hasDiagram = [
    'arvore-ou-escada',
    'familia-humana',
    'eva-mitocondrial-explicada',
    'leitura-cann-1987',
    'migracoes-e-encontros',
    'leitura-green-2010',
    'leitura-reich-2010',
    'fosseis-e-dna-antigo',
    'leitura-berger-2015',
  ].includes(publication.id);
  if (hasDiagram) return diagram;

  const assets = publication.organismoIds.flatMap((id) => {
    const organism = organismosPorId.get(id);
    const asset = organism ? mediaPorId.get(organism.mediaPrincipalId) : undefined;
    return asset ? [asset] : [];
  }).filter((asset, index, items) => items.findIndex(({ id }) => id === asset.id) === index).slice(0, 2);

  if (!assets.length) return null;
  return (
    <figure className="reader-image-figure">
      <div>
        {assets.map((asset) => <img alt={asset.altPt} key={asset.id} loading="lazy" src={asset.arquivos.src} />)}
      </div>
      <figcaption>{assets.map((asset) => `${asset.titulo} — ${asset.autor}, ${asset.licenca}`).join(' · ')}</figcaption>
    </figure>
  );
}

function PublicationReader({ publication }: { publication: Publicacao }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeBlockId, setActiveBlockId] = useState<string>();
  const [annotations, setAnnotations] = useState<AnotacaoLeitura[]>([]);
  const [favorite, setFavorite] = useState(false);
  const [pendingSelection, setPendingSelection] = useState<PendingSelection>();
  const [progress, setProgress] = useState<Progress>();
  const [message, setMessage] = useState('');
  const articleBlocks = publication.camadaAprofundar;
  const completed = (progress?.percentual ?? 0) >= 100;
  const bookmarkedBlock = progress?.marcadorBlocoId
    ? articleBlocks.find(({ id }) => id === progress.marcadorBlocoId)
    : undefined;

  useEffect(() => {
    void Promise.all([studyDb.anotacoes(), studyDb.favoritos(), studyDb.progressos()]).then(([storedAnnotations, favorites, storedProgress]) => {
      setAnnotations(storedAnnotations.filter((item) => item.publicacaoId === publication.id));
      setFavorite(favorites.some(({ id }) => id === `publicacao-${publication.id}`));
      const current = storedProgress.find(({ publicacaoId }) => publicacaoId === publication.id);
      const now = new Date().toISOString();
      const opened: Progress = {
        id: publication.id,
        publicacaoId: publication.id,
        camada: 'aprofundar',
        percentual: Math.max(current?.percentual ?? 0, 10),
        marcadorBlocoId: current?.marcadorBlocoId,
        marcadorTitulo: current?.marcadorTitulo,
        abertoEm: current?.abertoEm ?? now,
        updatedAt: now,
      };
      setProgress(opened);
      void studyDb.salvarProgresso(opened);
    }).catch(() => setMessage('O armazenamento local não está disponível neste navegador.'));
  }, [publication.id]);

  const toggleFavorite = async () => {
    const id = `publicacao-${publication.id}`;
    if (favorite) await studyDb.removerFavorito(id);
    else await studyDb.salvarFavorito({ id, tipo: 'publicacao', entidadeId: publication.id, updatedAt: new Date().toISOString() });
    setFavorite(!favorite);
  };

  const toggleCompleted = async () => {
    const now = new Date().toISOString();
    const nextCompleted = !completed;
    const next: Progress = {
      id: publication.id,
      publicacaoId: publication.id,
      camada: 'aprofundar',
      percentual: nextCompleted ? 100 : progress?.marcadorBlocoId ? Math.min(progress.percentual, 95) : 10,
      marcadorBlocoId: progress?.marcadorBlocoId,
      marcadorTitulo: progress?.marcadorTitulo,
      abertoEm: progress?.abertoEm ?? now,
      updatedAt: now,
    };
    await studyDb.salvarProgresso(next);
    setProgress(next);
    setMessage(nextCompleted ? 'Leitura marcada como concluída.' : 'Leitura devolvida à estante de hoje.');
  };

  const saveBookmark = async (block: BlocoEditorial, index: number) => {
    const now = new Date().toISOString();
    const removing = progress?.marcadorBlocoId === block.id;
    const next: Progress = {
      id: publication.id,
      publicacaoId: publication.id,
      camada: 'aprofundar',
      percentual: Math.max(progress?.percentual && progress.percentual < 100 ? progress.percentual : 10, Math.min(95, Math.round(((index + 1) / articleBlocks.length) * 100))),
      marcadorBlocoId: removing ? undefined : block.id,
      marcadorTitulo: removing ? undefined : block.titulo ?? 'Trecho salvo',
      abertoEm: progress?.abertoEm ?? now,
      updatedAt: now,
    };
    await studyDb.salvarProgresso(next);
    setProgress(next);
    setMessage(removing ? 'Ponto de leitura removido.' : `Ponto de leitura salvo em “${next.marcadorTitulo}”.`);
  };

  const saveAnnotation = async (block: BlocoEditorial, selector: TextQuoteSelector, note = '') => {
    const now = new Date().toISOString();
    const annotation: AnotacaoLeitura = {
      id: `anotacao-${publication.id}-${now.replace(/\D/g, '')}-${annotations.length}`,
      publicacaoId: publication.id,
      versaoConteudo: publication.revisao.revisadoEm,
      blockId: block.id,
      seletor: selector,
      nota: note,
      status: 'ancorada',
      criadaEm: now,
      atualizadaEm: now,
    };
    await studyDb.salvarAnotacao(annotation);
    setAnnotations((current) => [...current, annotation]);
    setPendingSelection(undefined);
    window.getSelection()?.removeAllRanges();
    setMessage(note ? 'Comentário salvo neste trecho.' : 'Trecho destacado.');
  };

  const removeAnnotation = async (id: string) => {
    await studyDb.removerAnotacao(id);
    setAnnotations((current) => current.filter((item) => item.id !== id));
    setMessage('Anotação removida.');
  };

  const resumeReading = () => {
    if (!bookmarkedBlock) return;
    const target = document.getElementById(`reader-block-${bookmarkedBlock.id}`);
    target?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    });
    window.setTimeout(() => target?.focus({ preventScroll: true }), 220);
  };

  useEffect(() => {
    const blockId = searchParams.get('retomar');
    if (!blockId || !articleBlocks.some(({ id }) => id === blockId)) return;
    const timer = window.setTimeout(() => {
      const target = document.getElementById(`reader-block-${blockId}`);
      target?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start',
      });
      window.setTimeout(() => target?.focus({ preventScroll: true }), 220);
    }, 80);
    return () => window.clearTimeout(timer);
  }, [articleBlocks, searchParams]);

  const orphaned = annotations.filter((annotation) => {
    const currentBlock = [...publication.camadaEssencial, ...publication.camadaAprofundar].find(({ id }) => id === annotation.blockId);
    return !currentBlock || reanchorTextQuote(blockText(currentBlock), annotation.seletor) < 0;
  });

  return (
    <article className="publication-reader">
      <header className="reader-header">
        <button aria-label="Voltar à biblioteca" className="icon-button" onClick={() => navigate('/publicacoes')} type="button"><IconeVoltar size={20} /></button>
        <div className="reader-title">
          <p className="eyebrow">{publicationModeLabels[publication.modo]}</p>
          <h1>{publication.titulo}</h1>
          <p>{publication.autores.join(', ')} · {publication.minutosLeitura} min</p>
        </div>
        <button aria-pressed={favorite} className={`reader-favorite${favorite ? ' is-active' : ''}`} onClick={toggleFavorite} type="button">
          <IconeFavorito size={18} />{favorite ? 'Favoritada' : 'Favoritar'}
        </button>
      </header>

      {bookmarkedBlock && !completed && (
        <button className="reader-resume" onClick={resumeReading} type="button">
          <IconeMarcador size={18} />
          <span><strong>Continuar de onde parei</strong><small>{progress?.marcadorTitulo}</small></span>
          <IconeSeta size={17} />
        </button>
      )}

      <section className="reader-summary" aria-labelledby="reader-summary-title">
        <p className="eyebrow">TL;DR</p>
        <h2 id="reader-summary-title">Resumo</h2>
        {publication.camadaEssencial.map((block) => <SummaryBlock block={block} key={block.id} />)}
      </section>

      <PublicationIllustration publication={publication} />

      <div className="reader-body">
        <header className="reader-article-heading">
          <p className="eyebrow">Texto completo</p>
          <h2>Entenda o assunto</h2>
        </header>
        {articleBlocks.map((block, index) => (
          <ReaderBlock
            active={activeBlockId === block.id}
            annotations={annotations}
            block={block}
            bookmarked={progress?.marcadorBlocoId === block.id}
            key={block.id}
            onActivate={() => setActiveBlockId(block.id)}
            onBookmark={() => { void saveBookmark(block, index); }}
            onComment={(selector, note) => saveAnnotation(block, selector, note)}
            onHighlight={(selector) => saveAnnotation(block, selector)}
            onRemoveAnnotation={removeAnnotation}
            onSelection={setPendingSelection}
            pendingSelection={pendingSelection}
          />
        ))}
        {orphaned.length > 0 && <aside className="orphaned-annotations"><h2>Anotações para revisar</h2><p>{orphaned.length} destaque(s) antigo(s) não puderam ser reencontrados após uma revisão editorial. Nada foi apagado.</p></aside>}
      </div>

      <footer className="reader-source">
        <strong>Fonte e direitos</strong>
        <p>{publication.notaEditorial}</p>
        <a href={publication.fonteOriginal.url} rel="noreferrer" target="_blank">Abrir publicação original <IconeSeta size={15} /></a>
      </footer>

      <section className="reader-completion" aria-labelledby="reader-completion-title">
        <div>
          <h2 id="reader-completion-title">{completed ? 'Leitura concluída' : 'Terminou a leitura?'}</h2>
          <p>{completed ? 'Ela não aparecerá novamente na seleção diária da página inicial.' : 'Marque apenas quando chegar ao fim. O ponto de retomada pode continuar salvo.'}</p>
        </div>
        <button aria-pressed={completed} className={completed ? 'is-active' : ''} onClick={toggleCompleted} type="button">
          <IconeConcluido size={18} />{completed ? 'Lida' : 'Marcar como lida'}
        </button>
        <span aria-live="polite">{message}</span>
      </section>
    </article>
  );
}

export default function Publicacoes() {
  const { slug } = useParams();
  const { publicacoes } = useAtlas();
  const publication = publicacoes.find((item) => item.slug === slug);
  const grouped = useMemo(() => ({
    'Sínteses Dinopad': publicacoes.filter(({ modo }) => modo === 'sintese-dinopad'),
    'Traduções CC BY': publicacoes.filter(({ modo }) => modo === 'traducao-autorizada'),
    'Leituras guiadas': publicacoes.filter(({ modo }) => modo === 'leitura-guiada'),
  }), [publicacoes]);

  if (publication) return <div className="page-scroll"><PublicationReader publication={publication} /></div>;

  return (
    <div className="page-scroll library-page">
      <header className="library-hero">
        <IconeBiblioteca size={30} />
        <p className="eyebrow">Textos em português</p>
        <h1>Biblioteca</h1>
        <p>Cada leitura começa com um resumo e segue em um texto contínuo. Você pode favoritar e guardar o ponto em que parou.</p>
      </header>
      {Object.entries(grouped).map(([title, items]) => (
        <section className="library-section" key={title}>
          <div className="section-heading"><h2>{title}</h2></div>
          <div className="publication-grid">
            {items.map((item) => (
              <Link className="publication-card" key={item.id} to={`/publicacoes/${item.slug}`}>
                <span>{item.minutosLeitura} min</span>
                <h3>{item.titulo}</h3>
                <p>{item.camadaEssencial[0]?.texto}</p>
                <small>{item.autores.join(', ')}</small>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
