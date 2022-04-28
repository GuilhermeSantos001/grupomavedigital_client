/**
 * @description Efetuada uma chamada para a API para verificar o token do usuario
 * @author GuilhermeSantos001
 * @update 16/12/2021
 */

import Fetch from '@/src/utils/fetch'
import { Variables } from '@/src/db/variables'

export const saveUpdatedToken = async (signature: string, token) => {
  const variables = new Variables(1, 'IndexedDB')
  await variables.define('signature', signature);
  await variables.define('token', token);
}

export const tokenValidate = async (_fetch: Fetch): Promise<boolean> => {
  try {
    const validate = await _fetch.tokenValidate();

    const {
      errors,
      data
    } = validate

    if (errors) return false

    const { success, signature, token } = data.response;

    if (success) {
      if (signature && token)
        saveUpdatedToken(signature, token);

      return true
    } else {
      return false
    }
  } catch (error) {
    console.error(error);

    return false
  }
}