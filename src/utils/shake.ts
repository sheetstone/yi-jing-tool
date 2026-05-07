import { useEffect, useCallback, useRef } from 'react';

interface ShakeOptions {
  threshold?: number;    // acceleration threshold
  cooldownMs?: number;   // minimum time between shake detections
  onShake: () => void;
}

export function useShakeDetector({ threshold = 15, cooldownMs = 1000, onShake }: ShakeOptions) {
  const lastShakeRef = useRef<number>(0);
  const callbackRef = useRef(onShake);
  callbackRef.current = onShake;

  const handleMotion = useCallback((event: DeviceMotionEvent) => {
    const acc = event.accelerationIncludingGravity;
    if (!acc || !acc.x || !acc.y || !acc.z) return;

    const magnitude = Math.sqrt(acc.x ** 2 + acc.y ** 2 + acc.z ** 2);

    if (magnitude > threshold) {
      const now = Date.now();
      if (now - lastShakeRef.current > cooldownMs) {
        lastShakeRef.current = now;
        callbackRef.current();
      }
    }
  }, [threshold, cooldownMs]);

  useEffect(() => {
    if (typeof DeviceMotionEvent === 'undefined') return;

    // iOS requires permission request
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      // We don't auto-request; user will trigger via button
      return;
    }

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [handleMotion]);

  return {
    requestPermission: async (): Promise<boolean> => {
      if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
        try {
          const permission = await (DeviceMotionEvent as any).requestPermission();
          if (permission === 'granted') {
            window.addEventListener('devicemotion', handleMotion);
            return true;
          }
        } catch {
          return false;
        }
      }
      // No permission needed (Android)
      window.addEventListener('devicemotion', handleMotion);
      return true;
    },
  };
}
