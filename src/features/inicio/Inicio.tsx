import { type FormEvent, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import logoAvif384 from '../../assets/brand/dinopad-dilophosaurus-home-384.avif';
import logoAvif768 from '../../assets/brand/dinopad-dilophosaurus-home-768.avif';
import logoMetadata from '../../assets/brand/dinopad-dilophosaurus.generated.json';
import logoPng from '../../assets/brand/dinopad-dilophosaurus-transparent.png';
import logoWebp384 from '../../assets/brand/dinopad-dilophosaurus-home-384.webp';
import logoWebp768 from '../../assets/brand/dinopad-dilophosaurus-home-768.webp';
import { IconeBiblioteca, IconeBusca, IconeFavorito, IconeMarcador, IconeSeta } from '../../components/Icons';
import { formatarEnergia } from '../../content/format';
import type { OrganismoAtlas } from '../../content/types';
import { useAtlas } from '../../hooks/useAtlas';
import { useStudySnapshot } from '../estudo/useStudySnapshot';
import { dayKey, rotateFromSeed, selectDailyItem, selectDailyReadings } from './home-discovery';

function OrganismLinkCard({
  organismo,
  imagemSrc,
  imagemSrcSet,
  periodo,
}: {
  organismo: OrganismoAtlas;
  imagemSrc?: string;
  imagemSrcSet?: string;
  periodo?: string;
}) {
  return (
    <Link className="home-organism-link" to={`/cartas?item=${organismo.id}`}>
      {imagemSrc && <img alt="" loading="lazy" src={imagemSrc} srcSet={imagemSrcSet} />}
      <span>
        <small>{periodo}</small>
        <strong>{organismo.nomePt}</strong>
        <em>{organismo.nomeCientifico}</em>
      </span>
      <IconeSeta size={17} />
    </Link>
  );
}

export default function Inicio() {
  const navigate = useNavigate();
  const {
    especimes,
    linhagens,
    mediaPorId,
    organismos,
    organismosPorId,
    periodosPorId,
    publicacoes,
  } = useAtlas();
  const { favoritos, progressos } = useStudySnapshot();
  const [busca, setBusca] = useState('');
  const [visitRotation] = useState(() => {
    try {
      const current = Number(sessionStorage.getItem('dinopad.home.visit') ?? '0') + 1;
      sessionStorage.setItem('dinopad.home.visit', String(current));
      return current;
    } catch {
      return 0;
    }
  });

  const completedPublicationIds = useMemo(
    () => new Set(progressos.filter(({ percentual }) => percentual >= 100).map(({ publicacaoId }) => publicacaoId)),
    [progressos],
  );
  const readingsForToday = useMemo(
    () => selectDailyReadings(publicacoes, completedPublicationIds),
    [completedPublicationIds, publicacoes],
  );
  const bookmarkedReadings = useMemo(
    () => progressos
      .filter(({ marcadorBlocoId, percentual }) => marcadorBlocoId && percentual < 100)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .flatMap((progress) => {
        const publication = publicacoes.find(({ id }) => id === progress.publicacaoId);
        return publication && progress.marcadorBlocoId
          ? [{ progress, publication }]
          : [];
      })
      .slice(0, 3),
    [progressos, publicacoes],
  );
  const favoriteOrganisms = useMemo(
    () => favoritos
      .filter(({ tipo }) => tipo === 'organismo')
      .flatMap(({ entidadeId }) => {
        const organismo = organismosPorId.get(entidadeId);
        return organismo ? [organismo] : [];
      })
      .slice(0, 4),
    [favoritos, organismosPorId],
  );
  const discoveries = useMemo(
    () => rotateFromSeed(organismos, `descobertas-${dayKey()}-${visitRotation}`, 3),
    [organismos, visitRotation],
  );
  const featuredSpecimen = useMemo(() => selectDailyItem(especimes, 'especime'), [especimes]);
  const featuredOrganism = featuredSpecimen?.organismoId ? organismosPorId.get(featuredSpecimen.organismoId) : undefined;
  const featuredLineage = featuredSpecimen?.linhagemId ? linhagens.find(({ id }) => id === featuredSpecimen.linhagemId) : undefined;
  const featuredImage = featuredSpecimen ? mediaPorId.get(featuredSpecimen.mediaIds[0]) : undefined;
  const featuredLink = featuredOrganism ? `/cartas?item=${featuredOrganism.id}` : '/humanidade';
  const featuredScientificName = featuredOrganism?.nomeCientifico ?? featuredLineage?.nomePt;
  const humanitySamples = useMemo(
    () => ['lucy', 'neanderthal-1', 'denisova-3'].flatMap((id) => {
      const specimen = especimes.find((item) => item.id === id);
      if (!specimen) return [];
      const organism = specimen.organismoId ? organismosPorId.get(specimen.organismoId) : undefined;
      const lineage = specimen.linhagemId ? linhagens.find((item) => item.id === specimen.linhagemId) : undefined;
      const image = mediaPorId.get(specimen.mediaIds[0]);
      return [{
        href: organism ? `/cartas?item=${organism.id}` : '/humanidade?tema=neandertais-denisovanos',
        image,
        name: specimen.apelido,
        scientificName: organism?.nomeCientifico ?? lineage?.nomePt,
        year: specimen.anoDescoberta,
      }];
    }),
    [especimes, linhagens, mediaPorId, organismosPorId],
  );

  const handleBuscar = (event: FormEvent) => {
    event.preventDefault();
    const termo = busca.trim();
    navigate(termo ? `/buscar?q=${encodeURIComponent(termo)}` : '/buscar');
  };

  return (
    <div className="page-scroll home-page">
      <section className="discovery-hero" aria-labelledby="home-title">
        <div className="hero-copy">
          <picture className="home-brand-art">
            <source srcSet={`${logoAvif384} 384w, ${logoAvif768} 768w`} type="image/avif" />
            <source srcSet={`${logoWebp384} 384w, ${logoWebp768} 768w`} type="image/webp" />
            <img
              alt="Emblema do Dinopad: fóssil de Dilophosaurus em uma rocha com samambaias"
              decoding="async"
              fetchPriority="high"
              height={logoMetadata.height}
              src={logoPng}
              width={logoMetadata.width}
            />
          </picture>
          <p className="eyebrow">Caderno de campo · tempo profundo</p>
          <h1 id="home-title">A Terra guardou as pistas. Vamos encontrá-las.</h1>
          <p className="hero-intro">Um atlas para descobrir quem viveu aqui, quando isso aconteceu e como fósseis se transformam em conhecimento.</p>
          <form className="memory-search" onSubmit={handleBuscar} role="search">
            <IconeBusca size={20} /><label className="sr-only" htmlFor="home-search">Buscar um organismo</label>
            <input id="home-search" onChange={(event) => setBusca(event.target.value)} placeholder="Lembra de uma pista? Tente “três chifres”" type="search" value={busca} />
            <button aria-label="Buscar" type="submit"><IconeSeta size={18} /></button>
          </form>
          <div className="hero-actions"><Link className="button button-primary" to="/cartas">Abrir o atlas <IconeSeta size={17} /></Link><Link className="button button-quiet" to="/tempo">Viajar no tempo</Link></div>
        </div>
        {featuredSpecimen && featuredImage && (
          <Link aria-label={`Abrir ${featuredSpecimen.apelido}`} className="hero-plate" to={featuredLink}>
            <figure>
              <picture>{featuredImage.arquivos.avifSrcSet && <source srcSet={featuredImage.arquivos.avifSrcSet} type="image/avif" />}<img alt={featuredImage.altPt} src={featuredImage.arquivos.src} srcSet={featuredImage.arquivos.srcSet} /></picture>
              <div className="hero-plate-wash" />
              <figcaption>
                <span className="plate-index">Espécime em destaque</span>
                <span className="plate-title">{featuredSpecimen.apelido}{featuredScientificName ? ` · ${featuredScientificName}` : ''}</span>
                <span className="plate-meta">{featuredSpecimen.formacao} · {featuredSpecimen.local}</span>
              </figcaption>
            </figure>
          </Link>
        )}
        <section className="home-section home-reading-section" aria-labelledby="reading-title">
        <div className="section-heading">
          <div><p className="eyebrow">Sua estante de hoje</p><h2 id="reading-title">Leituras escolhidas para esta visita</h2></div>
          <Link className="text-link" to="/publicacoes">Abrir a Biblioteca <IconeSeta size={16} /></Link>
        </div>
        {bookmarkedReadings.length > 0 && (
          <nav aria-label="Pontos de leitura salvos" className="home-reading-markers">
            <div><IconeMarcador size={20} /><strong>Continuar de onde você parou</strong></div>
            <ul>
              {bookmarkedReadings.map(({ progress, publication }) => (
                <li key={publication.id}>
                  <Link to={`/publicacoes/${publication.slug}?retomar=${progress.marcadorBlocoId}`}>
                    <span>{publication.titulo}</span>
                    <small>{progress.marcadorTitulo ?? 'Trecho salvo'}</small>
                    <IconeSeta size={16} />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
        {readingsForToday.length > 0 ? (
          <div className="home-reading-grid">
            {readingsForToday.map((publication) => {
              const progress = progressos.find(({ publicacaoId }) => publicacaoId === publication.id);
              return (
                <Link className="home-reading-card" key={publication.id} to={`/publicacoes/${publication.slug}`}>
                  <span>{progress ? 'Continue a leitura' : 'Para ler hoje'} · {publication.minutosLeitura} min</span>
                  <h3>{publication.titulo}</h3>
                  <p>{publication.camadaEssencial[0]?.texto}</p>
                  <strong>Ler o texto <IconeSeta size={16} /></strong>
                </Link>
              );
            })}
          </div>
        ) : (
          <aside className="home-reading-complete">
            <IconeBiblioteca size={24} />
            <div><h3>Você concluiu a estante atual.</h3><p>As leituras continuam disponíveis na Biblioteca e novas áreas poderão entrar na próxima atualização.</p></div>
            <Link className="button button-quiet" to="/publicacoes">Revisitar leituras</Link>
          </aside>
        )}
        </section>
      </section>

      <section className="home-section home-personal-section" aria-labelledby="notebook-title">
        <div className="home-personal-grid">
          <div className="home-shelf">
            <div className="home-shelf-heading">
              <div><p className="eyebrow">Seu caderno</p><h2 id="notebook-title">Favoritos para reencontrar</h2></div>
              <IconeFavorito size={22} />
            </div>
            {favoriteOrganisms.length > 0 ? (
              <div className="home-organism-list">
                {favoriteOrganisms.map((organismo) => {
                  const image = mediaPorId.get(organismo.mediaPrincipalId);
                  return <OrganismLinkCard imagemSrc={image?.arquivos.src} imagemSrcSet={image?.arquivos.miniaturaSrcSet ?? image?.arquivos.srcSet} key={organismo.id} organismo={organismo} periodo={periodosPorId.get(organismo.periodoIds[0])?.nomePt} />;
                })}
              </div>
            ) : (
              <div className="home-shelf-empty">
                <p>Ao guardar uma ficha, ela volta para cá. Abra um organismo e toque no marcador de favorito.</p>
                <Link className="text-link" to="/cartas">Escolher uma primeira descoberta <IconeSeta size={16} /></Link>
              </div>
            )}
          </div>

          <div className="home-shelf">
            <div className="home-shelf-heading">
              <div><p className="eyebrow">Muda a cada visita</p><h2>Descubra agora</h2></div>
            </div>
            <div className="home-organism-list">
              {discoveries.map((organismo) => {
                const image = mediaPorId.get(organismo.mediaPrincipalId);
                return <OrganismLinkCard imagemSrc={image?.arquivos.src} imagemSrcSet={image?.arquivos.miniaturaSrcSet ?? image?.arquivos.srcSet} key={organismo.id} organismo={organismo} periodo={`${formatarEnergia(organismo.energia.modoPrincipal)} · ${periodosPorId.get(organismo.periodoIds[0])?.nomePt ?? ''}`} />;
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="home-section home-pathways-section" aria-labelledby="pathways-title">
        <div className="home-pathways">
          <div className="home-humanity-copy">
            <p className="eyebrow">Humanidade</p>
            <h2 id="pathways-title">O que fósseis e genes contam sobre nós?</h2>
            <p>Conheça registros como Lucy, Neanderthal 1 e Denisova 3, encontre seus ramos na árvore e veja o que cada evidência permite concluir.</p>
            <div className="home-humanity-actions">
              <Link className="button button-primary" to="/humanidade">Explorar Humanidade <IconeSeta size={17} /></Link>
              <Link className="text-link" to="/arvore?raiz=hominidae&modo=cladograma">Ver o ramo humano <IconeSeta size={16} /></Link>
            </div>
          </div>
          <aside className="home-humanity-samples" aria-label="Registros em destaque">
            <h3>Comece por um registro</h3>
            <ol>
              {humanitySamples.map((sample) => (
                <li key={sample.name}>
                  <Link to={sample.href}>
                    {sample.image && <img alt="" loading="lazy" src={sample.image.arquivos.src} srcSet={sample.image.arquivos.miniaturaSrcSet ?? sample.image.arquivos.srcSet} />}
                    <span>
                      <strong>{sample.name}</strong>
                      {sample.scientificName && <em>{sample.scientificName}</em>}
                      {sample.year && <small>Descoberta em {sample.year}</small>}
                    </span>
                    <IconeSeta size={17} />
                  </Link>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </section>

      <section className="time-notebook" aria-labelledby="period-title">
        <div className="time-notebook-intro"><p className="eyebrow">Uma ideia importante</p><h2 id="period-title">Viver na “época dos dinossauros” não torna todo animal um dinossauro.</h2><p>O atlas distingue dinossauros, pterossauros, répteis marinhos, sinapsídeos e mamíferos — e mostra a enorme distância temporal entre eles.</p><Link className="text-link" to="/cartas?colecao=nao-dinossauro">Explorar “Não é dinossauro” <IconeSeta size={16} /></Link></div>
        <ol className="period-strip">{[
          ['triassico', 'Os primeiros dinossauros aparecem; Staurikosaurus, Buriolestes e Gnathovorax colocam o Brasil nessa história.'],
          ['jurasico', 'Gigantes de pescoço longo, grandes predadores, avialanos e florestas de ginkgos ocupam paisagens diversas.'],
          ['cretaceo', 'Fauna e plantas com flores se diversificam até o evento K–Pg, registrado uma única vez na cronologia.'],
        ].map(([id, texto], index) => { const periodo = periodosPorId.get(id); return periodo ? <li key={id}><span className="period-number">{String(index + 1).padStart(2, '0')}</span><div><p>{periodo.inicioMa}–{periodo.fimMa} Ma</p><h3>{periodo.nomePt}</h3><span>{texto}</span></div></li> : null; })}</ol>
      </section>
      <footer className="home-footer-note"><p><strong>Ma</strong> significa “milhões de anos atrás”. Quanto maior o número, mais distante estamos no passado.</p><Link to="/creditos">Fontes, licenças e método editorial</Link></footer>
    </div>
  );
}
