/**
 * @description Admin -> Users -> Gerenciamento de Usuários
 * @author GuilhermeSantos001
 * @update 15/02/2022
 */

import React, { useEffect, useState } from 'react'

import Button from '@mui/material/Button';

import { useRouter } from 'next/router'

import SkeletonLoader from 'tiny-skeleton-loader-react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from '@/src/utils/fontAwesomeIcons'

import NoPrivilege, { handleClickFunction } from '@/components/noPrivilege'
import NoAuth from '@/components/noAuth'

import { BoxLoadingMagicSpinner } from '@/components/utils/BoxLoadingMagicSpinner'
import { BoxError } from '@/components/utils/BoxError'

import { ListWithFiveColumns } from '@/components/lists/ListWithFiveColumns'
import { LocationInfo } from '@/components/modals/LocationInfo'
import { RegisterUsers } from '@/components/modals/RegisterUsers';

import { PageProps } from '@/pages/_app'
import { GetMenuMain } from '@/bin/GetMenuMain'

import { Variables } from '@/src/db/variables'
import hasPrivilege from '@/src/functions/hasPrivilege'

import Alerting from '@/src/utils/alerting'

import { useUserService } from '@/services/useUserService'
import { useUsersService } from '@/services/useUsersService'

import { UserType, Location } from '@/types/UserType'

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

function compose_ready(
  handleClickBackPage: () => void,
  users: UserType[],
  removeMultipleUsers: (usersAuth: string[]) => Promise<void>,
  handleRemoveUser: (userAuth: string) => Promise<void>,
  showModalLocationInfo: boolean,
  locationInfo: Location,
  locationInfoUsername: string,
  handleChangeLocationInfo: (value: Location) => void,
  handleChangeLocationInfoUsername: (value: string) => void,
  openModalLocationInfo: () => void,
  closeModalLocationInfo: () => void,
  showModalRegisterUsers: boolean,
  openModalRegisterUsers: () => void,
  closeModalRegisterUsers: () => void,
) {
  return (
    <>
      <RegisterUsers show={showModalRegisterUsers} handleClose={closeModalRegisterUsers} />
      <LocationInfo
        show={showModalLocationInfo}
        location={locationInfo}
        username={locationInfoUsername}
        handleClose={closeModalLocationInfo}
      />
      <div className="row g-2">
        <div className="col-12">
          <div className="p-3 bg-primary bg-gradient rounded">
            <p className="text-center text-secondary fw-bold fs-5 my-2">
              <FontAwesomeIcon
                icon={Icon.render('fas', 'users')}
                className="me-2 fs-3 flex-shrink-1 text-secondary my-auto"
              /> Usuários
            </p>
          </div>
          <button
            type="button"
            className="btn btn-link"
            onClick={handleClickBackPage}
          >
            Voltar
          </button>
          <ListWithFiveColumns
            noItemsMessage='Nenhum usuário disponível.'
            pagination={{
              page: 1,
              limit: 10,
              paginationLimit: 10
            }}
            columns={[
              {
                title: 'Nome',
                size: '2'
              },
              {
                title: 'Nome de Usuário',
                size: '2'
              },
              {
                title: 'E-mail',
                size: '2'
              },
              {
                title: 'Privilégio',
                size: '2'
              }
            ]}
            actionMenu={{
              actions: [
                {
                  title: 'Deletar',
                  icon: {
                    prefix: 'fas',
                    name: 'trash'
                  },
                  enabled: true,
                  handleClick: (items) => {
                    if (!items) return;

                    const filter = items.filter(item => {
                      const user = users.find(user => user.authorization === item);

                      if (user && user.privileges.includes('administrador'))
                        return true;

                      return false;
                    });

                    if (filter.length > 0)
                      removeMultipleUsers(filter)
                    else
                      Alerting.create('warning', 'Nenhum usuário pode ser removido.')
                  }
                },
              ]
            }}
            lines={[...users]
              .map((item: UserType) => {
                return {
                  id: item.authorization,
                  values: [
                    {
                      data: `${item.name} ${item.surname}`,
                      size: '2'
                    },
                    {
                      data: item.username,
                      size: '2'
                    },
                    {
                      data: item.email,
                      size: '2'
                    },
                    {
                      data: item.privilege,
                      size: '2'
                    }
                  ],
                  actions: [
                    {
                      icon: {
                        prefix: 'fas',
                        name: 'location-dot'
                      },
                      enabled: item.location ? true : false,
                      handleClick: () => {
                        handleChangeLocationInfo(item.location);
                        handleChangeLocationInfoUsername(item.username);
                        openModalLocationInfo();
                      },
                      popover: {
                        title: 'Localização',
                        description: 'Clique para ver a localização do usuário.'
                      }
                    },
                    {
                      icon: {
                        prefix: 'fas',
                        name: 'trash'
                      },
                      enabled: !item.privileges.includes('administrador'),
                      handleClick: () => {
                        if (item.privileges.includes('administrador'))
                          return Alerting.create('error', 'O usuário não pode ser removido.');

                        handleRemoveUser(item.authorization);
                      },
                      popover: {
                        title: 'Deletar usuário',
                        description: 'Você só poderá deletar os usuários que não forem administradores.'
                      }
                    }
                  ]
                }
              })}
          />
          <Button variant={'contained'} className='col-12' onClick={openModalRegisterUsers}>
            <FontAwesomeIcon
              icon={Icon.render('fas', 'plus-square')}
              className="me-2 flex-shrink-1 my-auto"
            />
            Registrar
          </Button>
        </div>
      </div>
    </>
  )
}

export default function Users() {
  const [syncData, setSyncData] = useState<boolean>(false)

  const [isReady, setReady] = useState<boolean>(false)
  const [notPrivilege, setNotPrivilege] = useState<boolean>(false)
  const [notAuth, setNotAuth] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  const [showModalLocationInfo, setShowModalLocationInfo] = useState<boolean>(false)
  const [locationInfo, setLocationInfo] = useState<Location>({
    street: '???',
    number: 0,
    complement: '???',
    district: '???',
    state: '???',
    city: '???',
    zipcode: '???'
  })
  const [locationInfoUsername, setLocationInfoUsername] = useState<string>('')

  const [showModalRegisterUsers, setShowModalRegisterUsers] = useState<boolean>(false)

  const { create: CreateUser } = useUserService();
  const { data: users, isLoading: isLoadingUsers, update: UpdateUsers, delete: DeleteUsers } = useUsersService();

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
    },
    handleClickBackPage = () => router.push('/admin'),
    handleRemoveUser = async (auth: string) => {
      if (!DeleteUsers)
        return Alerting.create('error', 'Não foi possível remover o usuário. Tente novamente, mais tarde!');

      const remove = await DeleteUsers(auth);

      if (!remove)
        return Alerting.create('error', 'Não foi possível remover o usuário. Tente novamente com outra autorização.');

      Alerting.create('success', 'Cartão deletado com sucesso!');
    },
    removeMultipleUsers = async (usersAuth: string[]) => usersAuth.forEach(async (auth) => {
      if (DeleteUsers) {
        const remove = await DeleteUsers(auth);

        if (remove)
          return Alerting.create('success', 'Cartão deletado com sucesso!');
      }
    }),
    handleChangeLocationInfo = (value: Location) => setLocationInfo(value),
    handleChangeLocationInfoUsername = (value: string) => setLocationInfoUsername(value),
    openModalLocationInfo = () => setShowModalLocationInfo(true),
    closeModalLocationInfo = () => setShowModalLocationInfo(false),
    openModalRegisterUsers = () => setShowModalRegisterUsers(true),
    closeModalRegisterUsers = () => setShowModalRegisterUsers(false);

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

  if (
    isLoadingUsers && !syncData
  )
    return <BoxLoadingMagicSpinner />

  if (
    !syncData
    && users
  ) {
    setSyncData(true);
  } else if (
    !syncData && !users
    || !syncData && !CreateUser
    || !syncData && !UpdateUsers
    || !syncData && !DeleteUsers
  ) {
    return <BoxError />
  }

  if (loading) return compose_load()

  if (notPrivilege) return compose_noPrivilege(handleClickNoPrivilege)

  if (notAuth) return compose_noAuth(handleClickNoAuth)

  if (isReady) return compose_ready(
    handleClickBackPage,
    users,
    removeMultipleUsers,
    handleRemoveUser,
    showModalLocationInfo,
    locationInfo,
    locationInfoUsername,
    handleChangeLocationInfo,
    handleChangeLocationInfoUsername,
    openModalLocationInfo,
    closeModalLocationInfo,
    showModalRegisterUsers,
    openModalRegisterUsers,
    closeModalRegisterUsers,
  )
}