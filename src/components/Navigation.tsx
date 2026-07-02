import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  Code2,
  FolderKanban,
  Home,
  Mail,
  Maximize2,
  Menu,
  Minimize2,
  UserRound,
  X,
  type LucideIcon,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const navItems: Array<{ label: string; href: string; icon: LucideIcon; type: 'section' | 'page' }> = [
  { label: 'Home', href: '#home', icon: Home, type: 'section' },
  { label: 'About', href: '#about', icon: UserRound, type: 'section' },
  { label: 'Projects', href: '#projects', icon: FolderKanban, type: 'section' },
  { label: 'Skills', href: '#skills', icon: Code2, type: 'section' },
  { label: 'Contact', href: '#contact', icon: Mail, type: 'section' },
];

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    let frameId: number | null = null;

    const updateNavigationState = () => {
      setIsScrolled(window.scrollY > 50);

      if (location.pathname === '/resume') {
        setActiveSection('resume');
        return;
      }

      // Update active section based on scroll position
      const sections = navItems
        .filter((item) => item.type === 'section')
        .map(item => item.href.substring(1));
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (current) {
        setActiveSection(current);
      }
    };

    const handleScroll = () => {
      if (frameId !== null) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        updateNavigationState();
        frameId = null;
      });
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    updateNavigationState();
    handleFullscreenChange();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [location.pathname]);

  const scrollToSection = (href: string) => {
    if (!href.startsWith('#')) {
      navigate(href);
      setIsOpen(false);
      return;
    }

    const sectionId = href.substring(1);
    const jumpToSection = () => {
      const element = document.getElementById(sectionId);
      if (!element) return;

      setActiveSection(sectionId);
      const root = document.documentElement;
      const previousScrollBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = 'auto';
      window.scrollTo(0, element.offsetTop);
      root.style.scrollBehavior = previousScrollBehavior;
      if (window.location.hash !== href) {
        window.history.replaceState(null, '', href);
      }
    };

    if (location.pathname !== '/') {
      navigate(`/${href}`);
      window.setTimeout(jumpToSection, 80);
      setIsOpen(false);
      return;
    }

    jumpToSection();
    setIsOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed left-0 right-0 top-7 z-50 bg-transparent"
    >
      <div className="relative mx-auto max-w-6xl px-6 py-2.5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="relative z-20 cursor-pointer"
            onClick={() => scrollToSection('#home')}
          >
            <img
              src="/GMz.png"
              alt="Gokul Logo"
              className="h-9 w-9 object-contain drop-shadow-[0_0_18px_rgba(34,211,238,0.32)]"
              style={{ display: 'inline-block' }}
            />
          </motion.div>

          {/* Desktop Navigation */}
          <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-full border border-white/10 bg-background-secondary/58 px-2 py-2 shadow-[0_20px_55px_-32px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl md:flex">
            <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-primary/45 to-transparent" />
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.type === 'page'
                ? location.pathname === item.href
                : activeSection === item.href.substring(1) && location.pathname === '/';

              return (
                <Tooltip key={item.label} delayDuration={120}>
                  <TooltipTrigger asChild>
                    <motion.button
                      onClick={() => scrollToSection(item.href)}
                      className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-300 ${
                        isActive
                          ? 'text-primary-foreground'
                          : 'text-muted-foreground hover:text-white'
                      }`}
                      aria-label={item.label}
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="activeSectionPill"
                          className="absolute inset-0 rounded-full bg-gradient-primary shadow-[0_0_28px_rgba(34,211,238,0.28)]"
                          initial={false}
                          transition={{ type: "spring", stiffness: 520, damping: 42, mass: 0.72 }}
                        />
                      )}
                      <Icon className="relative z-10 h-[18px] w-[18px] stroke-[2.2]" aria-hidden="true" />
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    sideOffset={12}
                    className="border border-primary/20 bg-background-secondary/95 px-3 py-1.5 text-sm font-semibold text-white shadow-[0_16px_42px_-24px_rgba(34,211,238,0.7)] backdrop-blur-xl"
                  >
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>

          {/* Fullscreen/Minimize Icon Button */}
          <button
            className={`absolute right-6 top-1/2 z-50 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border bg-background-secondary/50 shadow-[0_18px_40px_-28px_rgba(0,0,0,0.9)] backdrop-blur-xl transition-all duration-300 active:scale-95 active:border-primary/60 active:text-primary md:inline-flex ${
              isFullscreen
                ? 'border-primary/45 text-primary shadow-[0_0_26px_rgba(34,211,238,0.18)]'
                : 'border-white/10 text-muted-foreground hover:border-primary/35 hover:text-primary'
            }`}
            title={isFullscreen ? "Exit Fullscreen" : "Go Fullscreen"}
            onClick={() => {
              if (isFullscreen) {
                void document.exitFullscreen?.();
              } else {
                void document.documentElement.requestFullscreen?.();
              }
            }}
            type="button"
          >
            {isFullscreen ? (
              <Minimize2 className="h-5 w-5" />
            ) : (
              <Maximize2 className="h-5 w-5" />
            )}
          </button>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="relative z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-background-secondary/60 text-primary shadow-[0_18px_40px_-28px_rgba(0,0,0,0.9)] backdrop-blur-xl md:hidden"
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="mt-4 space-y-2 rounded-3xl border border-white/10 bg-background-secondary/72 p-3 shadow-[0_24px_70px_-42px_rgba(0,0,0,0.95)] backdrop-blur-2xl">
            {navItems.map((item, index) => {
              const Icon = item.icon;

              return (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : -20 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => scrollToSection(item.href)}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-base font-semibold transition-colors ${
                  (item.type === 'page' ? location.pathname === item.href : activeSection === item.href.substring(1) && location.pathname === '/')
                    ? 'bg-gradient-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5 stroke-[2.2]" aria-hidden="true" />
                <span>{item.label}</span>
              </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};
