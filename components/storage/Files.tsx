/**
 * @description Componente de exibição dos arquivos do GED
 * @author @GuilhermeSantos001
 * @update 10/12/2021
 */

import React from 'react'

import { Nav, Offcanvas, Tab } from 'react-bootstrap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from '@/src/utils/fontAwesomeIcons'

import Sugar from 'sugar'

import { Socket } from 'socket.io-client'

import { getGroupId, getUserAuth, matches } from '@/pages/storage/index'

import { PrivilegesSystem } from "@/pages/_app"

import Alerting from '@/src/utils/alerting'

import HerculesContext from '@/context/hercules.context'

export type FilePermission = 'Write' | 'Read' | 'Delete' | 'Protect' | 'Share' | 'Security' | 'Block'

export interface GroupId {
  name: PrivilegesSystem
  permissions: FilePermission[]
}

export interface UserId {
  email: string
  permissions: FilePermission[]
}

export interface IHistory {
  authorId: string;
  uploadDate: string;
  size: number;
  compressedSize: number;
  fileId: string;
  version: number;
}

export type MyProps = {
  socket: Socket
  room: string[]
  cid: string
  accessGroupId: GroupId[]
  accessUsersId: UserId[]
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
  version: number
  versions: number
  history: IHistory[]
  size: number
  compressedSize: number
  trash: string
}

export type MyStates = {
  name: string
  description: string
  tag: string
  type: string
  accessGroupId: GroupId[]
  accessUsersId: UserId[]
  folderId: string
  updated: string
  lastAccess: string
  version: number
  versions: number
  history: IHistory[]
  size: number
  compressedSize: number
  trash: string
  offcanvas: IOffcanvas
  tabKey: string
  change: {
    name: boolean
    description: boolean
    tag: boolean
  }
}

declare type ChangeKeys = 'name' | 'description' | 'tag' | 'type'

declare interface IOffcanvas {
  details: boolean
}

export default class Files extends React.Component<MyProps, MyStates> {
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
      version: this.props.version,
      versions: this.props.versions,
      history: this.props.history,
      size: this.props.size,
      compressedSize: this.props.compressedSize,
      trash: this.props.trash,
      offcanvas: {
        details: false
      },
      tabKey: 'details',
      change: {
        name: false,
        description: false,
        tag: false
      }
    }
  }

  inFilter() {
    return this.context.searchFileByName(`${this.state.name}${this.props.type}`);
  }

  hasFolderId() {
    return this.context.hasItemFolderId(this.props.cid);
  }

  enableAction() {
    this.context.addFileItemAction({
      name: `${this.state.name}${this.props.type}`,
      action: 'None'
    });
  }

  disableAction() {
    this.context.removeFileItemAction(`${this.state.name}${this.props.type}`);
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
        <div className='file-container'>
          <div className='file-item-action'>
            <div className="form-check d-flex flex-row justify-content-center align-items-center">
              <input
                className="form-check-input my-auto"
                type="checkbox"
                value=""
                checked={this.context.getFileItemAction(`${this.state.name}${this.props.type}`) !== undefined}
                onChange={(e) => e.target.checked ? this.enableAction() : this.disableAction()}
              />
            </div>
          </div>
          <div className='file-item' onClick={() => this.openOffcanvas('details')}>
            <div className='file-item-section-1'>
              <FontAwesomeIcon
                icon={this.getIcon()}
                className="fs-4 flex-shrink-1"
              />
            </div>
            <div className='file-item-section-2'>
              <p className='fw-bold col-11 text-truncate my-auto'>{this.state.name}{this.state.type}</p>
            </div>
          </div>
        </div>
      </>
    )
  }

  getIcon() {
    switch (this.state.type) {
      case '.doc':
      case '.docx':
        return Icon.render('fas', 'file-word');
      case '.xls':
      case '.xlsx':
        return Icon.render('fas', 'file-excel');
      case '.ppt':
      case '.pptx':
        return Icon.render('fas', 'file-powerpoint');
      case '.pdf':
        return Icon.render('fas', 'file-pdf');
      case '.txt':
        return Icon.render('fas', 'file-alt');
      case '.zip':
      case '.rar':
        return Icon.render('fas', 'file-archive');
      default:
        return Icon.render('fas', 'file');
    }
  }

  offcanvas_details() {
    return (
      <Offcanvas show={this.state.offcanvas.details} onHide={() => this.closeOffcanvas('details')} placement={'end'}>
        <Offcanvas.Header closeButton closeVariant='white' className='bg-primary bg-gradient text-secondary fw-bold'>
          <Offcanvas.Title>{this.state.name}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="input-group mb-2 ">
            <span className="input-group-text" id="description-addon">
              <FontAwesomeIcon
                icon={Icon.render('fas', 'align-left')}
                className="mx-auto flex-shrink-1"
              />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Descrição do arquivo"
              aria-label="Descrição do arquivo"
              aria-describedby="description-addon"
              value={this.state.description}
              disabled={!this.state.change.description}
              onChange={(e) => this.handleChangeDescription(e.target.value)}
            />
            <span className="input-group-text">
              <FontAwesomeIcon
                icon={Icon.render('fas', this.checkChangeIsEnable('description') ? 'check' : 'pen')}
                className={`mx-auto flex-shrink-1 file-icon-edit-property ${this.checkChangeIsEnable('description') ? 'activate' : ''}`}
                onClick={() => !this.state.change.description ? this.enableChange('description') : this.saveChange('description')}
              />
            </span>
          </div>
          <div className="input-group border-top pt-2 mb-2">
            <span className="input-group-text" id="name-addon">
              <FontAwesomeIcon
                icon={this.getIcon()}
                className="mx-auto flex-shrink-1"
              />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Nome do arquivo"
              aria-label="Nome do arquivo"
              aria-describedby="name-addon"
              value={this.state.name}
              disabled={!this.state.change.name}
              onChange={(e) => this.handleChangeName(e.target.value)}
            />
            <span className="input-group-text">
              <FontAwesomeIcon
                icon={Icon.render('fas', this.checkChangeIsEnable('name') ? 'check' : 'pen')}
                className={`mx-auto flex-shrink-1 file-icon-edit-property ${this.checkChangeIsEnable('name') ? 'activate' : ''}`}
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
              placeholder="Marcação do arquivo"
              aria-label="Marcação do arquivo"
              aria-describedby="tag-addon"
              value={this.state.tag}
              disabled={!this.state.change.tag}
              onChange={(e) => this.handleChangeTag(e.target.value)}
            />
            <span className="input-group-text">
              <FontAwesomeIcon
                icon={Icon.render('fas', this.checkChangeIsEnable('tag') ? 'check' : 'pen')}
                className={`mx-auto flex-shrink-1 file-icon-edit-property ${this.checkChangeIsEnable('tag') ? 'activate' : ''}`}
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
              placeholder="Marcação da pasta"
              aria-label="Marcação da pasta"
              aria-describedby="type-addon"
              value={this.state.type}
              disabled={true}
            />
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
                <Nav.Item className='col-12 col-md-4 text-center'>
                  <Nav.Link eventKey="share">
                    Compartilhar
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className='col-12 col-md-4 text-center'>
                  <Nav.Link eventKey="assignees">
                    Procuradores
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className='col-12 col-md-4 text-center'>
                  <Nav.Link eventKey="versions">
                    Versões
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
              <Tab.Pane eventKey="versions">
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Offcanvas.Body>
      </Offcanvas>
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
            Total de Versões
          </p>
          <div className="input-group">
            <span className="input-group-text" id="details-versions">
              <FontAwesomeIcon
                icon={Icon.render('fas', 'history')}
                className="fs-4 flex-shrink-1"
              />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Total de Versões"
              aria-label="Total de Versões"
              aria-describedby="details-versions"
              value={this.state.versions}
              disabled={true}
            />
          </div>
        </div>
        <div className='col-12 p-2 my-2'>
          <p className="form-label fw-bold text-center col-12 ms-1 pb-1 border-bottom">
            Tamanho Descompactado
          </p>
          <div className="input-group">
            <span className="input-group-text" id="details-size">
              <FontAwesomeIcon
                icon={Icon.render('fas', 'file-invoice')}
                className="fs-4 flex-shrink-1"
              />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Tamanho Descompactado"
              aria-label="Tamanho Descompactado"
              aria-describedby="details-size"
              value={Sugar.Number.bytes(this.state.size, 2, true)}
              disabled={true}
            />
          </div>
        </div>
        <div className='col-12 p-2 my-2'>
          <p className="form-label fw-bold text-center col-12 ms-1 pb-1 border-bottom">
            Tamanho Compactado
          </p>
          <div className="input-group">
            <span className="input-group-text" id="details-compressedSize">
              <FontAwesomeIcon
                icon={Icon.render('fas', 'file-archive')}
                className="fs-4 flex-shrink-1"
              />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Tamanho Compactado"
              aria-label="Tamanho Compactado"
              aria-describedby="details-compressedSize"
              value={Sugar.Number.bytes(this.state.compressedSize, 2, true)}
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

  setChange(field: ChangeKeys, value: boolean) {
    if (field === 'name')
      this.setState({ change: { ...this.state.change, name: value } });
    else if (field === 'description')
      this.setState({ change: { ...this.state.change, description: value } });
    else if (field === 'tag')
      this.setState({ change: { ...this.state.change, tag: value } });
  }

  checkChangeIsEnable(field: ChangeKeys) {
    if (field === 'name')
      return this.state.change.name;
    else if (field === 'description')
      return this.state.change.description;
    else if (field === 'tag')
      return this.state.change.tag;
  }

  enableChange(field: ChangeKeys) {
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
   * * Socket.io
   */

  inRoom(room: string[]) {
    return this.props.room.filter(r => room.includes(r)).length > 0;
  }

  async emitChangeDescription() {
    this.props.socket.emit('FILE-CHANGE-DESCRIPTION',
      this.props.room,
      await getGroupId(),
      await getUserAuth(),
      this.props.cid,
      this.state.description
    );
  }

  async emitChangeName() {
    this.props.socket.emit('FILE-CHANGE-NAME',
      this.props.room,
      await getGroupId(),
      await getUserAuth(),
      this.props.cid,
      this.state.name
    );
  }

  async emitChangeTag() {
    this.props.socket.emit('FILE-CHANGE-TAG',
      this.props.room,
      await getGroupId(),
      await getUserAuth(),
      this.props.cid,
      this.state.tag
    );
  }

  async emitChangeType() {
    this.props.socket.emit('FILE-CHANGE-TYPE',
      this.props.room,
      await getGroupId(),
      await getUserAuth(),
      this.props.cid,
      this.state.type
    );
  }

  onSocketEvents() {
    this.onChangeDescription(`FILE-CHANGE-DESCRIPTION-${this.props.cid}`);
    this.onChangeName(`FILE-CHANGE-NAME-${this.props.cid}`);
    this.onChangeTag(`FILE-CHANGE-TAG-${this.props.cid}`);
    this.onChangeType(`FILE-CHANGE-TYPE-${this.props.cid}`);
  }

  offSocketEvents() {
    this.offChangeDescription(`FILE-CHANGE-DESCRIPTION-${this.props.cid}`);
    this.offChangeName(`FILE-CHANGE-NAME-${this.props.cid}`);
    this.offChangeTag(`FILE-CHANGE-TAG-${this.props.cid}`);
    this.offChangeType(`FILE-CHANGE-TYPE-${this.props.cid}`);
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
        if (this.inRoom(room))
          Alerting.create(error);
      })
  }

  offChangeDescription(eventName: string) {
    const
      eventSuccess = `${eventName}-SUCCESS`,
      eventError = `${eventName}-ERROR`;

    this.props.socket.off(eventSuccess);
    this.props.socket.off(eventError);
  };

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
        if (this.inRoom(room))
          Alerting.create(error);
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
        if (this.inRoom(room))
          Alerting.create(error);
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
        if (this.inRoom(room))
          Alerting.create(error);
      })
  }

  offChangeType(eventName: string) {
    const
      eventSuccess = `${eventName}-SUCCESS`,
      eventError = `${eventName}-ERROR`;

    this.props.socket.off(eventSuccess);
    this.props.socket.off(eventError);
  }
}