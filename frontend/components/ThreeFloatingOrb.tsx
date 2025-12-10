"use client";

import dynamic from 'next/dynamic';
import { Suspense, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Canvas = dynamic(
  () => import('@react-three/fiber').then((mod) => mod.Canvas),
  { ssr: false }
);
const OrbitControls = dynamic(
  () => import('@react-three/drei').then((mod) => mod.OrbitControls),
  { ssr: false }
);
const MeshDistortMaterial = dynamic(
  () => import('@react-three/drei').then((mod) => mod.MeshDistortMaterial),
  { ssr: false }
);

export function ThreeFloatingOrb() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced) setEnabled(true);
  }, []);

  if (!enabled) {
    return (
      <div
        style={{
          width: '100%',
          height: 260,
          borderRadius: 999,
          background: 'linear-gradient(120deg, rgba(255,124,40,0.18), rgba(255,63,175,0.18))',
          filter: 'blur(6px)',
        }}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
      style={{ width: '100%', height: 260 }}
    >
      <Suspense
        fallback={
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '999px',
              background: 'radial-gradient(circle at 30% 30%, rgba(255,124,40,0.25), rgba(255,63,175,0.25))',
            }}
          />
        }
      >
        <Canvas camera={{ position: [0, 0, 4.2], fov: 50 }}>
          <ambientLight intensity={0.7} />
          <pointLight position={[2, 3, 3]} intensity={1.2} color="#ff7a1a" />
          <pointLight position={[-3, -2, -4]} intensity={0.9} color="#ff3faf" />
          <mesh>
            <icosahedronGeometry args={[1.3, 1]} />
            <MeshDistortMaterial
              speed={3}
              distort={0.45}
              color="#ff7a1a"
              emissive="#ff3faf"
              emissiveIntensity={0.4}
              roughness={0.15}
              metalness={0.35}
            />
          </mesh>
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.2} />
        </Canvas>
      </Suspense>
    </motion.div>
  );
}


