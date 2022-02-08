export type UploadType = {
  id: string
  cursorId: number
  fileId: string
  authorId: string
  filename: string
  filetype: string
  description :string
  size: number
  compressedSize: number
  version: number
  temporary: boolean
  expiredAt: Date
  createdAt: Date
  updatedAt: Date
}