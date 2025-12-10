# CLAUDE.md - Personal Website Codebase Guide

This document provides comprehensive guidance for AI assistants working on this personal portfolio website. It covers the codebase structure, development workflows, and key conventions to follow.

## Project Overview

This is a personal portfolio website for Iris Mu, showcasing both Computer Science and Music Production projects. The site features:
- **Unified vertical scrolling**: All CS and Music projects on one continuous scrollable page
- **Snap-to-section navigation**: Scroll-based navigation with smooth transitions and 100px threshold
- **Dual-theme interface**: CS and Music themes with dynamic color transitions based on current project
- **Project selector**: Bottom-aligned navigation for quick project access and tab switching
- **Visual effects**: Fluid particle simulation with theme-reactive colors (blue/cyan for CS, purple/magenta for Music)
- **Audio spectrum visualizer**: Real-time horizontal frequency spectrum with responsive bar widths
- **Audio playback**: Custom full-width audio player with auto-pause when scrolling away
- **Responsive design**: All components adapt to screen size

## Tech Stack

### Core Technologies
- **React 18.3.1**: UI framework with hooks and functional components
- **TypeScript 5.4.5**: Type-safe development with strict mode enabled
- **Vite 5.3.1**: Fast build tool and dev server
- **Tailwind CSS 3.4.4**: Utility-first CSS framework with custom design tokens

### UI Libraries
- **Radix UI**: Accessible, unstyled component primitives (extensive collection)
- **shadcn/ui**: Pre-built accessible components (see `Attributions.md`)
- **Lucide React**: Icon library
- **Framer Motion 11.2.10**: Animation library

### Additional Dependencies
- **react-h5-audio-player**: Audio playback component
- **embla-carousel-react**: Carousel functionality
- **class-variance-authority (CVA)**: Component variant management
- **tailwind-merge**: Tailwind class merging utility
- **clsx**: Conditional class name utility
- **zod**: Schema validation

## Codebase Structure

```
/
├── App.tsx                    # Root application component
├── main.tsx                   # Application entry point
├── index.html                 # HTML template
├── package.json               # Dependencies and scripts
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript configuration
├── tailwind.config.js        # Tailwind configuration
├── postcss.config.js         # PostCSS configuration
│
├── components/               # React components
│   ├── CredentialsSection.tsx    # Header with profile info
│   ├── ProjectSelector.tsx       # Tab switcher and project selector
│   ├── SingleCSProject.tsx       # Individual CS project display
│   ├── SingleMusicProject.tsx    # Individual music project with visualizer
│   │
│   ├── figma/                    # Figma-related components
│   │   └── ImageWithFallback.tsx
│   │
│   └── ui/                       # shadcn/ui components (30+ components)
│       ├── button.tsx
│       ├── card.tsx
│       ├── tabs.tsx
│       ├── carousel.tsx
│       ├── particles.tsx         # Custom particle background
│       ├── fluid-particles.tsx   # Navier-Stokes fluid simulation background
│       ├── audio-spectrum.tsx    # Horizontal audio spectrum visualizer
│       ├── skeleton.tsx
│       └── ...
│
├── data/
│   └── projects.ts           # CS and Music project data with metadata
│
├── styles/
│   └── globals.css           # Global styles, CSS variables, theme tokens
│
├── public/
│   └── assets/
│       └── profile_pic.png   # Profile picture
│
├── guidelines/
│   └── Guidelines.md         # Design system guidelines (template)
│
├── Attributions.md           # Third-party attribution notices
└── CLAUDE.md                 # This file
```

## Development Workflows

### Available Scripts
```bash
npm run dev       # Start development server (Vite)
npm run build     # Production build
npm run preview   # Preview production build locally
```

### Git Workflow
- **Commit style**: Concise, descriptive messages (see git log)
  - Examples: "Replace 3D fountain with horizontal audio spectrum visualizer", "Adjust music tab styling", "Add content"
- Always commit meaningful changes with clear messages
- Push to the specified claude/* branch using `git push -u origin <branch-name>`

### Build & Development
- Vite provides fast hot module replacement (HMR)
- TypeScript is configured with strict mode
- All paths use `@/` alias (maps to project root)

## Code Organization & Conventions

### TypeScript Configuration
- **Strict mode**: Enabled with all strict checks
- **Module resolution**: Bundler mode (Vite-optimized)
- **Path aliases**: `@/*` maps to `./*` (project root)
- **Unused code**: Errors on unused locals and parameters
- **Target**: ES2020

### Component Structure

#### Naming Conventions
- **Components**: PascalCase (e.g., `CredentialsSection`, `ProjectSelector`, `SingleMusicProject`)
- **Files**: Match component name with `.tsx` extension
- **Props interfaces**: Suffix with `Props` (e.g., `SingleMusicProjectProps`)

#### Component Pattern
```typescript
// 1. Imports
import { useState } from "react";
import { ComponentName } from "./path";

// 2. Props interface
interface ComponentNameProps {
  activeTab: "cs" | "music";
  setActiveTab: (tab: "cs" | "music") => void;
}

// 3. Component export
export function ComponentName({ activeTab, setActiveTab }: ComponentNameProps) {
  // 4. State and hooks
  const [state, setState] = useState<Type>(initialValue);

  // 5. Event handlers
  const handleEvent = (e: React.MouseEvent) => {
    // handler logic
  };

  // 6. Return JSX
  return (
    <div className="...">
      {/* component content */}
    </div>
  );
}
```

### State Management
- **Local state**: `useState` for component-level state
- **Prop drilling**: Used for the dual-theme system (`activeTab` state)
- **No global state**: Currently no Redux/Zustand/Context (simple app)

### Type Safety
- Always define prop interfaces
- Use TypeScript unions for fixed sets (e.g., `"cs" | "music"`)
- Leverage type inference where appropriate
- No `any` types - use proper typing

## Styling Conventions

### Tailwind CSS
The project uses Tailwind with a custom design system defined in `styles/globals.css`.

#### Design Tokens
```css
/* CSS variables for colors, spacing, etc. */
:root {
  --font-size: 16px;
  --radius: 0.625rem;
  /* Color tokens using oklch() */
  --background, --foreground, --primary, etc.
}

.dark {
  /* Dark theme overrides */
}
```

#### Theme System
- **Two themes**: CS (slate-950/slate-900) and Music (purple-950/purple-900)
- **Dynamic backgrounds**: Applied via conditional classes on root div
- **Transition**: `duration-700` for smooth theme changes
- **Color system**: Uses CSS variables mapped through Tailwind config

#### Class Naming Patterns
```tsx
// Conditional classes with template literals
className={`base-classes ${condition ? "conditional-classes" : "alternative-classes"}`}

// Dynamic theme-based styling
className={activeTab === "cs" ? "bg-slate-950" : "bg-purple-950"}

// Utility helpers
import { cn } from "@/lib/utils";
className={cn("base", conditional && "extra")}
```

#### Custom Animations
- **Ripple effect**: Global click animation (defined in App.tsx and globals.css)
- **Particle background**: Custom component with animated particles
- **Shooting stars**: Custom SVG-based animation component
- **Tailwind Animate**: Plugin for built-in animations

### Component Styling Best Practices
1. Use Tailwind utilities first (avoid custom CSS when possible)
2. Leverage design tokens from `globals.css`
3. Follow responsive-first approach (`sm:`, `md:`, `lg:` breakpoints)
4. Use semantic color variables (not hard-coded colors)
5. Apply consistent spacing using Tailwind scale

## Key Features & Patterns

### 1. Dual-Theme System
The entire app toggles between two themes based on `activeTab` state, with dynamic particle color transitions:
```typescript
const [activeTab, setActiveTab] = useState<"cs" | "music">("cs");

// Fluid particle colors change based on active tab
<FluidParticles
  hueMin={activeTab === "cs" ? 180 : 270}
  hueMax={activeTab === "cs" ? 240 : 330}
  lightness={activeTab === "cs" ? 60 : 75}
/>
```

- **CS theme**: Blue/cyan particles (hue 180-240, lightness 60%)
- **Music theme**: Purple/magenta particles (hue 270-330, lightness 75%)

### 2. Unified Project Navigation
The app uses a vertical scrolling layout with all projects on one continuous page:

**Unified Project List:**
- All CS and Music projects combined into single array: `[CS1, CS2, Music1, Music2, ...]`
- Projects laid out vertically, each taking full viewport height
- Current project determines active tab and particle theme colors

**Scroll-Based Navigation:**
- Accumulates scroll delta (wheel events)
- When delta exceeds 100px, auto-scrolls to next/previous project
- Uses `scrollIntoView({ behavior: "smooth" })` for seamless transitions
- 700ms cooldown prevents rapid-fire scrolling during transitions

**Click Navigation:**
- Bottom-aligned `ProjectSelector` (left-aligned text, px-8 padding)
- Click project titles to jump directly to any project
- Click CS/Music tabs to jump to first project of that type
- Shows only projects of current active type in selector

**Audio Management:**
- Each music project registers its audio element via callback
- Audio elements tracked in Map by project ID
- Auto-pause audio when scrolling away from music projects
- Ensures only one audio plays at a time

```typescript
const unifiedProjects = [
  ...csProjects.map((p) => ({ ...p, type: "cs" as const })),
  ...musicProjects.map((p) => ({ ...p, type: "music" as const })),
];

const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
const audioElementsRef = useRef<Map<string, HTMLAudioElement>>(new Map());
```

### 3. Project Component Layout
Both `SingleCSProject` and `SingleMusicProject` use a vertical-centered layout:

**Structure:**
- Top spacer div (`h-32 flex-shrink-0`) to avoid overlap with credentials section
- Flex-1 centered container wraps all content
- Content is vertically centered within available space
- All text uses left alignment with `px-8` padding

```typescript
<div className="h-full w-full flex flex-col pointer-events-none">
  {/* Spacer for top credentials section */}
  <div className="h-32 flex-shrink-0" />

  {/* Centered content area */}
  <div className="flex-1 flex items-center justify-center">
    <div className="w-full pointer-events-auto pb-32">
      {/* Project content: title, tags, description, media */}
    </div>
  </div>
</div>
```

### 4. Audio Spectrum Visualizer
Implemented in `components/ui/audio-spectrum.tsx`:
- **Real-time frequency analysis**: Uses Web Audio API with AnalyserNode (FFT size: 2048)
- **Responsive layout**: Bars span full page width, automatically adapting to screen size
- **Bottom-aligned bars**: Bars grow upward from a baseline with configurable bottom margin
- **Parametrizable**:
  - `barCount`: Number of frequency bars (default: 64, typically 128-256)
  - `minFrequency` / `maxFrequency`: Frequency range (20 Hz - 20 kHz)
  - `smoothing`: Audio smoothing constant (0-1, default: 0.75)
  - `amplification`: Loudness multiplier (default: 1.5)
  - `color` / `lineColor`: Bar and connecting line colors (RGBA strings)
  - `maxHeight`: Maximum canvas height (default: 400px)
  - `bottomMargin`: Space below bars (default: 50px)
- **Linear frequency mapping**: Equal frequency spacing across all bars
- **Responsive bar widths**: Bar width and gap calculated from `barCount` and screen width
  - Available width divided evenly by bar count
  - Gap is 25% of total bar width, bar is 75%
- **Connecting line**: Drawn between bar bottom points
- Integrates with `react-h5-audio-player` audio element

```typescript
<AudioSpectrum
  audioElement={audioElement}
  barCount={256}
  minFrequency={20}
  maxFrequency={20000}
  smoothing={0.75}
  amplification={1.5}
  maxHeight={400}
  bottomMargin={50}
/>
```

### 5. Interactive Effects

#### Fluid Particle Background
- `FluidParticles` component: Navier-Stokes fluid simulation
- Creates dynamic, swirling particle effects
- 30,000+ particles following fluid dynamics with trail particle spawning
- **Theme-reactive colors**: Changes hue and lightness based on active tab
  - `hueMin` / `hueMax`: HSL hue range (0-360)
  - `lightness`: HSL lightness percentage (0-100)
  - CS tab: Blue/cyan tones (180-240 hue, 60% lightness)
  - Music tab: Purple/magenta tones (270-330 hue, 75% lightness)
- Particles reinitialize when color parameters change
- Uses `pointer-events-none` to prevent interaction blocking

```typescript
<FluidParticles
  hueMin={270}
  hueMax={330}
  lightness={75}
/>
```

### 6. Custom Audio Player
Heavily customized `react-h5-audio-player` with two CSS variants in `globals.css`:

**Full-Width Layout** (`.custom-audio-player-fullwidth`):
- **Horizontal-reverse layout**: Progress bar at bottom, controls above
- **Full width**: Spans 100% of screen width
- **Custom control arrangement**:
  - Left side: Current time, loop, rewind, play/pause, forward
  - Flex spacer pushes controls to edges
  - Right side: Volume, duration
- **Zero gap**: Progress bar sits directly above spectrum visualizer
- Uses `customControlsSection` and `customProgressBarSection` arrays

**Minimal Layout** (`.custom-audio-player-minimal`):
- Two-row flex layout
- Progress bar on first row, controls centered on second row
- More compact design for smaller contexts

Both variants share common styles via grouped selectors:
- Purple/pink gradient progress bars
- Custom button hover states
- Transparent backgrounds
- Consistent spacing and sizing

## UI Component Library

### shadcn/ui Components
The `components/ui/` directory contains 30+ pre-built components from shadcn/ui:
- **Layout**: Card, Separator, Accordion, Tabs, Collapsible, Sheet
- **Forms**: Button, Input, Select, Checkbox, Switch, Label
- **Overlays**: Dialog, Alert Dialog, Popover, Dropdown Menu, Hover Card
- **Navigation**: Breadcrumb, Navigation Menu, Menubar, Sidebar
- **Feedback**: Alert, Progress, Skeleton, Toast (Sonner)
- **Data**: Calendar, Command, Table, Chart (Recharts)
- **Media**: Avatar, Carousel (Embla)
- **Custom**: Particles, Fluid Particles, Audio Spectrum

### Using UI Components
```typescript
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// Usage with variants
<Button variant="default" size="lg">Click me</Button>
```

## File Import Paths

Use the `@/` alias for all imports:
```typescript
// ✅ Correct
import { Button } from "@/components/ui/button";
import App from "@/App";

// ❌ Avoid relative paths from root
import { Button } from "./components/ui/button";
```

## Development Guidelines for AI Assistants

### When Making Changes

1. **Read before modifying**: Always read the file first to understand context
2. **Preserve existing patterns**: Match the codebase's style and conventions
3. **Type safety**: Maintain strict TypeScript typing
4. **Responsive design**: Ensure changes work on mobile and desktop
5. **Theme consistency**: Consider both CS and Music theme appearances
6. **Performance**: Avoid unnecessary re-renders or heavy computations

### Common Tasks

#### Adding a New Component
1. Create file in appropriate directory (`components/` or `components/ui/`)
2. Define TypeScript interface for props
3. Use functional component pattern with proper types
4. Import and use Tailwind utilities
5. Export as named export

#### Modifying Styles
1. Check if design tokens exist in `globals.css`
2. Use Tailwind utilities over custom CSS
3. Consider both theme states
4. Maintain responsive breakpoints
5. Test transitions and animations

#### Working with State
1. Keep state as local as possible
2. Use proper TypeScript types for state
3. Prefer `useState` over complex state management
4. Consider prop drilling for shared state (e.g., `activeTab`)

#### Adding Dependencies
1. Use npm for package management
2. Update `package.json` via `npm install`
3. Verify TypeScript types (add `@types/package` if needed)
4. Update this CLAUDE.md if it's a significant addition

### Code Quality Standards

- **No `any` types**: Always use proper TypeScript types
- **Strict mode**: All strict TypeScript checks must pass
- **No unused code**: Remove unused imports, variables, and functions
- **Accessible**: Follow ARIA best practices (Radix UI helps)
- **Semantic HTML**: Use appropriate HTML elements
- **Performance**: Optimize images, lazy load when appropriate

### Common Pitfalls to Avoid

1. **Breaking theme system**: Always consider both `cs` and `music` themes
2. **Hardcoded colors**: Use CSS variables and Tailwind tokens
3. **Pointer events**: Remember particles use `pointer-events-none`
4. **Import paths**: Don't mix `@/` and relative imports
5. **Type safety**: Don't bypass TypeScript errors with `as any`
6. **Mobile responsiveness**: Test on various screen sizes
7. **CSS specificity**: Avoid `!important` unless absolutely necessary
8. **Audio context**: Web Audio API requires user interaction to start; handle accordingly

## Attributions & Licenses

See `Attributions.md` for third-party attribution:
- **shadcn/ui**: MIT License
- **Unsplash photos**: Unsplash License

When adding new third-party resources, update `Attributions.md` accordingly.

## Project Context

This is a personal portfolio website showcasing:
- Computer Science projects (games, algorithms, web apps)
- Music production work (original compositions, audio files)

The owner is **Iris Mu**, a student studying Computer Science and Music Production. Contact info is in the header (`CredentialsSection.tsx`).

## Questions or Issues?

When uncertain about:
- **Design decisions**: Check existing patterns in similar components
- **Styling**: Refer to `globals.css` and `tailwind.config.js`
- **Components**: Look at `components/ui/` for reusable UI primitives
- **Types**: Check prop interfaces and TypeScript config
- **Build issues**: Check Vite and TypeScript configurations

Always prioritize consistency with existing code over introducing new patterns unless there's a clear improvement.

---

**Last updated**: 2025-12-10
**Codebase version**: Unified vertical scrolling layout with snap-to-section navigation, centered project components, and auto-pause audio
