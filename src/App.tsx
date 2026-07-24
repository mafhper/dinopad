/**
 * App.tsx
 * Componente raiz do Dinopad.
 */
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';

export function App() {
  return <RouterProvider router={router} />;
}
