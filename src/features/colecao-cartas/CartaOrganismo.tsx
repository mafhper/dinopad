import { formatarEnergia, formatarFaixa, medidaPrincipal } from '../../content/format';
import type { OrganismoAtlas } from '../../content/types';
import { getMediaById } from '../../hooks/useAtlas';

interface CartaOrganismoProps {
  organismo: OrganismoAtlas;
  periodoNome?: string;
  onSelect: (organismo: OrganismoAtlas) => void;
}

export function CartaOrganismo({ organismo, periodoNome, onSelect }: CartaOrganismoProps) {
  const media = getMediaById(organismo.mediaPrincipalId);
  const naoDinossauro = organismo.reino === 'animalia' && !organismo.categoriaIds.some((id) => ['dinossauro', 'ave-primitiva'].includes(id));
  const medida = medidaPrincipal(organismo);
  return (
    <button className="organism-card" onClick={() => onSelect(organismo)} type="button">
      <div className="organism-card-image">
        {media && (
          <picture>
            {media.arquivos.avifSrcSet && <source sizes="(min-width: 900px) 30vw, 50vw" srcSet={media.arquivos.avifSrcSet} type="image/avif" />}
            <img alt={media.altPt} loading="lazy" sizes="(min-width: 900px) 30vw, 50vw" src={media.arquivos.src} srcSet={media.arquivos.srcSet} />
          </picture>
        )}
        <span className="organism-period-stamp">{periodoNome ?? organismo.periodoIds[0]}</span>
        {organismo.reino === 'plantae' && <span className="taxonomy-stamp">Flora</span>}
        {naoDinossauro && <span className="taxonomy-stamp">Não é dinossauro</span>}
      </div>
      <div className="organism-card-copy">
        <h2>{organismo.nomePt}</h2>
        <p className="scientific-name">{organismo.nomeCientifico}</p>
        <div className="card-fact-row">
          <span className="diet-badge" data-diet={organismo.energia.modoPrincipal}>{formatarEnergia(organismo.energia.modoPrincipal)}</span>
          <span>{medida.rotuloPt.toLocaleLowerCase('pt-BR')} · {formatarFaixa(medida.min, medida.max, medida.unidade)}</span>
        </div>
      </div>
    </button>
  );
}
