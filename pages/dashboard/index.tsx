/**
 * @description Painéis do sistema
 * @author @GuilhermeSantos001
 * @update 06/10/2021
 */

import React, { useEffect, useState } from 'react'

import Link from 'next/link'

import { useRouter } from 'next/router'

import SkeletonLoader from 'tiny-skeleton-loader-react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from '@/src/utils/fontAwesomeIcons'

import RenderPageError from '@/components/renderPageError'
import NoPrivilege from '@/components/noPrivilege'
import NoAuth from '@/components/noAuth'

import { PageProps } from '@/pages/_app'

import Fetch from '@/src/utils/fetch'
import Variables from '@/src/db/variables'
import tokenValidate from '@/src/functions/tokenValidate'
import hasPrivilege from '@/src/functions/hasPrivilege'

const serverSideProps: PageProps = {
  title: 'System/Dashboard',
  description: 'Painéis de gestão do Grupo Mave',
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
      active: false,
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
      id: 'mn-dashboard',
      active: true,
      icon: {
        family: 'fas',
        name: 'chart-line',
      },
      name: 'Painéis',
      link: '/dashboard',
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

export const getServerSideProps = async () => {
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

function compose_noPrivilege(handleClick) {
  return <NoPrivilege handleClick={handleClick} />
}

function compose_noAuth(handleClick) {
  return <NoAuth handleClick={handleClick} />
}

function compose_ready() {
  return (
    <div className="row g-2">
      <div className="col-12 col-md-6">
        <div className="p-3 bg-primary bg-gradient rounded">
          <p className="text-center text-secondary fw-bold fs-5 my-2">
            <FontAwesomeIcon
              icon={Icon.render('fas', 'coins')}
              className="me-1 fs-3 flex-shrink-1 text-secondary my-auto"
            />
            Financeiro
          </p>
        </div>
        <div className="p-3 bg-light-gray rounded overflow-auto h-50">
          <div className="my-1 text-primary">
            <p className="text-center text-md-start px-2 fs-6 fw-bold">
              <FontAwesomeIcon
                icon={Icon.render('fas', 'file-invoice-dollar')}
                className="me-1 flex-shrink-1 my-auto"
              />
              <Link href="/dashboard/finances/revenues">
                Faturamento
              </Link>
            </p>
            <hr />
          </div>
        </div>
      </div>
      <div className="col-12 col-md-6">
        <div className="p-3 bg-primary bg-gradient rounded">
          <p className="text-center text-secondary fw-bold fs-5 my-2">
            <FontAwesomeIcon
              icon={Icon.render('fas', 'parachute-box')}
              className="me-2 fs-3 flex-shrink-1 text-secondary my-auto"
            />
            Suprimentos
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

const Dashboard = (): JSX.Element => {
  const [isReady, setReady] = useState<boolean>(false)
  const [isError, setError] = useState<boolean>(false)
  const [notPrivilege, setNotPrivilege] = useState<boolean>(false)
  const [notAuth, setNotAuth] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  const router = useRouter()
  const _fetch = new Fetch(process.env.NEXT_PUBLIC_GRAPHQL_HOST)

  const handleClickNoAuth = async (e, path) => {
      e.preventDefault()

      if (path === '/auth/login') {
        const variables = new Variables(1, 'IndexedDB')
        await Promise.all([await variables.clear()]).then(() => {
          router.push(path)
        })
      }
    },
    handleClickNoPrivilege = async (e, path) => {
      e.preventDefault()
      router.push(path)
    }

  useEffect(() => {
    const timer = setTimeout(async () => {
      const allowViewPage = await tokenValidate(_fetch)

      if (!allowViewPage) {
        setNotAuth(true)
        setLoading(false)
      } else {
        try {
          if (!(await hasPrivilege('administrador'))) setNotPrivilege(true)

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

  if (notPrivilege) return compose_noPrivilege(handleClickNoPrivilege)

  if (notAuth) return compose_noAuth(handleClickNoAuth)

  if (isReady) return compose_ready()
}

export default Dashboard