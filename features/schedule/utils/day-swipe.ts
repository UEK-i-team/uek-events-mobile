export const DAY_SWIPE_THRESHOLD = 80;
// A quick flick switches the day even when it is shorter than the threshold.
export const DAY_SWIPE_VELOCITY = 600;

// Swiping left shows the next day, swiping right the previous one.
export function resolveDaySwipe(translationX: number, velocityX: number): -1 | 0 | 1 {
  "worklet";
  const isFlick = Math.abs(velocityX) > DAY_SWIPE_VELOCITY && Math.sign(velocityX) === Math.sign(translationX);
  if (Math.abs(translationX) < DAY_SWIPE_THRESHOLD && !isFlick) return 0;
  return translationX < 0 ? 1 : -1;
}
