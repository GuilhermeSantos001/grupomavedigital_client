/* eslint-disable @typescript-eslint/ban-ts-comment */
/**
 * @description DropZone usado para arrastar arquivos/pastas para upload
 * @author GuilhermeSantos001
 * @update 18/01/2022
 */

import React from 'react'

import Sugar from 'sugar'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from '@/src/utils/fontAwesomeIcons'

import { RotateSpinner } from 'react-spinners-kit'

import singleUpload, { File as IUploadFile } from '@/src/functions/singleUpload'
import multipleUpload from '@/src/functions/multipleUpload'

import Alerting from '@/src/utils/alerting'
import Fetch from '@/src/utils/fetch'

declare function callbackAfterUpload(files: IUploadFile | IUploadFile[]): void

type MyProps = {
  fetch: Fetch
  ext: `.${string}`[]
  maxSize: number
  limit?: number
  randomName?: boolean
  onCallbackAfterUpload: typeof callbackAfterUpload
}

type MyState = {
  message: dropZoneMessage
  overlay: boolean
  invalid: boolean
  files: File[]
  inputFileType: 'file' | 'folder'
  uploading: boolean
  removeAllItems: boolean
}

interface File {
  name: string
  size: number
  remove: boolean
  raw: globalThis.File
}

enum dropZoneMessage {
  beforeDragEnter = 'Arraste e solte os arquivos/pastas aqui!!!',
  afterDragEnter = 'Muito bem!, agora solte-os para analisarmos',
  afterDrop = '',
  invalid = 'Arquivos recusados. Tente novamente!',
}

export default class DropZone extends React.Component<MyProps, MyState> {
  inputFiles: React.RefObject<HTMLInputElement>

  constructor(props) {
    super(props)

    this.inputFiles = React.createRef<HTMLInputElement>()

    this.state = {
      message: dropZoneMessage.beforeDragEnter,
      overlay: false,
      invalid: undefined,
      files: [],
      inputFileType: 'file',
      uploading: false,
      removeAllItems: false
    }
  }

  totalBytes(): number {
    let totalBytes = 0

    this.state.files.forEach((file) => (totalBytes += file.size))

    return totalBytes
  }

  exceedBytes(bytes: number, files: File[] = this.state.files): boolean {
    let totalBytes = 0

    files.forEach((file) => (totalBytes += file.size))

    return (totalBytes + bytes) > this.props.maxSize;
  }

  render() {
    if (this.state.uploading)
      return (
        <div
          className={`dropzone ${this.state.uploading ? 'active' : 'deactivate'
            } d-flex flex-column p-2`}
        >
          <button
            type="button"
            className="btn btn-outline-primary col-12"
            disabled={true}
          >
            <div className="d-flex justify-content-center">
              <RotateSpinner size={42} color={'#004a6e'} loading={true} />
            </div>
          </button>
        </div>
      )

    return (
      <div
        className={`dropzone ${this.state.uploading ? 'deactivate' : 'active'}`}
      >
        {this.state.files.length <= 0 ? (
          <>
            <div
              className={`drag-drop-zone ${this.state.overlay ? 'overlay' : ''
                } ${this.state.invalid
                  ? `invalid-${this.state.files.length <= 0 ? '1' : '2'}`
                  : ''
                }`}
              onDrop={(e) => this.handleDrop(e)}
              onDragOver={(e) => this.handleDragOver(e)}
              onDragEnter={(e) => this.handleDragEnter(e)}
              onDragLeave={(e) => this.handleDragLeave(e)}
            >
              <p className="my-auto fs-4">{this.state.message}</p>
            </div>
            {this.render_inputUploadFile()}
            {this.render_buttonUploadFiles()}
          </>
        ) : (
          <>
            <div
              className={`drag-drop-zone flex-column py-2 ${this.state.overlay ? 'overlay' : ''
                } ${this.state.invalid
                  ? `invalid-${this.state.files.length <= 0 ? '1' : '2'}`
                  : ''
                }`}
              onDrop={(e) => this.handleDrop(e)}
              onDragOver={(e) => this.handleDragOver(e)}
              onDragEnter={(e) => this.handleDragEnter(e)}
              onDragLeave={(e) => this.handleDragLeave(e)}
            >
              <div className={`dropbox-container ${this.state.removeAllItems ? 'deactivate' : 'active'}`}>
                <div className="d-flex border-bottom">
                  <div className="p-2 w-100 text-truncate">
                    <h1 className="text-start text-primary fs-5 fw-bold">
                      Arquivos: {this.state.files.length} (
                      {Sugar.Number.bytes(this.totalBytes(), 2, true)}/
                      {Sugar.Number.bytes(this.props.maxSize)})
                    </h1>
                  </div>
                  <div className="p-2 flex-shrink-1">
                    <FontAwesomeIcon
                      icon={Icon.render('fas', 'trash')}
                      className="flex-shrink-1 my-auto trash-icon"
                      onClick={() => this.handleClickTrashAll()}
                    />
                  </div>
                </div>
                {this.state.files.map((file, i) => {
                  return (
                    <div
                      key={`${file.name}-${i}`}
                      className={`dropbox-item ${!file.remove ? 'active' : 'deactivate'
                        }`}
                    >
                      <div className="p-2 w-100 text-truncate">
                        <p className="my-2 text-start text-primary text-truncate fw-bold text-muted">
                          {file.name} ({Sugar.Number.bytes(file.size, 2, true)})
                        </p>
                      </div>
                      <div className="p-2 flex-shrink-1 my-2">
                        <FontAwesomeIcon
                          icon={Icon.render('fas', 'trash')}
                          className="ms-2 flex-shrink-1 my-auto trash-icon"
                          onClick={() => this.handleClickTrashFile(file.name)}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            {this.render_inputUploadFile()}
            {this.render_buttonUploadFiles()}
          </>
        )}
      </div>
    )
  }

  render_inputUploadFile() {
    return (
      <div className="d-flex flex-column flex-md-row p-2">
        <div className="col-12 col-md-10">
          {this.state.inputFileType === 'folder' ? (
            <div className="input-group">
              <input
                type="file"
                className="form-control"
                /* @ts-expect-error */
                webkitdirectory=""
                mozdirectory=""
                directory=""
                multiple
                ref={this.inputFiles}
                accept={this.props.ext.join(', ')}
                onChange={() => this.handleUploadFiles()}
              />
            </div>
          ) : (
            <div className="input-group">
              <input
                type="file"
                className="form-control"
                multiple
                ref={this.inputFiles}
                accept={this.props.ext.join(', ')}
                onChange={() => this.handleUploadFiles()}
              />
            </div>
          )}
        </div>
        <div className="col-12 col-md-2">
          <select
            className="form-select"
            aria-label="Default select example"
            onChange={(e) => this.handleChangeInputFileType(e)}
            value={this.state.inputFileType}
          >
            <option value="file">Arquivo</option>
            <option value="folder">Pasta</option>
          </select>
        </div>
      </div>
    )
  }

  render_buttonUploadFiles() {
    return (
      <div className="d-flex flex-column p-2">
        <button
          type="button"
          className="btn btn-outline-primary col-12"
          disabled={this.state.files.length <= 0 ? true : false}
          onClick={() => this.handleClickUploadFiles()}
        >
          Enviar arquivos
        </button>
      </div>
    )
  }

  async handleClickUploadFiles() {
    this.setState({ uploading: true })

    let params: any = []

    if (this.state.files.length > 1) {
      params = await multipleUpload(
        this.props.fetch,
        this.state.files.map((file) => file.raw),
        this.props.randomName
      )
    } else {
      params = await singleUpload(this.props.fetch, this.state.files[0].raw, this.props.randomName)
    }

    this.handleClickTrashAll()

    this.props.onCallbackAfterUpload(params)

    setTimeout(() => this.setState({ uploading: false }))
  }

  handleChangeInputFileType(e) {
    this.setState({
      inputFileType: e.target.value,
    })
  }

  handleClickTrashAll() {
    this.setState({
      files: this.state.files.map((file) => {
        return {
          ...file,
          remove: true
        }
      }),
      removeAllItems: true
    })

    setTimeout(() => {
      this.setState({
        files: [],
        message: dropZoneMessage.beforeDragEnter,
      })
    }, 400)
  }

  handleClickTrashFile(filename: string) {
    this.setState({
      files: this.state.files.map((file) => {
        return {
          ...file,
          remove: file.name === filename ? true : false,
        }
      }),
    })

    setTimeout(() => {
      const files = this.state.files.filter((file) => file.name !== filename)

      this.setState({
        files: files,
        message:
          files.length <= 0
            ? dropZoneMessage.beforeDragEnter
            : dropZoneMessage.afterDrop,
      })
    }, 400)
  }

  async handleDrop(e) {
    e.preventDefault()
    e.stopPropagation()

    const items = await this.getAllFileEntries(e.dataTransfer.items)

    this.processFiles(items)
    this.setState({ removeAllItems: false });
  }

  async handleUploadFiles() {
    this.processFiles(this.inputFiles.current.files)
    this.inputFiles.current.value = ''
    this.setState({ removeAllItems: false });
  }

  async processFiles(items) {
    if (this.props.limit > 0 && this.state.files.length >= this.props.limit)
      return this.setDropInvalid('exceedLimit');

    const valid = Array.from({ length: items.length }).filter((_, i) =>
      this.props.ext.includes(
        `.${items[i].name.substring(items[i].name.lastIndexOf('.') + 1)}`
      )
    ),
      invalid = Array.from({ length: items.length }).filter(
        (_, i) =>
          !this.props.ext.includes(
            `.${items[i].name.substring(items[i].name.lastIndexOf('.') + 1)}`
          )
      ),
      isFileList = items instanceof FileList;

    if (isFileList) {
      const _convertItems: File[] = []

      Array.from({ length: items.length }).forEach((_, i) =>
        _convertItems.push({
          name: items[i].name,
          size: items[i].size,
          remove: false,
          raw: items[i],
        })
      )

      items = _convertItems
    }

    if (valid.length > 0) {
      const _files: File[] = [],
        _duplicateNames: string[] = [],
        process = (index, file) => {
          if (
            _files.filter((_file) => _file.name == file.name).length <= 0 &&
            this.state.files.filter((_file) => _file.name == file.name).length <= 0
          ) {
            if (
              !this.exceedBytes(file.size, _files) &&
              this.props.ext.includes(
                `.${file.name.substring(file.name.lastIndexOf('.') + 1)}`
              )
            ) {
              _files.push({
                name: file.name,
                size: file.size,
                remove: false,
                raw: isFileList ? file.raw : file,
              })
            }
          } else {
            _duplicateNames.push(file.name)
          }

          if (index >= items.length - 1) {
            if (_files.length > 0)
              return this.setDropValid(_files);

            if (_duplicateNames.length > 0)
              return this.setDropInvalid('duplicate', _duplicateNames);

            return this.setDropInvalid('maxSize')
          }
        }

      Array.from({ length: items.length }).forEach((_, i) => {
        if (isFileList) {
          process(i, items[i])
        } else {
          items[i].file((file) => {
            process(i, file);
          })
        }
      })
    }

    if (valid.length <= 0 && invalid.length > 0) this.setDropInvalid('ext')
  }

  async getAllFileEntries(dataTransferItemList) {
    const fileEntries = [],
      queue = []

    Array.from({ length: dataTransferItemList.length }).forEach((_, i) =>
      queue.push(dataTransferItemList[i].webkitGetAsEntry())
    )

    while (queue.length > 0) {
      const entry = queue.shift()

      if (entry.isFile) {
        fileEntries.push(entry)
      } else if (entry.isDirectory) {
        queue.push(
          ...(await this.readAllDirectoryEntries(entry.createReader()))
        )
      }
    }

    return fileEntries
  }

  async readAllDirectoryEntries(directoryReader) {
    const entries = [];

    let readEntries: any = await this.readEntriesPromise(directoryReader)

    while (readEntries.length > 0) {
      entries.push(...readEntries)
      readEntries = await this.readEntriesPromise(directoryReader)
    }

    return entries
  }

  async readEntriesPromise(directoryReader) {
    try {
      return await new Promise((resolve, reject) => {
        directoryReader.readEntries(resolve, reject)
      })
    } catch (err) {
      console.error(err)
    }
  }

  setDropValid(files) {
    this.setState({
      ...this.state,
      overlay: false,
      message: dropZoneMessage.afterDrop,
      files: [...this.state.files, ...files],
    })
  }

  setDropInvalid(
    alertType: 'ext' | 'maxSize' | 'duplicate' | 'exceedLimit',
    duplicateNames?: string[]
  ) {
    if (alertType == 'ext') {
      Alerting.create(
        'error',
        `Extensão do arquivo não é aceita. Extensões aceitas: ${this.props.ext.join(
          ', '
        )}`,
        3600
      )
    } else if (alertType == 'maxSize') {
      Alerting.create(
        'error',
        'Seu arquivo irá exceder o limite máximo permitido.',
        3600
      )
    } else if (alertType == 'duplicate') {
      if (duplicateNames.length <= 5) {
        duplicateNames.forEach((name) =>
          Alerting.create('error',`Arquivo "${name}" já está na lista.`)
        )
      } else {
        Alerting.create('error',`Varios arquivos informados já estão na lista.`)
      }
    } else if (alertType == 'exceedLimit') {
      Alerting.create('error',`Você atingiu o limite máximo de ${this.props.limit} arquivo(s) para upload por vêz.`)
    }

    this.setState({
      ...this.state,
      invalid: true,
      overlay: false,
      message: dropZoneMessage.invalid,
    })

    setTimeout(() => {
      this.setState({
        ...this.state,
        invalid: false,
        message: dropZoneMessage.beforeDragEnter,
      })
    }, 1500)
  }

  handleDragEnter(e) {
    e.preventDefault()
    e.stopPropagation()
  }

  handleDragOver(e) {
    e.preventDefault()
    e.stopPropagation()

    if (!this.state.overlay)
      this.setState({
        ...this.state,
        overlay: true,
        message: dropZoneMessage.afterDragEnter,
      })
  }

  handleDragLeave(e) {
    e.preventDefault()
    e.stopPropagation()

    this.setState({
      ...this.state,
      overlay: false,
      message: dropZoneMessage.beforeDragEnter,
    })
  }
}
