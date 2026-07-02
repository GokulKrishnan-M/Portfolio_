// @ts-nocheck
/* eslint-disable react/forbid-component-props, jsx-a11y/no-static-element-interactions */
import { AnimatePresence, motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { type PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from 'react';
import { Code2, Gamepad2, LayoutDashboard } from 'lucide-react';
import { ParticleBackground } from '../ParticleBackground';

export const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [showShowcasePopup, setShowShowcasePopup] = useState(false);
  const [showcaseFullImage, setShowcaseFullImage] = useState<string | null>(null);
  const [showcaseFullImageIdx, setShowcaseFullImageIdx] = useState<number>(0);
  const [activeJourneyIndex, setActiveJourneyIndex] = useState(0);
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [aboutCardHint, setAboutCardHint] = useState({ x: 0, y: 0, visible: false });

  const timelineItems = [
    {
      year: "Sept 2024 - June 2026",
      title: "Master of Computer Applications (MCA)",
      company: "Santhigiri College - MG University",
      description: "Continuing my academic path to gain deeper insights into modern software systems and technology trends."
    },
    {
      year: "June - Nov, 2023",
      title: "Flutter App Development",
      company: "Luminar Technolab",
      description: "Learned in developing android apps using flutter, animated user interfaces with modern frameworks."
    },
    {
      year: "Oct 2022 - April 2023",
      title: "Project on PHP and Python",
      company: "ZION IT & LCC",
      description: "Learned Web Development by working on PHP & Python-based projects for emphasizing functionality, clarity, and performance."
    },
    {
      year: "Oct 2020 - March 2023",
      title: "Bachelor of Computer Applications (BCA)",
      company: "Mangalam MC Vargheese College - MG University",
      description: "Started my journey in BCA, diving into programming languages, database systems, and software development best practices."
    },
  ];

  // Showcase cards data
  const showcaseCards = [
    {
      img: "Flutter.jpg",
      alt: "Flutter",
      title: "Flutter >"
    },
    {
      img: "PHP.jpg",
      alt: "PHP Project",
      title: "PHP Project"
    },
    {
      img: "Addon - Web Design.jpg",
      alt: "Addon - Web Design",
      title: "Addon - Web Design"
    },
    {
      img: "Python.jpg",
      alt: "Python",
      title: "Python Project"
    }
  ];

  const openFullImage = (img: string, idx: number) => {
    setShowcaseFullImage(img);
    setShowcaseFullImageIdx(idx);
  };

  const showPrevImage = () => {
    const prevIdx = (showcaseFullImageIdx - 1 + showcaseCards.length) % showcaseCards.length;
    setShowcaseFullImage(showcaseCards[prevIdx].img);
    setShowcaseFullImageIdx(prevIdx);
  };

  const showNextImage = () => {
    const nextIdx = (showcaseFullImageIdx + 1) % showcaseCards.length;
    setShowcaseFullImage(showcaseCards[nextIdx].img);
    setShowcaseFullImageIdx(nextIdx);
  };

  const showAboutCardHint = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType === 'touch' || showPersonalInfo) return;
    setAboutCardHint({ x: event.clientX, y: event.clientY, visible: true });
  };

  const hideAboutCardHint = () => {
    setAboutCardHint((current) => ({ ...current, visible: false }));
  };

  // Keyboard navigation for full image modal
  useEffect(() => {
    if (!showcaseFullImage) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        showNextImage();
      } else if (e.key === 'ArrowLeft') {
        showPrevImage();
      } else if (e.key === 'Escape') {
        setShowcaseFullImage(null); // Only close the image modal, not the main popup
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showcaseFullImage, showcaseFullImageIdx]);

  // Close showcase popup on Escape key press, but only if image modal is NOT open
  useEffect(() => {
    if (!showShowcasePopup || showcaseFullImage) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowShowcasePopup(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showShowcasePopup, showcaseFullImage]);

  useEffect(() => {
    if (!aboutCardHint.visible) return;

    window.addEventListener('scroll', hideAboutCardHint, true);
    window.addEventListener('blur', hideAboutCardHint);

    return () => {
      window.removeEventListener('scroll', hideAboutCardHint, true);
      window.removeEventListener('blur', hideAboutCardHint);
    };
  }, [aboutCardHint.visible]);

  return (
    <section ref={ref} className="py-20 px-6 relative overflow-hidden bg-[radial-gradient(circle_at_20%_18%,rgba(15,23,42,0.42),transparent_38%),linear-gradient(180deg,#000_0%,rgba(3,5,10,0.78)_18%,rgba(0,0,0,0.96)_100%)]">
      <div className="absolute inset-0 opacity-[0.12]">
        <ParticleBackground variant="ambient" fitParent />
      </div>
      {/* Background shapes */}
      <motion.div className="absolute top-10 left-0 z-0" initial={{ x: -60, opacity: 0 }} animate={isInView ? { x: 0, opacity: 0.5 } : {}} transition={{ duration: 1.2, ease: "easeOut" }}>
        <div className="w-24 h-24 rounded-full bg-cyan-400/30 blur-2xl" />
      </motion.div>
      {/* eslint-disable-next-line react/forbid-component-props */}
      <motion.div className="absolute bottom-10 right-0 z-0" initial={{ x: 60, opacity: 0 }} animate={isInView ? { x: 0, opacity: 0.5 } : {}} transition={{ duration: 1.2, ease: "easeOut" }}>
        {/* eslint-disable-next-line react/forbid-component-props */}
        <div className="w-20 h-20 bg-pink-400/30 rotate-12 blur-2xl" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }} />
      </motion.div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* About Me */}
        <motion.div initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-center mb-16">
          <h2 className="interactive-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-gradient-secondary">About Me</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
       Aspiring web developer who enjoys building simple, easy-to-use websites. Also into game development and love creating fun digital experiences.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Hello, I'm Gokul */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ y: -4 }}
            className="relative"
          >
            <motion.button
              type="button"
              onClick={() => setShowPersonalInfo((current) => !current)}
              onPointerEnter={showAboutCardHint}
              onPointerMove={showAboutCardHint}
              onPointerLeave={hideAboutCardHint}
              className="premium-card-motion relative block min-h-[320px] sm:min-h-[420px] md:min-h-[490px] w-full overflow-hidden rounded-[28px] border border-primary/10 bg-[linear-gradient(145deg,rgba(2,8,14,0.46),rgba(0,0,0,0.22))] p-4 text-left shadow-[0_30px_100px_-78px_rgba(34,211,238,0.48)] backdrop-blur-xl sm:p-5 lg:min-h-[480px]"
              whileTap={{ scale: 0.985 }}
              aria-pressed={showPersonalInfo}
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(34,211,238,0.16),transparent_42%),radial-gradient(circle_at_88%_86%,rgba(217,70,239,0.12),transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.035),transparent_44%)]" />
              <div className="absolute inset-0 bg-gradient-glow opacity-10" />
              <div className="relative min-h-[450px] overflow-hidden rounded-2xl border border-white/[0.06] bg-black/20 p-6 transition-all duration-300 group-hover:border-primary/20 lg:min-h-[440px]">
                <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-primary/45 to-transparent" />
                <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-secondary/8 blur-3xl" />
                <AnimatePresence mode="wait">
                  {!showPersonalInfo ? (
                    <motion.div
                      key="about-summary"
                      initial={{ opacity: 0, x: -18, filter: 'blur(8px)' }}
                      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, x: 18, filter: 'blur(8px)' }}
                      transition={{ duration: 0.28, ease: 'easeOut' }}
                      className="min-h-[280px] sm:min-h-[402px] lg:min-h-[392px]"
                    >
                      <h3 className="text-2xl font-bold mb-4 text-primary">Hello, I'm Gokul!</h3>
                      <p className="text-muted-foreground mb-6 leading-relaxed text-justify max-w-xl mx-auto">
                        As an MCA graduate, I focus on building clean, responsive, and user-friendly software experiences with a strong interest in web development and modern UI design. I enjoy turning ideas into practical digital products using technologies like HTML, CSS, JavaScript, and related tools. Alongside software and interface development, I also explore game development as a creative way to strengthen logic, interaction, and problem-solving skills.
                      </p>
                      <div
                        className="mt-8 rounded-2xl border border-white/[0.07] bg-black/25 p-4"
                        onClick={(event) => event.stopPropagation()}
                        onPointerEnter={(event) => {
                          event.stopPropagation();
                          hideAboutCardHint();
                        }}
                        onPointerMove={(event) => {
                          event.stopPropagation();
                          hideAboutCardHint();
                        }}
                      >
                        <div className="mb-4 flex items-center justify-between gap-4">
                          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-primary/80">
                            Current Focus
                          </span>
                          <span className="h-px flex-1 bg-gradient-to-r from-primary/35 via-secondary/20 to-transparent" />
                        </div>
                        <div className="grid gap-3 sm:grid-cols-3">
                          {[
                            { icon: LayoutDashboard, label: 'Smart UI Building', tone: 'text-primary' },
                            { icon: Code2, label: 'Web Apps', tone: 'text-secondary' },
                            { icon: Gamepad2, label: 'Game Design', tone: 'text-accent' },
                          ].map((item) => (
                            <div
                              key={item.label}
                              className="group flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/12 hover:bg-white/[0.045]"
                            >
                              <span className={`flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] bg-black/20 ${item.tone}`}>
                                <item.icon className="h-4 w-4" />
                              </span>
                              <span className="text-sm font-semibold text-white/86">{item.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="personal-info"
                      initial={{ opacity: 0, x: 18 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -18 }}
                      transition={{ duration: 0.28, ease: 'easeOut' }}
                      className="grid min-h-[280px] sm:min-h-[402px] gap-6 sm:grid-cols-[10rem_1fr] lg:min-h-[392px]"
                    >
                      <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-2xl border border-white/[0.08] bg-black/30 sm:mx-0">
                        <img
                          src="/ME.png"
                          alt="Gokul Krishnan M"
                          className="h-full w-full object-contain contrast-110 saturate-110"
                          draggable={false}
                        />
                        <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-primary/55 to-transparent" />
                      </div>

                      <div>
                        <h3 className="mb-4 text-2xl font-bold text-primary">Personal Info</h3>
                        <div className="space-y-3">
                          {[
                            ['Name', 'Gokul Krishnan M'],
                            ['Date of Birth', 'October 24, 2002'],
                            ['Location', 'Kottayam, Kerala - India'],
                            ['Religion and Caste', 'Hindu, Nair'],
                          ].map(([label, value]) => (
                            <div
                              key={label}
                              className="rounded-xl border border-white/[0.06] bg-white/[0.025] px-4 py-3"
                            >
                              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                                {label}
                              </div>
                              <div className="mt-1 text-sm font-semibold text-white/90">{value}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.button>
          </motion.div>

          {/* Timeline Section */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.4 }} className="relative">
            <h3 className="mb-8 text-2xl font-bold text-accent">My Journey</h3>
            <div className="premium-card-motion relative min-h-[390px] overflow-hidden rounded-[28px] border border-primary/10 bg-[linear-gradient(145deg,rgba(2,8,14,0.46),rgba(0,0,0,0.22))] p-4 shadow-[0_30px_100px_-78px_rgba(34,211,238,0.48)] backdrop-blur-xl transition-all duration-300 hover:border-primary/25 hover:shadow-[0_0_42px_rgba(34,211,238,0.16),0_30px_100px_-72px_rgba(34,211,238,0.62)] sm:p-5">
              <div className="pointer-events-none absolute inset-0 bg-gradient-glow opacity-10" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(34,211,238,0.12),transparent_36%),radial-gradient(circle_at_82%_78%,rgba(167,139,250,0.12),transparent_34%)]" />
              <div className="relative grid min-h-[350px] gap-5 lg:grid-cols-[10rem_1fr]">
                <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
                  {timelineItems.map((item, index) => {
                    const isActive = activeJourneyIndex === index;

                    return (
                      <button
                        key={item.year}
                        type="button"
                        onClick={() => setActiveJourneyIndex(index)}
                        onPointerEnter={() => setActiveJourneyIndex(index)}
                        className={`group flex min-w-[8.75rem] items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-all duration-300 lg:min-w-0 ${
                          isActive
                            ? 'border-primary/35 bg-primary/10 text-white shadow-[0_0_28px_rgba(34,211,238,0.16)]'
                            : 'border-white/5 bg-white/[0.03] text-muted-foreground hover:border-white/15 hover:bg-white/[0.06]'
                        }`}
                      >
                        <span className={`h-2.5 w-2.5 shrink-0 rounded-full transition ${isActive ? 'bg-primary shadow-[0_0_18px_rgba(34,211,238,0.9)]' : 'bg-white/20'}`} />
                        <span className="text-xs font-semibold leading-snug">{item.year}</span>
                      </button>
                    );
                  })}
                </div>

                <motion.div
                  key={activeJourneyIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  className="relative min-h-[300px] overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/80 p-6"
                >
                  <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
                  <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-secondary/10 blur-3xl" />
                  <span className="mb-5 inline-flex rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold tracking-wide text-primary">
                    {timelineItems[activeJourneyIndex].year}
                  </span>
                  <h4 className="text-2xl font-bold leading-tight text-white">
                    {timelineItems[activeJourneyIndex].title}
                  </h4>
                  <p className="mt-3 text-lg text-secondary">
                    {timelineItems[activeJourneyIndex].company}
                  </p>
                  <p className="mt-5 text-sm leading-7 text-muted-foreground sm:text-base">
                    {timelineItems[activeJourneyIndex].description}
                  </p>
                  <div className="mt-8 flex gap-2">
                    {timelineItems.map((item, index) => (
                      <button
                        key={`${item.year}-dot`}
                        type="button"
                        aria-label={`Show ${item.title}`}
                        onClick={() => setActiveJourneyIndex(index)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          activeJourneyIndex === index ? 'w-9 bg-primary' : 'w-3 bg-white/15 hover:bg-white/30'
                        }`}
                      />
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        <AnimatePresence>
          {aboutCardHint.visible && !showPersonalInfo && (
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.96 }}
              transition={{ duration: 0.14 }}
              className="pointer-events-none fixed z-40 hidden -translate-x-1/2 rounded-md border border-primary/35 bg-black/70 px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#c9f8fb] shadow-[0_0_22px_rgba(34,211,238,0.26)] backdrop-blur-md md:block"
              style={{ left: aboutCardHint.x, top: aboutCardHint.y + 14 }}
            >
              Click for Personal info
            </motion.div>
          )}
        </AnimatePresence>

        {/* Showcase Popup */}
        {showShowcasePopup && (
          <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
            <div className="bg-zinc-900 rounded-2xl shadow-2xl p-12 max-w-7xl w-full relative">
              <button
                className="absolute top-4 right-4 text-white text-xl"
                onClick={() => setShowShowcasePopup(false)}
              >
                <span className="text-2xl font-bold">&times;</span>
              </button>
              <h3 className="text-2xl font-bold mb-8 text-accent text-center">Showcase</h3>
              <div className="flex gap-12 justify-center items-stretch flex-wrap">
                {showcaseCards.map((card, idx) => (
                  // eslint-disable-next-line react/forbid-component-props
                  <img
                    key={idx}
                    src={card.img}
                    alt={card.alt}
                    className="transition-all duration-300 cursor-pointer hover:shadow-2xl"
                    style={{
                      aspectRatio: '2/3',
                      minWidth: '140px',
                      maxWidth: '180px',
                      minHeight: '180px',
                      maxHeight: '240px',
                      width: '100%',
                      height: '180px',
                      objectFit: 'contain',
                      background: 'transparent',
                      border: 'none',
                      boxShadow: 'none'
                    }}
                    onClick={() => openFullImage(card.img, idx)}
                  />
                ))}
              </div>
              {/* Full Image Modal with navigation (arrows slightly away from image) */}
              {showcaseFullImage && (
                <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
                  {/* Previous Button */}
                  {/* eslint-disable-next-line react/forbid-component-props */}
                  <button
                    className="fixed left-0 top-1/2 -translate-y-1/2 text-white text-3xl px-4 py-2 z-50 rounded-full hover:bg-black/80"
                    style={{ 
                      transform: 'translateY(-50%)', 
                      left: '12vw',
                      background: 'rgba(0,0,0,0.5)', // 50% transparent background
                      opacity: 0.3 // 50% transparent button
                    }}
                    onClick={showPrevImage}
                    aria-label="Previous"
                  >
                    &#8592;
                  </button>
                  {/* Close button fixed above and outside the image area, centered horizontally */}
                  {/* eslint-disable-next-line react/forbid-component-props */}
                  <button
                    className="fixed top-2 left-1/2 -translate-x-1/2 text-white text-3xl z-50 rounded-full hover:bg-black/80"
                    style={{
                      background: 'rgba(0,0,0,0.5)',
                      opacity: 0.3
                    }}
                    onClick={() => setShowcaseFullImage(null)}
                    aria-label="Close"
                  >
                    &times;
                  </button>
                  <div className="relative flex items-center">
                    {/* eslint-disable-next-line react/forbid-component-props */}
                    <img
                      src={showcaseFullImage}
                      alt="Full Showcase"
                      className="max-h-[80vh] max-w-[90vw] shadow-2xl"
                      style={{
                        objectFit: 'contain',
                        background: 'transparent',
                        border: 'none',
                        boxShadow: 'none'
                      }}
                    />
                  </div>
                  {/* Next Button */}
                  {/* eslint-disable-next-line react/forbid-component-props */}
                  <button
                    className="fixed right-0 top-1/2 -translate-y-1/2 text-white text-3xl px-4 py-2 z-50 rounded-full hover:bg-black/80"
                    style={{ 
                      transform: 'translateY(-50%)', 
                      right: '12vw',
                      background: 'rgba(0,0,0,0.5)',
                      opacity: 0.3
                    }}
                    onClick={showNextImage}
                    aria-label="Next"
                  >
                    &#8594;
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
