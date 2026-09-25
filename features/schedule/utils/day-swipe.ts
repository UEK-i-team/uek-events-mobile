export const DAY_SWIPE_THRESHOLD = 110;
// Scroll offsets are fractional on Android, so exact edge comparisons miss.
const EDGE_TOLERANCE = 1;

export interface ScrollEdges {
  isAtTop: boolean;
  isAtBottom: boolean;
}

export function getScrollEdges(offsetY: number, layoutHeight: number, contentHeight: number): ScrollEdges {
  "worklet";
  const maxScroll = Math.max(0, contentHeight - layoutHeight);
  return {
    isAtTop: offsetY <= EDGE_TOLERANCE,
    isAtBottom: offsetY >= maxScroll - EDGE_TOLERANCE,
  };
}

// Positive pulls toward the previous day, negative toward the next one; a drag
// away from the edge it started at does not pull at all.
export function getDaySwipePull(translationY: number, atStart: ScrollEdges): number {
  "worklet";
  if (translationY > 0 && atStart.isAtTop) return translationY;
  if (translationY < 0 && atStart.isAtBottom) return translationY;
  return 0;
}

// A drag switches the day only when it starts and ends at the edge it pulls
// past, so scrolling through a long day never jumps to another one.
export function resolveDaySwipe(translationY: number, atStart: ScrollEdges, atEnd: ScrollEdges): -1 | 0 | 1 {
  "worklet";
  if (translationY > DAY_SWIPE_THRESHOLD && atStart.isAtTop && atEnd.isAtTop) return -1;
  if (translationY < -DAY_SWIPE_THRESHOLD && atStart.isAtBottom && atEnd.isAtBottom) return 1;
  return 0;
}
