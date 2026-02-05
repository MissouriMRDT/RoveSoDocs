---
layout: home

title: RoveSoDocs
titleTemplate: Vite & Vue Powered Static Site Generator

hero:
  name: RoveSoDocs
  text: Documentation Hub
  tagline: Guides for Today, Tomorrow, and Forever.
  image:
    src: logo.png
    alt: VitePress

features:
  - icon: "🛰️"
    title: "RoveSoSimulator"
    details: "Unreal Engine 5 simulation environment for MRDT—testing with realistic scenarios, sensors, and repeatable runs."
    link: https://docs.themrdt.org/RoveSoSimulator/
    linkText: "Open Simulator Docs"

  - icon: "🤖"
    title: "Autonomy Software"
    details: "C++ rover autonomy stack—setup, architecture, perception + navigation notes, and testing workflows for competition readiness."
    link: https://docs.themrdt.org/autonomy/
    linkText: "Open Autonomy Docs"
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  /* --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #dd3232ff 30%, #bfd4dbff); */

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
</style>