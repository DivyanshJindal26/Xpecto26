import { Canvas, useFrame } from "@react-three/fiber";
import { Torus } from "@react-three/drei";
import { useRef } from "react";

function Ring() {
  const ref = useRef();

  useFrame((_, delta) => {
    ref.current.rotation.x += delta * 0.05;
    ref.current.rotation.y += delta * 0.08;
  });

  return (
    <Torus ref={ref} args={[2.5, 0.03, 16, 100]} position={[0, 0, 0]}>
      <meshStandardMaterial
        color="#38bdf8"
        emissive="#38bdf8"
        emissiveIntensity={0.6}
        transparent
        opacity={0.35}
      />
    </Torus>
  );
}

export default function OrbitalAccent() {
  return (
    <Canvas
      className="absolute inset-0 pointer-events-none"
      camera={{ position: [0, 0, 6] }}
    >
      <ambientLight intensity={0.5} />
      <Ring />
    </Canvas>
  );
}
