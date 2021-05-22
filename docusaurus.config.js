/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Kotlin Multiplatform Mobile',
  tagline: 'Kotlin Multiplatform Mobile в IceRock Development',
  url: 'https://kmm.icerock.dev',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'icerockdev', // Usually your GitHub org/user name.
  projectName: 'kmm.icerock.dev', // Usually your repo name.
  // i18n: {
  //   defaultLocale: 'ru',
  //   locales: ['ru', 'en'],
  // },
  themeConfig: {
    navbar: {
      title: 'Home',
      // logo: {
      //   alt: 'IceRock logo',
      //   src: 'img/icerock-logo.svg',
      // },
      items: [
        {
          type: 'doc',
          docId: 'intro',
          position: 'left',
          label: 'Documentation',
          docsPluginId: 'docs',
        },
        {
          type: 'doc',
          docId: 'intro',
          position: 'left',
          label: 'Onboarding',
          docsPluginId: 'onboarding',
        },
        // {
        //   type: 'localeDropdown',
        //   position: 'right',
        // },
        {
          href: 'https://github.com/icerockdev/kmm.icerock.dev',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Documentation',
              to: '/docs/intro',
            },
            {
              label: 'Onboarding',
              to: '/onboarding/intro',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            // {
            //   label: 'Stack Overflow',
            //   href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            // },
            // {
            //   label: 'Discord',
            //   href: 'https://discordapp.com/invite/docusaurus',
            // },
            // {
            //   label: 'Twitter',
            //   href: 'https://twitter.com/docusaurus',
            // },
          ],
        },
        {
          title: 'More',
          items: [
            // {
            //   label: 'Blog',
            //   to: '/blog',
            // },
            {
              label: 'Docusaurus',
              href: 'https://github.com/facebook/docusaurus',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} IceRock Development. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          id: 'docs',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/icerockdev/kmm.icerock.dev/tree/master/',
        },
        // blog: {
        //   showReadingTime: true,
        //   // Please change this to your repo.
        //   editUrl:
        //     'https://github.com/facebook/docusaurus/edit/master/website/blog/',
        // },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'onboarding',
        path: 'onboarding',
        routeBasePath: 'onboarding',
        sidebarPath: require.resolve('./sidebars.js'),
        editUrl: 'https://github.com/icerockdev/kmm.icerock.dev/tree/master/',
      },
    ],
  ],
};
