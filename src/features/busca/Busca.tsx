import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router';
import { IconeBusca } from '../../components/Icons';
import { useAtlas } from '../../hooks/useAtlas';
import { CartaOrganismo } from '../colecao-cartas/CartaOrganismo';
import { OrganismoDetalhe } from '../colecao-cartas/OrganismoDetalhe';

const sugestoes = ['T. rex', 'três chifres', 'Brasil', 'fotossíntese', 'não é dinossauro'];

function normalizar(valor: string) {
  return valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR').replace(/[^a-z0-9]+/g, ' ').trim();
}

export default function Busca() {
  const { organismos, periodosPorId, indicesConteudo } = useAtlas();
  const [searchParams, setSearchParams] = useSearchParams();
  const termoBusca = searchParams.get('q') ?? '';
  const organismoSelecionadoId = searchParams.get('item');
  const { resultados, resultadosEditoriais } = useMemo(() => {
    const termo = normalizar(termoBusca);
    if (!termo) return { resultados: [], resultadosEditoriais: [] };
    const ids = new Set<string>(indicesConteudo.busca.filter(({ texto }) => texto.includes(termo)).map(({ id }) => id));
    return {
      resultados: organismos.filter(({ id }) => ids.has(id)),
      resultadosEditoriais: indicesConteudo.buscaEditorial.filter(({ texto }) => texto.includes(termo)),
    };
  }, [indicesConteudo.busca, indicesConteudo.buscaEditorial, organismos, termoBusca]);

  if (organismoSelecionadoId) return <OrganismoDetalhe organismoId={organismoSelecionadoId} onVoltar={() => setSearchParams(termoBusca ? { q: termoBusca } : {})} />;
  const atualizarBusca = (valor: string) => setSearchParams(valor ? { q: valor } : {}, { replace: true });

  return (
    <div className="tool-page search-page">
      <header className="tool-header"><p className="eyebrow">Consulta rápida</p><h1>O que você lembra?</h1><p>Vale um pedaço do nome, fonte de energia, período, país ou até “não é dinossauro”.</p><div className="search-field"><IconeBusca size={21} /><label className="sr-only" htmlFor="atlas-search">Buscar no atlas</label><input autoFocus id="atlas-search" onChange={(event) => atualizarBusca(event.target.value)} placeholder="Ex.: três chifres, fotossíntese, Brasil…" type="search" value={termoBusca} /></div>{!termoBusca && <div className="search-suggestions" aria-label="Sugestões de busca">{sugestoes.map((sugestao) => <button key={sugestao} onClick={() => atualizarBusca(sugestao)} type="button">{sugestao}</button>)}</div>}</header>
      {termoBusca && resultados.length > 0 && <section aria-live="polite"><p className="search-result-count">{resultados.length} {resultados.length === 1 ? 'ficha encontrada' : 'fichas encontradas'}</p><div className="atlas-grid">{resultados.map((organismo) => <CartaOrganismo key={organismo.id} organismo={organismo} onSelect={() => setSearchParams({ q: termoBusca, item: organismo.id })} periodoNome={periodosPorId.get(organismo.periodoIds[0])?.nomePt} />)}</div></section>}
      {termoBusca && resultadosEditoriais.length > 0 && <section className="search-editorial-results" aria-labelledby="search-reading-title"><h2 id="search-reading-title">Leituras e temas</h2>{resultadosEditoriais.map((item) => <Link key={`${item.tipo}-${item.id}`} to={item.tipo === 'publicacao' ? `/publicacoes/${item.slug}` : `/humanidade?tema=${item.slug}`}><span>{item.tipo === 'publicacao' ? 'Publicação' : 'Tema'}</span><strong>{item.titulo}</strong></Link>)}</section>}
      {termoBusca && resultados.length === 0 && resultadosEditoriais.length === 0 && <div className="search-empty" aria-live="polite"><p className="eyebrow">Sem resultado</p><h2>Ainda não encontramos “{termoBusca}”.</h2><p>Tente outro nome, uma formação, conceito ou país.</p></div>}
    </div>
  );
}
