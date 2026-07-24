import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconeArvore, IconeBusca, IconeFavorito, IconeSeta, IconeVoltar } from '../../components/Icons';
import { formatarEnergia, formatarFaixa } from '../../content/format';
import { useAtlas } from '../../hooks/useAtlas';
import { studyDb } from '../estudo/study-db';
import { EscalaDimensional } from './EscalaDimensional';
import { rotuloPapelMedia } from './rotulosMidia';
import { VisualizadorMidia } from './VisualizadorMidia';

export interface OrganismoDetalheProps {
  organismoId: string;
  onVoltar: () => void;
}

export function OrganismoDetalhe({ organismoId, onVoltar }: OrganismoDetalheProps) {
  const navigate = useNavigate();
  const { organismosPorId, periodosPorId, fontesPorId, mediaPorId, especimesPorId } = useAtlas();
  const [indiceMidiaAberta, setIndiceMidiaAberta] = useState<number | null>(null);
  const [favorito, setFavorito] = useState(false);
  const gatilhoParaRestaurarRef = useRef<HTMLButtonElement | null>(null);
  const organismo = organismosPorId.get(organismoId);

  useEffect(() => {
    if (indiceMidiaAberta !== null || !gatilhoParaRestaurarRef.current) return;
    const gatilho = gatilhoParaRestaurarRef.current;
    gatilhoParaRestaurarRef.current = null;
    window.requestAnimationFrame(() => gatilho.focus());
  }, [indiceMidiaAberta]);

  useEffect(() => {
    void studyDb.favoritos()
      .then((favoritos) => setFavorito(favoritos.some(({ id }) => id === `organismo-${organismoId}`)))
      .catch(() => setFavorito(false));
  }, [organismoId]);

  if (!organismo) {
    return <div className="atlas-empty"><h1>Ficha não encontrada</h1><p>Esse registro ainda não faz parte do atlas aprovado.</p><button className="button button-primary" onClick={onVoltar} type="button">Voltar ao atlas</button></div>;
  }

  const periodos = organismo.periodoIds.map((id) => periodosPorId.get(id)).filter(Boolean);
  const media = organismo.mediaIds.map((id) => mediaPorId.get(id)).filter((item) => item !== undefined);
  const fontes = organismo.fonteIds.map((id) => fontesPorId.get(id)).filter((item) => item !== undefined);
  const especimes = organismo.especimeIds.map((id) => especimesPorId.get(id)).filter((item) => item !== undefined);
  const naoDinossauro = organismo.reino === 'animalia' && !organismo.categoriaIds.some((id) => ['dinossauro', 'ave-primitiva'].includes(id));
  const fecharVisualizador = () => setIndiceMidiaAberta(null);
  const alternarFavorito = async () => {
    const id = `organismo-${organismo.id}`;
    if (favorito) await studyDb.removerFavorito(id);
    else await studyDb.salvarFavorito({ id, tipo: 'organismo', entidadeId: organismo.id, updatedAt: new Date().toISOString() });
    setFavorito(!favorito);
  };

  return (
    <>
      <article className="detail-page">
      <header className="detail-topbar">
        <button aria-label="Voltar ao atlas" className="icon-button" onClick={onVoltar} type="button"><IconeVoltar size={20} /></button>
        <div className="detail-topbar-copy"><strong>{organismo.nomePt}</strong><span>{organismo.nomeCientifico}</span></div>
        <button aria-label={favorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'} aria-pressed={favorito} className="icon-button detail-favorite-button" onClick={alternarFavorito} type="button"><IconeFavorito size={19} /></button>
      </header>
      <div className="detail-layout">
        <div className="detail-gallery" aria-label={`Galeria científica de ${organismo.nomePt}`}>
          {media.map((asset, index) => (
            <figure className={index === 0 ? 'detail-visual' : 'detail-support-visual'} key={asset.id}>
              <button
                aria-haspopup="dialog"
                aria-label={`Ampliar ${asset.titulo}`}
                className="detail-media-open"
                onClick={(event) => {
                  gatilhoParaRestaurarRef.current = event.currentTarget;
                  setIndiceMidiaAberta(index);
                }}
                type="button"
              >
                {asset.papel === 'escala'
                  ? <EscalaDimensional organismo={organismo} />
                  : <picture>
                    {asset.arquivos.avifSrcSet && <source sizes="(min-width: 1000px) 42vw, 100vw" srcSet={asset.arquivos.avifSrcSet} type="image/avif" />}
                    <img alt={asset.altPt} loading={index === 0 ? 'eager' : 'lazy'} sizes="(min-width: 1000px) 42vw, 100vw" src={asset.arquivos.src} srcSet={asset.arquivos.srcSet} />
                  </picture>}
                <span className="detail-media-hint"><IconeBusca size={17} /> Ampliar</span>
              </button>
              <figcaption>
                <span className={`media-role role-${asset.papel}`}>{rotuloPapelMedia[asset.papel]}</span>
                <strong>{asset.titulo}</strong>
                <span>{asset.papel === 'escala' ? 'Régua dimensional calculada com a maior medida citada na ficha; não é uma reconstrução anatômica.' : asset.legendaPt}</span>
                <a href={asset.urlFonte} rel="noreferrer" target="_blank">{asset.autor} · {asset.licenca}</a>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="detail-content">
          <header className="detail-title">
            <p className="eyebrow">Ficha de campo · {organismo.revisao.status}</p>
            {organismo.reino === 'plantae' && <span className="taxonomy-label">Coleção Flora</span>}
            {naoDinossauro && <span className="taxonomy-label">Coleção “Não é dinossauro”</span>}
            <h1>{organismo.nomePt}</h1>
            <p className="scientific-name">{organismo.nomeCientifico} · {organismo.autoridadeTaxonomica}</p>
            <p className="detail-name-meaning">O nome significa <strong>“{organismo.significadoNome}”</strong>.</p>
          </header>
          <dl className="fact-grid">
            <div className="fact-cell"><dt>Registro conhecido</dt><dd>{organismo.intervalo.inicioMa}–{organismo.intervalo.fimMa} Ma</dd></div>
            <div className="fact-cell"><dt>Período</dt><dd>{periodos.map((periodo) => periodo?.nomePt).join(', ')}</dd></div>
            <div className="fact-cell"><dt>Energia</dt><dd>{formatarEnergia(organismo.energia.modoPrincipal)} · incerteza {organismo.energia.incerteza}</dd></div>
            {organismo.medidas.itens.map((medida, index) => (
              <div className="fact-cell" key={`${medida.tipo}-${medida.rotuloPt}-${index}`}><dt>{medida.rotuloPt}</dt><dd>{formatarFaixa(medida.min, medida.max, medida.unidade)}</dd></div>
            ))}
            <div className="fact-cell fact-cell-wide"><dt>Nome em inglês</dt><dd>{organismo.nomeEn}</dd></div>
          </dl>
          <p className="interval-note"><strong>Importante:</strong> {organismo.intervalo.significado} Isso não é uma duração exata da espécie.</p>
          <section className="detail-section"><h2>Quem era</h2><p>{organismo.descricao}</p></section>
          <aside className="curiosity-note"><p className="eyebrow">Para guardar na memória</p><p>{organismo.memoria}</p></aside>
          <section className="detail-section">
            <h2>Onde há ocorrências</h2>
            <div className="location-list">{organismo.ocorrencias.map((ocorrencia) => <span key={`${ocorrencia.formacao}-${ocorrencia.regiao}`}><strong>{ocorrencia.formacao}</strong> · {ocorrencia.regiao}, {ocorrencia.pais}</span>)}</div>
          </section>
          {especimes.length > 0 && (
            <section className="detail-section specimen-stories"><h2>Histórias de fósseis</h2>{especimes.map((especime) => <article key={especime.id}><p className="eyebrow">{especime.tipo} · {especime.numeroCatalogo}</p><h3>{especime.apelido}</h3><p>{especime.resumo}</p><dl><div><dt>Encontrado</dt><dd>{especime.anoDescoberta ?? 'data não documentada'} · {especime.local}</dd></div><div><dt>Acervo</dt><dd>{especime.museuAtual}</dd></div></dl></article>)}</section>
          )}
          {organismo.relacoes.length > 0 && (
            <section className="detail-section"><h2>Compare as pistas</h2><div className="source-list">{organismo.relacoes.map((relacao) => { const relacionado = organismosPorId.get(relacao.organismoId); return <button className="source-link" key={`${relacao.organismoId}-${relacao.tipo}`} onClick={() => navigate(`/cartas?item=${relacao.organismoId}`)} type="button"><span><strong>{relacionado?.nomePt ?? relacao.organismoId}</strong> · {relacao.nota}</span><IconeSeta size={17} /></button>; })}</div></section>
          )}
          <section className="detail-section"><h2>Fontes científicas</h2><div className="source-list">{fontes.map((fonte) => <a className="source-link" href={fonte.url} key={fonte.id} rel="noreferrer" target="_blank"><span><strong>Nível {fonte.nivel}</strong> · {fonte.titulo}</span><IconeSeta size={17} /></a>)}</div></section>
          <nav aria-label={`Explorar ${organismo.nomePt}`} className="detail-explore-links">
            <Link className="button button-primary" to={`/arvore?raiz=${organismo.noFilogeneticoId}&item=${organismo.id}&modo=cladograma`}>Ver na árvore <IconeArvore size={17} /></Link>
            <Link className="button button-quiet" to={`/tempo?inicioMa=${organismo.intervalo.inicioMa}&fimMa=${organismo.intervalo.fimMa}&item=${organismo.id}&camada=organismo&filtro=${organismo.reino === 'plantae' ? 'flora' : 'fauna'}`}>Ver no tempo <IconeSeta size={17} /></Link>
          </nav>
        </div>
      </div>
      </article>
      {indiceMidiaAberta !== null && (
        <VisualizadorMidia
          indiceInicial={indiceMidiaAberta}
          media={media}
          nomeOrganismo={organismo.nomePt}
          organismo={organismo}
          onFechar={fecharVisualizador}
        />
      )}
    </>
  );
}
