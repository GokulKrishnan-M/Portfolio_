import { Download } from 'lucide-react';
import { CustomCursor } from '@/components/CustomCursor';
import { InteractiveGridBackground } from '@/components/InteractiveGridBackground';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';

const resumeUrl = '/PDF/Gokul%20Krishnan%20M%20-%20CV.pdf';

const Resume = () => {
  return (
    <div className="min-h-screen animated-bg bg-black text-white">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_18%_20%,rgba(34,211,238,0.12),transparent_30%),radial-gradient(circle_at_82%_12%,rgba(167,139,250,0.11),transparent_28%),linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.9))]" />
      <InteractiveGridBackground />
      <CustomCursor />
      <Navigation />

      <main className="relative min-h-screen overflow-hidden px-4 pb-10 pt-24 sm:px-6">
        <div className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(circle_at_50%_48%,transparent_0%,rgba(0,0,0,0.04)_36%,rgba(0,0,0,0.5)_100%)]" />
        <section className="relative z-10 mx-auto flex min-h-[calc(100vh-8.5rem)] max-w-6xl items-center justify-center">
          <div className="relative mx-auto aspect-[210/297] h-[calc(100vh-9.5rem)] max-h-[980px] min-h-[560px] w-auto overflow-hidden rounded-sm bg-white shadow-[0_32px_100px_-42px_rgba(34,211,238,0.7),0_0_0_1px_rgba(255,255,255,0.14)]">
            <object
              title="Gokul Krishnan M CV paper preview"
              data={`${resumeUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
              type="application/pdf"
              className="h-full w-full"
            >
              <iframe
                title="Gokul Krishnan M CV paper preview fallback"
                src={`${resumeUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                className="h-full w-full bg-white"
              />
            </object>
          </div>
        </section>

        <Button
          className="glass fixed right-24 top-[1.9rem] z-30 h-10 rounded-full bg-gradient-primary px-4 text-primary-foreground shadow-[0_18px_45px_-24px_rgba(34,211,238,0.9)] max-sm:right-20"
          asChild
        >
          <a href={resumeUrl} download>
            <Download className="mr-2 h-4 w-4" />
            Download CV
          </a>
        </Button>
      </main>
    </div>
  );
};

export default Resume;
