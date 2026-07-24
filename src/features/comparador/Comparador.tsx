import { useMemo, useState } from 'react';
import { useAtlas } from '../../hooks/useAtlas';
import { calcularDominioComparacao } from './time-domain';

export default function Comparador() {
  const { organismos, periodosPorId } = useAtlas();
  const [primeiroId, setPrimeiroId] = useState('stegosaurus');
  const [segundoId, setSegundoId] = useState('tyrannosaurus-rex');
  const primeiro = useMemo(() => organismos.find(({ id }) => id === primeiroId), [organismos, primeiroId]);
  const segundo = useMemo(() => organismos.find(({ id }) => id === segundoId), [organismos, segundoId]);
  const tempo1 = primeiro ? (primeiro.intervalo.inicioMa + primeiro.intervalo.fimMa) / 2 : null;
  const tempo2 = segundo ? (segundo.intervalo.inicioMa + segundo.intervalo.fimMa) / 2 : null;
  const distancia = tempo1 !== null && tempo2 !== null ? Math.abs(tempo1 - tempo2) : null;
  const dominio = useMemo(() => {
    if (!primeiro || !segundo) return { inicioMa: 252, fimMa: 0 };
    return calcularDominioComparacao(primeiro, segundo);
  }, [primeiro, segundo]);
  const posicaoNoDominio = (tempo: number) => Math.max(0, Math.min(100, ((dominio.inicioMa - tempo) / (dominio.inicioMa - dominio.fimMa)) * 100));

  return (
    <div className="tool-page compare-page">
      <header className="tool-header"><p className="eyebrow">Experimento de escala</p><h1>Quem viveu mais perto de quem?</h1><p>A comparação usa o ponto médio do intervalo conhecido no registro fóssil, nunca uma data exata da vida de um indivíduo.</p></header>
      <div className="compare-content">
        <section className="compare-pickers" aria-label="Organismos para comparar"><label><span>Primeiro organismo</span><select onChange={(event) => setPrimeiroId(event.target.value)} value={primeiroId}>{organismos.map((item) => <option key={item.id} value={item.id}>{item.nomePt}</option>)}</select></label><span className="compare-versus" aria-hidden="true">×</span><label><span>Segundo organismo</span><select onChange={(event) => setSegundoId(event.target.value)} value={segundoId}>{organismos.map((item) => <option key={item.id} value={item.id}>{item.nomePt}</option>)}</select></label></section>
        {primeiro && segundo && tempo1 !== null && tempo2 !== null && distancia !== null && <><section className="compare-result" aria-live="polite"><p className="eyebrow">Distância aproximada</p><strong>{distancia.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}</strong><span>milhões de anos</span><p>{distancia < 1 ? `Os intervalos de ${primeiro.nomePt} e ${segundo.nomePt} ficam muito próximos.` : `${primeiro.nomePt} e ${segundo.nomePt} não eram vizinhos no tempo.`}</p></section><section className="meso-ruler" aria-label="Posição aproximada no domínio temporal calculado"><header><div><p className="eyebrow">Domínio da comparação</p><h2>{dominio.inicioMa.toFixed(1)}–{dominio.fimMa.toFixed(1)} Ma</h2></div><p>O eixo se ajusta aos dois organismos; mais antigo à esquerda.</p></header><div className="ruler-track ruler-track-dynamic">{[[primeiro, tempo1, 'point-one'], [segundo, tempo2, 'point-two']].map(([item, tempo, classe]) => <span className={`ruler-point ${classe}`} key={(item as typeof primeiro).id} style={{ left: `${posicaoNoDominio(tempo as number)}%` }}><i /><b>{(item as typeof primeiro).nomePt}</b><small>{(tempo as number).toFixed(1)} Ma</small></span>)}</div></section><section className="compare-notes"><article><p className="eyebrow">{periodosPorId.get(primeiro.periodoIds[0])?.nomePt}</p><h2>{primeiro.nomePt}</h2><p>{primeiro.memoria}</p></article><article><p className="eyebrow">{periodosPorId.get(segundo.periodoIds[0])?.nomePt}</p><h2>{segundo.nomePt}</h2><p>{segundo.memoria}</p></article></section></>}
      </div>
    </div>
  );
}
