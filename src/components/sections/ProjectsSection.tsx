// @ts-nocheck
/* eslint-disable jsx-a11y/aria-role, jsx-a11y/no-static-element-interactions, react/forbid-component-props */
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent, type SyntheticEvent, useEffect, useRef, useState } from 'react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from '@/components/ui/carousel';
import { ChevronsLeft, ChevronsRight, Maximize2, RotateCcw, X } from 'lucide-react';

type ProjectFilter = 'All' | 'PHP' | 'Python' | 'Laravel' | 'Mobile App' | 'AI / ML';

type Project = {
    id: number;
    title: string;
    description: string;
    popupDescription: string;
    popupModalDescription?: string;
    popupFunctions?: string[];
    popupStakeholders?: string[];
    popupOutcome?: string;
    image: string;
    popupVideos?: string[];
    popupimage?: string[];
    tech: string[];
    categories: string[];
    filters: ProjectFilter[];
    liveUrl: string;
    githubUrl: string;
    color: 'primary' | 'secondary' | 'accent';
};

const projects: Project[] = [
    {
        id: 1,
        title: 'MCCMS - Municipal Complaint Management System',
        description: 'Complaint reporting and managing website.',
        popupDescription:
            'A centralized web portal to report and track municipal issues. Citizens can raise complaints, monitor progress, and receive timely updates while enabling authorities to streamline response management.',
        popupModalDescription:
            'MCCMS demonstrates a structured complaint workflow built for municipal service teams. The preview highlights how users can register issues, access complaint-related actions, and move through a simple web interface designed for public-service reporting and administrative follow-up.',
        popupFunctions: [
            'Citizen complaint registration and issue submission',
            'Complaint tracking for status visibility and follow-up',
            'Admin-side complaint review and response management',
            'Organized handling of municipal service requests',
        ],
        popupStakeholders: [
            'Admin',
            'Citizen',
            'Municipal Staff',
        ],
        popupOutcome:
            'The project focuses on improving transparency between citizens and municipal teams by keeping complaint data organized, traceable, and easier to act on.',
        image: '/images/projects/mccms-thumb.jpg',
        popupVideos: ['/videos/MCCMS_vid.mp4'],
        tech: ['PHP', 'HTML', 'CSS', 'Mysql'],
        categories: ['PHP', 'Complaint Portal'],
        filters: ['PHP'],
        liveUrl: '#',
        githubUrl: '#',
        color: 'primary',
    },
    {
        id: 2,
        title: 'PWD4U',
        description: 'Managing PWD contractor data and complaints.',
        popupDescription:
            'A Python-based application designed to automate core functions of the Public Works Department. It handles project tracking, contractor management, and public complaints efficiently. By reducing manual tasks and improving transparency, the system ensures faster execution of infrastructure projects and better public service delivery.',
        popupModalDescription:
            'PWD4U focuses on simplifying department-side operations through a Python-driven system. The popup preview presents the application flow for managing public works data, reducing repeated manual entry, and supporting faster access to project and complaint information.',
        popupFunctions: [
            'Public Works project and contractor data management',
            'Complaint and request handling for department workflows',
            'Rating support for recording user feedback on service handling',
            'Location-specific details for identifying where a request or issue belongs',
            'Centralized record access for faster review',
        ],
        popupStakeholders: [
            'Admin - PWD Dept',
            'User',
            'Staffs',
        ],
        popupOutcome:
            'The system is intended to reduce manual effort, improve departmental visibility, and support smoother execution of public works operations.',
        image: '/images/CMS.webp',
        popupVideos: ['/videos/PWD_vid.mp4'],
        tech: ['Python', 'HTML', 'Javascript', 'CSS', 'Mysql'],
        categories: ['Python', 'Automation'],
        filters: ['Python'],
        liveUrl: '#',
        githubUrl: '#',
        color: 'secondary',
    },
    {
        id: 3,
        title: 'Rhythm Music Player App',
        description: 'Mobile app for smooth music playback and playlists.',
        popupDescription:
            'A Flutter-based mobile application designed to provide a smooth and responsive audio playback experience. It supports key features such as play, pause, skip and playlist creation. With an intuitive user interface and fast performance across platforms.',
        popupModalDescription:
            'Rhythm Music Player is a mobile music application designed around a focused listening experience. The app emphasizes quick access to songs, smooth playback controls, playlist-style organization, and a clean interface that helps users browse and enjoy audio without unnecessary friction.',
        popupFunctions: [
            'Audio playback with play, pause, and skip controls',
            'Playlist-oriented music browsing experience',
            'Mobile-first interface built for quick interaction',
            'Responsive media controls for smooth app usage',
        ],
        popupStakeholders: [
            'User',
        ],
        popupOutcome:
            'The project emphasizes a clean listening experience with simple controls, lightweight navigation, and an interface suited for everyday mobile use.',
        image: '/images/projects/music-thumb.jpg',
        popupimage: ['/images/Muz.jpg'],
        tech: ['Flutter', 'Dart', 'Javascript', 'C/C++'],
        categories: ['Flutter', 'Mobile App'],
        filters: ['Mobile App'],
        liveUrl: '#',
        githubUrl: '#',
        color: 'accent',
    },
    {
        id: 4,
        title: 'RentalHarmony',
        description: 'Rental management platform for listings, tenants, and bookings.',
        popupDescription:
            'A PHP and Laravel-based rental management platform built to simplify property listings, tenant handling, and booking workflows. It helps streamline day-to-day rental operations through an organized and user-friendly interface.',
        popupModalDescription:
            'RentalHarmony is a rental management platform focused on making property discovery, listing control, and customer interaction easier to manage. The system supports a structured rental workflow where users can browse available rental options while administrators maintain property details and booking-related data.',
        popupFunctions: [
            'Rental property listing and browsing',
            'Admin-side property and availability management',
            'Customer inquiry or booking workflow support',
            'Organized rental information for easier decision-making',
        ],
        popupStakeholders: [
            'Admin',
            'User/Customer',
        ],
        popupOutcome:
            'The project focuses on simplifying rental operations by connecting users with available properties through a cleaner and more manageable digital workflow.',
        image: '/images/projects/rent-thumb.jpg',
        popupimage: ['/images/RENT.jpg'],
        tech: ['PHP', 'Laravel'],
        categories: ['PHP', 'Laravel'],
        filters: ['PHP', 'Laravel'],
        liveUrl: '#',
        githubUrl: '#',
        color: 'primary',
    },
    {
        id: 5,
        title: 'AI Medical Advisor',
        description: 'AI-assisted medical guidance tool powered by ML models.',
        popupDescription:
            'A Python-based AI Medical Advisor designed to support health-related guidance using machine learning and artificial intelligence concepts. It is focused on analyzing inputs intelligently and offering helpful recommendation-oriented outputs through an easy-to-use interface.',
        popupModalDescription:
            'AI Medical Advisor is a healthcare-support project that uses AI-assisted logic to help users receive preliminary guidance before formal consultation. It is designed to support doctor discovery and booking, temporary symptom detection, and medical guidance that helps users understand possible next steps while keeping professional healthcare involvement central.',
        popupFunctions: [
            'AI-supported temporary symptom detection',
            'Medical support guidance based on entered symptoms',
            'Doctor booking support for suitable consultation paths',
            'Admin-side management for healthcare records or platform data',
            'Pharmacy-related support for medicine or treatment follow-up workflows',
        ],
        popupStakeholders: [
            'Admin',
            'User',
            'Doctor',
            'Pharmacist',
        ],
        popupOutcome:
            'The project focuses on improving early healthcare support by combining AI guidance, doctor booking, and symptom-oriented assistance in one accessible system.',
        image: '/images/101.jpg',
        popupimage: ['/images/101.jpg'],
        tech: ['Python', 'ML - Machine Learning', 'AI - Artificial Intelligence'],
        categories: ['AI / ML', 'Python'],
        filters: ['Python', 'AI / ML'],
        liveUrl: '#',
        githubUrl: '#',
        color: 'secondary',
    },
];

const additionalProjects: Project[] = [
    {
        id: 6,
        title: 'Online Clothing Store',
        description: 'Online website for purchasing clothing items.',
        popupDescription:
            'A PHP-based online clothing store built for browsing and purchasing fashion products through a simple and user-friendly shopping experience.',
        popupModalDescription:
            'Online Clothing Store is an e-commerce project created for presenting fashion products in a simple shopping interface. It supports product browsing for users and management functionality for administrators, making it easier to organize items, categories, and purchase-oriented interactions.',
        popupFunctions: [
            'Product browsing and item discovery',
            'Admin product and category management',
            'Shopping-focused user interaction flow',
            'Organized presentation of clothing items',
        ],
        popupStakeholders: [
            'User',
            'Admin',
        ],
        popupOutcome:
            'The project focuses on providing a clear online store experience where users can explore products while administrators can manage the shopping catalog.',
        image: '/images/projects/cloths-thumb.jpg',
        popupimage: ['/images/CLOTHS.jpg'],
        tech: ['PHP', 'HTML', 'CSS', 'Mysql'],
        categories: ['PHP', 'E-Commerce'],
        filters: ['PHP'],
        liveUrl: '#',
        githubUrl: '#',
        color: 'primary',
    },
    {
        id: 7,
        title: 'Art Gallery',
        description: 'A website to showcase and sell artwork.',
        popupDescription:
            'A web platform created to present artwork collections and support online art sales with a visually engaging browsing experience.',
        popupModalDescription:
            'Art Gallery is a creative web project built to showcase artwork collections through a clean visual browsing experience. It supports users who want to explore artworks and administrators who need to manage gallery items, artwork details, and presentation content.',
        popupFunctions: [
            'Artwork showcase and gallery browsing',
            'Admin-side artwork and content management',
            'Visual presentation of creative collections',
            'Support for artwork discovery and sales-oriented browsing',
        ],
        popupStakeholders: [
            'User',
            'Admin',
        ],
        popupOutcome:
            'The project focuses on giving artwork a polished digital presentation while keeping gallery management simple for administrators.',
        image: '/images/projects/artg-thumb.jpg',
        popupimage: ['/images/ARTG.jpg'],
        tech: ['PHP', 'HTML', 'CSS', 'Mysql'],
        categories: ['PHP', 'Creative Website'],
        filters: ['PHP'],
        liveUrl: '#',
        githubUrl: '#',
        color: 'accent',
    },
];

const allProjects = [...projects, ...additionalProjects];

const projectTechBadgeClasses: Record<Project['color'], string> = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    secondary: 'bg-secondary/10 text-secondary border-secondary/20',
    accent: 'bg-accent/10 text-accent border-accent/20',
};

const hasProjectPopup = (_project: Project) => true;

const ProjectPopup = ({ project, onClose }: { project: Project; onClose: () => void }) => {
    useEffect(() => {
        const handleEscape = (event: globalThis.KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        const originalOverflow = document.body.style.overflow;
        const originalPaddingRight = document.body.style.paddingRight;
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

        document.body.style.overflow = 'hidden';
        if (scrollbarWidth > 0) {
            document.body.style.paddingRight = `${scrollbarWidth}px`;
        }
        window.addEventListener('keydown', handleEscape);
        return () => {
            document.body.style.overflow = originalOverflow;
            document.body.style.paddingRight = originalPaddingRight;
            window.removeEventListener('keydown', handleEscape);
        };
    }, [onClose]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 backdrop-blur-xl"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 18 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex max-h-[82vh] w-full max-w-3xl flex-col overflow-hidden rounded-[24px] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(5,8,14,0.96),rgba(0,0,0,0.9))] text-white shadow-[0_32px_100px_-76px_rgba(34,211,238,0.34),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-2xl"
                onClick={(event) => event.stopPropagation()}
                onWheel={(event) => event.stopPropagation()}
                onTouchMove={(event) => event.stopPropagation()}
            >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_10%,rgba(34,211,238,0.07),transparent_34%),radial-gradient(circle_at_92%_18%,rgba(167,139,250,0.06),transparent_34%)]" />
                <div className="relative flex shrink-0 items-start justify-between gap-4 border-b border-white/[0.07] px-5 py-4 sm:px-6">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/85">
                            {project.categories.join(' / ')}
                        </p>
                        <h3 className="mt-2 max-w-2xl text-xl font-black leading-tight text-white sm:text-2xl">
                            {project.title}
                        </h3>
                            </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close project popup"
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.045] text-white/82 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="relative min-h-0 flex-1 overscroll-contain overflow-y-auto p-4 [scrollbar-color:rgba(34,211,238,0.65)_rgba(255,255,255,0.05)]">
                    <div className="min-h-0 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5">
                        <div className="mb-5 flex flex-wrap gap-2">
                            {project.tech.map((tech) => (
                                <span
                                    key={tech}
                                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${projectTechBadgeClasses[project.color]}`}
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                        <div className="space-y-5">
                            <div>
                                <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">
                                    Overview
                                </h4>
                                <p className="text-left text-sm leading-7 text-white/72 [overflow-wrap:break-word] sm:text-justify sm:text-base">
                                    {project.popupModalDescription ?? project.popupDescription}
                                </p>
                            </div>

                            {project.popupFunctions && (
                                <div>
                                    <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">
                                        Core Functions
                                    </h4>
                                    <ul className="space-y-2">
                                        {project.popupFunctions.map((item) => (
                                            <li key={item} className="flex gap-3 text-sm leading-6 text-white/68">
                                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary shadow-[0_0_12px_rgba(34,211,238,0.55)]" />
                                                <span className="text-left [overflow-wrap:break-word] sm:text-justify">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {project.popupStakeholders && (
                                <div>
                                    <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">
                                        Stakeholders
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {project.popupStakeholders.map((stakeholder) => (
                                            <span
                                                key={stakeholder}
                                                className="rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-1 text-xs font-medium text-white/70"
                                            >
                                                {stakeholder}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {project.popupOutcome && (
                                <div>
                                    <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">
                                        Project Focus
                                    </h4>
                                    <p className="text-left text-sm leading-7 text-white/68 [overflow-wrap:break-word] sm:text-justify">
                                        {project.popupOutcome}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export const ProjectsSection = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-120px' });
    const [flippedProjectId, setFlippedProjectId] = useState<number | null>(null);
    const [delayedUnflipProjectIds, setDelayedUnflipProjectIds] = useState<Set<number>>(() => new Set());
    const [popupProject, setPopupProject] = useState<Project | null>(null);
    const [cardHint, setCardHint] = useState({ x: 0, y: 0, visible: false });
    const [carouselApi, setCarouselApi] = useState<CarouselApi>();
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const delayedUnflipTimeouts = useRef<Map<number, number>>(new Map());

    // store original inline heights so we can restore them when unflipped
    const originalHeights = useRef<Map<number, string | null>>(new Map());

    const scrollProjects = (direction: 'left' | 'right') => {
        if (!carouselApi) return;
        if (direction === 'right') {
            carouselApi.scrollNext();
            return;
        }

        carouselApi.scrollPrev();
    };

    const toggleProjectFlip = (projectId: number) => {
        setFlippedProjectId((current) => {
            const selectedDelayedTimeout = delayedUnflipTimeouts.current.get(projectId);
            if (selectedDelayedTimeout) {
                window.clearTimeout(selectedDelayedTimeout);
                delayedUnflipTimeouts.current.delete(projectId);
                setDelayedUnflipProjectIds((ids) => {
                    const next = new Set(ids);
                    next.delete(projectId);
                    return next;
                });
            }

            if (current === projectId) {
                return null;
            }

            if (current !== null) {
                const existingTimeout = delayedUnflipTimeouts.current.get(current);
                if (existingTimeout) {
                    window.clearTimeout(existingTimeout);
                }

                setDelayedUnflipProjectIds((ids) => {
                    const next = new Set(ids);
                    next.add(current);
                    return next;
                });

                const timeoutId = window.setTimeout(() => {
                    setDelayedUnflipProjectIds((ids) => {
                        const next = new Set(ids);
                        next.delete(current);
                        return next;
                    });
                    delayedUnflipTimeouts.current.delete(current);
                }, 800);

                delayedUnflipTimeouts.current.set(current, timeoutId);
            }

            return projectId;
        });
    };

    const handleFlipKeyDown = (event: ReactKeyboardEvent, projectId: number) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleProjectFlip(projectId);
        }
    };

    const openProjectPopup = (project: Project) => {
        if (!hasProjectPopup(project)) return;
        setCardHint((current) => ({ ...current, visible: false }));
        setPopupProject(project);
    };

    const stopPreviewInteraction = (event: SyntheticEvent) => {
        event.stopPropagation();
    };

    const showCardHint = (event: ReactPointerEvent<HTMLElement>) => {
        if (event.pointerType === 'touch') return;
        setCardHint({ x: event.clientX, y: event.clientY, visible: true });
    };

    const hideCardHint = () => {
        setCardHint((current) => ({ ...current, visible: false }));
    };

    useEffect(() => {
        if (!cardHint.visible) return;

        const hideWhenOutsideFrontCard = (event: PointerEvent) => {
            const hoveredElement = document.elementFromPoint(event.clientX, event.clientY);
            if (!(hoveredElement instanceof Element) || !hoveredElement.closest('[data-project-front-hit="true"]')) {
                hideCardHint();
            }
        };

        window.addEventListener('pointermove', hideWhenOutsideFrontCard);
        window.addEventListener('scroll', hideCardHint, true);
        window.addEventListener('blur', hideCardHint);

        return () => {
            window.removeEventListener('pointermove', hideWhenOutsideFrontCard);
            window.removeEventListener('scroll', hideCardHint, true);
            window.removeEventListener('blur', hideCardHint);
        };
    }, [cardHint.visible]);

    useEffect(() => {
        return () => {
            delayedUnflipTimeouts.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
            delayedUnflipTimeouts.current.clear();
        };
    }, []);

    useEffect(() => {
        if (!carouselApi) return;

        const updateCarouselState = () => {
            setCanScrollLeft(carouselApi.canScrollPrev());
            setCanScrollRight(carouselApi.canScrollNext());
        };

        updateCarouselState();
        carouselApi.on('select', updateCarouselState);
        carouselApi.on('reInit', updateCarouselState);

        return () => {
            carouselApi.off('select', updateCarouselState);
            carouselApi.off('reInit', updateCarouselState);
        };
    }, [carouselApi]);

    // When a project is flipped on mobile, compute a dynamic shift equal to the
    // flipped card height and set it as a CSS variable on the `body` so the
    // `.skills-section` can translate by the exact amount. This keeps desktop
    // behavior unchanged.
    useEffect(() => {
        const mq = window.matchMedia('(max-width: 640px)');
        const className = 'mobile-card-flipped';
        const varName = '--projects-flip-shift';

        const applyShift = () => {
            if (!mq.matches) {
                document.body.classList.remove(className);
                document.body.style.removeProperty(varName);
                return;
            }

            if (flippedProjectId === null) {
                document.body.classList.remove(className);
                document.body.style.removeProperty(varName);
                return;
            }

            const el = document.querySelector(`[data-project-id="${flippedProjectId}"]`);
            if (!el) {
                document.body.classList.remove(className);
                document.body.style.removeProperty(varName);
                return;
            }

            const rect = el.getBoundingClientRect();
            // shift by the card height plus small margin
            const shift = Math.round(rect.height + 24);
            document.body.style.setProperty(varName, `${shift}px`);
            document.body.classList.add(className);
        };

        applyShift();

        // re-apply on resize/orientation change while flipped
        window.addEventListener('resize', applyShift);
        window.addEventListener('orientationchange', applyShift);

        return () => {
            window.removeEventListener('resize', applyShift);
            window.removeEventListener('orientationchange', applyShift);
            document.body.classList.remove(className);
            document.body.style.removeProperty(varName);
        };
    }, [flippedProjectId]);

    useEffect(() => {
        if (!carouselApi) return;

        const frameId = window.requestAnimationFrame(() => {
            carouselApi.reInit();
            carouselApi.scrollTo(0);
            setCanScrollLeft(carouselApi.canScrollPrev());
            setCanScrollRight(carouselApi.canScrollNext());
        });

        return () => window.cancelAnimationFrame(frameId);
    }, [carouselApi]);

    return (
        <section
                ref={ref}
                className="projects-section relative overflow-hidden bg-[radial-gradient(circle_at_80%_16%,rgba(15,23,42,0.4),transparent_38%),linear-gradient(180deg,#000_0%,rgba(5,7,12,0.78)_18%,rgba(0,0,0,0.96)_100%)] px-6 py-20 text-white"
            >
            <div className="relative z-10 mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="mb-16 text-center"
                >
                    <h2 className="interactive-heading mb-6 text-3xl sm:text-4xl md:text-5xl font-bold text-gradient-primary">
                        Featured Projects
                    </h2>
                    <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
                        A showcase of my recent work, featuring modern web applications built with
                        cutting-edge technologies.
                    </p>
                </motion.div>

                <div className="relative mt-6">
                    <button
                        type="button"
                        onClick={() => scrollProjects('left')}
                        disabled={!canScrollLeft}
                        aria-label="Scroll featured projects left"
                        className="group absolute left-0 top-[8.75rem] z-20 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-300/20 bg-[radial-gradient(circle_at_32%_24%,rgba(34,211,238,0.18),transparent_42%),linear-gradient(145deg,rgba(5,12,20,0.9),rgba(0,0,0,0.74))] text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_34px_rgba(34,211,238,0.18)] backdrop-blur-md transition-all duration-300 hover:-translate-y-[calc(50%+2px)] hover:border-primary/55 hover:text-primary-glow hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_0_46px_rgba(34,211,238,0.34)] disabled:cursor-not-allowed disabled:opacity-35 lg:inline-flex lg:-left-12 xl:-left-16 xl:top-[9.25rem] 2xl:-left-20"
                    >
                        <span className="absolute inset-[6px] rounded-full border border-white/5" />
                        <ChevronsLeft className="relative h-5 w-5 transition-transform duration-300 group-hover:-translate-x-0.5" strokeWidth={2.4} />
                    </button>

                    <Carousel
                        setApi={setCarouselApi}
                        opts={{
                            align: 'start',
                            containScroll: 'trimSnaps',
                            skipSnaps: false,
                        }}
                        className="px-2 sm:px-3 lg:px-12"
                    >
                        <CarouselContent className="-ml-6 py-8">
                            {allProjects.map((project, index) => {
                                const isFlipped = flippedProjectId === project.id || delayedUnflipProjectIds.has(project.id);

                                return (
                                    <CarouselItem
                                        key={project.id}
                                        className="basis-[88%] px-1 pl-6 md:basis-[62%] lg:basis-[52%] xl:basis-1/2"
                                    >
                                            <motion.article
                                            initial={{ opacity: 0, y: 28 }}
                                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                                            whileHover={{ y: -6 }}
                                            transition={{
                                                duration: 0.58,
                                                delay: Math.min(index, 5) * 0.05,
                                                ease: [0.22, 1, 0.36, 1],
                                            }}
                                                         data-project-id={project.id}
                                                         className={`project-flip-card h-[420px] md:h-[560px] ${isFlipped ? 'is-flipped' : ''}`}
                                        >
                                            <div className="project-flip-card__inner">
                                                <div
                                                    role="button"
                                                    tabIndex={isFlipped ? -1 : 0}
                                                    aria-label={`Show ${project.title} details`}
                                                    aria-pressed={isFlipped ? 'true' : 'false'}
                                                    onClick={() => toggleProjectFlip(project.id)}
                                                    onPointerDown={(event: any) => {
                                                        if (event && event.pointerType === 'touch') {
                                                            event.preventDefault();
                                                            toggleProjectFlip(project.id);
                                                        }
                                                    }}
                                                    onKeyDown={(event) => handleFlipKeyDown(event, project.id)}
                                                    onPointerLeave={hideCardHint}
                                                    className="project-flip-card__face project-flip-card__front group flex cursor-pointer flex-col outline-none"
                                                >
                                                    <div
                                                        onPointerEnter={isFlipped ? undefined : showCardHint}
                                                        onPointerMove={isFlipped ? undefined : showCardHint}
                                                        onPointerLeave={hideCardHint}
                                                        data-project-front-hit={isFlipped ? undefined : 'true'}
                                                        className="relative aspect-[16/9] overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-[0_28px_90px_-58px_rgba(34,211,238,0.42)] transition duration-500 group-hover:border-primary/55 group-focus-visible:border-primary/70"
                                                    >
                                                        <img
                                                            src={project.image}
                                                            alt={project.title}
                                                            loading="lazy"
                                                            decoding="async"
                                                            sizes="(min-width: 1280px) 520px, (min-width: 1024px) 50vw, (min-width: 768px) 62vw, 88vw"
                                                            className="h-full w-full object-cover opacity-80 transition duration-700 ease-out group-hover:scale-[1.08] group-hover:opacity-100 group-focus-visible:scale-[1.08] group-focus-visible:opacity-100"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/42 to-transparent" />
                                                        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_30%,rgba(255,255,255,0.14)_46%,rgba(34,211,238,0.12)_52%,transparent_68%)] opacity-0 transition duration-700 group-hover:translate-x-10 group-hover:opacity-100 group-focus-visible:translate-x-10 group-focus-visible:opacity-100" />
                                                        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                                                            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
                                                                {project.categories.join(', ')}
                                                            </p>
                                                            <h4 className="text-2xl font-black uppercase leading-none text-white sm:text-3xl">
                                                                {project.title}
                                                            </h4>
                                                        </div>
                                                        <span className="absolute -right-2 top-1/2 hidden h-4 w-4 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_28px_rgba(34,211,238,0.9)] lg:block" />
                                                    </div>

                                                    <p className="mx-auto mt-5 min-h-[52px] max-w-[90%] text-center text-sm font-medium leading-6 text-white/55 sm:text-base">
                                                        {project.description}
                                                    </p>
                                                </div>

                                                {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
                                                <div
                                                    role="button"
                                                    tabIndex={isFlipped ? 0 : -1}
                                                    aria-label={`Show ${project.title} preview`}
                                                    aria-pressed={!isFlipped ? 'true' : 'false'}
                                                    onClick={() => toggleProjectFlip(project.id)}
                                                    onKeyDown={(event) => handleFlipKeyDown(event, project.id)}
                                                    onPointerEnter={hideCardHint}
                                                    onPointerMove={hideCardHint}
                                                    className="project-flip-card__face project-flip-card__back cursor-pointer outline-none"
                                                >
                                                    <div className="glass premium-card-motion relative flex max-h-[430px] min-h-[390px] flex-col overflow-hidden rounded-[28px] p-6 shadow-[0_28px_90px_-58px_rgba(34,211,238,0.5)] sm:max-h-[455px] sm:min-h-[410px]">
                                                        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
                                                        <div className="mb-5 flex items-start justify-between gap-4">
                                                            <div>
                                                                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/80">
                                                                    {project.categories.join(' / ')}
                                                                </p>
                                                                <h4 className="mt-3 text-2xl font-black uppercase leading-tight text-white sm:text-3xl">
                                                                    {project.title}
                                                                </h4>
                                                            </div>
                                                            <div className="flex shrink-0 items-center gap-2">
                                                                {hasProjectPopup(project) && (
                                                                <button
                                                                    type="button"
                                                                    tabIndex={isFlipped ? 0 : -1}
                                                                    onClick={(event) => {
                                                                        event.stopPropagation();
                                                                        openProjectPopup(project);
                                                                    }}
                                                                    onKeyDown={(event) => event.stopPropagation()}
                                                                    aria-label={`Open ${project.title} popup`}
                                                                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white transition hover:border-primary/45 hover:bg-primary/10 hover:text-primary"
                                                                >
                                                                    <Maximize2 className="h-5 w-5" />
                                                                </button>
                                                                )}
                                                                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-primary">
                                                                    <RotateCcw className="h-5 w-5" />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <p
                                                            onClick={stopPreviewInteraction}
                                                            onPointerDown={stopPreviewInteraction}
                                                            onWheel={stopPreviewInteraction}
                                                            onTouchMove={stopPreviewInteraction}
                                                            className="max-h-[120px] overscroll-contain overflow-y-auto pr-2 text-left text-sm leading-7 text-white/70 [overflow-wrap:break-word] [scrollbar-width:thin] [scrollbar-color:rgba(34,211,238,0.5)_rgba(255,255,255,0.04)] sm:max-h-[136px] sm:text-base"
                                                        >
                                                            {project.popupDescription}
                                                        </p>

                                                        <div className="mt-6 flex flex-wrap gap-2">
                                                            {project.tech.map((tech) => (
                                                                <span
                                                                    key={tech}
                                                                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${projectTechBadgeClasses[project.color]}`}
                                                                >
                                                                    {tech}
                                                                </span>
                                                            ))}
                                                        </div>

                                                        <div className="mt-auto pt-8">
                                                            <div className="h-px bg-gradient-to-r from-primary/50 via-white/10 to-transparent" />
                                                            <p className="mt-4 text-sm font-semibold text-[#c9f8fb]">
                                                                {project.tech.slice(0, 3).join(' / ')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.article>
                                    </CarouselItem>
                                );
                            })}
                        </CarouselContent>
                    </Carousel>

                    <button
                        type="button"
                        onClick={() => scrollProjects('right')}
                        disabled={!canScrollRight}
                        aria-label="Scroll featured projects right"
                        className="group absolute right-0 top-[8.75rem] z-20 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-300/20 bg-[radial-gradient(circle_at_32%_24%,rgba(34,211,238,0.18),transparent_42%),linear-gradient(145deg,rgba(5,12,20,0.9),rgba(0,0,0,0.74))] text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_34px_rgba(34,211,238,0.18)] backdrop-blur-md transition-all duration-300 hover:-translate-y-[calc(50%+2px)] hover:border-primary/55 hover:text-primary-glow hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_0_46px_rgba(34,211,238,0.34)] disabled:cursor-not-allowed disabled:opacity-35 lg:inline-flex lg:-right-12 xl:-right-16 xl:top-[9.25rem] 2xl:-right-20"
                    >
                        <span className="absolute inset-[6px] rounded-full border border-white/5" />
                        <ChevronsRight className="relative h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={2.4} />
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {cardHint.visible && !popupProject && (
                    <motion.div
                        initial={{ opacity: 0, y: 4, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.96 }}
                        transition={{ duration: 0.14 }}
                        className="pointer-events-none fixed z-40 hidden rounded-md border border-primary/35 bg-black/70 px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#c9f8fb] shadow-[0_0_22px_rgba(34,211,238,0.26)] backdrop-blur-md md:block"
                        style={{ left: cardHint.x + 14, top: cardHint.y + 22 }}
                    >
                        click for info
                    </motion.div>
                )}
                {popupProject && (
                    <ProjectPopup
                        project={popupProject}
                        onClose={() => setPopupProject(null)}
                    />
                )}
            </AnimatePresence>

        </section>
    );
};
