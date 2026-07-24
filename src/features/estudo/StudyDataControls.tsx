import { type ChangeEvent, useState } from 'react';
import { studyDb } from './study-db';
import { useStudySnapshot } from './useStudySnapshot';

export function StudyDataControls() {
  const { favoritos, progressos } = useStudySnapshot();
  const [message, setMessage] = useState('');

  const exportStudy = async () => {
    try {
      const data = await studyDb.exportar();
      const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `dinopad-estudo-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
      setMessage('Cópia de segurança criada.');
    } catch {
      setMessage('Não foi possível criar a cópia de segurança neste navegador.');
    }
  };

  const importStudy = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      await studyDb.importar(JSON.parse(await file.text()) as unknown);
      setMessage('Dados restaurados. O conteúdo existente foi preservado quando era mais recente.');
    } catch {
      setMessage('Arquivo inválido. Nenhum dado foi alterado.');
    } finally {
      event.target.value = '';
    }
  };

  const leiturasConcluidas = progressos.filter(({ percentual }) => percentual >= 100).length;

  return (
    <section aria-labelledby="study-data-heading" className="settings-card study-settings">
      <div className="settings-card-heading">
        <div>
          <p className="eyebrow">Dados neste aparelho</p>
          <h2 id="study-data-heading">Estudo e cópia de segurança</h2>
        </div>
      </div>
      <p>Leituras, favoritos e anotações ficam somente neste navegador. Uma cópia JSON permite guardar ou transferir esse caderno.</p>
      <dl className="study-summary">
        <div><dt>Leituras concluídas</dt><dd>{leiturasConcluidas}</dd></div>
        <div><dt>Favoritos</dt><dd>{favoritos.length}</dd></div>
      </dl>
      <div className="study-settings-actions">
        <button className="button button-quiet" onClick={exportStudy} type="button">Exportar cópia</button>
        <label className="button button-quiet">
          Importar cópia
          <input accept="application/json" className="sr-only" onChange={importStudy} type="file" />
        </label>
      </div>
      <p aria-live="polite" className="settings-message">{message}</p>
      <p className="settings-caution">Limpar os dados do site ou usar navegação privada pode apagar esse conteúdo.</p>
    </section>
  );
}
