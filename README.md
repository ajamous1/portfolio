# Ahmad Jamous Portfolio

A modern portfolio website built with Next.js and TypeScript featuring a toggle between Developer and Designer modes.

## Features

- 🔄 Interactive toggle between Developer and Designer content
- 📱 Responsive design
- ⚡ Built with Next.js 14 and TypeScript
- 🎨 Clean, modern UI matching the provided mockup
- ♿ Accessible with keyboard navigation support

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── components/
│   │   └── ToggleSwitch.tsx    # Reusable toggle component
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Main page component
├── package.json
├── tsconfig.json
└── next.config.js
```

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better developer experience
- **CSS3** - Custom styling with smooth transitions
- **React Hooks** - State management with useState

## Toggle Functionality

The website features a smooth toggle switch that alternates between:
- **Developer Mode**: Blue theme with development-focused content
- **Designer Mode**: Orange theme with design-focused content

Content changes include different About text and Projects lists while maintaining the same overall layout structure. 