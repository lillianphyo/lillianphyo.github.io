import { HeroSection } from '@/components/hero-section';
import { AboutSection } from '@/components/about-section';
import { ResearchSection } from '@/components/research-section';
import { ProjectsSection } from '@/components/projects-section';
import { BlogPreview } from '@/components/blog-preview';
import { ContactSection } from '@/components/contact-section';
import { getSortedPostsData } from '@/lib/blog';

export default async function Home() {
  const posts = await getSortedPostsData();

  return (
    <>
      <HeroSection />
      <AboutSection />
      <ResearchSection />
      <ProjectsSection />
      <BlogPreview posts={posts} />
      <ContactSection />
    </>
  );
}
