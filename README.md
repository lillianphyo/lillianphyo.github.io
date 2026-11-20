# Lillian Phyo - Portfolio Website

A modern, multilingual portfolio website built with Next.js, TypeScript, and shadcn/ui. Features internationalization support for English, Burmese, and Japanese languages.

## Features

- 🌍 **Multilingual Support**: English, Burmese (မြန်မာ), and Japanese (日本語)
- 🎨 **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- 📱 **Responsive Design**: Optimized for all device sizes
- 🧠 **Brain Explorer**: Interactive 3D brain with speech and language regions in the Research section
- 📝 **Blog System**: Markdown-based blog with dynamic routing
- 🚀 **GitHub Pages Ready**: Configured for easy deployment
- ⚡ **Performance**: Built with Next.js 15 and optimized for speed

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Internationalization**: i18next
- **Content**: Markdown with gray-matter
- **Deployment**: GitHub Pages

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/lillianphyo/lillianphyo.github.io.git
cd lillianphyo.github.io
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tests

```bash
npm test
npm run test:coverage
```

## Brain Explorer

The Research section shows a 3D brain (`src/components/brain/`). Regions and sources are data in `src/lib/brain-regions.ts`. The listen, plan, speak story is in `src/lib/speech-story.ts`. Papers are in `src/lib/publications.ts`. Text is in `src/locales/*.json`.

The model `public/models/brain-dk.glb` is built from the Desikan-Killiany pial meshes of [Brain for Blender](https://brainder.org/research/brain-for-blender/) by Anderson Winkler. The meshes and this derived model are licensed under [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/).

To rebuild it, download and unpack `pial_DK_obj.tar.bz2` from that page, then run:

```bash
node scripts/build-brain-model.mjs path/to/pial_DK_obj
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── blog/              # Blog pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── about-section.tsx
│   ├── blog-preview.tsx
│   ├── contact-section.tsx
│   ├── footer.tsx
│   ├── hero-section.tsx
│   ├── language-switcher.tsx
│   ├── navigation.tsx
│   └── projects-section.tsx
├── content/              # Markdown content
│   └── blog/            # Blog posts
├── lib/                 # Utility functions
│   ├── blog.ts         # Blog utilities
│   ├── i18n.ts         # i18n configuration
│   └── utils.ts        # General utilities
└── locales/            # Translation files
    ├── en.json         # English translations
    ├── my.json         # Burmese translations
    └── ja.json         # Japanese translations
```

## Adding Blog Posts

1. Create a new markdown file in `src/content/blog/`
2. Add frontmatter with required fields:
```markdown
---
title: "Your Post Title"
date: "2024-01-15"
excerpt: "Brief description of your post"
author: "Lillian Phyo"
tags: ["tag1", "tag2", "tag3"]
---

# Your Post Content

Write your blog post content here in markdown...
```

## Deployment to GitHub Pages

### Automatic Deployment

The repository is configured with GitHub Actions for automatic deployment:

1. Push your changes to the `main` branch
2. GitHub Actions will automatically build and deploy to GitHub Pages
3. Your site will be available at `https://yourusername.github.io/portfolio-website`

### Manual Deployment

1. Build the project:
```bash
npm run build
```

2. The static files will be generated in the `out` directory
3. Deploy the `out` directory to your hosting provider

## Customization

### Adding New Languages

1. Create a new translation file in `src/locales/` (e.g., `fr.json` for French)
2. Add the language to the `languages` array in `src/components/language-switcher.tsx`
3. Update the i18n configuration in `src/lib/i18n.ts`

### Modifying Content

- **Personal Information**: Update the translation files in `src/locales/`
- **Projects**: Modify the `projects` array in `src/components/projects-section.tsx`
- **Skills**: Update the `skills` array in `src/components/about-section.tsx`
- **Contact Information**: Update contact details in `src/components/contact-section.tsx` and `src/components/footer.tsx`

### Styling

The project uses Tailwind CSS for styling. You can:
- Modify the color scheme in `tailwind.config.ts`
- Add custom styles in `src/app/globals.css`
- Customize shadcn/ui components in `src/components/ui/`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

- **Email**: lillian.phyo@example.com
- **University**: Saitama University
- **Location**: Saitama, Japan

---

Built with ❤️ using Next.js, TypeScript, and shadcn/ui