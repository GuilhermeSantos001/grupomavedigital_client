import { useState } from 'react'

import { GetServerSidePropsContext } from 'next/types'

import { useGetUserInfoService } from '@/services/graphql/useGetUserInfoService'

import { verifyCookie } from '@/lib/verifyCookie'

import { compressToEncodedURIComponent } from 'lz-string'

import Link from 'next/link'

import { useRouter } from 'next/router'

import SkeletonLoader from 'tiny-skeleton-loader-react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from '@/src/utils/fontAwesomeIcons'

import NoPrivilege, { handleClickFunction } from '@/components/noPrivilege'
import NoAuth from '@/components/noAuth'

import { PageProps } from '@/pages/_app'
import { GetMenuMain } from '@/bin/GetMenuMain'
import { PrivilegesSystem } from '@/types/UserType'

const serverSideProps: PageProps = {
  title: 'Pagamentos/Cartões Benefício',
  description: 'Cartões Benefício',
  themeColor: '#004a6e',
  menu: GetMenuMain('mn-payback')
}

export const getServerSideProps = async ({ req }: GetServerSidePropsContext) => {
  const privileges: PrivilegesSystem[] = [
    'administrador',
    'fin_gerente',
    'fin_faturamento',
    'fin_assistente'
  ]

  return {
    props: {
      ...serverSideProps,
      privileges,
      auth: await verifyCookie(req.cookies.auth),
      getUserInfoAuthorization: process.env.GRAPHQL_AUTHORIZATION_GETUSERINFO!,
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
              icon={Icon.render('fas', 'id-card')}
              className="me-2 fs-3 flex-shrink-1 text-secondary my-auto"
            /> Alelo - Cartões Benefício
          </p>
        </div>
        <div className="p-3 bg-light-gray rounded overflow-auto">
          <div className="my-1 text-primary">
            <div className='d-flex align-items-center justify-content-center col-12 bg-primary bg-gradient rounded p-2'>
              <p className='fs-5 my-auto text-secondary fw-bold text-center'>
                Cartões
              </p>
            </div>
            <div className='d-flex flex-column flex-md-row align-items-center border-bottom my-3'>
              <p className="text-center text-md-start px-2 fs-6 fw-bold">
                <FontAwesomeIcon
                  icon={Icon.render('fas', 'plus-square')}
                  className="me-1 flex-shrink-1 my-auto"
                />
                <Link href="/payback/cards/register">Registrar</Link>
              </p>
              <hr />
              <p className="text-center text-md-start px-2 fs-6 fw-bold">
                <FontAwesomeIcon
                  icon={Icon.render('fas', 'minus-square')}
                  className="me-1 flex-shrink-1 my-auto"
                />
                <Link href="/payback/cards/remove">Remover</Link>
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
                <Link href="/payback/cards/titles/pay">
                  Títulos a Pagar
                </Link>
              </p>
              <hr />
              <p className="text-center text-md-start px-2 fs-6 fw-bold">
                <FontAwesomeIcon
                  icon={Icon.render('fas', 'money-check-alt')}
                  className="me-1 flex-shrink-1 my-auto"
                />
                <Link href="/payback/cards/titles/paid">
                  Títulos Pagos
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Cards(
  {
    privileges,
    auth,
    getUserInfoAuthorization,
  }: {
    privileges: PrivilegesSystem[],
    auth: string,
    getUserInfoAuthorization: string
  }
) {
  const [isReady, setReady] = useState<boolean>(false)
  const [notPrivilege, setNotPrivilege] = useState<boolean>(false)
  const [notAuth, setNotAuth] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  const { success, data, error } = useGetUserInfoService(
    {
      auth: compressToEncodedURIComponent(auth),
    },
    {
      authorization: getUserInfoAuthorization,
      encodeuri: 'true'
    }
  );

  const router = useRouter()

  const
    handleClickNoAuth: handleClickFunction = async (
      event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
      path: string
    ) => {
      event.preventDefault();
      if (path === '/auth/login')
        router.push(path);
    },
    handleClickNoPrivilege: handleClickFunction = async (
      event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
      path: string
    ) => {
      event.preventDefault()
      router.push(path)
    };

  if (error && !notAuth) {
    setNotAuth(true);
    setLoading(false);
  }

  if (success && data && !isReady) {
    if (
      privileges
        .filter(privilege => data.privileges.indexOf(privilege) !== -1)
        .length <= 0
    )
      setNotPrivilege(true);

    setReady(true);
    setLoading(false);
  }

  if (loading) return compose_load()

  if (notPrivilege) return compose_noPrivilege(handleClickNoPrivilege)

  if (notAuth) return compose_noAuth(handleClickNoAuth)

  if (isReady) return compose_ready()
}