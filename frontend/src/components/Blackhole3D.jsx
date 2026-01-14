import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, useGLTF, Environment } from '@react-three/drei';

// NOTE: No import needed here!

const PlanetModel = () => {
  // Access the file directly from the public folder using a string
  // The path starts relative to the 'public' folder
  const { scene } = useGLTF('/planets/jupiter.glb'); 
  const modelRef = useRef();

  useFrame((state, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.1; 
    }
  });

  return (
    <primitive 
      ref={modelRef} 
      object={scene} 
      scale={2.5} 
    />
  );
};

const Blackhole3D = () => {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }} gl={{ alpha: false, antialias: true }}>
        <color attach="background" args={['#0a0015']} />
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 3, 5]} intensity={2} color="#ffffff" />

        <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
           <Suspense fallback={null}>
              <PlanetModel />
           </Suspense>
        </Float>

        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        <Environment preset="city" /> 
        <fog attach="fog" args={['#0a0015', 10, 30]} />
      </Canvas>
    </div>
  );
};

export default Blackhole3D;