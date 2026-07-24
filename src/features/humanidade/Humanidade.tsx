import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { IconeArvore, IconeBiblioteca, IconeSeta } from '../../components/Icons';
import { useAtlas } from '../../hooks/useAtlas';

const humanSpecimenIds = new Set([
  'toumai',
  'ardi',
  'lucy',
  'taung-1',
  'little-foot',
  'oh-7',
  'turkana-boy',
  'dmanisi-5',
  'neanderthal-1',
  'denisova-3',
  'lb1',
  'dh1',
]);

const readingIdsBySpecimen: Record<string, string[]> = {
  toumai: ['familia-humana', 'arvore-ou-escada'],
  ardi: ['familia-humana', 'arvore-ou-escada'],
  lucy: ['familia-humana', 'arvore-ou-escada'],
  'taung-1': ['familia-humana', 'arvore-ou-escada'],
  'little-foot': ['familia-humana', 'arvore-ou-escada'],
  'oh-7': ['fosseis-e-dna-antigo', 'familia-humana'],
  'turkana-boy': ['fosseis-e-dna-antigo', 'migracoes-e-encontros'],
  'dmanisi-5': ['migracoes-e-encontros', 'fosseis-e-dna-antigo'],
  'neanderthal-1': ['dna-neandertal', 'leitura-green-2010'],
  'denisova-3': ['leitura-reich-2010', 'migracoes-e-encontros'],
  lb1: ['fosseis-e-dna-antigo', 'arvore-ou-escada'],
  dh1: ['leitura-berger-2015', 'fosseis-e-dna-antigo'],
};

function formatTemporalPoint(value: number) {
  if (value === 0) return 'presente';
  if (value < 1) return `${Math.round(value * 1000).toLocaleString('pt-BR')} mil anos`;
  return `${Number(value.toFixed(2)).toLocaleString('pt-BR')} milhões de anos`;
}

export default function Humanidade() {
  const {
    dossies,
    especimes,
    fontesPorId,
    linhagens,
    mediaPorId,
    organismosPorId,
    publicacoes,
  } = useAtlas();
  const [searchParams] = useSearchParams();
  const tema = searchParams.get('tema');
  const selectedDossier = dossies.find((item) => item.slug === tema) ?? dossies[0];
  const humanSpecimens = especimes.filter((item) => humanSpecimenIds.has(item.id));

  useEffect(() => {
    if (!tema || !selectedDossier || window.matchMedia('(min-width: 860px)').matches) return;
    const frame = requestAnimationFrame(() => {
      document.getElementById('dossier-detail')?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start',
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [selectedDossier, tema]);

  return (
    <div className="page-scroll humanity-page">
      <header className="humanity-hero">
        <p className="eyebrow">Evolução humana</p>
        <h1>Humanidade</h1>
        <p>Fósseis, genes e espécies mostram uma história ramificada, com encontros e perguntas ainda abertas.</p>
        <div className="humanity-actions">
          <Link className="button button-primary" to="/arvore?raiz=hominidae&modo=cladograma">Abrir o ramo humano <IconeArvore size={18} /></Link>
          <Link className="button button-quiet" to="/publicacoes">Abrir a biblioteca <IconeBiblioteca size={18} /></Link>
        </div>
      </header>

      <section className="humanity-section humanity-topics" aria-labelledby="dossiers-title">
        <div className="section-heading">
          <div>
            <h2 id="dossiers-title">Temas para explorar</h2>
            <p>Escolha um assunto para ver a explicação, as fontes e as leituras relacionadas.</p>
          </div>
        </div>
        <div className="dossier-workspace">
          <nav aria-label="Temas de evolução humana" className="dossier-index">
            {dossies.map((dossier) => (
              <Link
                aria-current={selectedDossier?.id === dossier.id ? 'page' : undefined}
                className={selectedDossier?.id === dossier.id ? 'is-selected' : ''}
                key={dossier.id}
                to={`/humanidade?tema=${dossier.slug}`}
              >
                <span>{dossier.titulo}</span>
                <small>{dossier.resumo}</small>
                <IconeSeta size={16} />
              </Link>
            ))}
          </nav>

          {selectedDossier && (
            <article className="dossier-detail" id="dossier-detail">
              <header>
                <p className="eyebrow">Tema selecionado</p>
                <h3>{selectedDossier.titulo}</h3>
                <p>{selectedDossier.resumo}</p>
              </header>
              <div className="dossier-copy">
                {selectedDossier.blocos.map((block) => (
                  <section key={block.id}>
                    {block.titulo && <h4>{block.titulo}</h4>}
                    {block.texto && <p>{block.texto}</p>}
                    {block.itens && <ul>{block.itens.map((item) => <li key={item}>{item}</li>)}</ul>}
                  </section>
                ))}
              </div>
              <div className="dossier-related">
                <section>
                  <h4>Leituras</h4>
                  {publicacoes.filter((publication) => publication.dossieIds.includes(selectedDossier.id)).slice(0, 3).map((publication) => (
                    <Link key={publication.id} to={`/publicacoes/${publication.slug}`}>{publication.titulo}<IconeSeta size={14} /></Link>
                  ))}
                </section>
                <section>
                  <h4>Fontes</h4>
                  {selectedDossier.fonteIds.flatMap((id) => {
                    const source = fontesPorId.get(id);
                    return source ? [<a href={source.url} key={source.id} rel="noreferrer" target="_blank">{source.titulo}<IconeSeta size={14} /></a>] : [];
                  })}
                </section>
              </div>
            </article>
          )}
        </div>
      </section>

      <section className="humanity-section humanity-specimens" aria-labelledby="human-specimens-title">
        <div className="section-heading">
          <div>
            <h2 id="human-specimens-title">Fósseis e amostras humanas</h2>
            <p>Doze registros que conectam uma descoberta concreta à espécie, à data, à árvore e à literatura científica.</p>
          </div>
        </div>
        <div className="human-specimen-grid">
          {humanSpecimens.map((specimen) => {
            const organism = specimen.organismoId ? organismosPorId.get(specimen.organismoId) : undefined;
            const lineage = specimen.linhagemId ? linhagens.find((item) => item.id === specimen.linhagemId) : undefined;
            const media = mediaPorId.get(specimen.mediaIds[0]);
            const readingIds = readingIdsBySpecimen[specimen.id] ?? [];
            const readings = readingIds.flatMap((id) => {
              const publication = publicacoes.find((item) => item.id === id);
              return publication ? [publication] : [];
            });
            const treeUrl = organism
              ? `/arvore?raiz=${organism.noFilogeneticoId}&item=${organism.id}&modo=cladograma`
              : '/arvore?raiz=hominina&modo=cladograma';

            return (
              <article className="human-specimen-card" key={specimen.id}>
                {media && <img alt={media.altPt} loading="lazy" src={media.arquivos.src} />}
                <div className="human-specimen-copy">
                  <header>
                    <p>{specimen.numeroCatalogo}</p>
                    <h3>{specimen.apelido}</h3>
                    <span>{organism?.nomeCientifico ?? lineage?.nomePt ?? 'Linhagem humana antiga'}</span>
                  </header>
                  <dl>
                    <div>
                      <dt>Idade do registro</dt>
                      <dd>{organism?.intervalo
                        ? `${formatTemporalPoint(organism.intervalo.inicioMa)} a ${formatTemporalPoint(organism.intervalo.fimMa)}`
                        : lineage?.intervalo
                          ? `${formatTemporalPoint(lineage.intervalo.inicioMa)} a ${formatTemporalPoint(lineage.intervalo.fimMa)}`
                          : 'intervalo em revisão'}</dd>
                    </div>
                    <div><dt>Descoberta</dt><dd>{specimen.anoDescoberta ?? 'data não documentada'}</dd></div>
                    <div><dt>Local</dt><dd>{specimen.local}</dd></div>
                    <div><dt>Acervo</dt><dd>{specimen.museuAtual}</dd></div>
                  </dl>
                  <p>{specimen.resumo}</p>
                  <div className="human-specimen-links">
                    {organism && <Link to={`/cartas?item=${organism.id}`}>Abrir ficha <IconeSeta size={14} /></Link>}
                    <Link to={treeUrl}>Ver na árvore <IconeArvore size={15} /></Link>
                    {readings.map((publication) => <Link key={publication.id} to={`/publicacoes/${publication.slug}`}>{publication.titulo}<IconeBiblioteca size={15} /></Link>)}
                    {specimen.fonteIds.flatMap((id) => {
                      const source = fontesPorId.get(id);
                      return source ? [<a href={source.url} key={source.id} rel="noreferrer" target="_blank">Fonte científica <IconeSeta size={14} /></a>] : [];
                    })}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
