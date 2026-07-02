import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Github, Linkedin, Mail, Instagram, MapPin, Phone, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ParticleBackground } from '../ParticleBackground';

const CONTACT_EMAIL = "gokulkrishnan242002@gmail.com";

const contactCardClass =
  "premium-card-motion relative overflow-hidden rounded-[28px] border border-white/[0.045] bg-[linear-gradient(145deg,rgba(2,8,14,0.46),rgba(0,0,0,0.22))] p-5 shadow-[0_30px_100px_-84px_rgba(34,211,238,0.36)] backdrop-blur-xl sm:p-6";

const contactInputClass =
  "h-11 rounded-xl border-white/[0.07] bg-black/25 text-white placeholder:text-white/42 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition duration-300 focus:border-primary/45 focus:bg-white/[0.04] focus:ring-2 focus:ring-primary/10";

const contactTextAreaClass =
  "min-h-[124px] rounded-xl border-white/[0.07] bg-black/25 text-white placeholder:text-white/42 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition duration-300 focus:border-primary/45 focus:bg-white/[0.04] focus:ring-2 focus:ring-primary/10";

type ContactFormData = {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
};

const emptyFormData: ContactFormData = {
  firstName: "",
  lastName: "",
  email: "",
  subject: "",
  message: "",
};

export const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>(emptyFormData);

  const buildMailtoUrl = (data: ContactFormData) => {
    const fullName = `${data.firstName} ${data.lastName}`.trim();
    const params = new URLSearchParams({
      subject: `Portfolio Contact: ${data.subject}`,
      body: [
        `Name: ${fullName}`,
        `Email: ${data.email}`,
        "",
        data.message,
      ].join("\n"),
    });

    return `mailto:${CONTACT_EMAIL}?${params.toString()}`;
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    const trimmedData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      subject: formData.subject.trim(),
      message: formData.message.trim(),
    };

    const fullName = `${trimmedData.firstName} ${trimmedData.lastName}`.trim();
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: fullName,
          email: trimmedData.email,
          subject: trimmedData.subject,
          message: trimmedData.message,
          _subject: `Portfolio Contact: ${trimmedData.subject}`,
          _replyto: trimmedData.email,
          _captcha: "false",
          _template: "table",
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || result?.success === "false") {
        throw new Error("Direct contact service failed");
      }

      window.clearTimeout(timeoutId);

      toast({
        title: "Message sent!",
        description: "Your message was sent successfully.",
      });
      setFormData(emptyFormData);
    } catch {
      window.clearTimeout(timeoutId);
      const mailtoUrl = buildMailtoUrl(trimmedData);

      toast({
        title: "Opening your email app",
        description: "Direct sending was unavailable, so your message has been prepared in your mail app.",
      });

      window.setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 150);
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialLinks = [
    { icon: Github, href: "https://github.com/GokulKrishnan-M", label: "GitHub", color: "hover:border-primary/35 hover:text-primary hover:shadow-[0_18px_44px_-32px_rgba(34,211,238,0.55)]" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/gokul-krishnan-m/", label: "LinkedIn", color: "hover:border-secondary/35 hover:text-secondary hover:shadow-[0_18px_44px_-32px_rgba(168,85,247,0.55)]" },
    { icon: Instagram, href: "https://instagram.com/gokul.krishnan.__", label: "Instagram", color: "hover:border-accent/35 hover:text-accent hover:shadow-[0_18px_44px_-32px_rgba(236,72,153,0.55)]" },
    { 
      icon: Mail, 
      href: `mailto:${CONTACT_EMAIL}`,
      label: "Email", 
      color: "hover:border-primary/35 hover:text-primary hover:shadow-[0_18px_44px_-32px_rgba(34,211,238,0.55)]" 
    }
  ];

  return (
    <section ref={ref} className="contact-section py-20 px-6 relative overflow-hidden bg-[radial-gradient(circle_at_70%_20%,rgba(15,23,42,0.42),transparent_38%),linear-gradient(180deg,#000_0%,rgba(5,7,12,0.82)_18%,#000_100%)]">
      <div className="absolute inset-0 opacity-[0.12]">
        <ParticleBackground variant="ambient" fitParent />
      </div>
      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="interactive-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-gradient-secondary">Let's Work Together</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have something in mind? Let’s talk and make it happen.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1.02fr_0.98fr] gap-8 items-start">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className={contactCardClass}>
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(34,211,238,0.12),transparent_42%),radial-gradient(circle_at_88%_86%,rgba(217,70,239,0.1),transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_44%)]" />
              <div className="relative overflow-hidden rounded-2xl border border-white/[0.035] bg-black/20 p-6">
              <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-secondary/8 blur-3xl" />
              <h3 className="mb-6 text-2xl font-bold text-primary">Send a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <Input
                      name="firstName"
                      placeholder="First Name"
                      className={contactInputClass}
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    <Input
                      name="lastName"
                      placeholder="Last Name"
                      className={contactInputClass}
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </motion.div>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    className={contactInputClass}
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <Input
                    name="subject"
                    placeholder="Subject"
                    className={contactInputClass}
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <Textarea
                    name="message"
                    placeholder="..."
                    rows={5}
                    className={contactTextAreaClass}
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.9 }}
                  className="flex flex-col gap-2 rounded-2xl border border-white/[0.06] bg-black/25 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)] sm:flex-row sm:items-center"
                >
                  <a
                    href="https://wa.me/917510367210"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex h-12 items-center justify-center gap-3 overflow-hidden rounded-xl border border-emerald-300/20 bg-[linear-gradient(145deg,rgba(5,18,15,0.9),rgba(2,8,10,0.82))] px-3 text-left text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_18px_44px_-34px_rgba(16,185,129,0.7)] transition duration-300 hover:-translate-y-0.5 hover:border-emerald-300/42 hover:bg-[linear-gradient(145deg,rgba(6,26,20,0.94),rgba(3,10,12,0.86))] hover:text-white hover:shadow-[0_20px_48px_-32px_rgba(16,185,129,0.86)] sm:w-40"
                    title="Message me on WhatsApp"
                    aria-label="Message me on WhatsApp"
                  >
                    <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_18%,rgba(37,211,102,0.22),transparent_44%),radial-gradient(circle_at_86%_82%,rgba(34,211,238,0.1),transparent_46%)] opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
                    <span className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-emerald-200/35 to-transparent" />
                    <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_0_22px_rgba(37,211,102,0.42)] ring-1 ring-white/25 transition duration-300 group-hover:scale-105">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 32 32"
                        fill="none"
                        className="h-6 w-6"
                      >
                        <path
                          d="M16.04 4.5C9.73 4.5 4.6 9.53 4.6 15.72c0 1.98.53 3.91 1.53 5.61L4.5 27.5l6.35-1.58a11.65 11.65 0 0 0 5.19 1.24c6.31 0 11.46-5.03 11.46-11.22S22.35 4.5 16.04 4.5Zm0 20.72c-1.75 0-3.46-.46-4.96-1.33l-.36-.21-3.76.94.97-3.65-.24-.38a9.07 9.07 0 0 1-1.4-4.87c0-5.12 4.38-9.29 9.75-9.29s9.75 4.17 9.75 9.29-4.38 9.5-9.75 9.5Zm5.35-6.96c-.29-.14-1.72-.83-1.99-.92-.27-.1-.47-.14-.67.14-.2.29-.77.92-.95 1.11-.17.19-.35.21-.64.07-.29-.14-1.22-.44-2.33-1.4-.86-.75-1.44-1.68-1.61-1.97-.17-.29-.02-.44.13-.58.13-.13.29-.35.43-.52.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.14-.67-1.58-.92-2.16-.24-.58-.49-.5-.67-.51h-.57c-.19 0-.5.07-.76.36-.26.29-1 1-1 2.43s1.02 2.81 1.17 3.01c.14.19 2.02 3.14 4.99 4.28.7.27 1.24.43 1.67.55.7.22 1.34.19 1.84.12.56-.08 1.72-.69 1.96-1.35.24-.66.24-1.23.17-1.35-.07-.12-.26-.19-.55-.33Z"
                          fill="currentColor"
                        />
                      </svg>
                    </span>
                    <span className="relative flex flex-col leading-none">
                      <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-emerald-200/70">
                        Chat on
                      </span>
                      <span className="mt-1 text-sm font-semibold">WhatsApp</span>
                    </span>
                  </a>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="group relative h-12 flex-1 overflow-hidden rounded-xl bg-gradient-primary text-base font-semibold text-black shadow-[0_20px_48px_-32px_rgba(34,211,238,0.75)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.005] disabled:opacity-70"
                  >
                    <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_28%,rgba(255,255,255,0.28)_48%,transparent_68%)] opacity-0 transition duration-700 group-hover:translate-x-24 group-hover:opacity-100" />
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="relative h-5 w-5 rounded-full border-2 border-black/[0.7] border-t-transparent"
                      />
                    ) : (
                      <span className="relative flex items-center justify-center gap-2">
                        Send Message
                        <Send className="h-4 w-4" strokeWidth={2} />
                      </span>
                    )}
                  </Button>
                </motion.div>
              </form>
              </div>
            </div>
          </motion.div>

          {/* Contact Info & Social Links */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <div className={contactCardClass}>
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(34,211,238,0.12),transparent_36%),radial-gradient(circle_at_82%_78%,rgba(167,139,250,0.1),transparent_34%)]" />
              <div className="relative overflow-hidden rounded-2xl border border-white/[0.035] bg-black/20 p-6">
              <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-secondary/8 blur-3xl" />
              <h3 className="mb-6 bg-gradient-to-r from-violet-400 via-purple-300 to-cyan-200 bg-clip-text text-2xl font-bold text-transparent">Get in Touch</h3>
              <div className="space-y-4">
                <p className="max-w-md leading-7 text-white/60">
                  I'm always open to discussing new opportunities, creative projects, 
                  or just having a chat about technology and design.
                </p>
                <div className="space-y-4 pt-1">
                  <div className="flex items-center gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.06] bg-black/20 text-primary">
                      <Mail className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 truncate font-medium text-white/80">gokulkrishnan242002@gmail.com</span>
                    </div>
                  <div className="flex items-center gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.06] bg-black/20 text-secondary">
                      <Phone className="h-4 w-4" />
                    </span>
                    <span className="font-medium text-white/80">+917510367210</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.06] bg-black/20 text-accent">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <div>
                      <span className="text-base font-medium text-white/80">Kottayam, Kerala</span>
                      <br />
                      <span className="text-sm text-white/50">India</span>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </div>

            <div className={contactCardClass}>
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(34,211,238,0.1),transparent_36%),radial-gradient(circle_at_82%_78%,rgba(217,70,239,0.11),transparent_34%)]" />
              <div className="relative overflow-hidden rounded-2xl border border-white/[0.035] bg-black/20 p-6">
              <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-accent/8 blur-3xl" />
              <h3 className="mb-6 text-2xl font-bold text-accent">Follow Me</h3>
              <div className="grid grid-cols-2 gap-3">
                {socialLinks.map((link, index) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith('mailto:') ? undefined : "_blank"}
                    rel={link.href.startsWith('mailto:') ? undefined : "noopener noreferrer"}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                    className={`group flex min-h-14 items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-3 text-white/80 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.045] ${link.color}`}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.06] bg-black/20 transition duration-300 group-hover:border-white/[0.14]">
                      <link.icon className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-semibold">{link.label}</span>
                  </motion.a>
                ))}
              </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
