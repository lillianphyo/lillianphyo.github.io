'use client';

import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type Project = {
  title: string;
  category: string;
  role: string;
  description: string;
  technologies: string[];
};

export function ProjectsSection() {
  const { t } = useTranslation();

  const projects: Project[] = [
    {
      title: "EEG Inner-Speech Classification",
      category: "PhD Research",
      role: "Saitama University",
      description:
        "Benchmark study on cross-condition transfer learning for EEG-based inner-speech decoding. Compares modern convolutional and transformer architectures (EEGNet, ShallowConvNet, DeepConvNet, EEGConformer) across overt and imagined speech conditions, with leave-one-subject-out evaluation on public datasets. Manuscript prepared for IEEE Transactions on Neural Systems and Rehabilitation Engineering.",
      technologies: ["Python", "PyTorch", "MNE-Python", "NumPy", "LaTeX"],
    },
    {
      title: "Multi-Tenant ISP Operations Platform",
      category: "Enterprise Product",
      role: "Senior Full Stack Engineer",
      description:
        "Operations and business support system for internet service providers, serving multiple operator tenants from a single deployment. Covers subscriber lifecycle, billing, provisioning, and a real-time telemetry service that ingests PPPoE session data from network equipment and aggregates usage into half-hourly, daily, and monthly analytics. Jobs run on a Redis-backed queue with strict idempotency guarantees; production monitoring is built on AWS CloudWatch with Slack alerting.",
      technologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "Redis", "BullMQ", "TypeORM", "AWS"],
    },
    {
      title: "Restaurant POS & Kitchen Display",
      category: "Product Engineering",
      role: "Full Stack Engineer",
      description:
        "Point-of-sale platform for restaurants with a web-based admin dashboard, cross-platform kitchen display (KDS), and device-bound authentication. Designed for reliability in low-connectivity environments with offline order capture and deterministic sync on reconnect. Covers menu management, order routing to stations, and end-of-day reconciliation.",
      technologies: ["React", "TypeScript", "Flutter", "Node.js", "PostgreSQL", "TypeORM"],
    },
    {
      title: "Education Chatbot for Non-Profit",
      category: "Social Impact",
      role: "Full Stack Engineer",
      description:
        "Multi-channel learning chatbot (Messenger, Viber, Telegram) delivering curricula, quizzes, and certification to users across Myanmar. Built as the primary engagement surface for a youth-empowerment non-profit, paired with an internal admin dashboard for content authoring, user support, and impact reporting.",
      technologies: ["Python", "aiohttp", "Svelte", "PostgreSQL", "NLU"],
    },
  ];

  return (
    <section id="projects" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">{t('projects.title')}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <Card
                key={index}
                className="group overflow-hidden border border-border shadow-modern-lg hover:shadow-xl transition-all duration-300 bg-card backdrop-blur-sm hover-lift focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
              >
                <div className="h-56 bg-gradient-to-br from-card via-card to-card flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-foreground/10 to-foreground/10"></div>
                  <div className="relative z-10 flex flex-col items-center gap-2 text-center px-6">
                    <span className="text-sm uppercase tracking-widest text-muted-foreground">{project.category}</span>
                    <span className="text-foreground text-lg font-medium">{project.role}</span>
                  </div>
                  <div className="absolute top-4 right-4 w-3 h-3 bg-green-400 dark:bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">{project.title}</CardTitle>
                  <CardDescription className="text-muted-foreground leading-relaxed">{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="px-3 py-1 text-xs font-medium bg-foreground text-background hover:bg-foreground/90 transition-colors"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
