import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'en-US',
  title: "RoveSoDocs",
  description: "Documentation Hub for the Missouri S&T Mars Rover Design Team",

  // --- Head Array for SEO, Favicons, and Theming ---
  head: [
    ['meta', { charset: 'utf-8' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    ['meta', { name: 'description', content: 'Documentation Hub for the Missouri S&T Mars Rover Design Team' }],
    ['meta', { name: 'theme-color', content: '#A50303' }], // Example: Using a deep red/maroon for MRDT
    
    // Favicons - ensure these files exist in your `docs/public` directory
    ['link', { rel: 'icon', href: '/logo.png' }],
    ['link', { rel: 'apple-touch-icon', href: '/logo.png' }],
    ['link', { rel: 'mask-icon', href: '/logo.png', color: '#A50303' }],
  ],

  // --- Clean URLs for Nicer Paths ---
  cleanUrls: true,

  themeConfig: {

    // --- Edit Link for Collaboration ---
    editLink: {
      pattern: 'https://github.com/MissouriMRDT/RoveSoDocs/edit/development/:path', // Adjust 'main' if your default branch is different
      text: 'Edit this page on GitHub'
    },

    // --- Last Updated Timestamp ---
    lastUpdated: {
      text: 'Last Updated',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short'
      }
    },

    // --- Footer for Copyright and Licensing ---
    footer: {
      message: 'Released under the GPLv3 License.',
      copyright: 'Copyright © 2026 Missouri S&T Mars Rover Design Team - All Rights Reserved'
    },

    // --- Outline Configuration ---
    outline: {
      level: [2, 3], // Only show H2 and H3 headings in the outline
      label: 'On This Page' // Custom label for the outline
    },

    // --- Return to Top Button ---
    returnToTopLabel: 'Return to top',

    // --- Search Functionality (Local Search) ---
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: { buttonText: 'Search Docs', buttonAriaLabel: 'Search Docs' },
              modal: { noResultsText: 'No results for', resetButtonTitle: 'Clear search', backButtonTitle: 'Close search' }
            }
          }
        }
      }
    },

    // --- Social Media Links ---
    socialLinks: [
      { icon: 'github', link: 'https://github.com/MissouriMRDT/' },
      { icon: 'facebook', link: 'https://www.facebook.com/MissouriMRDT/' },
      { icon: 'instagram', link: 'https://www.instagram.com/missourimrdt/' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/company/missourimrdt/' },
      { icon: 'youtube', link: 'https://www.youtube.com/@missouristmrdt' },
      {
        icon: {
          svg: '<svg fill="#000000" height="800px" width="800px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 209.281 209.281" xml:space="preserve"><path d="M203.456,139.065c3.768-10.786,5.824-22.369,5.824-34.425s-2.056-23.639-5.824-34.425c-0.092-0.324-0.201-0.64-0.333-0.944 C188.589,28.926,149.932,0,104.641,0S20.692,28.926,6.159,69.271c-0.132,0.305-0.242,0.62-0.333,0.944 c-3.768,10.786-5.824,22.369-5.824,34.425s2.056,23.639,5.824,34.425c0.092,0.324,0.201,0.64,0.333,0.944 c14.534,40.346,53.191,69.271,98.482,69.271s83.948-28.926,98.482-69.271C203.255,139.705,203.364,139.39,203.456,139.065z  M104.641,194.281c-3.985,0-10.41-7.212-15.78-23.324c-2.592-7.775-4.667-16.713-6.179-26.436H126.6 c-1.512,9.723-3.587,18.66-6.178,26.436C115.051,187.069,108.626,194.281,104.641,194.281z M80.862,129.521 c-0.721-7.998-1.102-16.342-1.102-24.881s0.381-16.883,1.102-24.881h47.557c0.721,7.998,1.102,16.342,1.102,24.881 s-0.381,16.883-1.102,24.881H80.862z M15.001,104.641c0-8.63,1.229-16.978,3.516-24.881h47.3 c-0.701,8.163-1.057,16.529-1.057,24.881s0.355,16.718,1.057,24.881h-47.3C16.23,121.618,15.001,113.271,15.001,104.641z  M104.641,15c3.985,0,10.411,7.212,15.781,23.324c2.591,7.775,4.667,16.713,6.178,26.435H82.681 c1.512-9.723,3.587-18.66,6.179-26.435C94.231,22.212,100.656,15,104.641,15z M143.464,79.76h47.3 c2.287,7.903,3.516,16.251,3.516,24.881s-1.229,16.978-3.516,24.881h-47.3c0.701-8.163,1.057-16.529,1.057-24.881 S144.165,87.923,143.464,79.76z M184.903,64.76h-43.16c-2.668-18.397-7.245-34.902-13.666-46.644 C152.972,24.865,173.597,42.096,184.903,64.76z M81.204,18.115C74.783,29.857,70.206,46.362,67.538,64.76h-43.16 C35.685,42.096,56.309,24.865,81.204,18.115z M24.378,144.521h43.16c2.668,18.397,7.245,34.902,13.666,46.645 C56.309,184.416,35.685,167.186,24.378,144.521z M128.077,191.166c6.421-11.742,10.998-28.247,13.666-46.645h43.16 C173.597,167.186,152.972,184.416,128.077,191.166z"/></svg>'
        },
        link: 'https://marsrover.mst.edu/'
      }
    ]
  }
})
