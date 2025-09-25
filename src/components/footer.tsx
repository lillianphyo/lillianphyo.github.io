'use client';

import { useTranslation } from 'react-i18next';
import { Github, Linkedin, Mail, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export function Footer() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <footer className="bg-background text-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* About */}
          <div>
            <h3 className="text-2xl font-bold mb-6 gradient-text">Lillian Phyo</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {mounted ? t('about.description') : 'About description loading...'}
            </p>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
                <span>{mounted ? t('contact.location') : 'Saitama, Japan'}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Quick Links</h3>
            <div className="flex flex-col space-y-3">
              <Link href="/#about" className="text-muted-foreground hover:text-foreground transition-colors">
                {mounted ? t('nav.about') : 'About'}
              </Link>
              <Link href="/#projects" className="text-muted-foreground hover:text-foreground transition-colors">
                {mounted ? t('nav.projects') : 'Projects'}
              </Link>
              <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                {mounted ? t('nav.blog') : 'Blog'}
              </Link>
              <Link href="/#contact" className="text-muted-foreground hover:text-foreground transition-colors">
                {mounted ? t('nav.contact') : 'Contact'}
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-semibold mb-6">{mounted ? t('nav.contact') : 'Contact'}</h3>
            <div className="flex flex-col space-y-3 mb-6">
            <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>khinpyaephyosan@gmail.com</span>
              </div>
            <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{mounted ? t('contact.university') : 'Saitama University'}</span>
              </div>
            </div>
            <div className="flex gap-4">
              <Link href="https://www.github.com/lillianphyo" className="p-3 rounded-full bg-secondary hover:bg-accent transition-colors">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="https://www.linkedin.com/in/lillianphyo" className="p-3 rounded-full bg-secondary hover:bg-accent transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 Lillian Phyo. {mounted ? t('footer.rights') : 'All rights reserved.'}</p>
          <p className="mt-2">{t('footer.built_with')}</p>
        </div>
      </div>
    </footer>
  );
}
