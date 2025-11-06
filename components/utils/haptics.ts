export const triggerHapticFeedback = (intensity: number | number[] = 50) => {
  if (window.navigator && 'vibrate' in window.navigator) {
    try {
      window.navigator.vibrate(intensity);
    } catch (e) {
      console.warn("Haptic feedback failed or is not supported.", e);
    }
  }
};
