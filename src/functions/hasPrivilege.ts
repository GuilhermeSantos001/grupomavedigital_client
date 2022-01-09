/**
 * @description Verifica se o usuario tem os privilegios informados
 * @author GuilhermeSantos001
 * @update 06/10/2021
 */

import Fetch from '@/src/utils/fetch'
import { PrivilegesSystem } from '@/pages/_app';
import getUserInfo from '@/src/functions/getUserInfo'
import { saveUpdatedToken } from '@/src/functions/tokenValidate'

export default async function HasPrivilege(...privileges: PrivilegesSystem[]): Promise<boolean> {
  const _fetch = new Fetch(process.env.NEXT_PUBLIC_GRAPHQL_HOST)

  const { privileges: usr_privileges, updatedToken } = await getUserInfo(_fetch)

  if (updatedToken)
    await saveUpdatedToken(updatedToken.signature, updatedToken.token)

  return privileges.filter(privilege => usr_privileges.includes(privilege)).length > 0;
}