/**
 * @description Verifica se o usuário tem os privilégios informados
 * @author GuilhermeSantos001
 * @update 21/01/2022
 */

import { PrivilegesSystem } from '@/pages/_app';
import { saveUpdatedToken } from '@/src/functions/tokenValidate'
import getUserInfo from '@/src/functions/getUserInfo'
import Fetch from '@/src/utils/fetch'

export default async function HasPrivilege(...privileges: PrivilegesSystem[]): Promise<boolean> {
  try {
    const _fetch = new Fetch(process.env.NEXT_PUBLIC_GRAPHQL_HOST)

    const { privileges: usr_privileges, updatedToken } = await getUserInfo(_fetch)

    if (updatedToken)
      await saveUpdatedToken(updatedToken.signature, updatedToken.token)

    return privileges.filter(privilege => usr_privileges.includes(privilege)).length > 0;
  } catch {
    throw new Error('Não foi possível verificar os privilégios do usuário');
  }
}