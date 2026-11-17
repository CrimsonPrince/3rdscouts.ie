# Role & Goal
You are an expert Frontend Developer and Astro specialist. Your task is to rewrite and modernize the website for the 3rd Donnybrook Scout Group (https://3rdscouts.ie) into a minimal, high-performance static site built using **Astro**.

# Project Context
- **Current Site:** https://3rdscouts.ie (WordPress / Flatsome theme)
- **Target Framework:** Astro (latest version)
- **Architecture Goal:** A fast, SEO-friendly, zero-JS-by-default static site with clean layout patterns.

# Design & Style Requirements
- **Fidelity & Modernization:** Preserve the structural layout and content hierarchy of the existing site, but elevate the visual presentation with modern typography, refined spacing, and subtle styling improvements (clean card components, accessible buttons, and consistent padding).
- **Branding:** Maintain a clean, outdoor-friendly scouting aesthetic, subtly incorporating thematic touches (such as accent colors matching their "All the Red Ties" identity).
- **Responsiveness:** Fully mobile-first and responsive layout across all breakpoints.

# Scope & Core Pages to Implement
1. **Home Page (`index.astro`):** 
   - Hero section highlighting the group identity and upcoming events/announcements.
   - Quick overview of active sections (Beavers, Cubs, Scouts, Ventures).
   - Call-to-action (CTA) for joining or volunteering.
2. **About Us Page (`about.astro`):** 
   - Group history (founded in 1927, centenary milestones, catchment areas in Dublin 4 and 6).
3. **Sections Page & Subpages (`sections/`):** 
   - Details for each active section (meeting times, locations, contact emails for leaders).
4. **Join Us / Contact Pages (`join-us.astro`, `contact.astro`):** 
   - Information on waiting lists, application requirements, and direct contact details/forms.

# Technical Specifications
- **Project Structure:** Use standard Astro conventions (`src/layouts/Layout.astro`, `src/components/`, `src/pages/`).
- **Styling:** Use Tailwind CSS (or scoped CSS modules if preferred, but keep styling modular and easy to maintain).
- **Content:** Structure dynamic text or announcements using Markdown/MDX frontmatter or clean local JSON files where appropriate to make future updates easy.

# Deliverables
1. **Project Layout & Components:** Provide reusable layout wrappers, navigation header, footer, and section cards.
2. **Page Templates:** Fully coded Astro pages for the main routes.
3. **Setup Guide:** Brief instructions on how to install dependencies, run the development server (`npm run dev`), and build for production (`npm run build`).



## Project Purpose

To rewrite the 3rd Donnybrook Scouts Website (https://3rdscouts.ie) in astro.
The desire is to have a minimal, static site.

The design should be copied from the exisitng site, however improvements to the style are allowed without much changes. The design should be coherent and similar to what is in the current default page in the repository.


## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
