/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Kotlin Multiplatform Mobile',
  tagline: 'by IceRock Development',
  url: 'https://alex009.github.io',
  baseUrl: '/kmm.icerock.dev/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'alex009', // Usually your GitHub org/user name.
  projectName: 'kmm.icerock.dev', // Usually your repo name.
  // i18n: {
  //   defaultLocale: 'ru',
  //   locales: ['ru', 'en'],
  // },
  themeConfig: {
    navbar: {
      title: 'Home',
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
          label: 'Learning',
          docsPluginId: 'learning',
        },
        {
          type: 'doc',
          docId: 'intro',
          position: 'left',
          label: 'Onboarding',
          docsPluginId: 'onboarding',
        },
        {
          type: 'doc',
          docId: 'intro',
          position: 'left',
          label: 'University',
          docsPluginId: 'university',
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
          title: 'IceRock Development',
          items: [
            {
              label: 'Site',
              to: 'https://icerock.dev',
            },
            {
              label: 'GitHub',
              to: 'https://github.com/icerockdev',
            },
            {
              label: 'LinkedIn',
              to: 'https://www.linkedin.com/company/icerockdevelopment',
            },
            {
              label: 'Facebook',
              to: 'https://www.facebook.com/icerockdevelopment',
            },
            {
              label: 'VK',
              to: 'https://vk.com/icerockdev',
            },
            {
              label: 'Instagram',
              to: 'https://www.instagram.com/icerockdevelopment',
            },
            {
              label: 'YouTube',
              to: 'https://www.youtube.com/channel/UC-Vhmm09W_IWKHhSg80d68w',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Telegram @kotlinmpp',
              href: 'https://t.me/kotlinmpp'
            },
            {
              label: 'Telegram @kotlinmppchats',
              href: 'https://t.me/kotlinmppchats'
            },
            {
              label: 'Twitter @kotlinmpp',
              href: 'https://twitter.com/kotlinmpp'
            },
            {
              label: 'Kotlin Community',
              href: 'https://kotlinlang.org/community'
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Kotlin Multiplatform Mobile',
              href: 'https://kotlinlang.org/lp/mobile',
            },
            {
              label: 'Kotlin Multiplatform Libs',
              href: 'https://libs.kmp.icerock.dev',
            },
            {
              label: 'Kotlin Multiplatform Codelabs',
              href: 'https://codelabs.kmp.icerock.dev',
            },
            {
              label: 'MOKO',
              href: 'https://moko.icerock.dev',
            },
            {
              label: 'Kotlin/Native Docs',
              href: 'https://kotlinlang.org/docs/reference/native-overview.html',
            },
            {
              label: 'Kotlin Multiplatform Docs',
              href: 'https://kotlinlang.org/docs/reference/multiplatform.html',
            },
            {
              label: 'Docusaurus',
              href: 'https://github.com/facebook/docusaurus',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} IceRock Development. Built with Docusaurus.`,
    },
    gtag: {
      trackingID: 'G-91G2XYQTXS',
    },
    prism: {
      additionalLanguages: ['kotlin', 'swift'],
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          id: 'docs',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/icerockdev/kmm.icerock.dev/tree/docusaurus/',
        },
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
        editUrl: 'https://github.com/icerockdev/kmm.icerock.dev/tree/docusaurus/',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'learning',
        path: 'learning',
        routeBasePath: 'learning',
        sidebarPath: require.resolve('./sidebars.js'),
        editUrl: 'https://github.com/icerockdev/kmm.icerock.dev/tree/docusaurus/',
        remarkPlugins: [require('mdx-mermaid')],
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'university',
        path: 'university',
        routeBasePath: 'university',
        sidebarPath: require.resolve('./sidebars.js'),
        editUrl: 'https://github.com/icerockdev/kmm.icerock.dev/tree/docusaurus/',
        remarkPlugins: [require('mdx-mermaid')],
      },
    ]
  ],
};
