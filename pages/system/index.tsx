/**
 * @description Pagina principal do sistema
 * @author @GuilhermeSantos001
 * @update 05/10/2021
 */

import { DocumentContext } from 'next/document'

import React, { useEffect, useState } from 'react'

import Image from 'next/image'
import { useRouter } from 'next/router'

import SkeletonLoader from 'tiny-skeleton-loader-react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from '@/src/utils/fontAwesomeIcons'

import RenderPageError from '@/components/renderPageError'
import NoAuth from '@/components/noAuth'

import Sugar from 'sugar'

import { PageProps } from '@/pages/_app'

import Fetch from '@/src/utils/fetch'
import Variables from '@/src/db/variables'
import getUserInfo from '@/src/functions/getUserInfo'
import tokenValidate from '@/src/functions/tokenValidate'

interface PageData {
  photoProfile: string
  username: string
  privilege: string
}

const serverSideProps: PageProps = {
  title: 'System/Home',
  description: 'Grupo Mave Digital seu ambiente de trabalho integrado',
  themeColor: '#004a6e',
  menu: [
    {
      id: 'mn-home',
      active: false,
      icon: {
        family: 'fas',
        name: 'home',
      },
      name: 'Home',
      link: '/',
    },
    {
      id: 'mn-login',
      active: true,
      icon: {
        family: 'fas',
        name: 'sign-in-alt',
      },
      name: 'Conectado',
      link: '/system',
    },
    {
      id: 'mn-security',
      active: false,
      icon: {
        family: 'fas',
        name: 'shield-alt',
      },
      name: 'Segurança',
      link: '/user/security',
    },
    {
      id: 'mn-helping',
      active: false,
      icon: {
        family: 'fas',
        name: 'question-circle',
      },
      type: 'dropdown',
      name: 'Precisa de Ajuda?',
      dropdownId: 'navbarDropdown',
      content: [
        {
          id: 'md-helpdesk',
          icon: {
            family: 'fas',
            name: 'headset',
          },
          name: 'HelpDesk',
          link: '/help/helpdesk',
        },
        {
          id: 'md-sp1',
          type: 'separator',
        },
        {
          id: 'md-docs',
          icon: {
            family: 'fas',
            name: 'book-reader',
          },
          name: 'Documentação',
          link: '/help/docs',
        },
      ],
    },
    {
      id: 'mn-logout',
      active: false,
      icon: {
        family: 'fas',
        name: 'power-off',
      },
      name: 'Desconectar',
      link: '/auth/logout',
    },
  ],
}

export const getServerSideProps = async (ctx: DocumentContext) => {
  return {
    props: {
      ...serverSideProps,
    },
  }
}

function compose_load() {
  return (
    <div>
      <div className="d-block d-md-none">
        <div className="col-12">
          <div className="d-flex flex-column p-2">
            <div className="col-12 d-flex justify-content-center">
              <SkeletonLoader
                width={100}
                height={100}
                radius={10}
                circle={true}
              />
            </div>
            <div className="col-12 d-flex flex-column">
              <SkeletonLoader
                width="70%"
                height="1rem"
                circle={false}
                style={{
                  marginTop: '1rem',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              />
              <SkeletonLoader
                width="70%"
                height="1rem"
                circle={false}
                style={{
                  marginTop: '1rem',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              />
            </div>
            <div className="col-12 my-2 p-2">
              <SkeletonLoader
                width={'100%'}
                height={'0.1rem'}
                radius={0}
                circle={false}
              />
            </div>
            <div className="col-12 px-2">
              <SkeletonLoader
                width={'100%'}
                height={'10rem'}
                radius={10}
                circle={false}
                style={{ marginTop: '0.1rem' }}
              />
              <SkeletonLoader
                width={'100%'}
                height={'10rem'}
                radius={10}
                circle={false}
                style={{ marginTop: '1rem' }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="d-none d-md-flex">
        <div className="col-12">
          <div className="d-flex flex-row p-2">
            <div className="col-1 d-flex justify-content-center">
              <SkeletonLoader
                width={100}
                height={100}
                radius={20}
                circle={true}
              />
            </div>
            <div className="col-10 d-flex flex-column px-2">
              <SkeletonLoader
                width="20%"
                height="1rem"
                circle={false}
                style={{ marginTop: '2rem' }}
              />
              <SkeletonLoader
                width="20%"
                height="1rem"
                circle={false}
                style={{ marginTop: 5 }}
              />
            </div>
          </div>
          <div className="col-12 p-2">
            <SkeletonLoader
              width={'100%'}
              height={'0.1rem'}
              radius={0}
              circle={false}
            />
          </div>
          <div className="row g-2">
            <div className="col-12 col-md-6">
              <div className="p-1">
                <SkeletonLoader
                  width={'100%'}
                  height={'10rem'}
                  radius={10}
                  circle={false}
                />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="p-1">
                <SkeletonLoader
                  width={'100%'}
                  height={'10rem'}
                  radius={10}
                  circle={false}
                />
              </div>
            </div>
          </div>
          <div className="col-12 p-2">
            <SkeletonLoader
              width={'100%'}
              height={'0.1rem'}
              radius={0}
              circle={false}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function compose_error() {
  return <RenderPageError />
}

function compose_noAuth(handleClick) {
  return <NoAuth handleClick={handleClick} />
}

function compose_ready({ photoProfile, username, privilege }: PageData) {
  return (
    <div className="d-flex flex-column p-2">
      <div
        className="d-flex flex-column flex-md-row p-2"
        style={{ fontFamily: 'Fira Code' }}
      >
        <div className="col-4 col-md-1 d-flex flex-column flex-md-row align-self-center justify-content-center">
          <Image
            src={`/uploads/${photoProfile}`}
            alt="Você ;)"
            className="rounded-circle"
            width={100}
            height={100}
          />
        </div>
        <div className="col-12 col-md-10 d-flex flex-column align-self-center text-center text-md-start px-2">
          <p className="mt-2 mb-1 fw-bold">
            {Sugar.String.capitalize(username)}
          </p>
          <p className="mb-1">
            {
              <b className="text-primary fw-bold">
                {Sugar.String.capitalize(privilege)}
              </b>
            }
          </p>
        </div>
      </div>
      <hr className="text-muted" />
      {compose_user_view_1()}
      <hr className="text-muted" />
    </div>
  )
}

function compose_user_view_1() {
  return (
    <div className="row g-2">
      <div className="col-12 col-md-6">
        <div className="p-3 bg-primary bg-gradient rounded">
          <p className="text-center text-secondary fw-bold fs-5 my-2">
            <FontAwesomeIcon
              icon={Icon.render('fas', 'paper-plane')}
              className="me-1 fs-3 flex-shrink-1 text-secondary my-auto"
            />
            Novidades
          </p>
        </div>
        <div className="p-3 bg-light-gray rounded overflow-auto h-50">
          <div className="my-1 text-primary">
            <p className="text-center text-md-start px-2 fs-6 fw-bold">
              <FontAwesomeIcon
                icon={Icon.render('fas', 'paint-brush')}
                className="me-1 flex-shrink-1 my-auto"
              />
              Estamos com um novo visual, o que você achou?
            </p>
            <hr />
          </div>
        </div>
      </div>
      <div className="col-12 col-md-6">
        <div className="p-3 bg-primary bg-gradient rounded">
          <p className="text-center text-secondary fw-bold fs-5 my-2">
            <FontAwesomeIcon
              icon={Icon.render('fas', 'book')}
              className="me-2 fs-3 flex-shrink-1 text-secondary my-auto"
            />
            Meus Cursos
          </p>
        </div>
        <div className="p-3 bg-light-gray rounded overflow-auto h-50">
          <div className="my-1 text-muted">
            <p className="text-center text-md-start px-2 fs-6 fw-bold">
              <FontAwesomeIcon
                icon={Icon.render('fas', 'wrench')}
                className="me-1 flex-shrink-1 my-auto"
              />
              Estamos trabalhando nesse recurso.
            </p>
            <hr />
          </div>
        </div>
      </div>
    </div>
  )
}

const System = (): JSX.Element => {
  const [isReady, setReady] = useState<boolean>(false)
  const [isError, setError] = useState<boolean>(false)
  const [notAuth, setNotAuth] = useState<boolean>(false)
  const [data, setData] = useState<PageData>()
  const [loading, setLoading] = useState<boolean>(true)

  const router = useRouter()
  const _fetch = new Fetch(process.env.NEXT_PUBLIC_GRAPHQL_HOST)

  const handleClick = async (e, path) => {
    e.preventDefault()

    if (path === '/auth/login') {
      const variables = new Variables(1, 'IndexedDB')
      await Promise.all([await variables.clear()]).then(() => {
        router.push(path)
      })
    }
  }

  useEffect(() => {
    const timer = setTimeout(async () => {
      const allowViewPage = await tokenValidate(_fetch)

      if (!allowViewPage) {
        setNotAuth(true)
        setLoading(false)
      } else {
        try {
          const { photoProfile, username, privileges } = await getUserInfo(
            _fetch
          )

          setData({
            photoProfile,
            username,
            privilege: privileges[0],
          })

          setReady(true)
          return setLoading(false)
        } catch {
          setError(true)
          return setLoading(false)
        }
      }
    })

    return () => clearTimeout(timer)
  }, [])

  if (loading) return compose_load()

  if (isError) return compose_error()

  if (notAuth) return compose_noAuth(handleClick)

  if (isReady) return compose_ready(data)
}

export default System
