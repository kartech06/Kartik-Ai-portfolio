import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Stars } from "@react-three/drei";
import { useRef, Suspense } from "react";

function MinimalCore() {
  const mesh = useRef();

  useFrame((state, delta) => {
    if (!mesh.current) return;

    mesh.current.rotation.y += delta * 0.25;
    mesh.current.rotation.x += delta * 0.1;

    const targetX = state.mouse.x * 0.8;
    const targetY = state.mouse.y * 0.5;

    mesh.current.position.x += (targetX - mesh.current.position.x) * 0.05;
    mesh.current.position.y += (targetY - mesh.current.position.y) * 0.05;

    mesh.current.position.z = -Math.abs(state.mouse.x) * 0.2;
  });

  return (
    <Float speed={2} rotationIntensity={0.6} floatIntensity={1}>
      <mesh ref={mesh}>
        <torusKnotGeometry args={[1.6, 0.4, 128, 32]} />
        <meshStandardMaterial
          color="#c9c9c9"
          metalness={1}
          roughness={0.15}
          envMapIntensity={2}
        />
      </mesh>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <pointLight position={[-5, -5, -5]} intensity={0.8} />

      <Stars radius={80} depth={40} count={1000} factor={2} fade />

      <pointLight position={[0, 0, 5]} intensity={1.2} />

      <MinimalCore />

      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.35} />
    </>
  );
}

export default function Scene3D() {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 1.5]}>
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}