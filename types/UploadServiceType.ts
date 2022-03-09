import type { UploadType } from '@/types/UploadType'

export type DataUpload = Pick<UploadType,
  | 'fileId'
  | 'authorId'
  | 'filename'
  | 'filetype'
  | 'description'
  | 'size'
  | 'compressedSize'
  | 'version'
  | 'temporary'
  | 'expiredAt'
>;

export type ResponseCreateUpload = {
  data: UploadType
  update: typeof UpdateUpload
  delete: typeof DeleteUpload
} | undefined

declare function CreateUpload(data: DataUpload): Promise<ResponseCreateUpload>
declare function SetUpload(data: ResponseCreateUpload): void
declare function UpdateUpload(newData: DataUpload): Promise<boolean>
declare function DeleteUpload(): Promise<boolean>

declare function UpdateUploads(id: string, newData: DataUpload): Promise<boolean>
declare function DeleteUploads(id: string): Promise<boolean>

export type FunctionCreateUploadTypeof = typeof CreateUpload;
export type FunctionSetUploadTypeof = typeof SetUpload;
export type FunctionUpdateUploadTypeof = typeof UpdateUpload | undefined;
export type FunctionDeleteUploadTypeof = typeof DeleteUpload  | undefined;

export type FunctionUpdateUploadsTypeof = typeof UpdateUploads | undefined;
export type FunctionDeleteUploadsTypeof = typeof DeleteUploads | undefined;
export type FunctionNextPageTypeof = (() => void) | undefined;
export type FunctionPreviousPageTypeof = (() => void) | undefined;