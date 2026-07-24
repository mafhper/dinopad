import type { Energia, OrganismoAtlas } from './types';

const energiaPt: Record<Energia, string> = {
  carnivoria: 'Carnivoria',
  herbivoria: 'Herbivoria',
  onivoria: 'Onivoria',
  fotossintese: 'Fotossíntese',
  frugivoria: 'Frugivoria',
  folivoria: 'Folivoria',
  insetivoria: 'Insetivoria',
  desconhecida: 'Não determinada',
};

export function formatarEnergia(valor: Energia) {
  return energiaPt[valor];
}

export function formatarFaixa(min: number, max: number, unidade: string) {
  const valor = min === max ? min.toLocaleString('pt-BR') : `${min.toLocaleString('pt-BR')}–${max.toLocaleString('pt-BR')}`;
  return unidade === 'unid' ? valor : `${valor} ${unidade}`;
}

export function medidaPrincipal(organismo: OrganismoAtlas) {
  return organismo.medidas.itens.find(({ tipo }) => tipo === 'envergadura')
    ?? organismo.medidas.itens.find(({ tipo }) => tipo === 'comprimento')
    ?? organismo.medidas.itens[0];
}

export function nomeColecao(valor: string | null) {
  return ({ fauna: 'Fauna', flora: 'Flora', humanidade: 'Humanidade', brasil: 'Brasil', 'nao-dinossauro': 'Não é dinossauro' } as Record<string, string>)[valor ?? ''] ?? '';
}
