/**
 * LinhaDoTempo.tsx
 * Tela principal da linha do tempo geologica.
 * Fase 1: timeline SVG navegavel com bandas geologicas.
 */
import { Timeline } from './components/Timeline';

export default function LinhaDoTempo() {
  return (
    <div className="h-full">
      <Timeline />
    </div>
  );
}
