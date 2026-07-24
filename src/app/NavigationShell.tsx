import { NavLink, Outlet } from 'react-router-dom';
import {
  IconeArvore,
  IconeBiblioteca,
  IconeBusca,
  IconeCartas,
  IconeComparar,
  IconeConfiguracoes,
  IconeInicio,
  IconeHumanidade,
  IconeRelogio,
} from '../components/Icons';

const principaisDesktop = [
  { to: '/', label: 'Descobrir', Icone: IconeInicio },
  { to: '/cartas', label: 'Atlas', Icone: IconeCartas },
  { to: '/tempo', label: 'Tempo', Icone: IconeRelogio },
  { to: '/arvore', label: 'Árvore', Icone: IconeArvore },
  { to: '/humanidade', label: 'Humanidade', Icone: IconeHumanidade },
  { to: '/publicacoes', label: 'Biblioteca', Icone: IconeBiblioteca },
];

const ferramentas = [
  { to: '/buscar', label: 'Buscar', Icone: IconeBusca },
  { to: '/comparar', label: 'Comparar', Icone: IconeComparar },
];

const principaisMobile = principaisDesktop.filter(({ to }) => to !== '/humanidade');

function LinkNavegacao({
  item,
  compacto = false,
}: {
  item: (typeof principaisDesktop)[number];
  compacto?: boolean;
}) {
  return (
    <NavLink
      className={({ isActive }) => `nav-item${isActive ? ' is-active' : ''}${compacto ? ' is-compact' : ''}`}
      end={item.to === '/'}
      to={item.to}
    >
      <item.Icone size={compacto ? 20 : 19} />
      <span>{item.label}</span>
    </NavLink>
  );
}

export function NavigationShell() {
  return (
    <div className="app-shell">
      <aside className="desktop-sidebar">
        <NavLink aria-label="Dinopad — página inicial" className="brand-lockup" to="/">
          <span>
            <strong>Dinopad</strong>
            <small>Atlas do tempo profundo</small>
          </span>
        </NavLink>

        <nav aria-label="Navegação principal" className="sidebar-nav">
          <p className="nav-section-label">Explorar</p>
          {principaisDesktop.map((item) => (
            <LinkNavegacao item={item} key={item.to} />
          ))}

          <p className="nav-section-label nav-section-spaced">Ferramentas</p>
          {ferramentas.map((item) => (
            <LinkNavegacao item={item} key={item.to} />
          ))}
        </nav>

        <NavLink className="sidebar-settings" to="/config">
          <IconeConfiguracoes size={18} />
          <span>Configurações</span>
        </NavLink>
      </aside>

      <header className="mobile-header">
        <NavLink aria-label="Dinopad — página inicial" className="mobile-brand" to="/">
          <strong>Dinopad</strong>
        </NavLink>
        <div className="mobile-actions">
          <NavLink aria-label="Buscar no atlas" className="mobile-search" to="/buscar">
            <IconeBusca size={21} />
          </NavLink>
          <NavLink aria-label="Aparência e configurações" className="mobile-search" to="/config">
            <IconeConfiguracoes size={20} />
          </NavLink>
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <nav aria-label="Navegação principal" className="mobile-tabbar">
        {principaisMobile.map((item) => (
          <LinkNavegacao compacto item={item} key={item.to} />
        ))}
      </nav>
    </div>
  );
}
