# HomeForge AI — Build Before You Build

A premium, futuristic landing site for a 3D interactive house design and visualization platform. The experience presents HomeForge AI as a digital showroom where users can design, preview, estimate, and export dream home concepts before construction begins.

## Features

- Dark luxury architecture-tech theme with glassmorphism UI
- Animated CSS 3D house preview with selectable camera angles
- Product concept, module showcase, workflow, AI assistant, builder MVP, and pricing sections
- Responsive layout for desktop, tablet, and mobile
- Zero runtime dependencies for simple static deployment
- Docker, Netlify, and static `dist/` deployment support

## Development

```bash
npm run dev
```

Open <http://localhost:3000>.

## Build

```bash
npm run build
npm start
```

The production site is generated in `dist/` and served at <http://localhost:3000>.

## Checks

```bash
npm run check
```

## Deployment

### Static hosting

Run `npm run build`, then deploy the generated `dist/` folder to any static host.

### Netlify

The included `netlify.toml` builds with `npm run build` and publishes `dist/`.

### Docker

```bash
docker build -t homeforge-ai .
docker run --rm -p 3000:3000 homeforge-ai
```
