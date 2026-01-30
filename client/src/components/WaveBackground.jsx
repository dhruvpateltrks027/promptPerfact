import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import FOG from 'vanta/dist/vanta.fog.min';

/**
 * WaveBackground Component
 * Renders a WebGL-powered animated fog/smoke background using Vanta.js
 */
export default function WaveBackground() {
  const [vantaEffect, setVantaEffect] = useState(null);
  const vantaRef = useRef(null);

  useEffect(() => {
    if (!vantaEffect && vantaRef.current) {
      setVantaEffect(
        FOG({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          highlightColor: 0x7c3aed, // Purple
          midtoneColor: 0x22d3ee,   // Cyan
          lowlightColor: 0x2a0a4a,  // Deep purple/blue
          baseColor: 0x05050a,      // Background base
          blurFactor: 0.6,
          speed: 1.5,
          zoom: 1.2
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <div 
      ref={vantaRef} 
      className="fixed inset-0 z-0"
      style={{ 
        background: '#05050a'
      }}
    />
  );
}

