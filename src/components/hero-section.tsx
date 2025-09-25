'use client';

import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Mail, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export function HeroSection() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-background"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-card/20 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-card/20 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-card/20 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card backdrop-blur-sm border border-border shadow-modern mb-8 animate-fade-in-up">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-foreground">
              {mounted ? t('hero.available') : 'Available for opportunities'}
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in-up delay-200">
            <span className="gradient-text">
              {mounted ? t('hero.title') : "Hi, I'm Lillian Phyo"}
            </span>
          </h1>
          
          <h2 className="text-2xl md:text-3xl text-foreground mb-8 font-medium animate-fade-in-up delay-300">
            {mounted ? t('hero.subtitle') : 'PhD Student & Senior Full Stack Developer'}
          </h2>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-400">
            {mounted ? t('hero.description') : 'Passionate about research and development, creating innovative solutions that bridge academia and industry.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-fade-in-up delay-500">
            <Button asChild size="lg" className="h-14 px-8 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-modern-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Link href="/#projects">
                {mounted ? t('hero.cta') : 'View My Work'}
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="h-14 px-8 text-lg font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105">
              <Link href="/#contact">
                {mounted ? t('nav.contact') : 'Contact'}
              </Link>
            </Button>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-8 mb-16 animate-fade-in-up delay-600">
            <Link 
              href="https://www.github.com/lillianphyo" 
              className="group p-4 rounded-full bg-card backdrop-blur-sm border border-border shadow-modern hover:shadow-modern-lg hover:scale-110 hover:-translate-y-1 btn-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-300"
              aria-label="GitHub Profile"
            >
              <Github className="h-6 w-6 text-foreground group-hover:text-primary transition-colors" />
            </Link>
            <Link 
              href="https://www.linkedin.com/in/lillianphyo" 
              className="group p-4 rounded-full bg-card backdrop-blur-sm border border-border shadow-modern hover:shadow-modern-lg hover:scale-110 hover:-translate-y-1 btn-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-300"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="h-6 w-6 text-foreground group-hover:text-primary transition-colors" />
            </Link>
            <Link 
              href="mailto:khinpyaephyosan@gmail.com" 
              className="group p-4 rounded-full bg-card backdrop-blur-sm border border-border shadow-modern hover:shadow-modern-lg hover:scale-110 hover:-translate-y-1 btn-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-300"
              aria-label="Send Email"
            >
              <Mail className="h-6 w-6 text-foreground group-hover:text-primary transition-colors" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
