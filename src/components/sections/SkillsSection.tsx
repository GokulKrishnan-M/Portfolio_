import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import {
	Atom,
	Bot,
	Braces,
	Code2,
	Coffee,
	Database,
	FileCode2,
	Flame,
	GitBranch,
	MonitorSmartphone,
	Paintbrush,
	Palette,
	PenTool,
	Server,
	Smartphone,
	Sparkles,
	Wrench,
} from 'lucide-react';
import { useMemo, useRef } from 'react';
import { ParticleBackground } from '../ParticleBackground';

type SkillCategoryColor = 'primary' | 'secondary' | 'accent';
type SkillHeadingColor = SkillCategoryColor | 'purple';

const skillCategories = [
	{
		title: 'Frontend',
		color: 'primary',
		headingColor: 'primary',
		icon: MonitorSmartphone,
		skills: [
			{ name: 'HTML', level: 92, icon: FileCode2 },
			{ name: 'CSS', level: 78, icon: Paintbrush },
			{ name: 'JavaScript', level: 81, icon: Braces },
			{ name: 'Flutter', level: 84, icon: Smartphone },
			{ name: 'React.js', level: 58, icon: Atom },
		],
	},
	{
		title: 'Backend',
		color: 'secondary',
		headingColor: 'purple',
		icon: Server,
		skills: [
			{ name: 'PHP', level: 87, icon: FileCode2 },
			{ name: 'Java', level: 82, icon: Coffee },
			{ name: 'Python', level: 77, icon: Bot },
			{ name: 'SQL', level: 85, icon: Database },
			{ name: 'MongoDB', level: 78, icon: Database },
		],
	},
	{
		title: 'Tools & Others',
		color: 'accent',
		headingColor: 'accent',
		icon: Wrench,
		skills: [
			{ name: 'Canva', level: 90, icon: Palette },
			{ name: 'Adobe Tools', level: 69, icon: PenTool },
			{ name: 'Git', level: 90, icon: GitBranch },
			{ name: 'Lovable', level: 82, icon: Sparkles },
			{ name: 'Firebase', level: 71, icon: Flame },
		],
	},
] satisfies Array<{
	title: string;
	color: SkillCategoryColor;
	headingColor: SkillHeadingColor;
	icon: typeof Code2;
	skills: Array<{ name: string; level: number; icon: typeof Code2 }>;
}>;

const skillTextColorClasses: Record<SkillCategoryColor, string> = {
	primary: 'text-primary',
	secondary: 'text-secondary',
	accent: 'text-accent',
};

const skillHeadingColorClasses: Record<SkillHeadingColor, string> = {
	primary: 'text-primary',
	secondary: 'text-secondary',
	accent: 'text-accent',
	purple: '!bg-gradient-to-r !from-violet-500 !via-purple-400 !to-violet-200 !bg-clip-text !text-transparent drop-shadow-[0_0_12px_rgba(139,92,246,0.22)]',
};

const skillBarClasses: Record<SkillCategoryColor, string> = {
	primary: 'bg-gradient-primary',
	secondary: 'bg-gradient-secondary',
	accent: 'bg-gradient-to-r from-pink-400 via-fuchsia-400 to-rose-300',
};

const skillGlowClasses: Record<SkillCategoryColor, string> = {
	primary: 'shadow-[0_0_28px_rgba(34,211,238,0.2)]',
	secondary: 'shadow-[0_0_28px_rgba(168,85,247,0.2)]',
	accent: 'shadow-[0_0_28px_rgba(236,72,153,0.2)]',
};

const skillLineAccentClasses: Record<SkillCategoryColor, string> = {
	primary: 'to-cyan-300/50',
	secondary: 'to-violet-300/50',
	accent: 'to-pink-300/50',
};

const cardGlowClasses: Record<SkillCategoryColor, string> = {
	primary: 'bg-cyan-300/5',
	secondary: 'bg-violet-400/6',
	accent: 'bg-pink-400/6',
};

const cardShadeClasses: Record<SkillCategoryColor, string> = {
	primary: 'border-cyan-300/10 bg-[radial-gradient(circle_at_10%_12%,rgba(34,211,238,0.055),transparent_34%),radial-gradient(circle_at_96%_12%,rgba(168,85,247,0.045),transparent_36%),linear-gradient(145deg,rgba(7,11,18,0.98),rgba(2,4,9,0.98)_58%,rgba(5,16,19,0.8))] shadow-[inset_0_1px_0_rgba(255,255,255,0.035),0_30px_80px_-62px_rgba(34,211,238,0.22)]',
	secondary: 'border-violet-300/10 bg-[radial-gradient(circle_at_10%_12%,rgba(34,211,238,0.035),transparent_34%),radial-gradient(circle_at_96%_12%,rgba(217,70,239,0.065),transparent_38%),linear-gradient(145deg,rgba(7,9,15,0.985),rgba(3,4,9,0.98)_56%,rgba(12,6,17,0.82))] shadow-[inset_0_1px_0_rgba(255,255,255,0.035),0_30px_80px_-62px_rgba(168,85,247,0.24)]',
	accent: 'border-pink-300/10 bg-[radial-gradient(circle_at_10%_12%,rgba(34,211,238,0.03),transparent_34%),radial-gradient(circle_at_96%_12%,rgba(236,72,153,0.07),transparent_38%),linear-gradient(145deg,rgba(7,9,15,0.985),rgba(3,4,9,0.98)_56%,rgba(17,6,13,0.82))] shadow-[inset_0_1px_0_rgba(255,255,255,0.035),0_30px_80px_-62px_rgba(236,72,153,0.22)]',
};

const categoryIconShadowClasses: Record<SkillCategoryColor, string> = {
	primary: 'shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_18px_34px_-24px_rgba(34,211,238,0.75)]',
	secondary: 'shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_18px_34px_-24px_rgba(168,85,247,0.82)]',
	accent: 'shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_18px_34px_-24px_rgba(236,72,153,0.78)]',
};

const floatingSkillIcons = ['⚛️', '💻', '🚀', '🎨', '⚡', '🔧'];

interface SkillSignalProps {
	skill: { name: string; level: number; icon: typeof Code2 };
	index: number;
	isInView: boolean;
	color: SkillCategoryColor;
}

const SkillSignal = ({ skill, index, isInView, color }: SkillSignalProps) => {
	const percent = skill.level / 100;
	const SkillIcon = skill.icon;
	return (
		<motion.div
			initial={{ opacity: 0, y: 16 }}
			animate={isInView ? { opacity: 1, y: 0 } : {}}
			transition={{ duration: 0.5, delay: index * 0.08 }}
			className="group relative"
		>
			<div className="mb-2 flex items-center justify-between gap-3">
				<div className="flex min-w-0 items-center gap-2">
					<span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.045] ${skillTextColorClasses[color]} ${skillGlowClasses[color]} transition duration-300 group-hover:border-white/20 group-hover:bg-white/[0.075]`}>
						<SkillIcon className="h-4 w-4" strokeWidth={1.8} />
					</span>
					<span className="truncate text-sm font-medium text-white/88 transition-colors duration-300 group-hover:text-white">
						{skill.name}
					</span>
				</div>
				<span className={`h-px w-10 shrink-0 bg-gradient-to-r from-transparent ${skillLineAccentClasses[color]}`} />
			</div>
			<div className="h-[3px] overflow-hidden rounded-full bg-white/[0.07]">
				<motion.div
					initial={{ scaleX: 0 }}
					animate={isInView ? { scaleX: percent } : { scaleX: 0 }}
					transition={{
						duration: 0.9,
						delay: index * 0.08 + 0.35,
						ease: 'easeOut',
					}}
					style={{
						width: '100%',
						originX: 0,
					}}
					className={`h-full rounded-full shadow-glow ${skillBarClasses[color]}`}
				/>
			</div>
		</motion.div>
	);
};

export const SkillsSection = () => {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: '-100px' });
	const floatingIconOffsets = useMemo(
		() => floatingSkillIcons.map(() => `${Math.random() * 50}%`),
		[]
	);

	return (
		<section ref={ref} className="skills-section py-20 px-6 relative overflow-hidden bg-[radial-gradient(circle_at_15%_22%,rgba(15,23,42,0.38),transparent_38%),linear-gradient(180deg,#000_0%,rgba(5,7,12,0.8)_18%,rgba(0,0,0,0.96)_100%)]">
			<div className="absolute inset-0 opacity-[0.12]">
				<ParticleBackground variant="ambient" fitParent />
			</div>
			<div className="relative z-10 max-w-6xl mx-auto">
				<motion.div
					initial={{ opacity: 0, y: 50 }}
					animate={isInView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.8 }}
					className="text-center mb-16"
				>
					<h2 className="interactive-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-gradient-primary">
						Skills & Expertise
					</h2>
					<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
						A focused stack for building polished interfaces, practical backends,
						and production-ready digital experiences.
					</p>
				</motion.div>

				<div className="grid md:grid-cols-3 gap-8">
					{skillCategories.map((category, categoryIndex) => (
						<motion.div
							key={category.title}
							initial={{ opacity: 0, y: 50 }}
							animate={isInView ? { opacity: 1, y: 0 } : {}}
							transition={{ duration: 0.8, delay: categoryIndex * 0.2 }}
							className={`group premium-card-motion relative min-h-[340px] rounded-lg border p-7 backdrop-blur-xl ${cardShadeClasses[category.color]}`}
						>
							<div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/24 to-transparent" />
							<div className="pointer-events-none absolute -left-20 top-12 h-44 w-32 rounded-full bg-cyan-300/4 blur-3xl transition-opacity duration-500 group-hover:opacity-70" />
							<div className={`pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full ${cardGlowClasses[category.color]} blur-3xl transition-opacity duration-500 group-hover:opacity-70`} />
							<div className="relative z-10 flex h-full flex-col">
								<div className="mb-8 flex items-center gap-4">
									<div className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.025))] ${skillTextColorClasses[category.color]} ${categoryIconShadowClasses[category.color]} transition duration-300 group-hover:-translate-y-0.5 group-hover:border-white/20 group-hover:bg-white/[0.07]`}>
										<span className={`pointer-events-none absolute inset-2 rounded-md opacity-20 blur-md ${skillBarClasses[category.color]}`} />
										<category.icon className="relative h-5 w-5" strokeWidth={1.9} />
									</div>
									<h3
										className={`text-2xl font-bold leading-tight ${skillHeadingColorClasses[category.headingColor]}`}
									>
										{category.title}
									</h3>
								</div>

								<div className="space-y-5">
									{category.skills.map((skill, skillIndex) => (
										<SkillSignal
											key={skill.name}
											skill={skill}
											index={skillIndex}
											isInView={isInView}
											color={category.color}
										/>
									))}
								</div>
							</div>
						</motion.div>
					))}
				</div>

				{/* Floating Skill Icons */}
				<div className="relative mt-16 h-32 overflow-hidden hidden sm:block">
					{floatingSkillIcons.map((icon, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, scale: 0 }}
							animate={isInView ? { opacity: 1, scale: 1 } : {}}
							transition={{ duration: 0.6, delay: 1 + index * 0.2 }}
							className="absolute text-4xl animate-float"
							style={{
								left: `${15 + index * 15}%`,
								top: floatingIconOffsets[index],
								animationDelay: `${index * 0.5}s`,
							}}
						>
							<motion.span
								className="block cursor-pointer"
								whileHover={{ y: index % 2 === 0 ? -22 : 22 }}
								transition={{ type: 'spring', stiffness: 180, damping: 18 }}
							>
								{icon}
							</motion.span>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
};
