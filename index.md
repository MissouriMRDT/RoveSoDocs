---
layout: home

title: RoveSoDocs
titleTemplate: Documentation Hub

hero:
  name: RoveSoDocs
  text: Documentation Hub
  tagline: Guides for Today, Tomorrow, and Forever.
  image:
    src: /logo.png
    alt: VitePress

features:
  - icon: "🤖"
    title: "Autonomy Software (Doxygen)"
    details: "C++ rover autonomy stack—setup, architecture, perception + navigation notes, and testing workflows for competition readiness."
    link: /autonomy/
    linkText: "Open Autonomy Docs"
    
  - icon: "🔋"
    title: "Embedded Docs (Doxygen)"
    details: "Embedded rover firmware stack—setup, API docs, hardware bring-up, framework tutorials, tips + best practices for reliable competition-ready embedded code."
    link: /embedded/
    linkText: "Open Embedded Docs"

  - icon: "🛰️"
    title: "RoveSoSimulator (Jekyll)"
    details: "Unreal Engine 5 simulation environment for MRDT—testing with realistic scenarios, sensors, and repeatable runs."
    link: /RoveSoSimulator/_j/
    linkText: "Open Simulator Docs"

  - icon: "🛰️"
    title: "RoveSoSimulator (Doxygen)"
    details: "Unreal Engine 5 simulation environment for MRDT—testing with realistic scenarios, sensors, and repeatable runs."
    link: /RoveSoSimulator/_d/
    linkText: "Open Simulator Docs"
    
---

<style>
:root {
  --vp-home-hero-name-color: transparent;

  --vp-home-hero-name-background: -webkit-linear-gradient(
    120deg,
    #7a0016 0%,
    #b00020 40%,
    #0b1220 92%
  );

  --vp-home-hero-image-background-image:
    radial-gradient(560px circle at 78% 32%, rgba(153, 0, 0, 0.22) 0%, rgba(153, 0, 0, 0) 72%),
    linear-gradient(-45deg, #f6f8fb 0%, #e9eef5 55%, #dde6f2 100%);

  --vp-home-hero-image-filter: blur(36px);
}

/* Dark mode overrides */
html.dark {
  --vp-home-hero-name-background: -webkit-linear-gradient(
    120deg,
    #b00020 10%,
    #e14b4b 45%,
    #e9eef2 95%
  );

  --vp-home-hero-image-background-image:
    radial-gradient(560px circle at 78% 32%, rgba(153, 0, 0, 0.40) 0%, rgba(153, 0, 0, 0) 72%),
    linear-gradient(-45deg, #05070D 0%, #0B1220 55%, #121824 100%);

  --vp-home-hero-image-filter: blur(44px);
}

@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px);
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(68px);
  }
}

/* Always 2 columns for the homepage feature cards (except small screens) */
.VPHome .VPFeatures {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

/* On phones, switch to 1 column */
@media (max-width: 639px) {
  .VPHome .VPFeatures {
    grid-template-columns: 1fr;
  }
}
</style>
