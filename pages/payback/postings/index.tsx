/**
 * @description Payback -> Lançamentos Operacionais
 * @author GuilhermeSantos001
 * @update 10/02/2022
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
import PageMenu from '@/bin/main_menu'

import Variables from '@/src/db/variables'
import hasPrivilege from '@/src/functions/hasPrivilege'

const serverSideProps: PageProps = {
  title: 'Pagamentos/Lançamentos Operacionais',
  description: 'Lançamentos Operacionais',
  themeColor: '#004a6e',
  menu: PageMenu('mn-payback')
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
              icon={Icon.render('fas', 'money-check-alt')}
              className="me-2 fs-3 flex-shrink-1 text-secondary my-auto"
            /> Lançamentos Operacionais
          </p>
        </div>
        <div className="p-3 bg-light-gray rounded overflow-auto">
          <div className="my-1 text-primary">
            <div className='d-flex align-items-center justify-content-center col-12 bg-primary bg-gradient rounded p-2'>
              <p className='fs-5 my-auto text-secondary fw-bold text-center'>
                FT/Freelancer
              </p>
            </div>
            <div className='d-flex flex-column flex-md-row align-items-center border-bottom my-3'>
              <p className="text-center text-md-start px-2 fs-6 fw-bold">
                <FontAwesomeIcon
                  icon={Icon.render('fas', 'plus-square')}
                  className="me-1 flex-shrink-1 my-auto"
                />
                <Link href="/payback/postings/ft/register">Registrar Lançamento</Link>
              </p>
              <hr />
              <p className="text-center text-md-start px-2 fs-6 fw-bold">
                <FontAwesomeIcon
                  icon={Icon.render('fas', 'user-shield')}
                  className="me-1 flex-shrink-1 my-auto"
                />
                <Link href="/payback/postings/ft/check">Apurar Lançamentos</Link>
              </p>
              <hr />
              <p className="text-center text-md-start px-2 fs-6 fw-bold">
                <FontAwesomeIcon
                  icon={Icon.render('fas', 'history')}
                  className="me-1 flex-shrink-1 my-auto"
                />
                <Link href="/payback/postings/ft/history">
                  Histórico de Lançamentos
                </Link>
              </p>
              <hr />
            </div>
            <div className='d-flex align-items-center justify-content-center col-12 bg-primary bg-gradient rounded p-2'>
              <p className='fs-5 my-auto text-secondary fw-bold text-center'>
                Cartões Alelo
              </p>
            </div>
            <div className='d-flex flex-column flex-md-row align-items-center border-bottom my-3'>
              <p className="text-center text-md-start px-2 fs-6 fw-bold">
                <FontAwesomeIcon
                  icon={Icon.render('fas', 'user-plus')}
                  className="me-1 flex-shrink-1 my-auto"
                />
                <Link href="/payback/cards/link">
                  Associar
                </Link>
              </p>
              <hr />
              <p className="text-center text-md-start px-2 fs-6 fw-bold">
                <FontAwesomeIcon
                  icon={Icon.render('fas', 'user-minus')}
                  className="me-1 flex-shrink-1 my-auto"
                />
                <Link href="/payback/cards/unlink">
                  Desassociar
                </Link>
              </p>
              <hr />
              <p className="text-center text-md-start px-2 fs-6 fw-bold">
                <FontAwesomeIcon
                  icon={Icon.render('fas', 'search')}
                  className="me-1 flex-shrink-1 my-auto"
                />
                <Link href="/payback/cards/links">
                  Verificar Associações
                </Link>
              </p>
              <hr />
            </div>
            <div className='d-flex align-items-center justify-content-center col-12 bg-primary bg-gradient rounded p-2'>
              <p className='fs-5 my-auto text-secondary fw-bold text-center'>
                Relatórios
              </p>
            </div>
            <div className='d-flex flex-column flex-md-row align-items-center border-bottom my-3'>
              <p className="text-center text-md-start px-2 fs-6 fw-bold">
                <FontAwesomeIcon
                  icon={Icon.render('fas', 'flag')}
                  className="me-1 flex-shrink-1 my-auto"
                />
                <Link href="/payback/cards/report/postings">
                  Relatório dos Lançamentos
                </Link>
              </p>
              <hr />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Postings() {
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
    hasPrivilege('administrador', 'ope_gerente', 'ope_coordenador', 'ope_mesa')
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