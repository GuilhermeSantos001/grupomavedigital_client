/**
 * @description Classe usada para interação com indexedDB
 * @author @GuilhermeSantos001
 * @update 25/09/2021
 */

import IDatabaseProvider from '@/src/contracts/databaseProvider';

export default class indexedDB implements IDatabaseProvider {
    private readonly name: string;
    private readonly version: number;

    constructor(db_name: string, version: number) {
        if (!this.supportBrowser())
            throw new TypeError('Browser not support for indexedDB!');

        this.name = db_name;
        this.version = version;
    }

    /**
     * @description Retorna o nome da database
     */
    public getName(): string {
        return this.name;
    }

    /**
     * @description Retorna a versão da database
     */
    public getVersion(): number {
        return this.version;
    }

    /**
     * @description Verifica se o browser tem suporte a indexedDB
     */
    public supportBrowser(): boolean {
        return window.indexedDB ? true : false;
    }

    /**
     * @description Adiciona um novo valor há store
     */
    public storeAdd<Type>(storeName: string, keyPath: string, data: Type): Promise<void> {
        return new Promise((resolve, reject) => {
            const request_DB = window.indexedDB.open(this.getName(), this.getVersion());

            request_DB.onerror = function () {
                return reject('Error when opening the database');
            };

            request_DB.onupgradeneeded = function (event) {
                const target: any = event.target;

                target.result.createObjectStore(storeName, { keyPath });
            };

            request_DB.onsuccess = function (event) {
                const target: any = event.target,
                    db = target.result,
                    transaction = db.transaction([storeName], "readwrite"),
                    objectStore = transaction.objectStore(storeName);

                transaction.onerror = function () {
                    return resolve();
                };

                const request = objectStore.add(data);

                request.onerror = function () {
                    return resolve();
                };

                request.onsuccess = function () {
                    return resolve();
                };
            };
        });
    }

    /**
     * @description Atualiza um valor na store
     */
    public storeUpdate<Type>(storeName: string, keyPath: string, key: string, newData: Type): Promise<void> {
        return new Promise((resolve, reject) => {
            const request_DB = window.indexedDB.open(this.getName(), this.getVersion());

            request_DB.onerror = function () {
                return reject('Error when opening the database');
            };

            request_DB.onupgradeneeded = function (event) {
                const target: any = event.target;

                target.result.createObjectStore(storeName, { keyPath });
            };

            request_DB.onsuccess = function (event) {
                const
                    target: any = event.target,
                    db = target.result,
                    transaction = db.transaction([storeName], "readwrite"),
                    objectStore = transaction.objectStore(storeName);

                transaction.onerror = function () {
                    return resolve();
                };

                const request = objectStore.get(key);

                request.onerror = function () {
                    return resolve();
                };

                request.onsuccess = function () {
                    const result = request.result || {};

                    const update = objectStore.put(Object.assign(result, newData));

                    update.onsuccess = function () {
                        return resolve();
                    };

                    update.onerror = function () {
                        return resolve();
                    };
                };
            };
        });
    }

    /**
     * @description Retorna um valor da store
     */
    public storeGet<Type>(storeName: string, keyPath: string, key: string): Promise<Type> {
        return new Promise((resolve, reject) => {
            const request_DB = window.indexedDB.open(this.getName(), this.getVersion());

            request_DB.onerror = function () {
                reject('Error when opening the database');
            };

            request_DB.onupgradeneeded = function (event) {
                const target: any = event.target;

                target.result.createObjectStore(storeName, { keyPath });
            };

            request_DB.onsuccess = function (event) {
                const target: any = event.target,
                    db = target.result,
                    transaction = db.transaction([storeName], "readwrite"),
                    objectStore = transaction.objectStore(storeName);

                transaction.onerror = function () {
                    return reject('Transaction not opened due to error. Duplicate items not allowed.');
                };

                const request = objectStore.get(key);

                request.onsuccess = function () {
                    return resolve(request.result || undefined);
                };

                request.onerror = function () {
                    return reject('Error when trying to access the ObjectStore.');
                };
            };
        });
    }

    /**
     * @description Retorna todas as chaves da store
     */
    public storeGetAllKeys(storeName: string, keyPath: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            const request_DB = window.indexedDB.open(this.getName(), this.getVersion());

            request_DB.onerror = function () {
                reject('Error when opening the database');
            };

            request_DB.onupgradeneeded = function (event) {
                const target: any = event.target;

                target.result.createObjectStore(storeName, { keyPath });
            };

            request_DB.onsuccess = function (event) {
                const target: any = event.target,
                    db = target.result,
                    transaction = db.transaction([storeName], "readwrite"),
                    objectStore = transaction.objectStore(storeName);

                transaction.onerror = function () {
                    return reject('Transaction not opened due to error. Duplicate items not allowed.');
                };

                const request = objectStore.getAllKeys();

                request.onsuccess = function () {
                    return resolve(request.result || undefined);
                };

                request.onerror = function () {
                    return reject('Error when trying to access the ObjectStore.');
                };
            };
        });
    }

    /**
     * @description Retorna todos os valores da store
     */
    public storeGetAll<Type>(storeName: string, keyPath: string): Promise<Type[]> {
        return new Promise((resolve, reject) => {
            const request_DB = window.indexedDB.open(this.getName(), this.getVersion());

            request_DB.onerror = function () {
                reject('Error when opening the database');
            };

            request_DB.onupgradeneeded = function (event) {
                const target: any = event.target;

                target.result.createObjectStore(storeName, { keyPath });
            };

            request_DB.onsuccess = function (event) {
                const target: any = event.target,
                    db = target.result,
                    transaction = db.transaction([storeName], "readwrite"),
                    objectStore = transaction.objectStore(storeName);

                transaction.onerror = function () {
                    return reject('Transaction not opened due to error. Duplicate items not allowed.');
                };

                const request = objectStore.getAll();

                request.onsuccess = function () {
                    return resolve(request.result || undefined);
                };

                request.onerror = function () {
                    return reject('Error when trying to access the ObjectStore.');
                };
            };
        });
    }

    /**
     * @description Remove um valor da store
     */
    public storeRemove(storeName: string, keyPath: string, key: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const request_DB = window.indexedDB.open(this.getName(), this.getVersion());

            request_DB.onerror = function () {
                return reject('Error when opening the database');
            };

            request_DB.onupgradeneeded = function (event) {
                const target: any = event.target;

                target.result.createObjectStore(storeName, { keyPath });
            };

            request_DB.onsuccess = function (event) {
                const
                    target: any = event.target,
                    db = target.result,
                    transaction = db.transaction([storeName], "readwrite"),
                    objectStore = transaction.objectStore(storeName);

                transaction.onerror = function () {
                    return resolve();
                };

                const request = objectStore.delete(key);

                request.onerror = function () {
                    return resolve();
                };

                request.onsuccess = function () {
                    return resolve();
                };
            };
        });
    }

    /**
     * @description Limpa todos os valores da store
     */
    public storeClear(storeName: string, keyPath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const request_DB = window.indexedDB.open(this.getName(), this.getVersion());

            request_DB.onerror = function () {
                return reject('Error when opening the database');
            };

            request_DB.onupgradeneeded = function (event) {
                const target: any = event.target;

                target.result.createObjectStore(storeName, { keyPath });
            };

            request_DB.onsuccess = function (event) {
                const target: any = event.target,
                    db = target.result,
                    transaction = db.transaction([storeName], "readwrite"),
                    objectStore = transaction.objectStore(storeName);

                transaction.onerror = function () {
                    return reject();
                };

                const request = objectStore.clear();

                request.onerror = function () {
                    return resolve();
                };

                request.onsuccess = function () {
                    return resolve();
                };
            };
        });
    }
}