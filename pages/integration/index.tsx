import { useState } from 'react'

import { GetServerSidePropsContext } from 'next/types'

import { useGetUserInfoService } from '@/services/graphql/useGetUserInfoService'

import { verifyCookie } from '@/lib/verifyCookie'

import { compressToEncodedURIComponent } from 'lz-string'

import { useRouter } from 'next/router'

import type { APIKeyType } from '@/types/APIKeyType'

import type {
  FunctionCreateAPIKeyTypeof,
  FunctionDeleteAPIKeysTypeof,
} from '@/types/APIKeyServiceType'

import {
  useAPIKeyService
} from '@/services/useAPIKeyService'

import {
  useAPIKeysService
} from '@/services/useAPIKeysService'

import SkeletonLoader from 'tiny-skeleton-loader-react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from '@/src/utils/fontAwesomeIcons'

import NoPrivilege, { handleClickFunction } from '@/components/noPrivilege'
import NoAuth from '@/components/noAuth'
import { RegisterAPIKey } from '@/components/modals/RegisterAPIKey'
import { Button } from 'react-bootstrap'

import { PageProps } from '@/pages/_app'
import { GetMenuMain } from '@/bin/GetMenuMain'
import { PrivilegesSystem } from '@/types/UserType'

import { copyTextToClipboard } from '@/src/functions/copyTextToClipboard';

import Alerting from '@/src/utils/alerting'

const serverSideProps: PageProps = {
  title: 'Integração/API',
  description: 'Gerencie suas chaves de API e execute testes de rota.',
  themeColor: '#004a6e',
  menu: GetMenuMain('mn-integration')
}

export const getServerSideProps = async ({ req }: GetServerSidePropsContext) => {
  const privileges: PrivilegesSystem[] = [
    'common'
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

function compose_ready(
  optionSelect: string,
  username: string,
  userMail: string,
  handleChangeOption: (option: string) => void,
  showModalRegisterAPIKey: boolean,
  handleOpenModalRegisterAPIKey: () => void,
  handleCloseModalRegisterAPIKey: () => void,
  APIKeys: APIKeyType[],
  isLoadingAPIKey: boolean,
  CreateAPIKey: FunctionCreateAPIKeyTypeof,
  handleDeleteAPIKeys: FunctionDeleteAPIKeysTypeof
) {
  return (
    <>
      <RegisterAPIKey
        show={showModalRegisterAPIKey}
        username={username}
        userMail={userMail}
        createAPIKey={CreateAPIKey}
        isLoadingAPIKey={isLoadingAPIKey}
        handleClose={handleCloseModalRegisterAPIKey}
      />
      <div className='d-flex flex-column flex-md-row p-2 m-2'>
        <div className='d-flex flex-column col-12 col-md-6 px-2'>
          <div className='d-flex flex-row bg-primary bg-gradient text-secondary text-bold align-items-center rounded p-2 my-2'>
            <Button
              variant="link"
              className={`col-11 fs-3 ${optionSelect === 'keys_api' ? 'text-secondary' : 'text-white'} text-start`}
              onClick={() => handleChangeOption('keys_api')}
            >
              Chaves de API
            </Button>
            <FontAwesomeIcon
              icon={Icon.render('fas', 'key')}
              className="col fs-3 flex-shrink-1 my-auto"
            />
          </div>
        </div>
        <div className='d-flex flex-column col-12 col-md-6 ms-md-2 border overflow-auto' style={{ height: '80vh' }}>
          {
            optionSelect === 'none' &&
            <>
              <div className='d-flex flex-row bg-light-gray justify-content-center align-items-center' style={{ height: '100%' }}>
                <div className='d-flex flex-column justify-content-center align-items-center text-muted fw-bold'>
                  <FontAwesomeIcon
                    icon={Icon.render('fas', 'book-open')}
                    className="col flex-shrink-1 my-auto"
                  />
                  <p className='fs-3'>SELECIONE UMA OPÇÃO</p>
                </div>
              </div>
            </>
          }
          {
            optionSelect === 'keys_api' &&
            <div className='d-flex flex-column p-2' style={{ height: '100%' }}>
              <Button
                variant="primary"
                className='col-12 fs-3 bg-gradient text-start hover-color hover-light'
                onClick={handleOpenModalRegisterAPIKey}
              >
                <FontAwesomeIcon
                  icon={Icon.render('fas', 'key')}
                  className="col me-2 flex-shrink-1 my-auto"
                  style={{ fontSize: '1.5rem' }}
                />
                Adicionar
              </Button>
              <hr />
              {
                APIKeys.map(key => (
                  <div key={key.id} className='d-flex flex-row align-items-center bg-primary bg-gradient rounded m-2 p-2'>
                    <div className='col-1'>
                      <FontAwesomeIcon
                        icon={Icon.render('fas', 'key')}
                        className="col text-secondary flex-shrink-1 my-auto"
                        style={{ fontSize: '1.5rem' }}
                      />
                    </div>
                    <div title={key.title} className='col ps-1 text-truncate'>
                      <p className='fs-3 text-truncate text-white my-auto'>{key.title}</p>
                    </div>
                    <div className='col-4 col-md-2 text-end'>
                      <FontAwesomeIcon
                        title='Copiar a chave de API'
                        icon={Icon.render('fas', 'copy')}
                        className="col mx-1 hover-color hover-light flex-shrink-1 my-auto"
                        style={{ fontSize: '1rem' }}
                        onClick={() => {
                          Alerting.create('success', 'Chave copiada com sucesso!');
                          copyTextToClipboard(key.key);
                        }}
                      />
                      <FontAwesomeIcon
                        title='Copiar a palavra-passe'
                        icon={Icon.render('fas', 'key')}
                        className="col mx-1 hover-color hover-light flex-shrink-1 my-auto"
                        style={{ fontSize: '1rem' }}
                        onClick={() => {
                          Alerting.create('success', 'Palavra-passe copiada com sucesso!');
                          copyTextToClipboard(key.passphrase);
                        }}
                      />
                      <FontAwesomeIcon
                        title='Deletar a chave de API'
                        icon={Icon.render('fas', 'trash')}
                        className="col mx-1 hover-color hover-light flex-shrink-1 my-auto"
                        style={{ fontSize: '1rem' }}
                        onClick={async () => {
                          try {
                            if (handleDeleteAPIKeys) {
                              const response = await handleDeleteAPIKeys(key.passphrase);

                              if (response)
                                return Alerting.create('success', 'Chave de API removida com sucesso!');
                            }

                            throw new Error('handleDeleteAPIKeys is undefined');
                          } catch {
                            Alerting.create('error', 'Erro ao remover a chave de API.');
                          }
                        }}
                      />
                    </div>
                  </div>
                ))
              }
            </div>
          }
        </div>
      </div>
    </>
  )
}

export default function Integration(
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

  const [username, setUsername] = useState<string>('')
  const [userMail, setUserMail] = useState<string>('')

  const [optionSelect, setOptionSelect] = useState<string>('none')
  const [showModalRegisterAPIKey, setShowModalRegisterAPIKey] = useState<boolean>(false)

  const { success, data, error } = useGetUserInfoService(
    {
      auth: compressToEncodedURIComponent(auth),
    },
    {
      authorization: getUserInfoAuthorization,
      encodeuri: 'true'
    }
  );

  const { isLoading: isLoadingAPIKey, create: CreateAPIKey } = useAPIKeyService();
  const { data: APIKeys, delete: handleDeleteAPIKeys } = useAPIKeysService();

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
    },
    handleChangeOption = (option: string) => setOptionSelect(option),
    handleOpenModalRegisterAPIKey = () => setShowModalRegisterAPIKey(true),
    handleCloseModalRegisterAPIKey = () => setShowModalRegisterAPIKey(false);

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

  if (data && username.length <= 0 && userMail.length <= 0) {
    const { username, email } = data;

    setUsername(username);
    setUserMail(email);
  }

  if (loading) return compose_load()

  if (notPrivilege) return compose_noPrivilege(handleClickNoPrivilege)

  if (notAuth) return compose_noAuth(handleClickNoAuth)

  if (isReady) return compose_ready(
    optionSelect,
    username,
    userMail,
    handleChangeOption,
    showModalRegisterAPIKey,
    handleOpenModalRegisterAPIKey,
    handleCloseModalRegisterAPIKey,
    APIKeys,
    isLoadingAPIKey,
    CreateAPIKey,
    handleDeleteAPIKeys
  )
}