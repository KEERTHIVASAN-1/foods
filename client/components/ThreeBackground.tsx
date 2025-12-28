import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const FloatingShape = ({ position, color, speed }: { position: [number, number, number], color: string, speed: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * speed;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * (speed * 0.5);
      meshRef.current.position.y += Math.sin(state.clock.getElapsedTime() * speed) * 0.002;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 32, 32]} position={position} scale={1.5}>
      <MeshDistortMaterial
        color={color}
        attach="material"
        distort={0.4}
        speed={1.5}
        roughness={0.4}
        metalness={0.1}
        transparent
        opacity={0.3}
      />
    </Sphere>
  );
};

const ThreeBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
      <Canvas camera={{ position: [0, 0, 5] }}>
        {/* @ts-ignore */}
        <ambientLight intensity={0.5} />
        {/* @ts-ignore */}
        <pointLight position={[10, 10, 10]} />
        <FloatingShape position={[-2, 1, 0]} color="#e23744" speed={0.4} />
        <FloatingShape position={[2, -1, -2]} color="#f97316" speed={0.3} />
        <FloatingShape position={[0, 2, -1]} color="#f5cd47" speed={0.2} />
      </Canvas>
    </div>
  );
};

export default ThreeBackground;