/**
 * @description Componente de exibição das pastas do GED
 * @author @GuilhermeSantos001
 * @update 14/12/2021
 */

import React from 'react'

import { Offcanvas, Modal, Tab, Nav, Button } from 'react-bootstrap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from '@/src/utils/fontAwesomeIcons'

import { Socket } from 'socket.io-client'

import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string'

import { getGroupId, getUserAuth, matches } from '@/pages/storage/index'

import { PrivilegesSystem } from "@/pages/_app"

import Alerting from '@/src/utils/alerting'

import HerculesContext from '@/context/hercules.context'

import type { ItemHistoryNavigation } from '@/app/features/hercules/treeNavigation.slice';

export type FolderPermission = 'Append' | 'Delete' | 'Protect' | 'Share' | 'Security' | 'Block'

export interface GroupId {
  name: PrivilegesSystem
  permissions: FolderPermission[]
}
export interface UserId {
  email: string
  permissions: FolderPermission[]
}

export type MyProps = {
  socket: Socket
  room: string[]
  addHistoryItemNavigation: (item: ItemHistoryNavigation) => {
    payload: ItemHistoryNavigation;
    type: string;
  }
  defineFoldersIdItemHistoryNavigation: (id: string, foldersId: string[] | null) => {
    payload: {
      id: string;
      foldersId: string[];
    };
    type: string;
  }
  gotoItemNavigation: (cid: string) => void
  cid: string
  accessGroupId: GroupId[]
  accessUsersId: UserId[]
  filesId: IItemAppend[]
  foldersId: IItemAppend[]
  folderId: string
  authorUsername: string
  authorEmail: string
  name: string
  description: string
  tag: string
  type: string
  createdAt: string
  updated: string
  lastAccess: string
  trash: string
}

export type MyStates = {
  name: string
  description: string
  tag: string
  type: string
  accessGroupId: GroupId[]
  accessUsersId: UserId[]
  filesId: IItemAppend[]
  foldersId: IItemAppend[]
  folderId: string
  updated: string
  lastAccess: string
  trash: string
  offcanvas: IOffcanvas
  change: {
    name: boolean
    description: boolean
    tag: boolean
    type: boolean
  }
  tmp: TmpKeys
  tabKey: string
  modal: IModal
  itemsForAppend: IItemAppend[]
  itemsForSplice: IItemSplice[]
}

declare type ChangeKeys = 'name' | 'description' | 'tag' | 'type'
declare type TmpKeys = {
  name: string
  description: string
  tag: string
  type: string
}

export interface IItemAppend {
  cid: string
  name: string
  type?: string
  whichIs: 'folder' | 'file'
}

export interface IItemSplice {
  cid: string
  whichIs: 'folder' | 'file'
}

declare interface IOffcanvas {
  details: boolean
}

declare interface IModal {
  append: boolean
  splice: boolean
}

export default class Folders extends React.Component<MyProps, MyStates> {
  static contextType = HerculesContext
  declare context: React.ContextType<typeof HerculesContext>

  constructor(props) {
    super(props);

    this.state = {
      name: this.props.name,
      description: this.props.description,
      tag: this.props.tag,
      type: this.props.type,
      accessGroupId: this.props.accessGroupId,
      accessUsersId: this.props.accessUsersId,
      folderId: this.props.folderId,
      updated: this.props.updated,
      lastAccess: this.props.lastAccess,
      filesId: this.props.filesId,
      foldersId: this.props.foldersId,
      trash: this.props.trash,
      offcanvas: {
        details: false
      },
      change: {
        name: false,
        description: false,
        tag: false,
        type: false
      },
      tmp: {
        name: '',
        description: '',
        tag: '',
        type: ''
      },
      tabKey: 'details',
      modal: {
        append: false,
        splice: false
      },
      itemsForAppend: [],
      itemsForSplice: []
    }

    this.enableAction = this.enableAction.bind(this);

    this.appendFolderInTreeNavigator();
  }

  inFilter() {
    return this.context.searchFolderByName(`${this.state.name}`);
  }

  hasFolderId() {
    return this.context.hasItemFolderId(this.props.cid);
  }

  enableAction() {
    this.context.addFolderItemAction({
      name: this.state.name,
      action: 'None'
    });
  }

  disableAction() {
    this.context.removeFolderItemAction(this.state.name);
  }

  createdAt() {
    const date = new Date(this.props.createdAt);

    return `Criado em ${date.toLocaleDateString()} às ${date.toLocaleTimeString()}`;
  }

  updatedAt() {
    const date = new Date(this.props.updated);

    return `Atualizado em ${date.toLocaleDateString()} às ${date.toLocaleTimeString()}`;
  }

  lastAccessAt() {
    const date = new Date(this.props.lastAccess);

    return `Último acesso em ${date.toLocaleDateString()} às ${date.toLocaleTimeString()}`;
  }

  componentWillUnmount(): void {
    this.offSocketEvents();
  }

  render() {
    this.onSocketEvents();

    if (!this.inFilter() || this.hasFolderId())
      return <></>

    return (
      <>
        {this.offcanvas_details()}
        <div className='folder-container'>
          <div className='folder-item-action'>
            <div className="form-check d-flex flex-row justify-content-center align-items-center">
              <input
                className="form-check-input my-auto"
                type="checkbox"
                value=""
                checked={this.context.getFolderItemAction(this.state.name) !== undefined}
                onChange={(e) => e.target.checked ? this.enableAction() : this.disableAction()}
              />
            </div>
          </div>
          <div className='folder-item' onClick={() => this.openOffcanvas('details')}>
            <div className='folder-item-section-1'>
              <FontAwesomeIcon
                icon={Icon.render('fas', this.state.foldersId.length > 0 || this.state.filesId.length > 0 ? 'folder' : 'folder-open')}
                className="fs-4 flex-shrink-1"
              />
            </div>
            <div className='folder-item-section-2'>
              <p className='fw-bold col-11 text-truncate my-auto'>{this.state.name}</p>
            </div>
          </div>
        </div>
      </>
    )
  }

  offcanvas_details() {
    return (
      <Offcanvas show={this.state.offcanvas.details} onHide={() => this.closeOffcanvas('details')} placement={'end'}>
        <Offcanvas.Header closeButton closeVariant='white' className='bg-primary bg-gradient text-secondary fw-bold'>
          <Offcanvas.Title>{this.state.name}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="input-group mb-2">
            <span className="input-group-text" id="description-addon">
              <FontAwesomeIcon
                icon={Icon.render('fas', 'align-left')}
                className="mx-auto flex-shrink-1"
              />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Descrição da pasta"
              aria-label="Descrição da pasta"
              aria-describedby="description-addon"
              value={this.state.description}
              disabled={!this.state.change.description}
              onChange={(e) => this.handleChangeDescription(e.target.value)}
            />
            <span className="input-group-text">
              <FontAwesomeIcon
                icon={Icon.render('fas', this.checkChangeIsEnable('description') ? 'check' : 'pen')}
                className={`mx-auto flex-shrink-1 folder-icon-edit-property ${this.checkChangeIsEnable('description') ? 'activate' : ''}`}
                onClick={() => !this.state.change.description ? this.enableChange('description') : this.saveChange('description')}
              />
            </span>
          </div>
          <div className="input-group border-top pt-2 mb-2">
            <span className="input-group-text" id="name-addon">
              <FontAwesomeIcon
                icon={Icon.render('fas', 'folder')}
                className="mx-auto flex-shrink-1"
              />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Nome da pasta"
              aria-label="Nome da pasta"
              aria-describedby="name-addon"
              value={this.state.name}
              disabled={!this.state.change.name}
              onChange={(e) => this.handleChangeName(e.target.value)}
            />
            <span className="input-group-text">
              <FontAwesomeIcon
                icon={Icon.render('fas', this.checkChangeIsEnable('name') ? 'check' : 'pen')}
                className={`mx-auto flex-shrink-1 folder-icon-edit-property ${this.checkChangeIsEnable('name') ? 'activate' : ''}`}
                onClick={() => !this.state.change.name ? this.enableChange('name') : this.saveChange('name')}
              />
            </span>
          </div>
          <div className="input-group mb-2">
            <span className="input-group-text" id="tag-addon">
              <FontAwesomeIcon
                icon={Icon.render('fas', 'tag')}
                className="mx-auto flex-shrink-1"
              />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Marcação da pasta"
              aria-label="Marcação da pasta"
              aria-describedby="tag-addon"
              value={this.state.tag}
              disabled={!this.state.change.tag}
              onChange={(e) => this.handleChangeTag(e.target.value)}
            />
            <span className="input-group-text">
              <FontAwesomeIcon
                icon={Icon.render('fas', this.checkChangeIsEnable('tag') ? 'check' : 'pen')}
                className={`mx-auto flex-shrink-1 folder-icon-edit-property ${this.checkChangeIsEnable('tag') ? 'activate' : ''}`}
                onClick={() => !this.state.change.tag ? this.enableChange('tag') : this.saveChange('tag')}
              />
            </span>
          </div>
          <div className="input-group mb-2">
            <span className="input-group-text" id="type-addon">
              <FontAwesomeIcon
                icon={Icon.render('fab', 'typo3')}
                className="mx-auto flex-shrink-1"
              />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Tipo da pasta"
              aria-label="Tipo da pasta"
              aria-describedby="type-addon"
              value={this.state.type}
              disabled={!this.state.change.type}
              onChange={(e) => this.handleChangeType(e.target.value)}
            />
            <span className="input-group-text">
              <FontAwesomeIcon
                icon={Icon.render('fas', this.checkChangeIsEnable('type') ? 'check' : 'pen')}
                className={`mx-auto flex-shrink-1 folder-icon-edit-property ${this.checkChangeIsEnable('type') ? 'activate' : ''}`}
                onClick={() => !this.state.change.type ? this.enableChange('type') : this.saveChange('type')}
              />
            </span>
          </div>
          <div className='d-flex flex-column flex-md-row justify-content-center align-items-center p-2'>
            <button
              type="button"
              className="btn btn-primary my-2 my-md-0 mx-md-2 col-12 col-md"
              onClick={() => {
                this.closeOffcanvas('details');
                setTimeout(() => this.handleOpenFolder(), 500);
              }}
              disabled={this.state.foldersId.length <= 0 && this.state.filesId.length <= 0}
            >
              Abrir
              <FontAwesomeIcon
                icon={Icon.render('fas', 'folder-open')}
                className="ms-2 flex-shrink-1"
              />
            </button>
          </div>
          <div className='d-flex flex-column flex-md-row justify-content-center align-items-center p-2'>
            {this.render_modalSelectItemsForAppend()}
            {this.render_modalSelectItemsForSplice()}
            <button
              type="button"
              className="btn btn-primary my-2 my-md-0 mx-md-2 col-12 col-md"
              onClick={() => this.openModal('append')}
            >
              Adicionar
              <FontAwesomeIcon
                icon={Icon.render('fas', 'plus-circle')}
                className="ms-2 flex-shrink-1"
              />
            </button>
            <button
              type="button"
              className="btn btn-danger my-2 my-md-0 mx-md-2 col-12 col-md"
              disabled={this.state.foldersId.length > 0 || this.state.filesId.length > 0 ? false : true}
              onClick={() => this.openModal('splice')}
            >
              Remover
              <FontAwesomeIcon
                icon={Icon.render('fas', 'minus-circle')}
                className="ms-2 flex-shrink-1"
              />
            </button>
          </div>
          <Tab.Container defaultActiveKey={this.state.tabKey}>
            <div className='col-12'>
              <Nav variant="tabs" className="flex-row">
                <Nav.Item className='col-12 col-md-4 text-center'>
                  <Nav.Link eventKey="details">
                    Detalhes
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className='col-12 col-md-4 text-center'>
                  <Nav.Link eventKey="block">
                    Bloqueio
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className='col-12 col-md-4 text-center'>
                  <Nav.Link eventKey="security">
                    Segurança
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className='col-12 col-md-6 text-center'>
                  <Nav.Link eventKey="share">
                    Compartilhar
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className='col-12 col-md-6 text-center'>
                  <Nav.Link eventKey="assignees">
                    Procuradores
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </div>
            <Tab.Content>
              <Tab.Pane eventKey="details">
                {this.render_tab_details()}
              </Tab.Pane>
              <Tab.Pane eventKey="block">
              </Tab.Pane>
              <Tab.Pane eventKey="security">
              </Tab.Pane>
              <Tab.Pane eventKey="share">
              </Tab.Pane>
              <Tab.Pane eventKey="assignees">
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Offcanvas.Body>
      </Offcanvas >
    )
  }

  /**
   * @description Modal para adicionar pastas/arquivos na pasta atual
   */
  render_modalSelectItemsForAppend() {
    const
      handleClose = () => this.closeModal('append'),
      inListForAppend = (cid: string) => this.state.itemsForAppend.filter(item => item.cid === cid).length > 0,
      countListForAppend = () => this.state.itemsForAppend.length,
      addItemsForAppend = (cid: string, name: string, type: string, whichIs: 'folder' | 'file') => this.setState({
        itemsForAppend: [...this.state.itemsForAppend, {
          cid,
          name,
          type,
          whichIs
        }]
      }),
      removeItemsForAppend = (cid: string) => this.setState({
        itemsForAppend: this.state.itemsForAppend.filter(item => item.cid !== cid)
      }),
      itemsAvailable = this.context.getFolderItemsAvailableForSelect([this.state.name]);

    return (
      <Modal show={this.state.modal.append} onHide={handleClose} scrollable={true}>
        <Modal.Header className='bg-primary bg-gradient fw-bold text-secondary' closeButton closeVariant='white'>
          <Modal.Title>Selecione o que deseja adicionar a sua pasta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            itemsAvailable.length > 0 ?
              itemsAvailable.map((item, index) => {
                const name = item.whichIs === 'folder' ? item.name : `${item.name}${item.type}`;

                return (
                  <div key={index} className='d-flex flex-row justify-content-between align-items-center border p-2 my-2 bg-light-gray'>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="checkbox-append-item"
                        checked={inListForAppend(item.cid)}
                        onChange={(e) => e.target.checked ? addItemsForAppend(item.cid, item.name, item.type, item.whichIs) : removeItemsForAppend(item.cid)}
                      />
                      <label className="form-check-label" htmlFor="checkbox-append-item">
                        {name}
                      </label>
                    </div>
                    <FontAwesomeIcon
                      icon={Icon.render('fas', item.whichIs === 'folder' ? 'folder' : 'file')}
                      className="ms-2 flex-shrink-1"
                    />
                  </div>
                )
              })
              : <p className='text-center'>Nenhum item disponível para adicionar</p>
          }
        </Modal.Body>
        <Modal.Footer>
          <Button
            className='col-12'
            variant="primary"
            onClick={() => {
              this.emitAppendItems();
              handleClose();
            }}
            disabled={countListForAppend() <= 0 ? true : false}
          >
            Adicionar
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }

  /**
   * @description Modal para remover as pastas/arquivos da pasta atual
   */
  render_modalSelectItemsForSplice() {
    const
      handleClose = () => this.closeModal('splice'),
      inListForSplice = (cid: string) => this.state.itemsForSplice.filter(item => item.cid === cid).length > 0,
      countListForSplice = () => this.state.itemsForSplice.length,
      addItemsForSplice = (cid: string, whichIs: 'folder' | 'file') => this.setState({
        itemsForSplice: [...this.state.itemsForSplice, { cid, whichIs }]
      }),
      removeItemsForSplice = (cid: string) => this.setState({
        itemsForSplice: this.state.itemsForSplice.filter(item => item.cid !== cid)
      }),
      itemsAvailable = [...this.state.foldersId, ...this.state.filesId];

    return (
      <Modal show={this.state.modal.splice} onHide={handleClose} scrollable={true}>
        <Modal.Header className='bg-primary bg-gradient fw-bold text-secondary' closeButton closeVariant='white'>
          <Modal.Title>Escolha o que deseja remover da sua pasta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            itemsAvailable.length > 0 ?
              itemsAvailable.map((item, index) => {
                const name = item.whichIs === 'folder' ? item.name : `${item.name}${item.type}`;

                return (
                  <div key={index} className='d-flex flex-row justify-content-between align-items-center border p-2 my-2 bg-light-gray'>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="checkbox-append-item"
                        checked={inListForSplice(item.cid)}
                        onChange={(e) => e.target.checked ? addItemsForSplice(item.cid, item.whichIs) : removeItemsForSplice(item.cid)}
                      />
                      <label className="form-check-label" htmlFor="checkbox-append-item">
                        {name}
                      </label>
                    </div>
                    <FontAwesomeIcon
                      icon={Icon.render('fas', item.whichIs === 'folder' ? 'folder' : 'file')}
                      className="ms-2 flex-shrink-1"
                    />
                  </div>
                )
              })
              : <p className='text-center'>Nenhum item disponível para remoção</p>
          }
        </Modal.Body>
        <Modal.Footer>
          <Button
            className='col-12'
            variant="danger"
            onClick={() => {
              this.emitSpliceItems();
              handleClose();
            }}
            disabled={countListForSplice() <= 0 ? true : false}
          >
            Remover
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }

  render_tab_details() {
    return (
      <div className='col-12 border p-2 my-2 rounded'>
        <div className='col-12 p-2 my-2'>
          <p className="form-label fw-bold text-center col-12 ms-1 pb-1 border-bottom">
            Autor
          </p>
          <div className="input-group">
            <span className="input-group-text" id="details-author">
              <FontAwesomeIcon
                icon={Icon.render('fas', 'user-shield')}
                className="fs-4 flex-shrink-1"
              />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Autor"
              aria-label="Autor"
              aria-describedby="details-author"
              value={this.props.authorUsername}
              disabled={true}
            />
          </div>
        </div>
        <div className='col-12 p-2 my-2'>
          <p className="form-label fw-bold text-center col-12 ms-1 pb-1 border-bottom">
            Total de Arquivos
          </p>
          <div className="input-group">
            <span className="input-group-text" id="details-files">
              <FontAwesomeIcon
                icon={Icon.render('fas', 'file')}
                className="fs-4 flex-shrink-1"
              />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Total de arquivos"
              aria-label="Total de arquivos"
              aria-describedby="details-files"
              value={this.state.filesId.length > 0 ? this.state.filesId.length : 'Não há arquivos...'}
              disabled={true}
            />
          </div>
        </div>
        <div className='col-12 p-2 my-2'>
          <p className="form-label fw-bold text-center col-12 ms-1 pb-1 border-bottom">
            Total de Pastas
          </p>
          <div className="input-group">
            <span className="input-group-text" id="details-folders">
              <FontAwesomeIcon
                icon={Icon.render('fas', 'folder-open')}
                className="fs-4 flex-shrink-1"
              />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Total de pastas"
              aria-label="Total de pastas"
              aria-describedby="details-folders"
              value={this.state.foldersId.length > 0 ? this.state.foldersId.length : 'Não há pastas...'}
              disabled={true}
            />
          </div>
        </div>
        <div className='col-12 p-2 my-2'>
          <p className="form-label fw-bold text-center col-12 ms-1 pb-1 border-bottom">
            Data de Criação
          </p>
          <div className="input-group">
            <span className="input-group-text" id="details-createdAt">
              <FontAwesomeIcon
                icon={Icon.render('fas', 'calendar-alt')}
                className="fs-4 flex-shrink-1"
              />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Data de Criação"
              aria-label="Data de Criação"
              aria-describedby="details-createdAt"
              value={this.createdAt()}
              disabled={true}
            />
          </div>
        </div>
        <div className='col-12 p-2 my-2'>
          <p className="form-label fw-bold text-center col-12 ms-1 pb-1 border-bottom">
            Data de Atualização
          </p>
          <div className="input-group">
            <span className="input-group-text" id="details-updatedAt">
              <FontAwesomeIcon
                icon={Icon.render('fas', 'calendar-day')}
                className="fs-4 flex-shrink-1"
              />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Data de Atualização"
              aria-label="Data de Atualização"
              aria-describedby="details-updatedAt"
              value={this.updatedAt()}
              disabled={true}
            />
          </div>
        </div>
        <div className='col-12 p-2 my-2'>
          <p className="form-label fw-bold text-center col-12 ms-1 pb-1 border-bottom">
            Data de Acesso
          </p>
          <div className="input-group">
            <span className="input-group-text" id="details-lastAccessAt">
              <FontAwesomeIcon
                icon={Icon.render('fas', 'calendar-check')}
                className="fs-4 flex-shrink-1"
              />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Data de Atualização"
              aria-label="Data de Atualização"
              aria-describedby="details-lastAccessAt"
              value={this.lastAccessAt()}
              disabled={true}
            />
          </div>
        </div>
      </div>
    )
  };

  openOffcanvas(offcanvas: keyof IOffcanvas) {
    this.setState({ offcanvas: { ...this.state.offcanvas, [offcanvas]: true } });
  }

  closeOffcanvas(offcanvas: keyof IOffcanvas) {
    this.setState({ offcanvas: { ...this.state.offcanvas, [offcanvas]: false } });
  }

  openModal(modal: keyof IModal) {
    this.setState({ modal: { ...this.state.modal, [modal]: true } });
  }

  closeModal(modal: keyof IModal) {
    this.setState({ modal: { ...this.state.modal, [modal]: false } });
  }

  setChange(field: ChangeKeys, value: boolean) {
    if (field === 'name')
      this.setState({ change: { ...this.state.change, name: value } });
    else if (field === 'description')
      this.setState({ change: { ...this.state.change, description: value } });
    else if (field === 'tag')
      this.setState({ change: { ...this.state.change, tag: value } });
    else if (field === 'type')
      this.setState({ change: { ...this.state.change, type: value } });
  }

  checkChangeIsEnable(field: ChangeKeys) {
    if (field === 'name')
      return this.state.change.name;
    else if (field === 'description')
      return this.state.change.description;
    else if (field === 'tag')
      return this.state.change.tag;
    else if (field === 'type')
      return this.state.change.type;
  }

  enableChange(field: ChangeKeys) {
    this.setTmp(field, this.state[field]);
    this.setChange(field, true);
  }

  saveChange(field: ChangeKeys) {
    this.setChange(field, false);

    if (field === 'name')
      this.emitChangeName();
    else if (field === 'description')
      this.emitChangeDescription();
    else if (field === 'tag')
      this.emitChangeTag();
    else if (field === 'type')
      this.emitChangeType();
  }

  setTmp(key: keyof TmpKeys, value: string) {
    this.setState({ tmp: { ...this.state.tmp, [key]: value } });
  }

  getTmp(key: keyof TmpKeys) {
    return this.state.tmp[key];
  }

  appendFolderInTreeNavigator() {
    // ? Adiciona o nó ao final da árvore de navegação
    this.props.addHistoryItemNavigation({
      id: this.props.cid,
      name: this.state.name,
      root: false,
      folderId: this.props.cid,
      foldersId: this.state.foldersId.map(folder => folder.cid),
    });
  }

  async handleOpenFolder() {
    // ? Acessa a pasta na árvore de navegação
    this.props.gotoItemNavigation(this.props.cid);
  }

  handleChangeName(value: string) {
    this.setState({ name: String(value).replace(matches.specialCharacters, ' ').replace(/\s{2,}/g, ' ') });
  }

  handleChangeDescription(value: string) {
    this.setState({ description: String(value).replace(matches.specialCharacters, ' ').replace(/\s{2,}/g, ' ') });
  }

  handleChangeTag(value: string) {
    this.setState({ tag: String(value).replace(matches.specialCharacters, ' ').replace(/\s{2,}/g, ' ') });
  }

  handleChangeType(value: string) {
    this.setState({ type: String(value).replace(matches.specialCharacters, ' ').replace(/\s{2,}/g, ' ') });
  }

  /**
   * @description Move os itens para a pasta atual
   */
  moveItemsForFolder(itemsForAppend: IItemAppend[]) {
    const folders: IItemAppend[] = this.state.foldersId;

    for (const item of itemsForAppend) {
      if (item.whichIs === 'folder') {
        const newItem: IItemAppend = {
          cid: item.cid,
          name: item.name,
          whichIs: 'folder'
        }

        folders.push(newItem);

        this.setState({
          foldersId: folders
        });

      }
      else if (item.whichIs === 'file')
        this.setState({
          filesId: [...this.state.filesId, {
            cid: item.cid,
            name: item.name,
            type: item.type,
            whichIs: 'file'
          }]
        });

      this.context.moveItemForFolder(item.cid, this.props.cid);
    }

    this.props.defineFoldersIdItemHistoryNavigation(this.props.cid, folders.map(folder => folder.cid));
  }

  /**
   * @description Remove os itens da pasta atual
   */
  removeItemsOfFolder(itemsForSplice: IItemSplice[]) {
    const folders: IItemAppend[] = this.state.foldersId;

    for (const item of itemsForSplice) {
      if (item.whichIs === 'folder') {
        folders.splice(this.state.foldersId.findIndex(folder => folder.cid === item.cid), 1);

        this.setState({
          foldersId: folders
        });
      }
      else if (item.whichIs === 'file')
        this.setState({
          filesId: this.state.filesId.filter(file => file.cid !== item.cid)
        });

      this.context.removeItemOfFolder(item.cid, item.whichIs, this.props.room);
    }

    this.props.defineFoldersIdItemHistoryNavigation(this.props.cid, folders.map(folder => folder.cid));
  }

  /**
   * * Socket.io
   */

  inRoom(room: string[]) {
    return this.props.room.filter(r => room.includes(r)).length > 0;
  }

  async emitChangeDescription() {
    this.props.socket.emit('FOLDER-CHANGE-DESCRIPTION',
      this.props.room,
      await getGroupId(),
      await getUserAuth(),
      this.props.cid,
      this.state.description
    );
  }

  async emitChangeName() {
    this.props.socket.emit('FOLDER-CHANGE-NAME',
      this.props.room,
      await getGroupId(),
      await getUserAuth(),
      this.props.cid,
      this.state.name
    );
  }

  async emitChangeTag() {
    this.props.socket.emit('FOLDER-CHANGE-TAG',
      this.props.room,
      await getGroupId(),
      await getUserAuth(),
      this.props.cid,
      this.state.tag
    );
  }

  async emitChangeType() {
    this.props.socket.emit('FOLDER-CHANGE-TYPE',
      this.props.room,
      await getGroupId(),
      await getUserAuth(),
      this.props.cid,
      this.state.type
    );
  }

  async emitAppendItems() {
    this.props.socket.emit('FOLDER-APPEND-ITEMS',
      this.props.room,
      await getGroupId(),
      await getUserAuth(),
      this.props.cid,
      compressToEncodedURIComponent(JSON.stringify(this.state.itemsForAppend))
    );
  }

  async emitSpliceItems() {
    this.props.socket.emit('FOLDER-SPLICE-ITEMS',
      this.props.room,
      await getGroupId(),
      await getUserAuth(),
      this.props.cid,
      compressToEncodedURIComponent(JSON.stringify(this.state.itemsForSplice))
    );
  }

  onSocketEvents() {
    this.onChangeDescription(`FOLDER-CHANGE-DESCRIPTION-${this.props.cid}`);
    this.onChangeName(`FOLDER-CHANGE-NAME-${this.props.cid}`);
    this.onChangeTag(`FOLDER-CHANGE-TAG-${this.props.cid}`);
    this.onChangeType(`FOLDER-CHANGE-TYPE-${this.props.cid}`);
    this.onAppendItems(`FOLDER-APPEND-ITEMS-${this.props.cid}`);
    this.onSpliceItems(`FOLDER-SPLICE-ITEMS-${this.props.cid}`);
  }

  offSocketEvents() {
    this.offChangeDescription(`FOLDER-CHANGE-DESCRIPTION-${this.props.cid}`);
    this.offChangeName(`FOLDER-CHANGE-NAME-${this.props.cid}`);
    this.offChangeTag(`FOLDER-CHANGE-TAG-${this.props.cid}`);
    this.offChangeType(`FOLDER-CHANGE-TYPE-${this.props.cid}`);
    this.offAppendItems(`FOLDER-APPEND-ITEMS-${this.props.cid}`);
    this.offSpliceItems(`FOLDER-SPLICE-ITEMS-${this.props.cid}`);
  }

  onChangeDescription(eventName: string) {
    const
      eventSuccess = `${eventName}-SUCCESS`,
      eventError = `${eventName}-ERROR`;

    if (!this.props.socket.hasListeners(eventSuccess))
      this.props.socket.on(eventSuccess, (
        room: string[],
        cid: string,
        description: string
      ) => {
        if (this.inRoom(room) && cid === this.props.cid)
          this.setState({ description, updated: new Date().toString() });
      })

    if (!this.props.socket.hasListeners(eventError))
      this.props.socket.on(eventError, (room: string[], error) => {
        if (this.inRoom(room)) {
          Alerting.create(error);
          this.setState({ description: this.getTmp('description') });
        }
      })
  }

  offChangeDescription(eventName: string) {
    const
      eventSuccess = `${eventName}-SUCCESS`,
      eventError = `${eventName}-ERROR`;

    this.props.socket.off(eventSuccess);
    this.props.socket.off(eventError);
  }

  onChangeName(eventName: string) {
    const
      eventSuccess = `${eventName}-SUCCESS`,
      eventError = `${eventName}-ERROR`;

    if (!this.props.socket.hasListeners(eventSuccess))
      this.props.socket.on(eventSuccess, (
        room: string[],
        cid: string,
        name: string
      ) => {
        if (this.inRoom(room) && cid === this.props.cid)
          this.setState({ name, updated: new Date().toString() });
      })

    if (!this.props.socket.hasListeners(eventError))
      this.props.socket.on(eventError, (room: string[], error) => {
        if (this.inRoom(room)) {
          Alerting.create(error);
          this.setState({ name: this.getTmp('name') });
        }
      })
  }

  offChangeName(eventName: string) {
    const
      eventSuccess = `${eventName}-SUCCESS`,
      eventError = `${eventName}-ERROR`;

    this.props.socket.off(eventSuccess);
    this.props.socket.off(eventError);
  }

  onChangeTag(eventName: string) {
    const
      eventSuccess = `${eventName}-SUCCESS`,
      eventError = `${eventName}-ERROR`;

    if (!this.props.socket.hasListeners(eventSuccess))
      this.props.socket.on(eventSuccess, (
        room: string[],
        cid: string,
        tag: string
      ) => {
        if (this.inRoom(room) && cid === this.props.cid)
          this.setState({ tag, updated: new Date().toString() });
      })

    if (!this.props.socket.hasListeners(eventError))
      this.props.socket.on(eventError, (room: string[], error) => {
        if (this.inRoom(room)) {
          Alerting.create(error);
          this.setState({ tag: this.getTmp('tag') });
        }
      })
  }

  offChangeTag(eventName: string) {
    const
      eventSuccess = `${eventName}-SUCCESS`,
      eventError = `${eventName}-ERROR`;

    this.props.socket.off(eventSuccess);
    this.props.socket.off(eventError);
  }

  onChangeType(eventName: string) {
    const
      eventSuccess = `${eventName}-SUCCESS`,
      eventError = `${eventName}-ERROR`;

    if (!this.props.socket.hasListeners(eventSuccess))
      this.props.socket.on(eventSuccess, (
        room: string[],
        cid: string,
        type: string
      ) => {
        if (this.inRoom(room) && cid === this.props.cid)
          this.setState({ type, updated: new Date().toString() });
      })

    if (!this.props.socket.hasListeners(eventError))
      this.props.socket.on(eventError, (room: string[], error) => {
        if (this.inRoom(room)) {
          Alerting.create(error);
          this.setState({ type: this.getTmp('type') });
        }
      })
  }

  offChangeType(eventName: string) {
    const
      eventSuccess = `${eventName}-SUCCESS`,
      eventError = `${eventName}-ERROR`;

    this.props.socket.off(eventSuccess);
    this.props.socket.off(eventError);
  }

  onAppendItems(eventName: string) {
    const
      eventSuccess = `${eventName}-SUCCESS`,
      eventError = `${eventName}-ERROR`;

    if (!this.props.socket.hasListeners(eventSuccess))
      this.props.socket.on(eventSuccess, (
        room: string[],
        cid: string,
        data: string
      ) => {
        if (this.inRoom(room) && cid === this.props.cid) {
          Alerting.create(`Pastas/Arquivos movidos para a pasta: ${this.state.name}`);

          const itemsForAppend = JSON.parse(decompressFromEncodedURIComponent(data));

          this.moveItemsForFolder(itemsForAppend);
          this.setState({ itemsForAppend: [], updated: new Date().toString() });
        }
      })

    if (!this.props.socket.hasListeners(eventError))
      this.props.socket.on(eventError, (room: string[], error) => {
        if (this.inRoom(room))
          Alerting.create(error);
      })
  }

  offAppendItems(eventName: string) {
    const
      eventSuccess = `${eventName}-SUCCESS`,
      eventError = `${eventName}-ERROR`;

    this.props.socket.off(eventSuccess);
    this.props.socket.off(eventError);
  }

  onSpliceItems(eventName: string) {
    const
      eventSuccess = `${eventName}-SUCCESS`,
      eventError = `${eventName}-ERROR`;

    if (!this.props.socket.hasListeners(eventSuccess))
      this.props.socket.on(eventSuccess, (
        room: string[],
        cid: string,
        data: string
      ) => {
        if (this.inRoom(room) && cid === this.props.cid) {
          Alerting.create(`Pastas/Arquivos retirados da pasta: ${this.state.name}`);

          const itemsForSplice = JSON.parse(decompressFromEncodedURIComponent(data));

          this.removeItemsOfFolder(itemsForSplice);
          this.setState({ itemsForSplice: [], updated: new Date().toString() });
        }
      })

    if (!this.props.socket.hasListeners(eventError))
      this.props.socket.on(eventError, (room: string[], error) => {
        if (this.inRoom(room))
          Alerting.create(error);
      })
  }

  offSpliceItems(eventName: string) {
    const
      eventSuccess = `${eventName}-SUCCESS`,
      eventError = `${eventName}-ERROR`;

    this.props.socket.off(eventSuccess);
    this.props.socket.off(eventError);
  }
}