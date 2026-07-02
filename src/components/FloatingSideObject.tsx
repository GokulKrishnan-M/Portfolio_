import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { Suspense, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

type CrystalObjectProps = {
	isDragging: boolean;
	isHovered: boolean;
};

const OrbitingDot = ({
	color,
	phase,
	radius,
	speed,
}: {
	color: string;
	phase: number;
	radius: number;
	speed: number;
}) => {
	const meshRef = useRef<THREE.Mesh>(null);

	useFrame((state) => {
		if (!meshRef.current) return;

		const elapsed = state.clock.elapsedTime * speed + phase;
		meshRef.current.position.set(
			Math.cos(elapsed) * radius,
			Math.sin(elapsed * 1.22) * (radius * 0.48),
			Math.sin(elapsed) * radius * 0.42,
		);
		meshRef.current.scale.setScalar(0.84 + Math.sin(elapsed * 2) * 0.12);
	});

	return (
		<mesh ref={meshRef}>
			<sphereGeometry args={[0.055, 18, 18]} />
			<meshBasicMaterial color={color} toneMapped={false} />
		</mesh>
	);
};

const CrystalObject = ({ isDragging, isHovered }: CrystalObjectProps) => {
	const groupRef = useRef<THREE.Group>(null);
	const tiltRef = useRef<THREE.Group>(null);
	const glowRef = useRef<THREE.PointLight>(null);
	const octaEdges = useMemo(
		() => new THREE.EdgesGeometry(new THREE.OctahedronGeometry(1.36, 0)),
		[],
	);
	const wingEdges = useMemo(
		() => new THREE.EdgesGeometry(new THREE.TetrahedronGeometry(0.9, 0)),
		[],
	);

	useFrame((state, delta) => {
		if (!groupRef.current || !tiltRef.current) return;

		const elapsed = state.clock.elapsedTime;
		const spinSpeed = isDragging ? 1.75 : isHovered ? 1.15 : 0.58;
		const targetScale = isDragging ? 1.1 : isHovered ? 1.06 : 1;

		groupRef.current.rotation.y += delta * spinSpeed;
		groupRef.current.rotation.x += delta * (isHovered ? 0.22 : 0.1);
		groupRef.current.rotation.z = Math.sin(elapsed * 0.6) * 0.12;
		groupRef.current.position.y = Math.sin(elapsed * 0.9) * 0.14;
		groupRef.current.scale.lerp(
			new THREE.Vector3(targetScale, targetScale, targetScale),
			0.08,
		);

		tiltRef.current.rotation.x += (state.pointer.y * 0.58 - tiltRef.current.rotation.x) * 0.06;
		tiltRef.current.rotation.y += (state.pointer.x * 0.82 - tiltRef.current.rotation.y) * 0.06;

		if (glowRef.current) {
			glowRef.current.intensity = isDragging ? 6.2 : isHovered ? 5 : 3.4;
		}
	});

	return (
		<group ref={groupRef} rotation={[0.18, -0.38, -0.08]} scale={0.74}>
			<pointLight ref={glowRef} position={[0.8, 0.6, 1.4]} color="#22d3ee" intensity={3.4} />
			<group ref={tiltRef}>
				<mesh rotation={[0.2, 0.56, -0.22]}>
					<octahedronGeometry args={[1.28, 0]} />
					<meshPhysicalMaterial
						color="#ffffff"
						emissive="#123a44"
						emissiveIntensity={0.46}
						metalness={0.78}
						roughness={0.12}
						clearcoat={1}
						clearcoatRoughness={0.08}
						transparent
						opacity={0.82}
					/>
				</mesh>
				<lineSegments geometry={octaEdges}>
					<lineBasicMaterial color="#eaffff" transparent opacity={0.86} />
				</lineSegments>

				<mesh position={[0.92, -0.22, -0.05]} rotation={[0.64, -0.28, 0.86]} scale={[1.2, 0.82, 0.9]}>
					<tetrahedronGeometry args={[0.92, 0]} />
					<meshPhysicalMaterial
						color="#164e63"
						emissive="#00d9ff"
						emissiveIntensity={0.58}
						metalness={0.9}
						roughness={0.08}
						clearcoat={1}
						transparent
						opacity={0.92}
					/>
				</mesh>
				<lineSegments geometry={wingEdges} position={[0.92, -0.22, -0.05]} rotation={[0.64, -0.28, 0.86]} scale={[1.2, 0.82, 0.9]}>
					<lineBasicMaterial color="#67e8f9" transparent opacity={0.5} />
				</lineSegments>

				<mesh position={[-0.88, 0.32, 0.14]} rotation={[-0.72, 0.2, -0.64]} scale={[0.88, 1.14, 0.82]}>
					<tetrahedronGeometry args={[0.86, 0]} />
					<meshPhysicalMaterial
						color="#312e81"
						emissive="#8b5cf6"
						emissiveIntensity={0.48}
						metalness={0.86}
						roughness={0.1}
						clearcoat={1}
						transparent
						opacity={0.9}
					/>
				</mesh>

				<mesh rotation={[Math.PI / 2.4, 0.1, -0.28]} scale={[1.18, 1.18, 0.72]}>
					<torusGeometry args={[1.12, 0.018, 12, 96]} />
					<meshBasicMaterial color="#22d3ee" transparent opacity={0.5} toneMapped={false} />
				</mesh>
			</group>

			<OrbitingDot color="#22d3ee" phase={0} radius={1.78} speed={0.8} />
			<OrbitingDot color="#a78bfa" phase={2.1} radius={1.54} speed={0.95} />
			<OrbitingDot color="#ffffff" phase={4.1} radius={1.34} speed={1.08} />
		</group>
	);
};

export const FloatingSideObject = () => {
	const [isHovered, setIsHovered] = useState(false);
	const [isDragging, setIsDragging] = useState(false);

	return (
		<div className="pointer-events-none fixed right-0 top-1/2 z-30 hidden h-[340px] w-[300px] -translate-y-1/2 md:block">
			<motion.div
				drag
				dragMomentum={false}
				dragElastic={0.18}
				dragConstraints={{ top: -260, right: 130, bottom: 260, left: -520 }}
				onHoverStart={() => setIsHovered(true)}
				onHoverEnd={() => setIsHovered(false)}
				onDragStart={() => setIsDragging(true)}
				onDragEnd={() => setIsDragging(false)}
				onPointerDown={() => setIsDragging(true)}
				onPointerUp={() => setIsDragging(false)}
				onPointerCancel={() => setIsDragging(false)}
				whileHover={{ scale: 1.04 }}
				whileTap={{ scale: 0.98 }}
				transition={{ type: 'spring', stiffness: 220, damping: 24 }}
				className="pointer-events-auto relative h-full w-full cursor-grab touch-none active:cursor-grabbing"
				aria-label="Interactive rotating side object"
				role="img"
			>
				<div className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/12 blur-3xl" />
				<div className="pointer-events-none absolute right-16 top-16 h-4 w-4 rounded-full bg-primary shadow-[0_0_28px_rgba(34,211,238,0.95)]" />
				<div className="pointer-events-none absolute bottom-20 left-12 h-2.5 w-2.5 rounded-full bg-secondary shadow-[0_0_24px_rgba(167,139,250,0.85)]" />
				<motion.div
					className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
					animate={{
						rotateX: isHovered ? [12, -12, 12] : [4, -8, 4],
						rotateY: 360,
						rotateZ: isDragging ? [-8, 10, -8] : [-4, 5, -4],
					}}
					transition={{
						rotateY: {
							duration: isDragging ? 5.5 : isHovered ? 8 : 14,
							repeat: Infinity,
							ease: 'linear',
						},
						rotateX: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
						rotateZ: { duration: 5.4, repeat: Infinity, ease: 'easeInOut' },
					}}
					style={{ transformStyle: 'preserve-3d' }}
				>
					<div className="relative h-44 w-44" style={{ transformStyle: 'preserve-3d' }}>
						<div
							className="absolute left-7 top-4 h-32 w-28 border border-white/45 shadow-[0_0_38px_rgba(34,211,238,0.24)] backdrop-blur-sm"
							style={{
								background:
									'linear-gradient(135deg, rgba(255,255,255,0.84), rgba(34,211,238,0.26) 42%, rgba(10,16,30,0.86) 76%)',
								clipPath: 'polygon(48% 0, 100% 42%, 66% 100%, 0 72%, 12% 18%)',
								transform: 'rotateX(58deg) rotateY(-30deg) rotateZ(-14deg)',
							}}
						/>
						<div
							className="absolute right-5 top-12 h-28 w-32 border border-cyan-200/45 shadow-[0_0_34px_rgba(34,211,238,0.3)]"
							style={{
								background:
									'linear-gradient(130deg, rgba(34,211,238,0.82), rgba(96,165,250,0.3) 46%, rgba(7,10,18,0.9) 80%)',
								clipPath: 'polygon(0 28%, 74% 0, 100% 64%, 32% 100%)',
								transform: 'rotateX(-34deg) rotateY(36deg) rotateZ(10deg)',
							}}
						/>
						<div
							className="absolute bottom-5 left-12 h-24 w-32 border border-violet-200/35 shadow-[0_0_34px_rgba(167,139,250,0.26)]"
							style={{
								background:
									'linear-gradient(135deg, rgba(167,139,250,0.74), rgba(34,211,238,0.2) 48%, rgba(3,7,18,0.9) 82%)',
								clipPath: 'polygon(18% 0, 100% 20%, 78% 100%, 0 78%)',
								transform: 'rotateX(32deg) rotateY(20deg) rotateZ(-20deg)',
							}}
						/>
						<div className="absolute left-4 top-1/2 h-px w-40 -translate-y-1/2 bg-cyan-200/75 shadow-[0_0_22px_rgba(34,211,238,0.9)]" />
						<div className="absolute left-1/2 top-3 h-40 w-px -translate-x-1/2 bg-white/50 shadow-[0_0_20px_rgba(255,255,255,0.55)]" />
					</div>
				</motion.div>
				<Canvas
					camera={{ position: [0, 0, 6.3], fov: 36 }}
					dpr={[1, 1.8]}
					gl={{ alpha: true, antialias: true }}
					className="relative z-20 h-full w-full"
				>
					<Suspense fallback={null}>
						<ambientLight intensity={1.25} />
						<directionalLight position={[3, 3, 4]} intensity={2.2} color="#ffffff" />
						<directionalLight position={[-4, -2, 2]} intensity={1.4} color="#8b5cf6" />
						<CrystalObject isDragging={isDragging} isHovered={isHovered} />
					</Suspense>
				</Canvas>
			</motion.div>
		</div>
	);
};

export default FloatingSideObject;
