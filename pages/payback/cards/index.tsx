/**
 * @description Payback -> Cartões Beneficio (Alelo)
 * @author GuilhermeSantos001
 * @update 21/01/2022
 */

import { useEffect, useState } from 'react'

import Link from 'next/link'

import { useRouter } from 'next/router'

import SkeletonLoader from 'tiny-skeleton-loader-react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from '@/src/utils/fontAwesomeIcons'

import NoPrivilege from '@/components/noPrivilege'
import NoAuth from '@/components/noAuth'

import { PageProps } from '@/pages/_app'
import PageMenu from '@/bin/main_menu'

import Variables from '@/src/db/variables'
import hasPrivilege from '@/src/functions/hasPrivilege'

const serverSideProps: PageProps = {
  title: 'Pagamentos/Cartões Benefício',
  description: 'Cartões Benefício',
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

function compose_noPrivilege(handleClick) {
  return <NoPrivilege handleClick={handleClick} />
}

function compose_noAuth(handleClick) {
  return <NoAuth handleClick={handleClick} />
}

function compose_ready() {
  return (
    <div className="row g-2">
      <div className="col-12">
        <div className="p-3 bg-primary bg-gradient rounded">
          <p className="text-center text-secondary fw-bold fs-5 my-2">
            <FontAwesomeIcon
              icon={Icon.render('fas', 'id-card')}
              className="me-2 fs-3 flex-shrink-1 text-secondary my-auto"
            /> Alelo - Cartões Benefício
          </p>
        </div>
        <div className="p-3 bg-light-gray rounded overflow-auto">
          <div className="my-1 text-primary">
            <div className='d-flex align-items-center justify-content-center col-12 bg-primary bg-gradient rounded p-2'>
              <p className='fs-5 my-auto text-secondary fw-bold text-center'>
                Lotes
              </p>
            </div>
            <div className='d-flex flex-column flex-md-row align-items-center border-bottom my-3'>
              <p className="text-center text-md-start px-2 fs-6 fw-bold">
                <FontAwesomeIcon
                  icon={Icon.render('fas', 'plus-square')}
                  className="me-1 flex-shrink-1 my-auto"
                />
                <Link href="/payback/cards/register">Registrar Lote</Link>
              </p>
              <hr />
              <p className="text-center text-md-start px-2 fs-6 fw-bold">
                <FontAwesomeIcon
                  icon={Icon.render('fas', 'minus-square')}
                  className="me-1 flex-shrink-1 my-auto"
                />
                <Link href="/payback/cards/remove">Remover Lote</Link>
              </p>
              <hr />
            </div>
            <div className='d-flex align-items-center justify-content-center col-12 bg-primary bg-gradient rounded p-2'>
              <p className='fs-5 my-auto text-secondary fw-bold text-center'>
                Títulos
              </p>
            </div>
            <div className='d-flex flex-column flex-md-row align-items-center border-bottom my-3'>
              <p className="text-center text-md-start px-2 fs-6 fw-bold">
                <FontAwesomeIcon
                  icon={Icon.render('fas', 'money-check')}
                  className="me-1 flex-shrink-1 my-auto"
                />
                <Link href="/payback/titles/pay">
                  Títulos a Pagar
                </Link>
              </p>
              <hr />
              <p className="text-center text-md-start px-2 fs-6 fw-bold">
                <FontAwesomeIcon
                  icon={Icon.render('fas', 'money-check-alt')}
                  className="me-1 flex-shrink-1 my-auto"
                />
                <Link href="/payback/titles/paid">
                  Títulos Pagos
                </Link>
              </p>
              <hr />
            </div>
            <div className='d-flex align-items-center justify-content-center col-12 bg-primary bg-gradient rounded p-2'>
              <p className='fs-5 my-auto text-secondary fw-bold text-center'>
                Cartões
              </p>
            </div>
            <div className='d-flex flex-column flex-md-row align-items-center border-bottom my-3'>
              <p className="text-center text-md-start px-2 fs-6 fw-bold">
                <FontAwesomeIcon
                  icon={Icon.render('fas', 'dollar-sign')}
                  className="me-1 flex-shrink-1 my-auto"
                />
                <Link href="/payback/cards/credit">
                  Creditar Cartões
                </Link>
              </p>
              <hr />
              <p className="text-center text-md-start px-2 fs-6 fw-bold">
                <FontAwesomeIcon
                  icon={Icon.render('fas', 'user-lock')}
                  className="me-1 flex-shrink-1 my-auto"
                />
                <Link href="/payback/cards/lock">
                  Bloquear Cartões
                </Link>
              </p>
              <hr />
              <p className="text-center text-md-start px-2 fs-6 fw-bold">
                <FontAwesomeIcon
                  icon={Icon.render('fas', 'unlock-alt')}
                  className="me-1 flex-shrink-1 my-auto"
                />
                <Link href="/payback/cards/unlock">
                  Desbloquear Cartões
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
                <Link href="/payback/cards/report/credit">
                  Relatório dos Créditos
                </Link>
              </p>
              <hr />
              <p className="text-center text-md-start px-2 fs-6 fw-bold">
                <FontAwesomeIcon
                  icon={Icon.render('fas', 'flag')}
                  className="me-1 flex-shrink-1 my-auto"
                />
                <Link href="/payback/cards/report/cards">
                  Relatório dos Cartões
                </Link>
              </p>
              <hr />
              <p className="text-center text-md-start px-2 fs-6 fw-bold">
                <FontAwesomeIcon
                  icon={Icon.render('fas', 'flag')}
                  className="me-1 flex-shrink-1 my-auto"
                />
                <Link href="/payback/cards/report/link">
                  Relatório das Associações
                </Link>
              </p>
              <hr />
              <p className="text-center text-md-start px-2 fs-6 fw-bold">
                <FontAwesomeIcon
                  icon={Icon.render('fas', 'flag')}
                  className="me-1 flex-shrink-1 my-auto"
                />
                <Link href="/payback/cards/report/lots">
                  Relatório dos Lotes
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

export default function Cards() {
  const [isReady, setReady] = useState<boolean>(false)
  const [notPrivilege, setNotPrivilege] = useState<boolean>(false)
  const [notAuth, setNotAuth] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  const router = useRouter()

  const
    handleClickNoAuth = async (e, path) => {
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
    hasPrivilege('administrador', 'fin_gerente', 'fin_assistente')
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