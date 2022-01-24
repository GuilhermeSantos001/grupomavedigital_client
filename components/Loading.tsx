/**
 * @description Componentes de loading
 * @author GuilhermeSantos001
 * @update 24/01/2022
 */

import { useState, useEffect } from 'react'

import { SnackbarProvider } from 'notistack';

import { useRouter } from 'next/router'

import { RainbowSpinner, GooSpinner, PongSpinner } from "react-spinners-kit"

import ScrollToTop from '@/components/scrollToTop'
import Alerting from '@/components/Alerting'
import WindowSuperAdmin from '@/components/WindowSuperAdmin'

import { useAppDispatch } from '@/app/hooks'

export type Props = {
  children: React.ReactElement
}

declare global {
  interface Window {
    loading: 'show' | 'hide' | 'none'
    loading_screen: any
    pleaseWait: any
  }
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

export function LoadingFullWidth(lastRouterPathVisited: string | null, children?: React.ReactElement, contentEmpty?: boolean) {
  const Style = children ? {} : { width: '100vw', height: '100vh' }

  return (
    <div className={
      `${children ? `fade-effect active` : 'd-flex flex-row justify-content-center align-items-center bg-primary bg-gradient'}`
    } style={Style}>
      {
        !contentEmpty ?
          <div className={
            `d-flex flex-column p-2 fade-effect ${!children ? 'active' : 'deactivate'}`
          }>
            <div className='align-self-center m-2'>
              <RainbowSpinner size={70} color="#f6d816" loading={true} />
            </div>
            <p className='fw-bold text-secondary' style={{ fontFamily: 'Bebas Regular', fontSize: '2rem' }}>
              Ambiente Digital Interativo
            </p>
          </div> :
          children ?
            <>
              {children}
              <div
                className='d-flex flex-row justify-content-center align-items-center bg-light-gray border-top p-2 mt-5 bg-light-gray'
              >
                <p className='text-muted my-auto'>
                  Grupo Mave 2020-2022 © Todos direitos reservados.
                </p>
              </div>
            </>
            :
            !lastRouterPathVisited ? <></> :
              <div className='align-self-center m-2'>
                <GooSpinner size={70} color="#f6d816" loading={true} />
              </div>
      }
    </div>
  )
}

export default function Loading(props: Props) {
  const [fetchAPI, setFetchAPI] = useState<NodeJS.Timeout | null>(null)
  const [loadedAPI, setLoadedAPI] = useState<{ [key: string]: boolean }>({})
  const [lastRouterPathVisited, setLastRouterPathVisited] = useState<string | null>(null)
  const [loadingOverlay, setLoadingOverlay] = useState<boolean>(false)

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
      setFetchAPI(setTimeout(async () => setLoadedAPI({ loaded: true }), 1000));
    } else {
      setLastRouterPathVisited(router.pathname);
    }

    return () => {
      if (fetchAPI) {
        clearTimeout(fetchAPI);
      }
    }
  }, [loadedAPI])

  if (lastRouterPathVisited && lastRouterPathVisited != router.pathname) {
    setLastRouterPathVisited(router.pathname);
    setLoadedAPI({})
  }

  return <SnackbarProvider maxSnack={3}>
    <ScrollToTop />
    <Alerting />
    <WindowSuperAdmin />
    {
      LoadingOverlay(loadingOverlay)
    }
    {LoadingFullWidth(
      lastRouterPathVisited,
      hasLoadedAPI() ? props.children : undefined,
      hasLoadedAPI() ? true : false
    )}
  </SnackbarProvider>
}