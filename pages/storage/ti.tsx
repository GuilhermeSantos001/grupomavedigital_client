/**
 * @description Gestor online de documentos -> TI
 * @author GuilhermeSantos001
 * @update 16/12/2021
 */

import React, { useEffect, useState } from 'react'

import { Modal, Button } from 'react-bootstrap';

import io, { Socket } from 'socket.io-client'

import { useRouter } from 'next/router'

import SkeletonLoader from 'tiny-skeleton-loader-react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from '@/src/utils/fontAwesomeIcons'

import RenderPageError from '@/components/renderPageError'
import NoPrivilege from '@/components/noPrivilege'
import NoAuth from '@/components/noAuth'

import { PageProps } from '@/pages/_app'
import PageMenu from '@/bin/main_menu'
import { getGroupId, getUserAuth } from '@/pages/storage/index'

import Fetch from '@/src/utils/fetch'
import Variables from '@/src/db/variables'
import { tokenValidate } from '@/src/functions/tokenValidate'
import hasPrivilege from '@/src/functions/hasPrivilege'
import signURL from '@/src/functions/signURL'
import Alerting from '@/src/utils/alerting'

import DropZone from '@/components/dropZone'
import Folder, { MyProps as IFolder, GroupId as IFolderGroupId, UserId as IFolderUserId, IItemAppend as IFolderItemAppend } from '@/components/storage/Folders'
import File, { MyProps as IFile, IHistory, GroupId as IFileGroupId, UserId as IFileUserId } from '@/components/storage/Files'
import HerculesSearch from '@/components/storage/Search'
import HerculesMenuAction from '@/components/storage/MenuAction'

import HerculesContext, { IItemAction as HerculesIItemAction, IFolderItemsAvailableForSelect as HerculesIFolderItemsAvailableForSelect } from '@/context/hercules.context'

import { useAppSelector, useAppDispatch } from '@/app/hooks'

import {
  appendItemFolderId,
  removeItemFolderId,
  resetItemsFolderId,
  setReloadItemsOfPage,
} from '@/app/features/hercules/hercules.slice'

import {
  appendItemHistoryNavigation,
  setItemHistoryNavigation,
  setFoldersIdItemHistoryNavigation,
  resetItemHistoryNavigation,
} from '@/app/features/hercules/treeNavigation.slice'

import type {
  ItemHistoryNavigation
} from '@/app/features/hercules/treeNavigation.slice'

declare type IFolderState = Omit<IFolder, 'socket' | 'room' | 'addHistoryItemNavigation' | 'defineFoldersIdItemHistoryNavigation' | 'gotoItemNavigation'>
declare type IFileState = Omit<IFile, 'socket' | 'room'>

declare type InputModalFolderCreate = {
  name: string
  description: string
  type: string
  tag: string
}

const serverSideProps: PageProps = {
  title: 'System/Storage',
  description: 'Gestor de documentos online do Grupo Mave Digital',
  themeColor: '#004a6e',
  menu: PageMenu('mn-herculesStorage'),
  socketIO: {
    room: ['TI']
  }
};

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
  _fetch: Fetch,
  socket: Socket,
  room: string[],
  itemsHistoryNavigation: ItemHistoryNavigation[],
  folders: IFolderState[],
  files: IFileState[],
  showModalFolderCreate: boolean,
  openModalFolderCreate: () => void,
  closeModalFolderCreate: () => void,
  valueInputModalFolderCreate: (fieldsToGet: keyof InputModalFolderCreate) => string,
  handleChangeInputModalFolderCreate: (fieldsToUpdate: Partial<InputModalFolderCreate>) => void,
  enableSubmitModalFolderCreate: () => boolean,
  handleSubmitModalFolderCreate: () => Promise<void>,
  handleChangeFolderSearchText: (text: string) => void,
  searchFolderByName: (name: string) => boolean,
  handleChangeFileSearchText: (text: string) => void,
  searchFileByName: (name: string) => boolean,
  addFolderItemAction: (itemAction: HerculesIItemAction) => void,
  removeFolderItemAction: (name: string) => void,
  addFileItemAction: (itemAction: HerculesIItemAction) => void,
  removeFileItemAction: (name: string) => void,
  getFolderItemAction: (name: string) => HerculesIItemAction,
  countFolderItemAction: () => number,
  getFileItemAction: (name: string) => HerculesIItemAction,
  countFileItemAction: () => number,
  defineSelectedAllFolderItensAction: (selected: boolean) => void,
  hasSelectedAllFolderItensAction: () => boolean,
  defineSelectedAllFileItensAction: (selected: boolean) => void,
  hasSelectedAllFileItensAction: () => boolean,
  getFolderItemsAvailableForSelect: (exclude: string[]) => HerculesIFolderItemsAvailableForSelect[],
  moveItemForFolder: (id: string, parentId: string) => void,
  removeItemOfFolder: (id: string, type: 'folder' | 'file', room: string[]) => Promise<void>,
  hasItemFolderId: (id: string) => boolean,
  addHistoryItemNavigation: (item: ItemHistoryNavigation) => {
    payload: ItemHistoryNavigation;
    type: string;
  },
  defineFoldersIdItemHistoryNavigation: (id: string, foldersId: string[]) => {
    payload: {
      id: string;
      foldersId: string[];
    };
    type: string;
  },
  gotoItemNavigation: (cid: string) => void,
) {
  return (
    <>
      <div className="row g-2">
        <p className="p-2 text-start fw-bold">
          <a href='/storage' className="border-bottom" style={{ textDecoration: 'none' }}>
            Storage
          </a> {`>`} {itemsHistoryNavigation.slice(0, itemsHistoryNavigation.findIndex(item => item.root) + 1).map((item, index) => {
            if (item.root) {
              return <b key={index} className='text-secondary border-bottom'>
                {item.name}{`/`}
              </b>
            } else {
              return <a
                key={index}
                className="border-bottom"
                style={{ textDecoration: 'none', cursor: 'pointer' }}
                onClick={() => gotoItemNavigation(item.id)}
              >
                {item.name}{`/`}
              </a>
            }
          })}
        </p>
        <div className="col-12">
          <div className="p-3 bg-primary bg-gradient rounded">
            <div className="d-flex bd-highlight">
              <div className="p-2 w-100 bd-highlight">
                <p className="text-start text-secondary fw-bold fs-5 my-2">
                  Ações
                </p>
              </div>
              <div className="p-2 flex-shrink-1 bd-highlight my-2">
                <FontAwesomeIcon
                  icon={Icon.render('fas', 'fire')}
                  className="ms-2 fs-3 flex-shrink-1 text-secondary my-auto"
                />
              </div>
            </div>
          </div>
          <div className="p-3 bg-light-gray rounded overflow-auto my-2">
            <Modal show={showModalFolderCreate} onHide={closeModalFolderCreate}>
              <Modal.Header className='bg-primary bg-gradient text-secondary fw-bold' closeButton closeVariant='white'>
                <Modal.Title>
                  Criar uma nova pasta
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="input-group my-2">
                  <span className="input-group-text col-1" id="folderName-addon">
                    <FontAwesomeIcon
                      icon={Icon.render('fas', 'folder')}
                      className="mx-auto flex-shrink-1 text-primary my-auto"
                    />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nome da Pasta"
                    aria-label="Nome da Pasta"
                    aria-describedby="folderName-addon"
                    value={valueInputModalFolderCreate('name')}
                    onChange={(e) => handleChangeInputModalFolderCreate({ name: e.target.value })}
                  />
                </div>
                <div className="input-group my-2">
                  <span className="input-group-text col-1" id="folderDescription-addon">
                    <FontAwesomeIcon
                      icon={Icon.render('fas', 'align-left')}
                      className="mx-auto flex-shrink-1 text-primary my-auto"
                    />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Descrição da pasta"
                    aria-label="Descrição da pasta"
                    aria-describedby="folderDescription-addon"
                    value={valueInputModalFolderCreate('description')}
                    onChange={(e) => handleChangeInputModalFolderCreate({ description: e.target.value })}
                  />
                </div>
                <div className="input-group my-2">
                  <span className="input-group-text col-1" id="folderTag-addon">
                    <FontAwesomeIcon
                      icon={Icon.render('fas', 'tag')}
                      className="mx-auto flex-shrink-1 text-primary my-auto"
                    />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Marcação da pasta"
                    aria-label="Marcação da pasta"
                    aria-describedby="folderTag-addon"
                    value={valueInputModalFolderCreate('tag')}
                    onChange={(e) => handleChangeInputModalFolderCreate({ tag: e.target.value })}
                  />
                </div>
                <div className="input-group my-2">
                  <span className="input-group-text col-1" id="folderType-addon">
                    <FontAwesomeIcon
                      icon={Icon.render('fab', 'typo3')}
                      className="mx-auto flex-shrink-1 text-primary my-auto"
                    />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Tipo da pasta"
                    aria-label="Tipo da pasta"
                    aria-describedby="folderType-addon"
                    value={valueInputModalFolderCreate('type')}
                    onChange={(e) => handleChangeInputModalFolderCreate({ type: e.target.value })}
                  />
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="primary"
                  disabled={enableSubmitModalFolderCreate()}
                  onClick={handleSubmitModalFolderCreate}
                >
                  Salvar
                </Button>
              </Modal.Footer>
            </Modal>
            <button
              type="button"
              className="btn btn-primary col-12 text-start text-secondary fs-6 fw-bold mb-2"
              onClick={openModalFolderCreate}
            >
              <FontAwesomeIcon
                icon={Icon.render('fas', 'folder-plus')}
                className="me-2 flex-shrink-1 text-secondary my-auto"
              />
              Criar Pasta
            </button>
            <DropZone
              fetch={_fetch}
              ext={['.png', '.zip', '.rar', '.pdf', '.txt']}
              maxSize={20000000}
              onCallbackAfterUpload={async (files) => {
                const emitCreateFile = async (
                  authorId: string,
                  name: string,
                  size: number,
                  compressedSize: number,
                  fileId: string,
                  version: number
                ) => socket.emit('CREATE-FILE',
                  room,
                  await getGroupId(),
                  await getUserAuth(),
                  authorId,
                  name,
                  size,
                  compressedSize,
                  fileId,
                  version
                );

                if (files instanceof Array) {
                  for (let i = 0; i < files.length; i++) {
                    const { authorId, name, size, compressedSize, fileId, version } = files[i]

                    emitCreateFile(authorId, name, size, compressedSize, fileId, version);
                  }
                } else {
                  const { authorId, name, size, compressedSize, fileId, version } = files

                  emitCreateFile(authorId, name, size, compressedSize, fileId, version);
                }
              }}
            />
          </div>
          <div className="container-fluid overflow-hidden">
            <div className="row g-2">
              <HerculesContext.Provider
                value={{
                  searchFolderByName,
                  searchFileByName,
                  addFolderItemAction,
                  removeFolderItemAction,
                  addFileItemAction,
                  removeFileItemAction,
                  getFolderItemAction,
                  countFolderItemAction,
                  getFileItemAction,
                  countFileItemAction,
                  hasSelectedAllFolderItensAction,
                  defineSelectedAllFolderItensAction,
                  hasSelectedAllFileItensAction,
                  defineSelectedAllFileItensAction,
                  getFolderItemsAvailableForSelect,
                  moveItemForFolder,
                  removeItemOfFolder,
                  hasItemFolderId,
                }}
              >
                <div className="col-12 col-md-6">
                  <div className="p-2">
                    <div className="p-3 bg-primary bg-gradient rounded">
                      <div className="d-flex bd-highlight">
                        <div className="p-2 w-100 bd-highlight">
                          <p className="text-start text-secondary fw-bold fs-5 my-2">
                            Pastas
                          </p>
                        </div>
                        <div className="p-2 flex-shrink-1 bd-highlight my-2">
                          <FontAwesomeIcon
                            icon={Icon.render('fas', 'folder')}
                            className="ms-2 fs-3 flex-shrink-1 text-secondary my-auto"
                          />
                        </div>
                      </div>
                    </div>
                    <HerculesSearch type={'folder'} handleChangeFolderText={handleChangeFolderSearchText} />
                    <HerculesMenuAction type={'folder'} />
                    <div className="mb-5 px-2 overflow-auto" style={{ maxHeight: 300, marginBottom: 10 }}>
                      {
                        folders.length <= 0 ?
                          <div className="pe-1 bg-light-gray border rounded overflow-auto my-2 mh-100">
                            <div className='d-flex justify-content-center' style={{ height: 50 }}>
                              <p className='my-auto text-muted'>Não há pastas...</p>
                            </div>
                          </div> : folders.map(folder => {
                            return <Folder
                              key={folder.cid}
                              socket={socket}
                              room={room}
                              addHistoryItemNavigation={addHistoryItemNavigation}
                              defineFoldersIdItemHistoryNavigation={defineFoldersIdItemHistoryNavigation}
                              gotoItemNavigation={gotoItemNavigation}
                              cid={folder.cid}
                              accessGroupId={folder.accessGroupId}
                              accessUsersId={folder.accessUsersId}
                              folderId={folder.folderId}
                              name={folder.name}
                              description={folder.description}
                              tag={folder.tag}
                              type={folder.type}
                              authorEmail={folder.authorEmail}
                              authorUsername={folder.authorUsername}
                              createdAt={folder.createdAt}
                              updated={folder.updated}
                              lastAccess={folder.lastAccess}
                              filesId={folder.filesId}
                              foldersId={folder.foldersId}
                              trash={folder.trash}
                            />
                          })
                      }
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="p-2">
                    <div className="p-3 bg-primary bg-gradient rounded">
                      <div className="d-flex bd-highlight">
                        <div className="p-2 w-100 bd-highlight">
                          <p className="text-start text-secondary fw-bold fs-5 my-2">
                            Arquivos
                          </p>
                        </div>
                        <div className="p-2 flex-shrink-1 bd-highlight my-2">
                          <FontAwesomeIcon
                            icon={Icon.render('fas', 'file-archive')}
                            className="ms-2 fs-3 flex-shrink-1 text-secondary my-auto"
                          />
                        </div>
                      </div>
                    </div>
                    <HerculesSearch type={'file'} handleChangeFileText={handleChangeFileSearchText} />
                    <HerculesMenuAction type={'file'} />
                    <div className="mb-5 px-2 overflow-auto" style={{ maxHeight: 300, marginBottom: 10 }}>
                      {files.length <= 0 ?
                        <div className="pe-1 bg-light-gray border rounded overflow-auto my-2 mh-100">
                          <div className='d-flex justify-content-center' style={{ height: 50 }}>
                            <p className='my-auto text-muted'>Não há arquivos...</p>
                          </div>
                        </div> : files.map(file => {
                          return <File
                            key={file.cid}
                            socket={socket}
                            room={room}
                            cid={file.cid}
                            accessGroupId={file.accessGroupId}
                            accessUsersId={file.accessUsersId}
                            folderId={file.folderId}
                            name={file.name}
                            description={file.description}
                            tag={file.tag}
                            type={file.type}
                            authorEmail={file.authorEmail}
                            authorUsername={file.authorUsername}
                            createdAt={file.createdAt}
                            updated={file.updated}
                            lastAccess={file.lastAccess}
                            version={file.version}
                            versions={file.versions}
                            history={file.history}
                            size={file.size}
                            compressedSize={file.compressedSize}
                            trash={file.trash}
                          />
                        })}
                    </div>
                  </div>
                </div>
              </HerculesContext.Provider>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function socket_events(
  socket: Socket,
  room: string[],
  itemsHistoryNavigation: ItemHistoryNavigation[],
  folders: IFolderState[],
  setFolders: React.Dispatch<React.SetStateAction<IFolderState[]>>,
  files: IFileState[],
  setFiles: React.Dispatch<React.SetStateAction<IFileState[]>>,
) {
  // ! Socket Ouvintes
  // ? Evento emitido quando o usuario se conecta ao servidor
  if (!socket.hasListeners('connect'))
    socket.on("connect", async () => {
      Alerting.create('info', 'Você está conectado!');

      await loadFoldersAndFiles(socket, room, itemsHistoryNavigation);
    });

  // ? Evento emitido quando o usuario se reconecta com o servidor
  if (!socket.hasListeners('reconnect'))
    socket.on("reconnect", () => {
      Alerting.create('info', 'Você está conectado novamente!');
    });

  // ? Evento emitido quando a conexão do usuario é perdida
  if (!socket.hasListeners('connect_error'))
    socket.on("connect_error", (error) => {
      Alerting.create('error', 'Ocorreu um erro na conexão com o servidor. Tente novamente, mais tarde!');
      console.error(JSON.stringify(error));
    });

  // ? Evento emitido quando a conexão do usuario é desconectada
  if (!socket.hasListeners('disconnect'))
    socket.on("disconnect", (reason) => {
      Alerting.create('warning', `Conexão perdida com o servidor, devido: ${reason}`);
    });

  // ? Evento emitido quando não é possivel recuperar as pastas pelo grupo do usuario
  if (!socket.hasListeners('GET-FOLDERS-BY-GROUP-ERROR'))
    socket.on('GET-FOLDERS-BY-GROUP-ERROR', (_room, error) => {
      if (_room.filter(r => room.find(rr => r === rr)).length > 0) {
        Alerting.create('error',`Não foi possível recuperar as pastas. Fale com o administrador do sistema.`);
        console.error(error);
      }
    });

  // ? Evento emitido quando a renderização da pasta tem uma falha
  if (!socket.hasListeners('CREATE-FOLDER-ERROR'))
    socket.on('CREATE-FOLDER-ERROR', (_room, error) => {
      if (_room.filter(r => room.find(rr => r === rr)).length > 0) {
        Alerting.create('error',`Não foi possível criar a pasta. Fale com o administrador do sistema.`);
        console.error(error);
      }
    });

  // ? Evento emitido quando a criação do arquivo tem uma falha
  if (!socket.hasListeners('CREATE-FILE-ERROR'))
    socket.on('CREATE-FILE-ERROR', (_room, error) => {
      if (_room.filter(r => room.find(rr => r === rr)).length > 0) {
        Alerting.create('error',`Não foi possível criar o arquivo. Fale com o administrador do sistema.`);
        console.error(error);
      }
    });

  // ? Evento emitido para a renderização da pasta
  if (!socket.hasListeners('FOLDER-RENDER'))
    socket.on('FOLDER-RENDER', (
      _room: string[],
      cid: string,
      accessGroupId: IFolderGroupId[],
      accessUsersId: IFolderUserId[],
      filesId: IFolderItemAppend[],
      foldersId: IFolderItemAppend[],
      folderId: string,
      authorUsername: string,
      authorEmail: string,
      name: string,
      description: string,
      tag: string,
      type: string,
      createdAt: string,
      updated: string,
      lastAccess: string,
      trash: string
    ) => {
      if (_room.filter(r => room.find(rr => r === rr)).length > 0) {
        if (folders.filter(folder => folder.cid === cid).length === 0) {
          setFolders(prevFolders => [...prevFolders, {
            cid,
            accessGroupId,
            accessUsersId,
            folderId,
            authorUsername,
            authorEmail,
            name,
            description,
            tag,
            type,
            createdAt,
            updated,
            lastAccess,
            filesId,
            foldersId,
            trash
          }])
        }
      }
    });

  // ? Evento emitido quando a renderização da pasta tem uma falha
  if (!socket.hasListeners('FOLDER-RENDER-ERROR'))
    socket.on('FOLDER-RENDER-ERROR', (_room, error) => {
      if (_room.filter(r => room.find(rr => r === rr)).length > 0) {
        Alerting.create('error',`Não foi possível renderizar a pasta. Fale com o administrador do sistema.`);
        console.error(error);
      }
    });

  // ? Evento emitido para a renderização do arquivo
  if (!socket.hasListeners('FILE-RENDER'))
    socket.on('FILE-RENDER', (
      _room: string[],
      cid: string,
      accessGroupId: IFileGroupId[],
      accessUsersId: IFileUserId[],
      folderId: string,
      authorUsername: string,
      authorEmail: string,
      name: string,
      description: string,
      tag: string,
      type: string,
      createdAt: string,
      updated: string,
      lastAccess: string,
      version: number,
      versions: number,
      history: IHistory[],
      size: number,
      compressedSize: number,
      trash: string
    ) => {
      if (_room.filter(r => room.find(rr => r === rr)).length > 0) {
        if (files.filter(file => file.cid === cid).length === 0) {
          setFiles(prevFiles => [...prevFiles, {
            cid,
            accessGroupId,
            accessUsersId,
            folderId,
            authorUsername,
            authorEmail,
            name,
            description,
            tag,
            type,
            createdAt,
            updated,
            lastAccess,
            version,
            versions,
            history,
            size,
            compressedSize,
            trash
          }])
        }
      }
    });

  // ? Evento emitido quando a renderização do arquivo tem uma falha
  if (!socket.hasListeners('FILE-RENDER-ERROR'))
    socket.on('FILE-RENDER-ERROR', (_room, error) => {
      if (_room.filter(r => room.find(rr => r === rr)).length > 0) {
        Alerting.create('error',`Não foi possível renderizar o arquivo. Fale com o administrador do sistema.`);
        console.error(error);
      }
    });
};

async function loadFoldersAndFiles(
  socket: Socket,
  room: string[],
  itemsHistoryNavigation: ItemHistoryNavigation[]
) {
  const folderId = itemsHistoryNavigation.filter(item => item.root).length > 0 ? itemsHistoryNavigation.filter(item => item.root)[0].folderId : null;

  // ? Carrega as pastas da pagina
  socket.emit(
    'GET-FOLDERS-BY-ROOM',
    room,
    await getGroupId(),
    await getUserAuth(),
    100,
    folderId,
  );

  // ? Carrega os arquivos da pagina
  socket.emit(
    'GET-FILES-BY-ROOM',
    room,
    await getGroupId(),
    await getUserAuth(),
    100,
    folderId,
  );
}

const Storage = ({ socketIO }: PageProps): JSX.Element => {
  const [isReady, setReady] = useState<boolean>(false)
  const [isError, setError] = useState<boolean>(false)
  const [notPrivilege, setNotPrivilege] = useState<boolean>(false)
  const [notAuth, setNotAuth] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  const [socket, setSocket] = useState<Socket>(undefined)
  const [showModalFolderCreate, setShowModalFolderCreate] = useState<boolean>(false)
  const [folders, setFolders] = useState<IFolderState[]>([])
  const [files, setFiles] = useState<IFileState[]>([])
  const [inputModalFolderCreate, setInputModalFolderCreate] = useState<InputModalFolderCreate>({
    name: '',
    description: '',
    type: '',
    tag: '',
  })
  const [folderSearchText, setFolderSearchText] = useState<string>('')
  const [fileSearchText, setFileSearchText] = useState<string>('')
  const [itensFolderAction, setItensFolderAction] = useState<HerculesIItemAction[]>([])
  const [itensFileAction, setItensFileAction] = useState<HerculesIItemAction[]>([])
  const [selectedAllFolderItensAction, setSelectedAllFolderItensAction] = useState<boolean>(false)
  const [selectedAllFileItensAction, setSelectedAllFileItensAction] = useState<boolean>(false)

  const router = useRouter()
  const _fetch = new Fetch(process.env.NEXT_PUBLIC_GRAPHQL_HOST)

  const
    dispatch = useAppDispatch(),
    itemsFolderId = useAppSelector((state) => state.hercules.itemsFolderId),
    itemsHistoryNavigation = useAppSelector((state) => state.herculesTreeNavigation.itemsHistoryNavigation),
    reloadItemsOfPage = useAppSelector((state) => state.hercules.reloadItemsOfPage),
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
    openModalFolderCreate = () => setShowModalFolderCreate(true),
    closeModalFolderCreate = () => setShowModalFolderCreate(false),
    valueInputModalFolderCreate = (fieldsToGet: keyof InputModalFolderCreate) => {
      return inputModalFolderCreate[fieldsToGet];
    },
    handleChangeInputModalFolderCreate = (fieldsToUpdate: Partial<InputModalFolderCreate>) => {
      setInputModalFolderCreate({ ...inputModalFolderCreate, ...fieldsToUpdate })
    },
    enableSubmitModalFolderCreate = () => valueInputModalFolderCreate('name').length < 5,
    handleSubmitModalFolderCreate = async () => {
      // ? Envia o evento para criar a pasta
      const
        name = valueInputModalFolderCreate('name'),
        description = valueInputModalFolderCreate('description'),
        tag = valueInputModalFolderCreate('tag'),
        type = valueInputModalFolderCreate('type');

      socket.emit('CREATE-FOLDER',
        socketIO.room,
        await getGroupId(),
        await getUserAuth(),
        name,
        description,
        tag,
        type
      );

      closeModalFolderCreate();
    },
    handleChangeFolderSearchText = (text: string) => setFolderSearchText(text),
    searchFolderByName = (name: string) => name.toLowerCase().includes(folderSearchText.toLowerCase()),
    handleChangeFileSearchText = (text: string) => setFileSearchText(text),
    searchFileByName = (name: string) => name.toLowerCase().includes(fileSearchText.toLowerCase()),
    addFolderItemAction = (item: HerculesIItemAction) => setItensFolderAction(prevItens => [...prevItens, item]),
    removeFolderItemAction = (name: string) => setItensFolderAction(prevItens => prevItens.filter(folder => folder.name !== name)),
    addFileItemAction = (item: HerculesIItemAction) => setItensFileAction(prevItens => [...prevItens, item]),
    removeFileItemAction = (name: string) => setItensFileAction(prevItens => prevItens.filter(file => file.name !== name)),
    getFolderItemAction = (name: string) => itensFolderAction.find(folder => folder.name === name),
    countFolderItemAction = () => itensFolderAction.length,
    getFileItemAction = (name: string) => itensFileAction.find(file => file.name === name),
    countFileItemAction = () => itensFileAction.length,
    defineSelectedAllFolderItensAction = (selected: boolean) => {
      setSelectedAllFolderItensAction(selected)

      if (selected)
        folders.forEach(folder => addFolderItemAction({ name: folder.name, action: 'None' }));
      else
        folders.forEach(folder => removeFolderItemAction(folder.name));
    },
    hasSelectedAllFolderItensAction = () => selectedAllFolderItensAction,
    defineSelectedAllFileItensAction = (selected: boolean) => {
      setSelectedAllFileItensAction(selected)

      if (selected)
        files.forEach(file => addFileItemAction({ name: `${file.name}${file.type}`, action: 'None' }));
      else
        files.forEach(file => removeFileItemAction(`${file.name}${file.type}`));
    },
    hasSelectedAllFileItensAction = () => selectedAllFileItensAction,
    getFolderItemsAvailableForSelect = (exclude: string[]) => {
      const items: HerculesIFolderItemsAvailableForSelect[] = [];

      folders.forEach(folder => {
        if (!exclude.includes(folder.name)) {
          if (itemsFolderId.filter(item => item.id === folder.cid).length <= 0)
            items.push({ cid: folder.cid, name: folder.name, whichIs: 'folder' })
        }
      })

      files.forEach(file => {
        if (!exclude.includes(`${file.name}${file.type}`)) {
          if (itemsFolderId.filter(item => item.id === file.cid).length <= 0)
            items.push({ cid: file.cid, name: file.name, type: file.type, whichIs: 'file' })
        }
      })

      return items;
    },
    moveItemForFolder = (id: string, parentId: string) => dispatch(appendItemFolderId({ id, parentId })),
    removeItemOfFolder = async (id: string, type: 'folder' | 'file', room: string[]) => {
      // ? Verifica se a pasta não existe na memória
      if (type === 'folder' && folders.filter(folder => folder.cid === id).length <= 0) {
        // ? Carrega a pasta
        socket.emit(
          'GET-FOLDER-BY-CID',
          room,
          await getGroupId(),
          await getUserAuth(),
          id
        );
      }
      // ? Verifica se o arquivo não existe na memória
      else if (type === 'file' && files.filter(file => file.cid === id).length <= 0) {
        // ? Carrega o arquivo
        socket.emit(
          'GET-FILE-BY-CID',
          room,
          await getGroupId(),
          await getUserAuth(),
          id
        );
      }

      if (itemsFolderId.length > 0)
        dispatch(removeItemFolderId(id));
    },
    hasItemFolderId = (id: string) => itemsFolderId.filter(item => item.id === id).length > 0,
    addHistoryItemNavigation = (item: ItemHistoryNavigation) => dispatch(appendItemHistoryNavigation(item)),
    defineFoldersIdItemHistoryNavigation = (id: string, foldersId: string[] | null) => dispatch(setFoldersIdItemHistoryNavigation({ id, foldersId })),
    gotoItemNavigation = (cid: string) => {
      // ? Acessa a pasta na árvore de navegação
      dispatch(setItemHistoryNavigation(cid));

      // ? Solicita o recarregamento dos itens da pagina
      dispatch(setReloadItemsOfPage(true));

      // ? Reseta os itens movidos para as pastas
      dispatch(resetItemsFolderId());

      // ? Reseta a lista de pastas e arquivos
      setFolders(_ => []);
      setFiles(_ => []);
    }

  useEffect(() => {
    const timer = setTimeout(async () => {
      const isAllowViewPage = await tokenValidate(_fetch);

      if (!isAllowViewPage) {
        setNotAuth(true)
        setLoading(false)
      } else {
        try {
          if (!(await hasPrivilege('common', 'administrador'))) setNotPrivilege(true);

          if (!notPrivilege) {
            setSocket(io(process.env.NEXT_PUBLIC_WEBSOCKET_HOST, {
              reconnectionAttempts: 5,
              reconnectionDelay: 1000,
              reconnectionDelayMax: 5000,
              reconnection: true,
              auth: {
                signedUrl: await signURL()
              },
              secure: process.env.NODE_ENV === 'production'
            }));

            // ? Reseta a árvore de navegação
            dispatch(resetItemHistoryNavigation());

            // ? Adiciona o nó root da árvore de navegação
            addHistoryItemNavigation({
              id: '_root',
              name: 'Tecnologia da Informação',
              root: true,
              folderId: null,
              foldersId: [],
            });

            setReady(true)
          }

          return setLoading(false)
        } catch (error) {
          console.error(error);
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

  if (isReady) {
    socket_events(
      socket,
      socketIO.room,
      itemsHistoryNavigation,
      folders,
      setFolders,
      files,
      setFiles,
    );

    // ? Verifica se foi solicitado o recarregamento dos itens da pagina
    if (reloadItemsOfPage) {
      // ? Cancela o recarregamento dos itens da pagina
      dispatch(setReloadItemsOfPage(false));

      // ? Carrega as pastas e arquivos da pagina
      loadFoldersAndFiles(
        socket,
        socketIO.room,
        itemsHistoryNavigation
      );
    }

    return compose_ready(
      _fetch,
      socket,
      socketIO.room,
      itemsHistoryNavigation,
      folders,
      files,
      showModalFolderCreate,
      openModalFolderCreate,
      closeModalFolderCreate,
      valueInputModalFolderCreate,
      handleChangeInputModalFolderCreate,
      enableSubmitModalFolderCreate,
      handleSubmitModalFolderCreate,
      handleChangeFolderSearchText,
      searchFolderByName,
      handleChangeFileSearchText,
      searchFileByName,
      addFolderItemAction,
      removeFolderItemAction,
      addFileItemAction,
      removeFileItemAction,
      getFolderItemAction,
      countFolderItemAction,
      getFileItemAction,
      countFileItemAction,
      defineSelectedAllFolderItensAction,
      hasSelectedAllFolderItensAction,
      defineSelectedAllFileItensAction,
      hasSelectedAllFileItensAction,
      getFolderItemsAvailableForSelect,
      moveItemForFolder,
      removeItemOfFolder,
      hasItemFolderId,
      addHistoryItemNavigation,
      defineFoldersIdItemHistoryNavigation,
      gotoItemNavigation,
    )
  }
}

export default Storage
