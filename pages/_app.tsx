// import App from "next/app";

import PropTypes from 'prop-types';

import createEmotionCache from '@/utility/createEmotionCache';

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
  | 'mn-account'
  | 'mn-account-profile'
  | 'mn-account-separator-1'
  | 'mn-account-cards'
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

export type CustomHead = {
  url: string
  og_image: string
  icon: string
  apple_touch_icon: string
  apple_touch_startup_image: string
}

export interface PageProps {
  title: string
  description: string
  themeColor: string
  menu: MenuResponse
  fullwidth?: boolean
  cleanLayout?: boolean
  customHead?: CustomHead
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

const clientSideEmotionCache = createEmotionCache();

const MyApp = (props: any) => {
  const
    { Component, pageProps, emotionCache = clientSideEmotionCache, } = props,
    title = pageProps.title ?? 'Grupo Mave Digital',
    description =
      pageProps.description ??
      'Olá, venha conhecer o ambiente digital interativo do Grupo Mave. Tenha todas as informações a um clique. Acesse o link e saiba mais!',
    themeColor = pageProps.themeColor ?? '#004a6e',
    menu = pageProps.menu ?? GetMenuHome('mn-home'),
    fullwidth = pageProps.fullwidth,
    cleanLayout = pageProps.cleanLayout,
    customHead = pageProps.customHead,
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
          content={!customHead ?
            "https://grupomavedigital.com.br"
            :
            customHead.url
          }
          key="siteUrl"
        />
        <meta
          property="og:description"
          content={description}
          key="siteDescription"
        />
        <meta
          property="og:image"
          content={!customHead ?
            "https://i.imgur.com/CK5gmRJ.png"
            :
            customHead.og_image
          }
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
          href={!customHead ?
            "/favicon/favicon256.png"
            :
            customHead.icon
          }
          key="icon192"
        />
        <link
          rel="icon"
          href={!customHead ?
            "/favicon/favicon256.png"
            :
            customHead.icon
          }
          key="icon256"
        />
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
          href={!customHead ?
            "/favicon/favicon256.png"
            :
            customHead.icon
          }
          key="icon32"
        />
        <link
          rel="apple-touch-icon"
          sizes="128x128"
          href={!customHead ?
            "/favicon/favicon256.png"
            :
            customHead.apple_touch_icon
          }
          key="appleIcon128"
        />
        <link
          rel="apple-touch-startup-image"
          href={!customHead ?
            "/favicon/favicon256.png"
            :
            customHead.apple_touch_startup_image
          }
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
            <Layout
              fullwidth={fullwidth !== undefined ? fullwidth : false}
              cleanLayout={cleanLayout !== undefined ? cleanLayout : false}
              menu={menu}
              emotionCache={emotionCache}
            >
              <Component {...pageProps} />
            </Layout>
          </PersistGate>
        </Provider>
      </SSRProvider>
    </>
  )
}

export default MyApp

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};