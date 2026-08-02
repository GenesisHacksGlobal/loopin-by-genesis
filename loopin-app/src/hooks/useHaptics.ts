import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';

export const useHaptics = () => {
  const triggerSuccessHaptic = async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        await Haptics.notification({ type: NotificationType.Success });
      } else if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([50, 30, 80]);
      }
    } catch {
      // Haptics not supported in environment
    }
  };

  const triggerImpactHaptic = async (style: 'light' | 'medium' | 'heavy' = 'medium') => {
    try {
      if (Capacitor.isNativePlatform()) {
        const impactStyle =
          style === 'light'
            ? ImpactStyle.Light
            : style === 'heavy'
            ? ImpactStyle.Heavy
            : ImpactStyle.Medium;
        await Haptics.impact({ style: impactStyle });
      } else if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(40);
      }
    } catch {
      // Haptics unsupported
    }
  };

  return { triggerSuccessHaptic, triggerImpactHaptic };
};
