import { useState, useEffect } from 'react'

import { EmotionCache } from '@emotion/react';

import { useRouter } from 'next/router'

import { RainbowSpinner, GooSpinner, PongSpinner } from "react-spinners-kit"

import ScrollToTop from '@/components/scrollToTop'
import Alerting from '@/components/Alerting'
import Navbar from '@/components/Navbar'
import GridContent from '@/components/GridContent'

import { MenuResponse } from '@/pages/_app'
declare global {
  interface Window {
    loading: 'show' | 'hide' | 'none'
    loading_screen: any
    pleaseWait: any
  }
}

export type Props = {
  menu: MenuResponse
  emotionCache: EmotionCache
  children: React.ReactElement
  fullwidth: boolean
  cleanLayout: boolean
}

export function LoadingOverlay(overlay: boolean) {
  return (
    <div
      className={
        `d-flex flex-row justify-content-center align-items-center position-fixed fade-effect ${overlay ? 'active-classic' : 'deactivate-classic'}`
      }
      style={{ width: '100vw', height: '100vh', backgroundColor: "rgba(0, 0, 0, .5)", zIndex: 9999 }}
    >
      <div className={
        `d-flex flex-column p-2`
      }>
        <div className='align-self-center m-2 p-2 border border-5 border-secondary'>
          <PongSpinner size={200} color="#f6d816" loading={true} />
        </div>
        <p className='text-center fw-bold text-secondary' style={{ fontFamily: 'Bebas Regular', fontSize: '2rem', textShadow: '1px 1px 2px black' }}>
          Carregando...
        </p>
      </div>
    </div>
  )
}

export function LoadingFullWidth(lastRouterPathVisited: string | null, contentEmpty?: boolean) {
  const Style = contentEmpty ? {} : { width: '100vw', height: '100vh' }

  return (
    <div className={
      `${contentEmpty ? `fade-effect active` : 'd-flex flex-row justify-content-center align-items-center bg-primary bg-gradient'}`
    } style={Style}>
      {
        !contentEmpty ?
          <div className={
            `d-flex flex-column p-2 fade-effect ${!contentEmpty ? 'active' : 'deactivate'}`
          }>
            <div className='align-self-center m-2'>
              <RainbowSpinner size={70} color="#f6d816" loading={true} />
            </div>
            <p className='fw-bold text-secondary' style={{ fontFamily: 'Bebas Regular', fontSize: '2rem' }}>
              Ambiente Digital Interativo
            </p>
          </div> : contentEmpty ?
            <></>
            :
            !lastRouterPathVisited ? <></> :
              <div className='align-self-center m-2'>
                <GooSpinner size={70} color="#f6d816" loading={true} />
              </div>
      }
    </div>
  )
}

export default function Layout(props: Props) {
  const [fetchAPI, setFetchAPI] = useState<NodeJS.Timeout | null>(null)
  const [loadedAPI, setLoadedAPI] = useState<{ [key: string]: boolean }>({})
  const [lastRouterPathVisited, setLastRouterPathVisited] = useState<string | null>(null)
  const [loadingOverlay, setLoadingOverlay] = useState<boolean>(false)
  const [showFullWidth, setShowFullWidth] = useState<boolean>(false)

  const handleFullWidth = () => setShowFullWidth(!showFullWidth);

  const
    router = useRouter();

  const
    hasLoadedAPI = () => {
      if (loadedAPI['loaded'])
        return true;

      return false;
    }

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.loading === 'show') {
        window.loading = 'none';
        setLoadingOverlay(true);
      } else if (window.loading === 'hide') {
        window.loading = 'none';
        setLoadingOverlay(false);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    }
  }, [])


  useEffect(() => {
    if (!loadedAPI['loaded']) {
      setFetchAPI(setTimeout(async () => {
        setLoadedAPI({ loaded: true })
        clearTimeout(fetchAPI);
      }, 1000));
    } else {
      setLastRouterPathVisited(router.pathname);
    }

    return () => { }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadedAPI, router.pathname])

  if (lastRouterPathVisited && lastRouterPathVisited != router.pathname) {
    setLastRouterPathVisited(router.pathname);
    setLoadedAPI({})
  }

  return <>
    {hasLoadedAPI() ?
      <>
        <ScrollToTop />
        <Alerting />
        <Navbar
          menuShow={showFullWidth}
          setMenuShow={handleFullWidth}
          fullwidth={props.fullwidth}
          cleanLayout={props.cleanLayout}
        />
        <GridContent
          menuShow={showFullWidth}
          emotionCache={props.emotionCache}
          menu={props.menu}
          fullwidth={props.fullwidth}
          cleanLayout={props.cleanLayout}
        >
          {props.children}
        </GridContent>
      </>
      :
      loadingOverlay ?
        LoadingOverlay(loadingOverlay)
        :
        LoadingFullWidth(
          lastRouterPathVisited,
          hasLoadedAPI() ? true : false
        )
    }
  </>
}