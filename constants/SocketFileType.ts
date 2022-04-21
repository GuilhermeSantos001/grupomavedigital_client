export type TYPEOF_EMITTER_FILE_UPLOAD_ATTACHMENT = {
  channel: string
  authorId: string
  name: string
  description: string
  size: number
  compressedSize: number
  fileId: string
  version: number
}

export type TYPEOF_LISTENER_FILE_UPLOAD_ATTACHMENT = {
  fileId: string
  authorId: string
  filename: string
  filetype: string
  description: string
  size: number
  compressedSize: number
  version: number
  temporary: boolean
  expiredAt: string
}

export type TYPEOF_EMITTER_FILE_DELETE_ATTACHMENT = {
  filesId: string[]
  mirrorsId: string[]
}

export type TYPEOF_LISTENER_FILE_DELETE_ATTACHMENT = {
  mirrorsId: string[]
}

export type TYPEOF_EMITTER_FILE_CHANGE_TYPE_ATTACHMENT = {
  filesId: string[]
  type: 'TEMPORARY' | 'PERMANENT'
}

export type TYPEOF_LISTENER_FILE_CHANGE_TYPE_ATTACHMENT = {
  filesId: string[]
  type: 'TEMPORARY' | 'PERMANENT'
}