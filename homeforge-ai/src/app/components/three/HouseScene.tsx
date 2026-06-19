"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float, Environment } from "@react-three/drei";

function MiniHouse() {
  return (
    <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.7}>
      <group rotation={[0, -0.55, 0]}>
        {/* Ground platform */}
        <mesh position={[0, -0.08, 0]}>
          <boxGeometry args={[5.2, 0.12, 4]} />
          <meshStandardMaterial color="#0f172a" metalness={0.2} roughness={0.35} />
        </mesh>

        {/* Main house body */}
        <mesh position={[0, 0.65, 0]}>
          <boxGeometry args={[3.2, 1.4, 2.3]} />
          <meshStandardMaterial color="#e5e7eb" roughness={0.35} />
        </mesh>

        {/* Roof */}
        <mesh position={[0, 1.55, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[2.45, 2.45, 2.55]} />
          <meshStandardMaterial color="#111827" metalness={0.25} roughness={0.2} />
        </mesh>

        {/* Front glass window */}
        <mesh position={[0, 0.75, 1.17]}>
          <boxGeometry args={[1.55, 0.75, 0.05]} />
          <meshStandardMaterial color="#22d3ee" emissive="#0891b2" emissiveIntensity={0.35} />
        </mesh>

        {/* Door */}
        <mesh position={[-1.1, 0.35, 1.2]}>
          <boxGeometry args={[0.45, 0.9, 0.06]} />
          <meshStandardMaterial color="#a16207" roughness={0.4} />
        </mesh>

        {/* Side windows */}
        <mesh position={[1.66, 0.8, -0.35]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[1, 0.55, 0.05]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.25} />
        </mesh>

        {/* Pool */}
        <mesh position={[1.25, 0.02, -1.55]}>
          <boxGeometry args={[1.7, 0.05, 0.75]} />
          <meshStandardMaterial color="#06b6d4" emissive="#0891b2" emissiveIntensity={0.2} />
        </mesh>
      </group>
    </Float>
  );
}

export default function HouseScene() {
  return (
    <div className="h-[420px] w-full">
      <Canvas camera={{ position: [4, 3, 6], fov: 42 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 7, 5]} intensity={1.8} />
        <MiniHouse />
        <Environment preset="city" />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.8} />
      </Canvas>
    </div>
  );
}