'use client';

import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type Project = {
  slug: string;
  technologies: string[];
};

export function ProjectsSection() {
  const { t } = useTranslation();

  const projects: Project[] = [
    { slug: "research", technologies: ["Python", "PyTorch", "MNE-Python", "Transformers", "NumPy"] },
    { slug: "isp", technologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "Redis", "BullMQ", "TypeORM", "AWS"] },
    { slug: "pos", technologies: ["React", "TypeScript", "Flutter", "Node.js", "PostgreSQL", "TypeORM"] },
    { slug: "chatbot", technologies: ["Python", "aiohttp", "Svelte", "PostgreSQL", "NLU"] },
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
            {projects.map((project) => (
              <Card
                key={project.slug}
                className="group overflow-hidden border border-border shadow-modern-lg hover:shadow-xl transition-all duration-300 bg-card backdrop-blur-sm hover-lift focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
              >
                <div className="h-56 bg-gradient-to-br from-card via-card to-card flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-foreground/10 to-foreground/10"></div>
                  <div className="relative z-10 flex flex-col items-center gap-2 text-center px-6">
                    <span className="text-sm uppercase tracking-widest text-muted-foreground">{t(`projects.items.${project.slug}.category`)}</span>
                    <span className="text-foreground text-lg font-medium">{t(`projects.items.${project.slug}.role`)}</span>
                  </div>
                  <div className="absolute top-4 right-4 w-3 h-3 bg-green-400 dark:bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">{t(`projects.items.${project.slug}.title`)}</CardTitle>
                  <CardDescription className="text-muted-foreground leading-relaxed">{t(`projects.items.${project.slug}.description`)}</CardDescription>
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
