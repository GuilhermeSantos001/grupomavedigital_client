/**
 * @description Admin -> Tela Inicial
 * @author GuilhermeSantos001
 * @update 15/02/2022
 */

import React, { useEffect, useState } from 'react'

import Link from 'next/link'

import { useRouter } from 'next/router'

import SkeletonLoader from 'tiny-skeleton-loader-react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from '@/src/utils/fontAwesomeIcons'

import NoPrivilege, { handleClickFunction } from '@/components/noPrivilege'
import NoAuth from '@/components/noAuth'

import { PageProps } from '@/pages/_app'
import { GetMenuMain } from '@/bin/GetMenuMain'

import { Variables } from '@/src/db/variables'
import hasPrivilege from '@/src/functions/hasPrivilege'

const serverSideProps: PageProps = {
  title: 'Admin/Tela Inicial',
  description: 'Gerenciamento da plataforma',
  themeColor: '#004a6e',
  menu: GetMenuMain('mn-admin')
}

export const getServerSideProps = async () => {
  return {
    props: {
      ...serverSideProps,
    },
  }
}

// TODO: Implementar o esqueleto de loading da página
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

function compose_noPrivilege(handleClick: handleClickFunction) {
  return <NoPrivilege handleClick={handleClick} />
}

function compose_noAuth(handleClick: handleClickFunction) {
  return <NoAuth handleClick={handleClick} />
}

function compose_ready() {
  return (
    <div className="row g-2">
      <div className="col-12">
        <div className="p-3 bg-primary bg-gradient rounded">
          <p className="text-center text-secondary fw-bold fs-5 my-2">
            <FontAwesomeIcon
              icon={Icon.render('fas', 'hammer')}
              className="me-2 fs-3 flex-shrink-1 text-secondary my-auto"
            /> Administração
          </p>
        </div>
        <div className="p-3 bg-light-gray rounded overflow-auto">
          <div className="my-1 text-primary">
            <div className='d-flex align-items-center justify-content-center col-12 bg-primary bg-gradient rounded p-2'>
              <p className='fs-5 my-auto text-secondary fw-bold text-center'>
                Base de Dados
              </p>
            </div>
            <div className='d-flex flex-column flex-md-row align-items-center border-bottom my-3'>
              <p className="text-center text-md-start px-2 fs-6 fw-bold">
                <FontAwesomeIcon
                  icon={Icon.render('fas', 'users')}
                  className="me-1 flex-shrink-1 my-auto"
                />
                <Link href="/admin/users">
                  Usuários
                </Link>
              </p>
              <hr />
              <p className="text-center text-md-start px-2 fs-6 fw-bold">
                <FontAwesomeIcon
                  icon={Icon.render('fas', 'eye')}
                  className="me-1 flex-shrink-1 my-auto"
                />
                <Link href="/admin/costCenters">
                  Centros de Custo
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Admin() {
  const [isReady, setReady] = useState<boolean>(false)
  const [notPrivilege, setNotPrivilege] = useState<boolean>(false)
  const [notAuth, setNotAuth] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  const router = useRouter()

  const
    handleClickNoAuth: handleClickFunction = async (
      event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
      path: string
    ) => {
      event.preventDefault()

      if (path === '/auth/login') {
        const variables = new Variables(1, 'IndexedDB')
        await Promise.all([await variables.clear()]).then(() => {
          router.push(path)
        })
      }
    },
    handleClickNoPrivilege: handleClickFunction = async (
      event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
      path: string
    ) => {
      event.preventDefault()
      router.push(path)
    }

  useEffect(() => {
    hasPrivilege('administrador')
      .then((isAllowViewPage) => {
        if (isAllowViewPage) {
          setReady(true);
        } else {
          setNotPrivilege(true);
        }

        return setLoading(false);
      })
      .catch(() => {
        setNotAuth(true);
        return setLoading(false)
      });
  }, [])

  if (loading) return compose_load()

  if (notPrivilege) return compose_noPrivilege(handleClickNoPrivilege)

  if (notAuth) return compose_noAuth(handleClickNoAuth)

  if (isReady) return compose_ready()
}