/**
 * @description Verifica se o usuario tem os privilegios informados
 * @author @GuilhermeSantos001
 * @update 06/10/2021
 */

import Fetch from '@/src/utils/fetch'
import getUserInfo from '@/src/functions/getUserInfo'

export default async function HasPrivilege(...privileges: string[]): Promise<boolean> {
  const _fetch = new Fetch(process.env.NEXT_PUBLIC_GRAPHQL_HOST)

  const { privileges: usr_privileges } = await getUserInfo(_fetch)

  return privileges.filter(privilege => usr_privileges.includes(privilege)).length > 0;
}