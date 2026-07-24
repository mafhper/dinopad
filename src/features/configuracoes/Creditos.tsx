import { useAtlas } from '../../hooks/useAtlas';

export default function Creditos() {
  const { fontes, media, versaoEscalaGeologica } = useAtlas();
  return (
    <div className="tool-page credits-page">
      <header className="tool-header"><p className="eyebrow">Transparência editorial</p><h1>Créditos e fontes</h1><p>Cada alegação e imagem pode ser rastreada. A escala geológica usada é {versaoEscalaGeologica}.</p></header>
      <section className="credits-section"><h2>Como o atlas foi construído</h2><p>PBDB sustenta nomes, ocorrências e intervalos conhecidos no registro; não é usada para afirmar uma duração exata da espécie. Dieta, dimensões e interpretações recebem fontes adicionais. Reconstruções são sempre rotuladas como interpretação.</p></section>
      <section className="credits-section"><h2>Fontes científicas</h2><div className="credits-grid">{fontes.map((fonte) => <article className="credit-card" key={fonte.id}><p className="eyebrow">Nível {fonte.nivel} · {fonte.tipo.replace('-', ' ')}</p><h3>{fonte.titulo}</h3><p>{fonte.instituicao}</p>{fonte.observacao && <small>{fonte.observacao}</small>}<a href={fonte.url} rel="noreferrer" target="_blank">Abrir fonte</a></article>)}</div></section>
      <section className="credits-section"><h2>Registro das mídias</h2><div className="media-credit-list">{media.map((asset) => <article key={asset.id}><img alt="" loading="lazy" src={asset.arquivos.src} /><div><p className="eyebrow">{asset.papel} · {asset.licenca}</p><h3>{asset.titulo}</h3><p>{asset.autor} · {asset.fonte}</p><small>{asset.alteracoes}</small><a href={asset.urlFonte} rel="noreferrer" target="_blank">Página original</a> · <a href={asset.urlLicenca} rel="noreferrer" target="_blank">Licença</a></div></article>)}</div></section>
    </div>
  );
}
