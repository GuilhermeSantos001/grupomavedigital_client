/**
 * @description Efetuada uma chamada para a API para enviar um arquivo
 * @author GuilhermeSantos001
 * @update 14/11/2021
 */

import Fetch from '@/src/utils/fetch';
import Variables from '@/src/db/variables';
import signURL from '@/src/functions/signURL'

export interface File {
  authorId: string
  name: string
  size: number
  compressedSize: number
  fileId: string
  version: number
  status: string
}

const singleUpload = async (_fetch: Fetch, file: globalThis.File): Promise<File> => {
  const formData = new FormData(),
    signedUrl = await signURL(),
    size = file.size,
    variables = new Variables(1, 'IndexedDB'),
    auth = await variables.get<string>('auth'),
    operations = `{ "query": "mutation ($file: Upload!, $size: String!, $signedUrl: String!, $auth: String!) { singleUpload(file: $file, size: $size, signedUrl: $signedUrl, auth: $auth) { authorId name size compressedSize fileId version status } }", "variables": { "file": null, "size": "${size}", "signedUrl": "${signedUrl}", "auth": "${auth}" } }`,
    map = `{"0": ["variables.file"] }`

  formData.append('operations', operations)
  formData.append('map', map)
  formData.append('0', file)

  const req = await _fetch.upload<{
    data: {
      singleUpload: File
    },
    errors: Error[]
  }>(
    formData
  ),
    {
      errors,
      data,
    } = req

  if (errors)
    throw new TypeError(JSON.stringify(errors))

  return data.singleUpload;
}

export default singleUpload;