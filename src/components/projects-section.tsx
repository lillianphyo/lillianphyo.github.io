'use client';

import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github } from 'lucide-react';

export function ProjectsSection() {
  const { t } = useTranslation();

  const projects = [
    {
      title: "AI Research Platform",
      description: "A comprehensive platform for machine learning research with real-time data processing and visualization capabilities.",
      technologies: ["Python", "React", "TensorFlow", "PostgreSQL"],
      githubUrl: "https://www.github.com/lillianphyo",
      liveUrl: "https://example.com",
      image: "/api/placeholder/400/250"
    },
    {
      title: "Full Stack E-commerce",
      description: "Modern e-commerce platform with payment integration, inventory management, and admin dashboard.",
      technologies: ["Next.js", "Node.js", "TypeScript", "Stripe"],
      githubUrl: "https://www.github.com/lillianphyo",
      liveUrl: "https://example.com",
      image: "/api/placeholder/400/250"
    },
    {
      title: "University Management System",
      description: "Complete university management system for students, faculty, and administration with multi-language support.",
      technologies: ["React", "Node.js", "MongoDB", "i18next"],
      githubUrl: "https://www.github.com/lillianphyo",
      liveUrl: "https://example.com",
      image: "/api/placeholder/400/250"
    },
    {
      title: "Research Data Analytics",
      description: "Advanced analytics platform for processing and visualizing research data with interactive dashboards.",
      technologies: ["Python", "D3.js", "FastAPI", "Docker"],
      githubUrl: "https://www.github.com/lillianphyo",
      liveUrl: "https://example.com",
      image: "/api/placeholder/400/250"
    }
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
            <Card key={index} className="group overflow-hidden border border-border shadow-modern-lg hover:shadow-xl transition-all duration-300 bg-card backdrop-blur-sm hover-lift focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2">
              <div className="h-56 bg-gradient-to-br from-card via-card to-card flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-foreground/10 to-foreground/10"></div>
                <div className="text-foreground text-lg font-medium relative z-10">Project Preview</div>
                <div className="absolute top-4 right-4 w-3 h-3 bg-green-400 dark:bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <CardHeader className="pb-4">
                <CardTitle className="text-xl group-hover:text-primary transition-colors">{project.title}</CardTitle>
                <CardDescription className="text-muted-foreground leading-relaxed">{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary" className="px-3 py-1 text-xs font-medium bg-foreground text-background hover:bg-foreground/90 transition-colors">
                      {tech}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" asChild className="flex-1 border-2 hover:bg-accent transition-all duration-200 btn-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2" aria-label={`View ${project.title} source code`}>
                      <Github className="h-4 w-4" />
                      {t('projects.view_code')}
                    </a>
                  </Button>
                  <Button size="sm" asChild className="flex-1 shadow-modern hover:shadow-modern-lg transition-all duration-200 btn-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2" aria-label={`View ${project.title} live project`}>
                      <ExternalLink className="h-4 w-4" />
                      {t('projects.view_project')}
                    </a>
                  </Button>
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
