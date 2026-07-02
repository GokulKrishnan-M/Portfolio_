import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CodesRainBackground from '../CodesRainBackground';
import { ParticleBackground } from '../ParticleBackground';
import { Download, ArrowDown, Compass, ArrowRight } from 'lucide-react';

export const HeroSection = () => {
  const [particleType, setParticleType] = useState(0);
  const particleModes = [0, 1, 3, 4];
  const handleParticleChange = () => setParticleType((prev) => (prev + 1) % (particleModes.length + 1));

  // Typing animation for "Design & Development"
  const fullText = " Design & Development";
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    let i = 0;
    let typingInterval: ReturnType<typeof setInterval> | undefined;
    let restartTimeout: ReturnType<typeof setTimeout> | undefined;

    const startTyping = () => {
      typingInterval = setInterval(() => {
        setTypedText(fullText.slice(0, i + 1));
        i++;
        if (i > fullText.length) {
          clearInterval(typingInterval);
          restartTimeout = setTimeout(() => {
            i = 0;
            setTypedText("");
            startTyping();
          }, 5000); // Wait 5 seconds before restarting
        }
      }, 150);
    };

    startTyping();

    return () => {
      if (typingInterval) {
        clearInterval(typingInterval);
      }
      if (restartTimeout) {
        clearTimeout(restartTimeout);
      }
    };
  }, []);

  const exploreTargets = ['projects', 'about', 'contact', 'skills'];

  function getRandomSection(current: string | null) {
    const filtered = exploreTargets.filter(id => id !== current);
    return filtered[Math.floor(Math.random() * filtered.length)];
  }

  const [lastSection, setLastSection] = useState<string | null>(null);

  const handleExploreClick = () => {
    let target: string;
    if (!lastSection) {
      target = 'projects';
    } else {
      target = getRandomSection(lastSection);
    }
    setLastSection(target);
    const el = document.getElementById(target);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_48%_44%,rgba(10,18,32,0.24),transparent_42%),linear-gradient(180deg,rgba(1,3,8,0.82),#000_88%)]"
      onClick={handleParticleChange}
    >
      {particleType === 0 ? (
        <CodesRainBackground />
      ) : (
        <ParticleBackground type={particleModes[particleType - 1]} priority />
      )}

      <div
        className="relative z-20 max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center md:items-start text-left"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Profile Picture */}
        <div className="flex justify-center md:justify-start mb-8 md:mb-0 md:mr-10 relative">
          <motion.div
            className="relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              style={{ zIndex: 1 }}
              initial={{ opacity: 0.35, scale: 1 }}
              animate={{
                opacity: [0.24, 0.5, 0.3, 0.42, 0.24],
                scale: [1, 1.08, 1.02, 1.05, 1],
              }}
              transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="h-72 w-72 rounded-full bg-[radial-gradient(circle_at_30%_28%,rgba(34,211,238,0.34),transparent_34%),radial-gradient(circle_at_74%_32%,rgba(167,139,250,0.24),transparent_30%),radial-gradient(circle_at_50%_72%,rgba(59,130,246,0.16),transparent_42%)] blur-3xl" />
            </motion.div>
            <motion.div
              className="absolute -left-12 top-8 h-32 w-28 rounded-[40%] bg-gradient-to-br from-cyan-300/20 via-white/6 to-cyan-500/10 blur-sm backdrop-blur-sm"
              style={{ zIndex: 2 }}
              animate={{
                rotate: [-16, -6, -16],
                y: [0, -14, 0],
                opacity: [0.2, 0.42, 0.2],
              }}
              transition={{ duration: 6.4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -right-10 bottom-3 h-36 w-30 rounded-[44%] bg-gradient-to-br from-violet-300/18 via-white/6 to-blue-500/10 blur-sm backdrop-blur-sm"
              style={{ zIndex: 2 }}
              animate={{
                rotate: [14, 6, 14],
                y: [0, 12, 0],
                opacity: [0.18, 0.36, 0.18],
              }}
              transition={{ duration: 7.2, repeat: Infinity, ease: "easeInOut", delay: 0.35 }}
            />
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              style={{ zIndex: 3 }}
              animate={{
                opacity: [0.12, 0.24, 0.12],
                scale: [1, 1.03, 1],
              }}
              transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="h-64 w-64 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.09),transparent_62%)] blur-xl" />
            </motion.div>
            <motion.div
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
              style={{ zIndex: 3 }}
              animate={{ opacity: [0.3, 0.62, 0.3] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div
                className="relative h-[17rem] w-[17rem]"
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute inset-[16px] rounded-full border border-cyan-300/18 shadow-[0_0_18px_rgba(34,211,238,0.16)]" />
                <div className="absolute left-1/2 top-[10px] h-4 w-4 -translate-x-1/2 rounded-full bg-cyan-300 shadow-[0_0_22px_rgba(34,211,238,0.95)]" />
                <div className="absolute bottom-[20px] left-[24px] h-3.5 w-3.5 rounded-full bg-violet-300 shadow-[0_0_20px_rgba(167,139,250,0.9)]" />
                <div className="absolute right-[22px] top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-blue-300 shadow-[0_0_20px_rgba(96,165,250,0.9)]" />
              </motion.div>
            </motion.div>
            <motion.div
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
              style={{ zIndex: 4 }}
              animate={{ opacity: [0, 0.75, 0] }}
              transition={{ duration: 6.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="h-64 w-64 overflow-hidden rounded-full">
                <motion.div
                  className="h-full w-16 -translate-x-28 rotate-12 bg-gradient-to-r from-transparent via-white/18 to-transparent blur-md"
                  animate={{ x: [-112, 312, -112] }}
                  transition={{ duration: 6.8, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
            <motion.div
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
              style={{ zIndex: 4 }}
              animate={{ opacity: [0.24, 0.48, 0.24] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="h-52 w-52 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.08),transparent_62%)] blur-xl" />
            </motion.div>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center" style={{ zIndex: 4 }}>
              <div className="relative h-64 w-64">
                <motion.div
                  className="absolute left-4 top-9 h-28 w-px bg-gradient-to-b from-transparent via-cyan-300/95 to-transparent shadow-[0_0_16px_rgba(34,211,238,0.78)]"
                  animate={{ y: [0, 112, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute right-4 top-5 h-24 w-px bg-gradient-to-b from-transparent via-violet-300/95 to-transparent shadow-[0_0_16px_rgba(167,139,250,0.78)]"
                  animate={{ y: [0, 116, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 6.4, repeat: Infinity, ease: "easeInOut", delay: 0.45 }}
                />
                <motion.div
                  className="absolute left-9 top-4 h-px w-28 bg-gradient-to-r from-transparent via-cyan-300/95 to-transparent shadow-[0_0_16px_rgba(34,211,238,0.75)]"
                  animate={{ x: [0, 112, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                />
                <motion.div
                  className="absolute bottom-4 right-9 h-px w-28 bg-gradient-to-r from-transparent via-violet-300/95 to-transparent shadow-[0_0_16px_rgba(167,139,250,0.75)]"
                  animate={{ x: [0, -112, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                />
              </div>
            </div>
            {/* Profile image */}
            <motion.div
              className="group relative z-10 h-56 w-56 cursor-pointer overflow-hidden rounded-full shadow-2xl"
              style={{ transformStyle: "preserve-3d" }}
              whileHover={{
                rotateY: 180,
                scale: 1.04,
                boxShadow: "0 28px 70px rgba(34, 211, 238, 0.24)",
              }}
              whileTap={{
                rotateY: -180,
                scale: 0.96,
                boxShadow: "0 18px 44px rgba(167, 139, 250, 0.24)",
              }}
              transition={{ rotateY: { duration: 0.75, ease: "easeInOut" }, scale: { duration: 0.22 } }}
            >
              <img
                src="/GM_.png"
                alt="Portrait of Gokul Krishnan M"
                className="h-full w-full object-cover"
                style={{ border: "none" }}
                draggable={false}
              />
              <div className="pointer-events-none absolute -left-24 top-0 h-full w-16 rotate-12 bg-white/20 blur-xl transition-transform duration-700 ease-out group-hover:translate-x-[360px] group-active:translate-x-[360px]" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-cyan-300/14 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-active:opacity-100" />
            </motion.div>
          </motion.div>
        </div>
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.h1
              className="interactive-heading text-4xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-700 bg-clip-text text-transparent text-left whitespace-nowrap"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              Gokul Krishnan M
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl mb-8 text-muted-foreground text-left"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <span>
                {typedText}
                <span className="border-r-2 border-primary animate-pulse">&nbsp;</span>
              </span>
            </motion.p>
            <motion.div
              className="mb-12 flex w-full flex-col items-stretch justify-start gap-4 sm:w-fit sm:flex-row sm:items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <Button
                size="lg"
                className="group relative h-12 overflow-hidden rounded-full border border-white/10 bg-gradient-primary px-5 text-base font-semibold text-primary-foreground shadow-[0_0_28px_rgba(34,211,238,0.28),inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-[0_0_28px_rgba(34,211,238,0.22),inset_0_1px_0_rgba(255,255,255,0.22)] active:translate-y-0 active:brightness-95 sm:px-6"
                onClick={handleExploreClick}
              >
                <span className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/55 to-transparent" />
                <span className="pointer-events-none absolute inset-x-3 top-0 h-1/2 rounded-t-full bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.035)_56%,transparent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-active:opacity-80" />
                <span className="pointer-events-none absolute -left-16 top-0 h-full w-12 skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/24 to-transparent opacity-0 blur-[1px] transition duration-700 group-hover:translate-x-72 group-hover:opacity-100" />
                <span className="relative flex items-center justify-center gap-3.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/10 text-primary-foreground/95">
                    <Compass className="h-4 w-4" />
                  </span>
                  <span className="tracking-wide">Explore Portfolio</span>
                  <ArrowRight className="h-4 w-4 text-primary-foreground/80 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="group relative h-12 overflow-hidden rounded-full border border-white/10 bg-background-secondary/58 px-5 text-base font-semibold text-muted-foreground shadow-[0_20px_55px_-32px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-background-secondary/58 hover:text-white hover:shadow-[0_18px_52px_-38px_rgba(255,255,255,0.18),inset_0_1px_0_rgba(255,255,255,0.16)] active:translate-y-0 active:bg-background-secondary/58 active:brightness-95 sm:px-6"
                asChild
              >
                <Link to="/resume">
                  <span className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                  <span className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_28%_18%,rgba(255,255,255,0.16),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.035),transparent_58%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-active:opacity-80" />
                  <span className="pointer-events-none absolute -left-24 top-[-35%] h-[170%] w-16 rotate-12 bg-gradient-to-r from-transparent via-white/24 to-transparent opacity-0 blur-sm transition duration-700 ease-out group-hover:translate-x-72 group-hover:opacity-100" />
                  <span className="pointer-events-none absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-white/16 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="relative flex items-center justify-center gap-3.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/0 bg-white/0 text-primary transition-all duration-300 group-hover:border-white/12 group-hover:bg-white/[0.045] group-hover:text-white">
                      <Download className="h-4 w-4" />
                    </span>
                    <span className="tracking-wide">Resume</span>
                  </span>
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
        {/* Arrow stays centered at bottom */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-primary"
          >
            <ArrowDown className="w-8 h-8" />
          </motion.div>
        </motion.div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/20 z-10" />
    </section>
  );
};
