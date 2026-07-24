import { Link } from 'react-router-dom';
import { useAtlas } from '../../hooks/useAtlas';
import { THEME_OPTIONS, useTheme, type ThemePreference } from '../../theme/theme';
import { StudyDataControls } from '../estudo/StudyDataControls';

export default function Configuracoes() {
  const { activeTheme, preference, selectTheme } = useTheme();
  const { dossies, especimes, media, organismos, publicacoes } = useAtlas();

  return (
    <div className="tool-page settings-page">
      <header className="tool-header">
        <p className="eyebrow">Preferências</p>
        <h1>Seu Dinopad</h1>
        <p>Escolha como o atlas aparece neste aparelho. A preferência fica salva somente no navegador.</p>
      </header>

      <div className="settings-content">
        <section aria-labelledby="theme-heading" className="settings-card theme-settings">
          <div className="settings-card-heading">
            <div>
              <p className="eyebrow">Aparência</p>
              <h2 id="theme-heading">Tema do atlas</h2>
            </div>
            <span aria-live="polite" className="current-theme">Em uso: {THEME_OPTIONS.find(({ id }) => id === activeTheme)?.label}</span>
          </div>

          <fieldset className="theme-picker">
            <legend className="sr-only">Escolher tema</legend>
            {THEME_OPTIONS.map((option) => (
              <label className={`theme-choice theme-choice-${option.id}`} key={option.id}>
                <input
                  checked={preference === option.id}
                  name="dinopad-theme"
                  onChange={() => selectTheme(option.id as ThemePreference)}
                  type="radio"
                  value={option.id}
                />
                <span aria-hidden="true" className="theme-swatch"><i /><i /><i /></span>
                <span className="theme-choice-copy"><strong>{option.label}</strong><small>{option.description}</small></span>
              </label>
            ))}
          </fieldset>
        </section>

        <section aria-labelledby="inventory-heading" className="settings-card inventory-settings">
          <p className="eyebrow">Conteúdo disponível</p>
          <h2 id="inventory-heading">Inventário do atlas</h2>
          <p>Esta é a visão técnica da coleção instalada neste aparelho.</p>
          <dl className="inventory-grid">
            <div><dt>Organismos</dt><dd>{organismos.length}</dd></div>
            <div><dt>Imagens e diagramas</dt><dd>{media.length}</dd></div>
            <div><dt>Espécimes</dt><dd>{especimes.length}</dd></div>
            <div><dt>Leituras e dossiês</dt><dd>{publicacoes.length + dossies.length}</dd></div>
          </dl>
        </section>

        <StudyDataControls />

        <section aria-labelledby="about-heading" className="settings-card settings-about">
          <p className="eyebrow">Projeto</p>
          <h2 id="about-heading">Sobre o Dinopad</h2>
          <p>Atlas interativo sobre a história da vida, fósseis, fauna e flora, feito para explorar em família.</p>
          <p className="settings-version">Versão 0.1.0</p>
          <Link className="settings-link" to="/creditos">
            <span><strong>Créditos, fontes e método editorial</strong><small>Consulte referências científicas, licenças e autoria das mídias.</small></span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

        <aside className="settings-dedication">
          <p className="eyebrow">Feito com carinho</p>
          <p>Para a Maria Sofia e todas as crianças curiosas sobre a vida na Terra.</p>
        </aside>
      </div>
    </div>
  );
}
