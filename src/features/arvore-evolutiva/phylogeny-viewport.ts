type RectLike = Pick<DOMRect, 'bottom' | 'height' | 'left' | 'right' | 'top' | 'width'>;

export function unobscuredViewportCenter(canvas: RectLike, occluder?: RectLike | null) {
  const fallback = { x: canvas.left + canvas.width / 2, y: canvas.top + canvas.height / 2 };
  if (!occluder) return fallback;

  const overlap = {
    bottom: Math.min(canvas.bottom, occluder.bottom),
    left: Math.max(canvas.left, occluder.left),
    right: Math.min(canvas.right, occluder.right),
    top: Math.max(canvas.top, occluder.top),
  };
  if (overlap.right <= overlap.left || overlap.bottom <= overlap.top) return fallback;

  const candidates = [
    { bottom: canvas.bottom, left: canvas.left, right: overlap.left, top: canvas.top },
    { bottom: canvas.bottom, left: overlap.right, right: canvas.right, top: canvas.top },
    { bottom: overlap.top, left: canvas.left, right: canvas.right, top: canvas.top },
    { bottom: canvas.bottom, left: canvas.left, right: canvas.right, top: overlap.bottom },
  ].map((rect) => ({
    ...rect,
    area: Math.max(0, rect.right - rect.left) * Math.max(0, rect.bottom - rect.top),
  }));
  const visible = candidates.reduce((largest, candidate) => candidate.area > largest.area ? candidate : largest);
  if (visible.area === 0) return fallback;
  return { x: (visible.left + visible.right) / 2, y: (visible.top + visible.bottom) / 2 };
}
