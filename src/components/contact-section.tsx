'use client';

import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MapPin, Send } from 'lucide-react';
import { useState } from 'react';

export function ContactSection() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio Contact from ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    );
    const mailto = `mailto:khinpyaephyosan@gmail.com?subject=${subject}&body=${body}`;

    try {
      window.location.href = mailto;
    } catch {
      // Fallback for environments where mailto navigation may be blocked
      window.open(mailto, '_blank');
    }

    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">{t('contact.title')}</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('contact.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="border border-border shadow-modern-lg bg-card backdrop-blur-sm hover-lift focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2">
                <CardHeader>
                  <CardTitle className="text-2xl">Get in Touch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-card hover:bg-accent transition-colors">
                      <div className="p-2 rounded-lg bg-foreground">
                        <Mail className="h-5 w-5 text-background" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Email</p>
                        <p className="text-foreground">khinpyaephyosan@gmail.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-card hover:bg-accent transition-colors">
                      <div className="p-2 rounded-lg bg-foreground">
                        <MapPin className="h-5 w-5 text-background" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Location</p>
                        <p className="text-foreground">{t('contact.location')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-card hover:bg-accent transition-colors">
                      <div className="p-2 rounded-lg bg-foreground">
                        <MapPin className="h-5 w-5 text-background" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">University</p>
                        <p className="text-foreground">{t('contact.university')}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <Card className="border border-border shadow-modern-lg bg-card backdrop-blur-sm hover-lift focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2">
              <CardHeader>
                <CardTitle className="text-2xl">Send Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2 text-foreground">
                      {t('contact.name')}
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="border-2 focus:border-primary transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2 text-foreground">
                      {t('contact.email')}
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="border-2 focus:border-primary transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2 text-foreground">
                      {t('contact.message')}
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      required
                      className="border-2 focus:border-primary transition-colors"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full h-12 text-lg font-semibold shadow-modern-lg hover:shadow-xl transition-all duration-300 btn-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                    <Send className="h-5 w-5 mr-2" />
                    {t('contact.send')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
