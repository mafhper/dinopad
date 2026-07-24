import { useEffect, useState } from 'react';
import { STUDY_DATA_CHANGED_EVENT, studyDb, type Favorite, type Progress } from './study-db';

type StudySnapshot = {
  favoritos: Favorite[];
  progressos: Progress[];
  carregando: boolean;
  indisponivel: boolean;
};

const initialSnapshot: StudySnapshot = {
  favoritos: [],
  progressos: [],
  carregando: true,
  indisponivel: false,
};

export function useStudySnapshot() {
  const [snapshot, setSnapshot] = useState<StudySnapshot>(initialSnapshot);

  useEffect(() => {
    let active = true;
    const refresh = () => {
      void Promise.all([studyDb.progressos(), studyDb.favoritos()])
        .then(([progressos, favoritos]) => {
          if (active) setSnapshot({ progressos, favoritos, carregando: false, indisponivel: false });
        })
        .catch(() => {
          if (active) setSnapshot((current) => ({ ...current, carregando: false, indisponivel: true }));
        });
    };
    refresh();
    window.addEventListener(STUDY_DATA_CHANGED_EVENT, refresh);
    return () => {
      active = false;
      window.removeEventListener(STUDY_DATA_CHANGED_EVENT, refresh);
    };
  }, []);

  return snapshot;
}
