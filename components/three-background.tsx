"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Float, Text3D, Environment, Sparkles } from "@react-three/drei"
import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import type * as THREE from "three"

function FloatingTodo({
  position,
  rotation,
  text,
}: { position: [number, number, number]; rotation: [number, number, number]; text: string }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      meshRef.current.rotation.y += 0.005
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3 + position[0]) * 0.2
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} rotation={rotation}>
        <boxGeometry args={[1.5, 0.2, 1]} />
        <meshStandardMaterial color="#4f46e5" opacity={0.7} transparent />
      </mesh>
      <Text3D
        font="/fonts/Inter_Bold.json"
        size={0.1}
        height={0.02}
        position={[position[0] - 0.6, position[1] + 0.15, position[2] + 0.51]}
        rotation={rotation}
      >
        {text}
        <meshStandardMaterial color="#ffffff" />
      </Text3D>
    </Float>
  )
}

function AnimatedSphere({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.4) * 0.3
    }
  })

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={meshRef} position={position}>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial color="#06b6d4" wireframe opacity={0.6} transparent />
      </mesh>
    </Float>
  )
}

function CheckmarkIcon({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.6) * 0.1
    }
  })

  return (
    <Float speed={1} rotationIntensity={0.3} floatIntensity={0.8}>
      <group ref={groupRef} position={position}>
        <mesh position={[0.1, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.4, 0.05, 0.05]} />
          <meshStandardMaterial color="#10b981" />
        </mesh>
        <mesh position={[-0.1, 0.1, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[0.2, 0.05, 0.05]} />
          <meshStandardMaterial color="#10b981" />
        </mesh>
      </group>
    </Float>
  )
}

export function ThreeBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <Environment preset="dawn" />
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4f46e5" />

        {/* Floating todo cards */}
        <FloatingTodo position={[-4, 2, -2]} rotation={[0.1, 0.3, 0]} text="✓ Learn 3D" />
        <FloatingTodo position={[4, -1, -3]} rotation={[-0.1, -0.2, 0]} text="✓ Be Creative" />
        <FloatingTodo position={[-3, -2, -1]} rotation={[0.2, 0.1, 0]} text="✓ Stay Organized" />

        {/* Animated spheres */}
        <AnimatedSphere position={[-5, 0, -4]} />
        <AnimatedSphere position={[5, 3, -5]} />
        <AnimatedSphere position={[2, -3, -2]} />

        {/* Checkmark icons */}
        <CheckmarkIcon position={[-2, 3, -1]} />
        <CheckmarkIcon position={[3, 1, -2]} />
        <CheckmarkIcon position={[-1, -1, -3]} />

        {/* Sparkles for magic effect */}
        <Sparkles count={50} scale={[10, 10, 10]} size={2} speed={0.4} color="#4f46e5" />

        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  )
}
