import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, useGLTF, Environment } from '@react-three/drei';

/* =======================
   Planet Model Component
======================= */
const PlanetModel = ({ scale = 2.5, rotationSpeed = 0.1 }) => {
  const { scene } = useGLTF('/planets/green_planet.glb');
  const modelRef = useRef();

  useFrame((_, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * rotationSpeed;
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={scale}
    />
  );
};

/* =======================
   Blackhole3D Component
======================= */
const Blackhole3D = ({
  canvasSize = 120,     // 🔥 controls canvas size (px)
  modelScale = 2.5,     // 🔥 controls model size
  rotationSpeed = 0.1, // optional tweak
}) => {
  return (
    <div
      className="relative"
      style={{
        width: canvasSize,
        height: canvasSize,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false }}
      >
        {/* Background */}
        <color attach="background" args={['#0a0015']} />

        {/* Lights */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 3, 5]} intensity={2} />

        {/* Floating Planet */}
        <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
          <Suspense fallback={null}>
            <PlanetModel
              scale={modelScale}
              rotationSpeed={rotationSpeed}
            />
          </Suspense>
        </Float>

        {/* Atmosphere */}
        <Stars radius={100} depth={50} count={3000} factor={4} fade />
        <Environment preset="city" />
        <fog attach="fog" args={['#0a0015', 10, 30]} />
      </Canvas>
    </div>
  );
};

export default Blackhole3D;
