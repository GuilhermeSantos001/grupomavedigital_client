/**
 * @description Classe usada para armazenamento em memoria
 * @author GuilhermeSantos001
 * @update 27/09/2021
 */

import IDatabaseProvider from '@/src/contracts/databaseProvider';

export default class MemoryDB implements IDatabaseProvider {
    private readonly name: string;
    private readonly version: number;
    private data: unknown = {};

    constructor(db_name: string, version: number) {
        if (!this.supportBrowser())
            throw new Error('Browser not support for MemoryDB!');
        this.name = db_name;
        this.version = version;
    }

    /**
     * @description Retorna o nome da database
     */
    getName(): string {
        return this.name;
    }

    /**
     * @description Retorna a versão da database
     */
    getVersion(): number {
        return this.version;
    }

    /**
     * @description Verifica se o browser tem suporte a indexedDB
     */
    supportBrowser(): boolean {
        return true;
    }

    /**
     * @description Adiciona um novo valor há store
     */
    public storeAdd<Type>(storeName: string, keyPath: string, data: Type): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                if (!this.data[storeName])
                    this.data[storeName] = [];

                this
                    .data[storeName]
                    .push(
                        Object
                            .assign({ [keyPath]: undefined }, data)
                    );

                return resolve();
            } catch (error) {
                return reject(error);
            }
        })
    }

    /**
     * @description Atualiza o novo valor na store
     */
    public storeUpdate<Type>(storeName: string, keyPath: string, key: string, newData: Type): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                if (this.data[storeName]) {
                    const data: Type[] = this.data[storeName];

                    const updateData = (value: Type) => {
                        if (value[keyPath] === key)
                            return newData;
                    }

                    data.forEach((value: Type, index: number) =>
                        data[index] = updateData(value)
                    );

                }

                return resolve();
            } catch (error) {
                return reject(error);
            }
        })
    }

    /**
     * @description Retorna o novo valor da store
     */
    public storeGet<Type>(storeName: string, keyPath: string, key: string): Promise<Type> {
        return new Promise((resolve, reject) => {
            try {
                if (this.data[storeName])
                    return resolve(this.data[storeName].filter((data: Type) => data[keyPath] === key).at(0) || undefined);

                return resolve(undefined);
            } catch (error) {
                return reject(error);
            }
        })
    }

    /**
     * @description Retorna todas as chaves da store
     */
    public storeGetAllKeys(storeName: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            try {
                if (this.data[storeName])
                    return resolve(Object.keys(this.data[storeName]) || undefined);

                return resolve(undefined);
            } catch (error) {
                return reject(error);
            }
        })
    }

    /**
     * @description Retorna todos os valores da store
     */
    public storeGetAll<Type>(storeName: string, keyPath: string): Promise<Type[]> {
        return new Promise((resolve, reject) => {
            try {
                if (this.data[storeName])
                    return resolve(this.data[storeName].filter((data: Type) => data[keyPath] !== undefined) || undefined);

                return resolve(undefined);
            } catch (error) {
                return reject(error);
            }
        })
    }

    /**
     * @description Remove o valor da store
     */
    public storeRemove<Type>(storeName: string, keyPath: string, key: string): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                if (this.data[storeName])
                    this.data[storeName] = this.data[storeName].filter((data: Type) => data[keyPath] !== key);

                return resolve();
            } catch (error) {
                return reject(error);
            }
        })
    }

    /**
     * @description Limpa os valores da store
     */
    public storeClear(storeName: string): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                if (this.data[storeName])
                    this.data[storeName] = undefined;

                return resolve();
            } catch (error) {
                return reject(error);
            }
        })
    }
}