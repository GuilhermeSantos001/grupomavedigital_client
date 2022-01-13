/**
 * @description Componentes de loading
 * @author GuilhermeSantos001
 * @update 13/01/2022
 */

import { useState, useEffect } from 'react'

import { useRouter } from 'next/router'

import { RainbowSpinner, GooSpinner } from "react-spinners-kit"

import ScrollToTop from '@/components/scrollToTop'

import { uploadsAll } from '@/src/functions/getUploads'

import { useAppDispatch } from '@/app/hooks'

import {
  appendUploads,
  clearUploads,
} from '@/app/features/system/system.slice'

export type Props = {
  children: React.ReactElement
}

declare global {
  interface Window {
    loading_screen: any
    pleaseWait: any
  }
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
              <RainbowSpinner size={70} color="white" loading={true} />
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
                <GooSpinner size={70} color="white" loading={true} />
              </div>
      }
    </div>
  )
}

export default function Loading(props: Props) {
  const [fetchAPI, setFetchAPI] = useState<NodeJS.Timeout | null>(null)
  const [loadedAPI, setLoadedAPI] = useState<{ [key: string]: boolean }>({})
  const [lastRouterPathVisited, setLastRouterPathVisited] = useState<string | null>(null)

  const
    dispatch = useAppDispatch(),
    router = useRouter();

  const
    hasLoadedAPI = () => {
      if (loadedAPI['uploads'])
        return true;

      return false;
    }

  useEffect(() => {
    if (!loadedAPI['uploads']) {
      setFetchAPI(setTimeout(async () => {
        try {
          const uploads = await uploadsAll();

          dispatch(clearUploads());

          if (uploads.length > 0) {
            uploads.forEach(file => dispatch(appendUploads(file)));
          }

          setLoadedAPI((prevState) => ({ ...prevState, uploads: true }));
        } catch {
          setLoadedAPI((prevState) => ({ ...prevState, uploads: true }));
        }
      }, 1000));
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

  return <>
    <ScrollToTop />
    {LoadingFullWidth(
      lastRouterPathVisited,
      hasLoadedAPI() ? props.children : undefined,
      hasLoadedAPI() ? true : false
    )}
  </>
}