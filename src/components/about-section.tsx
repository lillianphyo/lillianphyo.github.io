'use client';

import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Briefcase, Code, MapPin } from 'lucide-react';

export function AboutSection() {
  const { t } = useTranslation();

  const skills = [
    'React', 'Node.js', 'TypeScript', 'Python', 'Machine Learning', 
    'Cloud Computing', 'Next.js', 'PostgreSQL', 'Docker', 'AWS'
  ];

  return (
    <section id="about" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">{t('about.title')}</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('about.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <Card className="border border-border shadow-modern-lg hover:shadow-xl transition-all duration-300 bg-card backdrop-blur-sm hover-lift focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 rounded-lg bg-foreground">
                    <GraduationCap className="h-6 w-6 text-background" />
                  </div>
                  {t('about.education')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground mb-4">
                  {t('about.phd')}
                </p>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{t('contact.university')}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border shadow-modern-lg hover:shadow-xl transition-all duration-300 bg-card backdrop-blur-sm hover-lift focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 rounded-lg bg-foreground">
                    <Briefcase className="h-6 w-6 text-background" />
                  </div>
                  {t('about.experience')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">
                  {t('about.senior_dev')}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border border-border shadow-modern-lg bg-card backdrop-blur-sm mb-8 hover-lift focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-lg bg-foreground">
                  <Code className="h-6 w-6 text-background" />
                </div>
                {t('about.skills')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="px-4 py-2 text-sm font-medium bg-foreground text-background hover:bg-foreground/90 transition-colors">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
