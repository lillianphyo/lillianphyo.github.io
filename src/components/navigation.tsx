'use client';

import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from './language-switcher';
import { ThemeToggle } from './theme-toggle';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Navigation() {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { key: 'home', href: '/' },
    { key: 'about', href: '/#about' },
    { key: 'projects', href: '/#projects' },
    { key: 'blog', href: '/blog' },
    { key: 'contact', href: '/#contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/90 backdrop-blur-md border-b border-border shadow-modern">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold gradient-text">
            Lillian Phyo
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    className="text-sm font-medium text-foreground hover:text-foreground transition-colors relative group link-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-2 py-1"
                  >
                    {mounted ? t(`nav.${item.key}`) : item.key}
                    <span className="absolute -bottom-1 left-2 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-[calc(100%-1rem)]"></span>
                  </Link>
            ))}
            <LanguageSwitcher />
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border py-4 bg-background/95 backdrop-blur-md">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className="text-sm font-medium text-foreground hover:text-foreground transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {mounted ? t(`nav.${item.key}`) : item.key}
                </Link>
              ))}
              <div className="pt-4 border-t border-border flex items-center justify-between">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
