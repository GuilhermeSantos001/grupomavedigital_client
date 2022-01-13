/**
 * @description Efetuada uma chamada para a API para enviar vários arquivos
 * @author GuilhermeSantos001
 * @update 11/01/2022
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

const multipleUpload = async (_fetch: Fetch, files: globalThis.File[], randomName: boolean): Promise<File[]> => {
  const formData = new FormData(),
    signedUrl = await signURL(),
    variables = new Variables(1, 'IndexedDB'),
    auth = await variables.get<string>('auth');

  let sizes: any = [],
    map: any = {}

  Array.from({ length: files.length }).forEach((_, i) =>
    sizes.push(`${files[i].size}`)
  )

  Array.from({ length: files.length }).forEach(
    (_, i) => (map[i] = [`variables.files.${i}`])
  )

  sizes = JSON.stringify(sizes)
  map = JSON.stringify(map)

  const filesData = JSON.stringify(
    Array.from({ length: files.length }).map(() => null)
  ),
    operations = `{ "query": "mutation ($files: [Upload!]!, $sizes: [String!]!, $signedUrl: String!, $auth: String!, $randomName: Boolean!) { multipleUpload(files: $files, sizes: $sizes, signedUrl: $signedUrl, auth: $auth) { authorId name size compressedSize fileId version status } }", "variables": { "files": ${filesData}, "sizes": ${sizes}, "signedUrl": "${signedUrl}", "auth": "${auth}", "randomName": ${randomName} } }`

  formData.append('operations', operations)
  formData.append('map', map)

  Array.from({ length: files.length }).forEach((_, i) =>
    formData.append(`${i}`, files[i])
  )

  const req = await _fetch.upload<{
    data: {
      multipleUpload: File[]
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
  throw new TypeError(JSON.stringify(errors));

  return data.multipleUpload;
}

export default multipleUpload;