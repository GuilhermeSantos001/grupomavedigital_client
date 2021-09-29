// import App from "next/app";
import type { AppProps /*, AppContext */ } from 'next/app'

import '../styles/globals.scss'
import '../styles/plugins.css'

import Head from 'next/head'
import Script from 'next/script'

import Layout from '@/components/Layout'
import Loading from '@/components/Loading'

import * as iconsBrands from '@fortawesome/free-brands-svg-icons'
import * as iconsRegular from '@fortawesome/free-regular-svg-icons'
import * as iconsSolid from '@fortawesome/free-solid-svg-icons'

export interface PageProps {
  title: string
  description: string
  themeColor: string
  menu: Menu[]
  fullwidth?: boolean
}

interface MenuItem {
  id: string
  active: boolean
  icon: iconsBrands.IconName | iconsRegular.IconName | iconsSolid.IconName
  name: string
  link: string
}

interface MenuItemDropdown extends Omit<MenuItem, 'link'> {
  type: 'dropdown'
  dropdownId: string
  content: Content[]
}

interface MenuItemSeparator extends Pick<MenuItem, 'id'> {
  type: 'separator'
}

export type Menu = MenuItem | MenuItemDropdown | MenuItemSeparator
type Content = Omit<MenuItem, 'active'> | MenuItemDropdown | MenuItemSeparator

function MyApp({ Component, pageProps }: AppProps) {
  const props: PageProps = pageProps,
    title = props.title ?? 'Grupo Mave Digital',
    description =
      props.description ??
      'Olá, venha conhecer o ambiente digital interativo do Grupo Mave. Tenha todas as informações a um clique. Acesse o link e saiba mais!',
    themeColor = props.themeColor ?? '#004a6e',
    menu = props.menu ?? [],
    fullwidth = props.fullwidth

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" key="charSet" />
        <meta
          httpEquiv="X-UA-Compatible"
          content="IE=edge"
          key="X-UA-Compatible"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
          key="viewport"
        />
        <meta name="description" content={description} key="description" />
        <meta property="og:title" content={title} key="title" />
        <meta
          property="og:site_name"
          content="Grupo Mave Digital"
          key="siteName"
        />
        <meta
          property="og:url"
          content="https://grupomavedigital.com.br"
          key="siteUrl"
        />
        <meta
          property="og:description"
          content="Olá, venha conhecer o ambiente digital interativo do Grupo Mave. Tenha todas as informações a um clique. Acesse o link e saiba mais!"
          key="siteDescription"
        />
        <meta
          property="og:image"
          content="https://i.imgur.com/CK5gmRJ.png"
          key="siteLogo"
        />
        <meta property="og:type" content="website" key="siteType" />
        <meta property="og:updated_time" content="1440432930" key="siteTime" />
        <meta
          name="mobile-web-app-capable"
          content="yes"
          key="mobileWebAppCapable"
        />
        <meta name="theme-color" content={themeColor} key="themeColor" />
        <meta
          name="apple-mobile-web-app-title"
          content={title}
          key="appleMobileWebAppTitle"
        />
        <meta
          name="apple-mobile-web-app-capable"
          content="yes"
          key="appleMobileWebAppCapable"
        />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content={themeColor}
          key="appleMobileWebAppCapable"
        />
        <link rel="manifest" href="/manifest.json" key="manifest" />
        <link
          rel="icon"
          sizes="192x192"
          href="/favicon/favicon256.png"
          key="icon192"
        />
        <link rel="icon" href="/favicon/favicon256.png" key="icon256" />
        <link
          rel="shortcut icon"
          href="/assets/favicon64x64.ico"
          type="image/x-icon"
          key="ico"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x30"
          href="/favicon/favicon256.png"
          key="icon32"
        />
        <link
          rel="apple-touch-icon"
          sizes="128x128"
          href="/favicon/favicon256.png"
          key="appleIcon128"
        />
        <link
          rel="apple-touch-startup-image"
          href="/favicon/favicon256.png"
          key="appleIcon256"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          key="materialIcons"
        />
      </Head>
      <Script
        src="/javascripts/plugins/please-wait.min.js"
        strategy="beforeInteractive"
      />
      <Loading />
      <Script
        src="/javascripts/plugins/plyr.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="/javascripts/plugins/jquery-3.6.0.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="/javascripts/plugins/jquery.ui.position.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="/javascripts/plugins/jquery.contextMenu.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="/javascripts/plugins/chart.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="/javascripts/plugins/socket.io.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="/javascripts/plugins/lz-string.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="/javascripts/plugins/bootstrap.bundle.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="/javascripts/plugins/feather.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="/javascripts/plugins/hls.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="/javascripts/plugins/file_explore.js"
        strategy="beforeInteractive"
      />
      <Layout fullwidth={fullwidth} menu={menu}>
        <Component {...pageProps} />
      </Layout>
    </>
  )
}

export default MyApp
