import React, { useState } from 'react'

import { GetServerSidePropsContext } from 'next/types'

import { useGetUserInfoService } from '@/services/graphql/useGetUserInfoService'

import { compressToEncodedURIComponent } from 'lz-string'

import { useRouter } from 'next/router'

import SkeletonLoader from 'tiny-skeleton-loader-react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from '@/src/utils/fontAwesomeIcons'

import NoPrivilege, { handleClickFunction } from '@/components/noPrivilege'
import NoAuth from '@/components/noAuth'

import { ModuleCardControl } from '@/components/cards/ModuleCardControl'

import { PageProps } from '@/pages/_app'
import { GetMenuMain } from '@/bin/GetMenuMain'
import { PrivilegesSystem } from '@/types/UserType'

const serverSideProps: PageProps = {
  title: 'Pagamentos/Lançamentos Operacionais',
  description: 'Lançamentos Operacionais',
  themeColor: '#004a6e',
  menu: GetMenuMain('mn-payback')
}

export const getServerSideProps = async ({ req }: GetServerSidePropsContext) => {
  const privileges: PrivilegesSystem[] = [
    'administrador',
    'ope_gerente',
    'ope_coordenador',
    'ope_mesa'
  ]

  return {
    props: {
      ...serverSideProps,
      privileges,
      auth: req.cookies.auth,
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
            <div className='d-flex flex-column flex-md-row align-items-center my-2'>
              <ModuleCardControl
                title='Registrar'
                subtitle='Registre novos lançamentos de FT/FREE.'
                link={"/payback/postings/ft/register"}
              />
              <ModuleCardControl
                title='Verificar'
                subtitle='Aprove e/ou reprove lançamentos de FT/FREE.'
                link={"/payback/postings/ft/check"}
              />
            </div>
            <div className='d-flex align-items-center justify-content-center col-12 bg-primary bg-gradient rounded p-2'>
              <p className='fs-5 my-auto text-secondary fw-bold text-center'>
                B2
              </p>
            </div>
            <div className='d-flex flex-column flex-md-row align-items-center my-2'>
              <ModuleCardControl
                title='Controle'
                subtitle='Registre, atualize e remova pessoas do B2.'
                link={"/payback/postings/b2/manager"}
              />
              <ModuleCardControl
                title='Histórico de Pagamento'
                subtitle='Confira os pagamentos realizados no B2.'
                link={"/payback/postings/b2/paycheck"}
              />
            </div>
            <div className='d-flex align-items-center justify-content-center col-12 bg-primary bg-gradient rounded p-2'>
              <p className='fs-5 my-auto text-secondary fw-bold text-center'>
                Pacote de Horas
              </p>
            </div>
            <div className='d-flex flex-column flex-md-row align-items-center my-2'>
              <ModuleCardControl
                title='Controle'
                subtitle='Registre, atualize e remova pessoas do Pacote de Horas.'
                link={"/payback/postings/ph/manager"}
              />
              <ModuleCardControl
                title='Histórico de Pagamento'
                subtitle='Confira os pagamentos realizados no Pacote de Horas.'
                link={"/payback/postings/ph/paycheck"}
              />
            </div>
            <div className='d-flex align-items-center justify-content-center col-12 bg-primary bg-gradient rounded p-2'>
              <p className='fs-5 my-auto text-secondary fw-bold text-center'>
                Cartões Alelo
              </p>
            </div>
            <div className='d-flex flex-column flex-md-row align-items-center my-2'>
              <ModuleCardControl
                title='Controle'
                subtitle='Associe/Dessaassocie os cartões dos colaboradores.'
                link={"/payback/cards/manager"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Postings(
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
      event.preventDefault();
      router.push(path);
    }

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