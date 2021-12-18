/**
 * @description Gestor online de documentos -> Pagina Inicial
 * @author @GuilhermeSantos001
 * @update 16/12/2021
 */

import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/router'

import SkeletonLoader from 'tiny-skeleton-loader-react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from '@/src/utils/fontAwesomeIcons'

import RenderPageError from '@/components/renderPageError'
import NoPrivilege from '@/components/noPrivilege'
import NoAuth from '@/components/noAuth'

import { PageProps } from '@/pages/_app'
import PageMenu from '@/bin/main_menu'

import Fetch from '@/src/utils/fetch'
import Variables from '@/src/db/variables'
import { tokenValidate } from '@/src/functions/tokenValidate'
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
  menu: PageMenu('mn-herculesStorage')
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

function compose_error(handleClick) {
  return <RenderPageError handleClick={handleClick} />
}

function compose_noPrivilege(handleClick) {
  return <NoPrivilege handleClick={handleClick} />
}

function compose_noAuth(handleClick) {
  return <NoAuth handleClick={handleClick} />
}

function compose_ready(
  privileges: string[],
  handleClickFolder
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
  handleClickFolder
) {
  const
    folders = {
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
  handleClickFolder,
  folders,
  foldersRender
) {
  return (
    <div className="col-12" key={key}>
      {render_folder(hasFolderRender(foldersRender, folders[key].name, privileges, folders[key].group), folders[key].name, folders[key].url, handleClickFolder, foldersRender)}
    </div>
  )
}

function hasFolderRender(foldersRender, folder: string, privileges: string[], groups: string[]) {
  if (foldersRender[folder.toLowerCase()])
    return false;

  return privileges.filter(priv => groups.includes(priv)).length > 0;
}

function render_folder(active: boolean, title: string, url: string, handleClickFolder, foldersRender) {
  foldersRender[title.toLowerCase()] = true;

  return (
    <button
      type="button"
      className="btn btn-primary bg-gradient col-12 my-2 fw-bold rounded"
      style={{ height: "2.8rem" }}
      onClick={(e) => {
        if (active)
          return handleClickFolder(e, url);

        Alerting.create('Você não tem permissão para acessar esta pasta.');
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

const Storage = (): JSX.Element => {
  const [isReady, setReady] = useState<boolean>(false)
  const [isError, setError] = useState<boolean>(false)
  const [notPrivilege, setNotPrivilege] = useState<boolean>(false)
  const [notAuth, setNotAuth] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [privileges, setPrivilages] = useState<string[]>([])

  const router = useRouter()
  const _fetch = new Fetch(process.env.NEXT_PUBLIC_GRAPHQL_HOST)

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
    },
    handleClickFolder = async (e, path) => {
      e.preventDefault()
      router.push(path)
    }

  useEffect(() => {
    const timer = setTimeout(async () => {
      const isAllowViewPage = await tokenValidate(_fetch);

      if (!isAllowViewPage) {
        setNotAuth(true)
        setLoading(false)
      } else {
        try {
          if (!(await hasPrivilege('common'))) setNotPrivilege(true)

          setPrivilages(await getPrivileges());

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

  if (isError) return compose_error(handleClickNoAuth)

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
  specialCharacters: /[\!\@\#\$\%\¨\`\´\&\*\(\)\-\_\+\=\§\}\º\{\}\[\]\'\"\/\.\,\;\<\>\^\~\?\|\\]/g,
  mail: /^([\w-.]+@([\w-]+.)+[\w-]{2,4})?$/g
};

export default Storage
