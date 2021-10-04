/**
 * @description Efetuada uma chamada para a API para verificar o token do usuario
 * @author @GuilhermeSantos001
 * @update 30/09/2021
 */

import Fetch from '@/src/utils/fetch'
import Variables from '@/src/db/variables'

const tokenValidate = async (_fetch: Fetch): Promise<boolean> => {
  const variables = new Variables(1, 'IndexedDB')

  const validate = await _fetch.tokenValidate(),
    {
      errors,
      data
    } = validate

  if (errors) return false

  const { success, signature, token } = data.response;

  if (success) {
    if (signature) await variables.define('signature', signature)
    if (token) await variables.define('token', token)

    return true
  } else {
    return false
  }
}

export default tokenValidate;