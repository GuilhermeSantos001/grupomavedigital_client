// import App from "next/app";
import type { AppProps /*, AppContext */ } from 'next/app'

import SSRProvider from 'react-bootstrap/SSRProvider';

import { Provider } from 'react-redux'
import store from '../app/store'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'

import '../styles/globals.scss'
import '../styles/plugins.css'

import Head from 'next/head'
import Script from 'next/script'

import Layout from '@/components/Layout'

import ProgressBar from "@badrap/bar-of-progress";
import Router from "next/router";

const progress = new ProgressBar({
  size: 2,
  color: "#f6d816",
  className: "bar-of-progress",
  delay: 100,
});

Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeComplete", progress.finish);
Router.events.on("routeChangeError", progress.finish);
Router.events.on('hashChangeStart', progress.start);
Router.events.on("hashChangeComplete", progress.finish);

import { ImpulseSpinner } from "react-spinners-kit"

import { iconsFamily, iconsName } from '@/src/utils/fontAwesomeIcons'

import { GetMenuHome } from '@/bin/GetMenuHome'

export type MenuResponse = {
  disable: MenuDisable
  options: Menu[]
}

export type MenuDisable = { [key in MenuOptions]: boolean | undefined }

export type MenuOptions =
  | 'mn-home'
  | 'mn-admin'
  | 'mn-login'
  | 'mn-integration'
  | 'mn-security'
  | 'mn-dashboard'
  | 'mn-helping'
  | 'mn-logout'
  | 'mn-herculesStorage'
  | 'mn-payback'
  | 'mn-payback-separator-1'
  | 'mn-payback-separator-2'
  | 'mn-payback-cashier'
  | 'mn-payback-cards'
  | 'mn-payback-postings'
  | 'mn-helpdesk'
  | 'mn-helpdesk-separator'
  | 'mn-docs'

export type Menu = MenuItem | MenuItemDropdown | MenuItemSeparator
export type Content = Omit<MenuItem, 'active'> | MenuItemDropdown | MenuItemSeparator

export interface PageProps {
  title: string
  description: string
  themeColor: string
  menu: MenuResponse
  fullwidth?: boolean
  socketIO?: {
    room: string[]
  }
}

interface MenuItem {
  id: MenuOptions
  active: boolean
  icon: {
    family: iconsFamily
    name: iconsName
  }
  name: string
  link: string
  disabled?: boolean
}

interface MenuItemDropdown extends Omit<MenuItem, 'link'> {
  type: 'dropdown'
  dropdownId: string
  content: Content[]
}

interface MenuItemSeparator extends Pick<MenuItem, 'id'> {
  type: 'separator'
}

function MyApp({ Component, pageProps }: AppProps) {
  const props: PageProps = pageProps,
    title = props.title ?? 'Grupo Mave Digital',
    description =
      props.description ??
      'Olá, venha conhecer o ambiente digital interativo do Grupo Mave. Tenha todas as informações a um clique. Acesse o link e saiba mais!',
    themeColor = props.themeColor ?? '#004a6e',
    menu = props.menu ?? GetMenuHome('mn-home'),
    fullwidth = props.fullwidth,
    persistor = persistStore(store);

  const reduxLoading = (
    <div
      className='d-flex flex-row justify-content-center align-items-center bg-primary bg-gradient'
      style={{ width: '100vw', height: '100vh' }}
    >
      <div className='align-self-center m-2'>
        <ImpulseSpinner size={70} backColor="white" frontColor='yellow' loading={true} />
      </div>
    </div>
  )

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
      </Head>
      <Script
        src="/javascripts/plugins/please-wait.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="/javascripts/plugins/plyr.min.js"
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
      <SSRProvider>
        <Provider store={store}>
          <PersistGate loading={reduxLoading} persistor={persistor}>
            <Layout fullwidth={fullwidth !== undefined ? fullwidth : false} menu={menu}>
              <Component {...pageProps} />
            </Layout>
          </PersistGate>
        </Provider>
      </SSRProvider>
    </>
  )
}

export default MyApp
