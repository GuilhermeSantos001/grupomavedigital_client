/* eslint-disable no-async-promise-executor */
/**
 * @description Retorna os privilégios do usuário
 * @author GuilhermeSantos001
 * @update 16/12/2021
 */

import { compressToEncodedURIComponent } from 'lz-string'

import axios from 'axios'
import Fetch from '@/src/utils/fetch'
import Variables from '@/src/db/variables'
import getUserInfo from '@/src/functions/getUserInfo'
import { saveUpdatedToken } from '@/src/functions/tokenValidate'
import { GroupId } from '@/components/storage/Files'

import { PrivilegesSystem } from '@/pages/_app'

export async function getPrivilege(): Promise<string> {
    const _fetch = new Fetch(process.env.NEXT_PUBLIC_GRAPHQL_HOST)

    const { privilege, updatedToken } = await getUserInfo(_fetch)

    if (updatedToken)
        await saveUpdatedToken(updatedToken.signature, updatedToken.token);

    return privilege;
}

export async function getPrivileges(): Promise<PrivilegesSystem[]> {
    const _fetch = new Fetch(process.env.NEXT_PUBLIC_GRAPHQL_HOST)

    const { privileges, updatedToken } = await getUserInfo(_fetch)

    if (updatedToken)
        await saveUpdatedToken(updatedToken.signature, updatedToken.token);

    return privileges;
}

export async function getPrivilegeAlias(group: GroupId): Promise<string> {
    return new Promise(async (resolve, reject) => {
        const
            variables = new Variables(1, 'IndexedDB'),
            token = await variables.get<string>('token'),
            refreshToken = await variables.get<{
                signature: string
                token: string
            }>('refreshToken'),
            signature = await variables.get<string>('signature'),
            uri = `${process.env.NEXT_PUBLIC_EXPRESS_HOST}`;

        axios
            .get(`${uri}/utils/privilege/alias/${compressToEncodedURIComponent(group.name)}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'auth': process.env.NEXT_PUBLIC_EXPRESS_AUTHORIZATION || "",
                    'token': compressToEncodedURIComponent(token),
                    'refreshToken': compressToEncodedURIComponent(JSON.stringify(refreshToken)),
                    'signature': compressToEncodedURIComponent(signature)
                }
            })
            .then(async response => {
                if (response.status == 200) {
                    if (response.data.updatedToken)
                        await saveUpdatedToken(response.data.updatedToken.signature, response.data.updatedToken.token);

                    resolve(response.data.alias);
                }
                else
                    reject(`Não foi possível retornar o apelido do grupo: ${group.name}.`)
            })
            .catch((error) => reject(error))
    });
}