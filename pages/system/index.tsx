import { useState } from 'react'

import { GetServerSidePropsContext } from 'next/types'

import { useGetUserInfoService } from '@/services/graphql/useGetUserInfoService'

import { compressToEncodedURIComponent } from 'lz-string'

import Image from 'next/image'
import { useRouter } from 'next/router'

import SkeletonLoader from 'tiny-skeleton-loader-react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from '@/src/utils/fontAwesomeIcons'

import { handleClickFunction } from '@/components/noPrivilege'
import NoAuth from '@/components/noAuth'

import Sugar from 'sugar'
import DateEx from '@/src/utils/dateEx'

import { PageProps } from '@/pages/_app'
import { GetMenuMain } from '@/bin/GetMenuMain'
import { GetUpdates } from '@/bin/GetUpdates'

interface PageData {
  photoProfile: string
  username: string
  privilege: string
}

const serverSideProps: PageProps = {
  title: 'System/Home',
  description: 'Grupo Mave Digital seu ambiente de trabalho integrado',
  themeColor: '#004a6e',
  menu: GetMenuMain('mn-account-profile')
}

export const getServerSideProps = async ({ req }: GetServerSidePropsContext) => {
  return {
    props: {
      ...serverSideProps,
      auth: req.cookies.auth,
      getUserInfoAuthorization: process.env.GRAPHQL_AUTHORIZATION_GETUSERINFO!,
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

function compose_noAuth(handleClick: handleClickFunction) {
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
        <div className="p-3 bg-light-gray rounded overflow-auto h-75">
          {
            GetUpdates().map(update => (
              <div key={update.id} className="my-1 text-primary">
                {
                  update.title && update.title.length > 0 &&
                  <h5 className='p-2 text-center fw-bold border-bottom'>{update.title}</h5>
                }
                <p className="px-2 fs-6 fw-bold" style={{ textAlign: 'justify' }}>
                  <FontAwesomeIcon
                    icon={Icon.render(update.iconFamily, update.iconName)}
                    className="me-1 flex-shrink-1 my-auto"
                  />
                  {update.message}
                </p>
                <p className="px-2 fs-6 text-muted">
                  {Sugar.String.capitalize(DateEx.formatDistance(new Date(), new Date(update.createdAt.year, update.createdAt.month, update.createdAt.day)))}
                </p>
                <hr />
              </div>
            ))
          }
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
        <div className="p-3 bg-light-gray rounded overflow-auto h-75">
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

export default function System(
  {
    auth,
    getUserInfoAuthorization,
  }: {
    auth: string,
    getUserInfoAuthorization: string
  }
) {
  const [isReady, setReady] = useState<boolean>(false)
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
    }

  if (error && !notAuth) {
    setNotAuth(true);
    setLoading(false);
  }

  if (success && data && !isReady) {
    setReady(true);
    setLoading(false);
  }

  if (loading) return compose_load()

  if (notAuth) return compose_noAuth(handleClickNoAuth)

  if (isReady) return compose_ready({
    photoProfile: data?.photoProfile || '',
    username: data?.username || '???',
    privilege: data?.privilege || '???',
  });
}