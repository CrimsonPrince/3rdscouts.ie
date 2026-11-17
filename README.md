# 3rd/40th/41st Dublin — Donnybrook Scout Group (`3rdscouts.ie`)

Static website for the **3rd/40th/41st Dublin, Donnybrook Scout Group** (*"All the Red Ties"*), rebuilt with [Astro](https://astro.build) for speed, accessibility, and zero-JS-by-default performance.

## Project Structure

```text
/
├── google-apps-script/
│   └── Code.gs              # Google Apps Script Web App backend for forms
├── public/
│   ├── favicon.ico
│   ├── favicon.svg
│   └── images/              # Group logos, section crests, and photography
├── src/
│   ├── components/          # Header, Footer, Hero, SectionCard, SectionDetail
│   ├── data/
│   │   └── siteData.json    # Announcements, 7 units, section details, news, contacts
│   ├── layouts/
│   │   └── Layout.astro     # Base HTML layout, metadata, and shared styles
│   ├── pages/               # File-based Astro routes & legacy WordPress aliases
│   │   ├── index.astro
│   │   ├── about.astro      # (alias: /325-2)
│   │   ├── join-us.astro
│   │   ├── contact.astro    # (alias: /contact-us)
│   │   ├── volunteering.astro # (alias: /volunteering-with-us)
│   │   ├── our-hall.astro
│   │   └── sections/
│   │       ├── index.astro
│   │       └── [slug].astro # /sections/beavers, /cubs, /scouts, /ventures, /rovers
│   ├── styles/
│   │   └── global.css       # Brand tokens, typography, grids, buttons, and forms
│   └── utils/
│       └── mailtoForm.ts    # Client-side form validation & mailto draft helper
└── package.json
```

## Setup & Development

Requires **Node.js >= 22.23.4**.

```sh
# 1. Install dependencies
npm install

# 2. Start the development server (http://localhost:4321)
npm run dev

# Or start Astro dev in background mode:
npx astro dev --background
# Manage with: npx astro dev status | npx astro dev logs | npx astro dev stop

# 3. Build the production static site to ./dist/
npm run build

# 4. Preview the production build locally
npm run preview
```

## Updating Content & Announcements

Most recurring updates—including homepage announcements, weekly section meeting times, leader contact emails, and recent adventure highlights—are stored in [`src/data/siteData.json`](src/data/siteData.json). Edit that file and rebuild (`npm run build`) to publish updates.

## Google Sheets & Apps Script Setup (Forms)

The Youth Application, Adult Application, Scout Hall Booking, and Contact Enquiry forms can submit directly to a Google Sheet (with email notifications and automatic `mailto:` fallback):

1. Open or create a Google Sheet under your group's Google account (e.g. `apply@donnybrookleaders.com`).
2. In the Sheet, open **Extensions → Apps Script** and replace the contents of `Code.gs` with [`google-apps-script/Code.gs`](google-apps-script/Code.gs).
3. Click **Deploy → New deployment**, choose **Web app**, set:
   - **Execute as:** `Me`
   - **Who has access:** `Anyone`
4. Authorize the script when prompted and copy the deployed Web App URL (`https://script.google.com/macros/s/.../exec`).
5. Set that URL in either:
   - `.env` as `PUBLIC_APPS_SCRIPT_URL=...` (see [`.env.example`](.env.example)), or
   - [`src/data/siteData.json`](src/data/siteData.json) under `forms.appsScriptUrl`.
6. Rebuild the site (`npm run build`). Submissions will automatically create and populate the **`Youth`**, **`Adults`**, **`Hall Bookings`**, and **`Enquiries`** tabs.
