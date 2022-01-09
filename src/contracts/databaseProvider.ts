/**
 * @description Contrato das implementações que interagem com o banco de dados
 * @author GuilhermeSantos001
 * @update 25/09/2021
 */

export default interface IDatabaseProvider {
    /**
     * @description Retorna o nome da database
     */
    getName(): string;

    /**
     * @description Retorna a versão da database
     */
    getVersion(): number;

    /**
     * @description Verifica se o browser tem suporte a tecnologia de banco de dados
     * escolhida
     */
    supportBrowser(): boolean;

    /**
     * @description Adiciona um ou mais valores na store
     */
    storeAdd<Type>(storeName: string, keyPath: string, data: Type): Promise<void>

    /**
     * @description Atualiza um ou mais valores da store
     */
    storeUpdate<Type>(storeName: string, keyPath: string, key: string, newData: Type): Promise<void>

    /**
     * @description Retorna um ou mais valores da store
     */
    storeGet<Type>(storeName: string, keyPath: string, key: string): Promise<Type>

    /**
     * @description Retorna todos os valores da store
     */
    storeGetAll<Type>(storeName: string, keyPath: string): Promise<Type[]>

    /**
     * @description Remove o valor da store
     */
    storeRemove(storeName: string, keyPath: string, key: string): Promise<void>

    /**
     * @description Limpa todos os valores da store
     */
    storeClear(storeName, keyPath): Promise<void>
}