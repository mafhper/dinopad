/**
 * router.tsx
 * Configuracao de rotas do Dinopad usando React Router com HashRouter.
 */
import { createHashRouter } from 'react-router-dom';
import { NavigationShell } from './NavigationShell';
import { lazy, Suspense } from 'react';

const LinhaDoTempo = lazy(() => import('../features/linha-do-tempo/LinhaDoTempo'));
const Inicio = lazy(() => import('../features/inicio/Inicio'));
const ColecaoCartas = lazy(() => import('../features/colecao-cartas/ColecaoCartas'));
const ArvoreEvolutiva = lazy(() => import('../features/arvore-evolutiva/ArvoreEvolutiva'));
const Comparador = lazy(() => import('../features/comparador/Comparador'));
const Busca = lazy(() => import('../features/busca/Busca'));
const Configuracoes = lazy(() => import('../features/configuracoes/Configuracoes'));
const Creditos = lazy(() => import('../features/configuracoes/Creditos'));
const Humanidade = lazy(() => import('../features/humanidade/Humanidade'));
const Publicacoes = lazy(() => import('../features/publicacoes/Publicacoes'));

function Loading() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-gray-400">Carregando...</div>
    </div>
  );
}

export const router = createHashRouter([
  {
    path: '/',
    element: <NavigationShell />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <Inicio />
          </Suspense>
        ),
      },
      {
        path: 'tempo',
        element: (
          <Suspense fallback={<Loading />}>
            <LinhaDoTempo />
          </Suspense>
        ),
      },
      {
        path: 'cartas',
        element: (
          <Suspense fallback={<Loading />}>
            <ColecaoCartas />
          </Suspense>
        ),
      },
      {
        path: 'arvore',
        element: (
          <Suspense fallback={<Loading />}>
            <ArvoreEvolutiva />
          </Suspense>
        ),
      },
      {
        path: 'comparar',
        element: (
          <Suspense fallback={<Loading />}>
            <Comparador />
          </Suspense>
        ),
      },
      {
        path: 'buscar',
        element: (
          <Suspense fallback={<Loading />}>
            <Busca />
          </Suspense>
        ),
      },
      {
        path: 'humanidade',
        element: (
          <Suspense fallback={<Loading />}>
            <Humanidade />
          </Suspense>
        ),
      },
      {
        path: 'publicacoes',
        element: (
          <Suspense fallback={<Loading />}>
            <Publicacoes />
          </Suspense>
        ),
      },
      {
        path: 'publicacoes/:slug',
        element: (
          <Suspense fallback={<Loading />}>
            <Publicacoes />
          </Suspense>
        ),
      },
      {
        path: 'config',
        element: (
          <Suspense fallback={<Loading />}>
            <Configuracoes />
          </Suspense>
        ),
      },
      {
        path: 'creditos',
        element: (
          <Suspense fallback={<Loading />}>
            <Creditos />
          </Suspense>
        ),
      },
    ],
  },
]);
