/**
 * @description Tipos dos eventos do Socket.io
 * @author GuilhermeSantos001
 * @update 24/01/2022
 */

export type TYPEOF_EMITTER_PAYBACK_UPLOAD_MIRROR = {
  authorId: string,
  name: string,
  description: string,
  size: number,
  compressedSize: number,
  fileId: string,
  version: number,
  type: 'COVERAGE' | 'COVERING'
}

export type TYPEOF_LISTENER_PAYBACK_UPLOAD_MIRROR = {
  fileId: string,
  authorId: string,
  filename: string,
  filetype: string,
  description: string,
  size: number,
  compressedSize: number,
  version: number,
  temporary: boolean,
  expiredAt: string
}

export type TYPEOF_EMITTER_PAYBACK_CHANGE_TYPE_MIRROR = {
  filesId: string[],
  type: 'TEMPORARY' | 'PERMANENT'
}

export type TYPEOF_LISTENER_PAYBACK_CHANGE_TYPE_MIRROR = {
  filesId: string[],
  type: 'TEMPORARY' | 'PERMANENT'
}

export type TYPEOF_EMITTER_PAYBACK_DELETE_MIRROR = {
  filesId: string[]
  mirrorsId: string[]
}

export type TYPEOF_LISTENER_PAYBACK_DELETE_MIRROR = {
  mirrorsId: string[]
}