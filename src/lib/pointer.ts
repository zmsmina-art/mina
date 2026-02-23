type PointerListener = (x: number, y: number) => void;

const listeners = new Set<PointerListener>();
let listening = false;
let px = 0;
let py = 0;

function onPointerMove(e: PointerEvent) {
  px = e.clientX;
  py = e.clientY;
  broadcast();
}

function onScroll() {
  broadcast();
}

function broadcast() {
  listeners.forEach((fn) => fn(px, py));
}

export function subscribePointer(fn: PointerListener): () => void {
  listeners.add(fn);
  if (!listening) {
    document.body.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    listening = true;
  }
  fn(px, py);
  return () => {
    listeners.delete(fn);
    if (listeners.size === 0) {
      document.body.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScroll);
      listening = false;
    }
  };
}
