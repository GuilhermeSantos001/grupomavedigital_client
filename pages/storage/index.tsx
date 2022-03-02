/**
 * @description Gestor online de documentos -> Pagina Inicial
 * @author GuilhermeSantos001
 * @update 02/02/2022
 */

import React, { useEffect, useState } from 'react'

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
import { getPrivileges } from '@/src/functions/getPrivilege'

import Alerting from '@/src/utils/alerting';

import { PrivilegesSystem } from "@/pages/_app"

export interface Matches {
  specialCharacters: RegExp;
  mail: RegExp;
}

const serverSideProps: PageProps = {
  title: 'System/Storage',
  description: 'Gestor de documentos online do Grupo Mave Digital',
  themeColor: '#004a6e',
  menu: GetMenuMain('mn-herculesStorage')
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

function compose_noPrivilege(handleClick: handleClickFunction) {
  return <NoPrivilege handleClick={handleClick} />
}

function compose_noAuth(handleClick: handleClickFunction) {
  return <NoAuth handleClick={handleClick} />
}

function compose_ready(
  privileges: string[],
  handleClickFolder: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, path: string) => Promise<void>
) {
  return (
    <>
      <div className="row g-2">
        <div className="col-12">
          <div className="p-3 bg-primary bg-gradient rounded">
            <div className="d-flex bd-highlight">
              <div className="p-2 w-100 bd-highlight">
                <p className="text-start text-secondary fw-bold fs-5 my-2">
                  Pastas Disponíveis
                </p>
              </div>
              <div className="p-2 flex-shrink-1 bd-highlight my-2">
                <FontAwesomeIcon
                  icon={Icon.render('fas', 'folder-open')}
                  className="ms-2 fs-3 flex-shrink-1 text-secondary my-auto"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="px-3">
          {render_folders(privileges, handleClickFolder)}
          <div className="px-2">
            <hr />
          </div>
        </div>
      </div>
    </>
  )
}

function render_folders(
  privileges: string[],
  handleClickFolder: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, path: string) => Promise<void>
) {
  const
    folders: { [keyof: string]: { name: string, url: string, group: string[] } } = {
      ti: {
        name: 'Tecnologia da Informação',
        url: '/storage/ti',
        group: [
          'administrador',
          'moderador',
          'supervisor',
          'diretoria'
        ]
      }
    },
    foldersRender: Record<string, boolean> = {},
    elements: JSX.Element[] = [];

  for (const key of Object.keys(folders)) {
    elements.push(render_folderTree(privileges, key, handleClickFolder, folders, foldersRender));
  }

  return elements;
}

function render_folderTree(
  privileges: string[],
  key: string,
  handleClickFolder: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, path: string) => Promise<void>,
  folders: { [keyof: string]: { name: string, url: string, group: string[] } },
  foldersRender: Record<string, boolean>
) {
  return (
    <div className="col-12" key={key}>
      {render_folder(hasFolderRender(foldersRender, folders[key].name, privileges, folders[key].group), folders[key].name, folders[key].url, handleClickFolder, foldersRender)}
    </div>
  )
}

function hasFolderRender(
  foldersRender: Record<string, boolean>,
  folder: string,
  privileges: string[],
  groups: string[]
) {
  if (foldersRender[folder.toLowerCase()])
    return false;

  return privileges.filter(priv => groups.includes(priv)).length > 0;
}

function render_folder(
  active: boolean,
  title: string,
  url: string,
  handleClickFolder: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, path: string) => Promise<void>,
  foldersRender: Record<string, boolean>
) {
  foldersRender[title.toLowerCase()] = true;

  return (
    <button
      type="button"
      className="btn btn-primary bg-gradient col-12 my-2 fw-bold rounded"
      style={{ height: "2.8rem" }}
      onClick={(e) => {
        if (active)
          return handleClickFolder(e, url);

        Alerting.create('error', 'Você não tem permissão para acessar esta pasta.');
      }}
      disabled={active ? false : true}
    >
      <div className="d-flex bd-highlight">
        <div className="p-1 w-100 bd-highlight">
          <p className="text-start text-secondary fw-bold">
            {title} {`${!active ? '(Sem Autorização)' : ''}`}
          </p>
        </div>
        <div className="p-1 flex-shrink-1 bd-highlight">
          <FontAwesomeIcon
            icon={Icon.render('fas', 'folder')}
            className="ms-2 flex-shrink-1 text-secondary my-auto"
          />
        </div>
      </div>
    </button>
  )
}

export default function Storage() {
  const [isReady, setReady] = useState<boolean>(false)
  const [isError, setError] = useState<boolean>(false)
  const [notPrivilege, setNotPrivilege] = useState<boolean>(false)
  const [notAuth, setNotAuth] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [privileges, setPrivileges] = useState<string[]>([])

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
    handleClickFolder = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, path: string) => {
      e.preventDefault()
      router.push(path)
    }

  useEffect(() => {
    hasPrivilege('common')
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

  if (isReady)
    return compose_ready(privileges, handleClickFolder)
}

export async function getGroupId(): Promise<PrivilegesSystem[]> {
  return await getPrivileges();
}

export async function getUserAuth(): Promise<string> {
  const variables = new Variables(1, 'IndexedDB');

  return await variables.get<string>('auth');
}

export const matches: Matches = {
  // eslint-disable-next-line no-useless-escape
  specialCharacters: /[\!\@\#\$\%\¨\U+0060\U+00b4\&\*\(\)\-\_\+\=\§\}\º\{\}\[\]\'\"\/\.\,\;\<\>\^\~\?\|\\]/g,
  mail: /^([\w-.]+@([\w-]+.)+[\w-]{2,4})?$/g
};