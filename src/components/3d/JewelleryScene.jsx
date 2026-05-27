import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, MeshDistortMaterial, Sparkles } from '@react-three/drei'
import { useMousePosition } from '@/hooks/useMousePosition'
import * as THREE from 'three'

function GoldTorus({ mouse }) {
  const meshRef = useRef()
  const materialRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      // Slow rotation
      meshRef.current.rotation.x += 0.003
      meshRef.current.rotation.y += 0.005

      // Mouse-reactive tilt
      const targetRotX = mouse.normalizedY * 0.3
      const targetRotZ = mouse.normalizedX * 0.15
      meshRef.current.rotation.x += (targetRotX - meshRef.current.rotation.x) * 0.02
      meshRef.current.rotation.z += (targetRotZ - meshRef.current.rotation.z) * 0.02
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef} castShadow>
        <torusGeometry args={[1.8, 0.35, 64, 128]} />
        <meshStandardMaterial
          ref={materialRef}
          color="#C9A96E"
          metalness={0.95}
          roughness={0.08}
          envMapIntensity={2.5}
        />
      </mesh>
    </Float>
  )
}

function InnerRing({ mouse }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y -= 0.008
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.3
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.3}>
      <mesh ref={meshRef} castShadow>
        <torusGeometry args={[1.1, 0.15, 48, 96]} />
        <meshStandardMaterial
          color="#D4B87A"
          metalness={0.9}
          roughness={0.12}
          envMapIntensity={2}
        />
      </mesh>
    </Float>
  )
}

function GemSphere() {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1
    }
  })

  return (
    <Float speed={3} floatIntensity={0.2}>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.25, 64, 64]} />
        <MeshDistortMaterial
          color="#5C1A1B"
          metalness={0.3}
          roughness={0.1}
          envMapIntensity={3}
          distort={0.15}
          speed={2}
        />
      </mesh>
    </Float>
  )
}

function FloatingParticles() {
  return (
    <Sparkles
      count={80}
      size={2}
      speed={0.3}
      scale={6}
      color="#C9A96E"
      opacity={0.5}
    />
  )
}

function MouseLight({ mouse }) {
  const lightRef = useRef()

  useFrame(() => {
    if (lightRef.current) {
      lightRef.current.position.x += (mouse.normalizedX * 5 - lightRef.current.position.x) * 0.05
      lightRef.current.position.y += (mouse.normalizedY * 5 - lightRef.current.position.y) * 0.05
    }
  })

  return (
    <pointLight
      ref={lightRef}
      color="#C9A96E"
      intensity={3}
      distance={15}
      position={[2, 2, 4]}
    />
  )
}

export default function JewelleryScene({ className = '' }) {
  const mouse = useMousePosition()

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} color="#F5F0E8" />
        <MouseLight mouse={mouse} />

        <GoldTorus mouse={mouse} />
        <InnerRing mouse={mouse} />
        <GemSphere />
        <FloatingParticles />

        <Environment preset="studio" environmentIntensity={0.6} />
      </Canvas>
    </div>
  )
}
