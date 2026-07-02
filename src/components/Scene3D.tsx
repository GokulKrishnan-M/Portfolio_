import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type GeometryKind = 'sphere' | 'box' | 'torus';

const FloatingGeometry = ({
  position,
  geometry,
  orbitRadius,
  speed,
  phaseOffset,
}: {
  position: [number, number, number];
  geometry: GeometryKind;
  orbitRadius: number;
  speed: number;
  phaseOffset: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) {
      return;
    }

    const elapsed = state.clock.elapsedTime * speed + phaseOffset;
    const scale = 1 + Math.sin(elapsed * 1.8) * 0.08;

    meshRef.current.rotation.x = elapsed * 0.45;
    meshRef.current.rotation.y = elapsed * 0.7;
    meshRef.current.rotation.z = Math.sin(elapsed * 0.8) * 0.25;

    meshRef.current.position.x = position[0] + Math.cos(elapsed) * orbitRadius;
    meshRef.current.position.y = position[1] + Math.sin(elapsed * 1.35) * (orbitRadius * 0.55);
    meshRef.current.position.z = position[2] + Math.sin(elapsed * 0.9) * 0.7;
    meshRef.current.scale.setScalar(scale);
  });

  const renderGeometry = () => {
    switch (geometry) {
      case 'sphere':
        return <sphereGeometry args={[1, 32, 32]} />;
      case 'box':
        return <boxGeometry args={[1.5, 1.5, 1.5]} />;
      case 'torus':
        return <torusGeometry args={[1, 0.4, 16, 32]} />;
      default:
        return <sphereGeometry args={[1, 32, 32]} />;
    }
  };

  return (
      <mesh ref={meshRef} position={position}>
      {renderGeometry()}
      <meshStandardMaterial
        color="#0800ffff"
        emissive="#0040ffff"
        emissiveIntensity={0.2}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
};

const SceneRig = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) {
      return;
    }

    const elapsed = state.clock.elapsedTime;
    groupRef.current.rotation.z = Math.sin(elapsed * 0.22) * 0.08;
    groupRef.current.position.y = Math.sin(elapsed * 0.35) * 0.18;
  });

  return (
    <group ref={groupRef}>
      <FloatingGeometry
        position={[-3, 2, 0]}
        geometry="sphere"
        orbitRadius={0.7}
        speed={0.9}
        phaseOffset={0}
      />
      <FloatingGeometry
        position={[3, -1, 2]}
        geometry="box"
        orbitRadius={0.95}
        speed={0.7}
        phaseOffset={1.6}
      />
      <FloatingGeometry
        position={[0, 1, -2]}
        geometry="torus"
        orbitRadius={0.8}
        speed={1.1}
        phaseOffset={3.2}
      />
    </group>
  );
};

export const Scene3D = () => {
  return (
    <div className="scene-3d absolute inset-0 z-10">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.45} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#00ffff" />
          <pointLight position={[-10, -10, -10]} intensity={0.55} color="#ff00ff" />
          <pointLight position={[0, 4, 8]} intensity={0.45} color="#60a5fa" />

          <SceneRig />
        </Suspense>
      </Canvas>
    </div>
  );
};
