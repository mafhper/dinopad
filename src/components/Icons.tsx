import type { ReactNode } from 'react';

interface IconeProps {
  size?: number;
  color?: string;
  corPrimaria?: string;
  className?: string;
}

function IconeBase({
  size = 24,
  color,
  corPrimaria,
  className,
  children,
}: IconeProps & { children: ReactNode }) {
  const cor = corPrimaria ?? color ?? 'currentColor';

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke={cor} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7">
        {children}
      </g>
    </svg>
  );
}

export function IconeInicio(props: IconeProps) {
  return (
    <IconeBase {...props}>
      <path d="M4 10.5 12 4l8 6.5" />
      <path d="M6.5 9.5V20h11V9.5" />
      <path d="M10 20v-5.5h4V20" />
    </IconeBase>
  );
}

export function IconeRelogio(props: IconeProps) {
  return (
    <IconeBase {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3.2 2" />
      <path d="M8 3.8 9.2 2.5M16 3.8l-1.2-1.3" />
    </IconeBase>
  );
}

export function IconeCartas(props: IconeProps) {
  return (
    <IconeBase {...props}>
      <rect height="14" rx="2" width="10.5" x="7" y="5" />
      <path d="M7 8.2 4.8 9a2 2 0 0 0-1.2 2.55l3.2 8.1a2 2 0 0 0 2.6 1.1l4.1-1.75" />
      <path d="M10 9h4.5M10 12h4.5M10 15h2.5" />
    </IconeBase>
  );
}

export function IconeArvore(props: IconeProps) {
  return (
    <IconeBase {...props}>
      <circle cx="12" cy="5" r="2" />
      <circle cx="6" cy="18.5" r="2" />
      <circle cx="18" cy="18.5" r="2" />
      <path d="M12 7v4m0 0H6v5.5m6-5.5h6v5.5" />
    </IconeBase>
  );
}

export function IconeComparar(props: IconeProps) {
  return (
    <IconeBase {...props}>
      <path d="M4 7h13" />
      <path d="m14 4 3 3-3 3" />
      <path d="M20 17H7" />
      <path d="m10 14-3 3 3 3" />
    </IconeBase>
  );
}

export function IconeConfiguracoes(props: IconeProps) {
  return (
    <IconeBase {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.2 13.5a7.8 7.8 0 0 0 0-3l1.5-1.2-2-3.4-1.9.8a8 8 0 0 0-2.6-1.5L14 3.1h-4l-.3 2.1a8 8 0 0 0-2.6 1.5l-1.9-.8-2 3.4 1.5 1.2a7.8 7.8 0 0 0 0 3l-1.5 1.2 2 3.4 1.9-.8a8 8 0 0 0 2.6 1.5l.3 2.1h4l.3-2.1a8 8 0 0 0 2.6-1.5l1.9.8 2-3.4-1.6-1.2Z" />
    </IconeBase>
  );
}

export function IconeBusca(props: IconeProps) {
  return (
    <IconeBase {...props}>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="m15 15 5 5" />
    </IconeBase>
  );
}

export function IconeFiltro(props: IconeProps) {
  return (
    <IconeBase {...props}>
      <path d="M4 6h16M7 12h10M10 18h4" />
    </IconeBase>
  );
}

export function IconeFechar(props: IconeProps) {
  return (
    <IconeBase {...props}>
      <path d="m7 7 10 10M17 7 7 17" />
    </IconeBase>
  );
}

export function IconeSeta(props: IconeProps) {
  return (
    <IconeBase {...props}>
      <path d="m9 5 7 7-7 7" />
    </IconeBase>
  );
}

export function IconeVoltar(props: IconeProps) {
  return (
    <IconeBase {...props}>
      <path d="m15 5-7 7 7 7" />
    </IconeBase>
  );
}

export function IconeDinossauro(props: IconeProps) {
  return (
    <IconeBase {...props}>
      <path d="M4 17c2.2-1 3.2-3.2 3.2-6.3C7.2 6.5 10 4 13.8 4c2.1 0 4.1.8 5.6 2.2L17 8.7h-3l-1.7 2.5 2.2 2.3-1.2 3.5H8.5" />
      <path d="M7 17v3m6.3-3v3M18 6.5l2 3.5" />
    </IconeBase>
  );
}

export function IconeHumanidade(props: IconeProps) {
  return (
    <IconeBase {...props}>
      <circle cx="12" cy="7" r="3" />
      <path d="M6.5 20v-2.5a5.5 5.5 0 0 1 11 0V20M5 9.5a3 3 0 0 0-2 2.8V15m16-5.5a3 3 0 0 1 2 2.8V15" />
    </IconeBase>
  );
}

export function IconeBiblioteca(props: IconeProps) {
  return (
    <IconeBase {...props}>
      <path d="M4.5 5.5A3.5 3.5 0 0 1 8 4h3v15H8a3.5 3.5 0 0 0-3.5 1.5Z" />
      <path d="M19.5 5.5A3.5 3.5 0 0 0 16 4h-3v15h3a3.5 3.5 0 0 1 3.5 1.5Z" />
    </IconeBase>
  );
}

export function IconeFavorito(props: IconeProps) {
  return (
    <IconeBase {...props}>
      <path d="m12 4 2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9L9.5 9Z" />
    </IconeBase>
  );
}

export function IconeMarcador(props: IconeProps) {
  return (
    <IconeBase {...props}>
      <path d="M7 4.5h10v16L12 17l-5 3.5Z" />
    </IconeBase>
  );
}

export function IconeDestaque(props: IconeProps) {
  return (
    <IconeBase {...props}>
      <path d="m6 15 7.8-7.8 3 3L9 18H6Z" />
      <path d="m12.5 8.5 3 3M5 20h14" />
    </IconeBase>
  );
}

export function IconeComentario(props: IconeProps) {
  return (
    <IconeBase {...props}>
      <path d="M5 5.5h14v10H10l-5 4Z" />
      <path d="M8.5 9.5h7M8.5 12.5h4.5" />
    </IconeBase>
  );
}

export function IconeConcluido(props: IconeProps) {
  return (
    <IconeBase {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.5 12 2.2 2.2 4.8-5" />
    </IconeBase>
  );
}

export function IconeExpandir(props: IconeProps) {
  return (
    <IconeBase {...props}>
      <path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5" />
    </IconeBase>
  );
}

export function IconeRecolher(props: IconeProps) {
  return (
    <IconeBase {...props}>
      <path d="M4 9h5V4M20 9h-5V4M4 15h5v5M20 15h-5v5" />
    </IconeBase>
  );
}
