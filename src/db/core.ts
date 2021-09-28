/**
 * @description Estrutura de base para interação com o banco de dados
 * @author @GuilhermeSantos001
 * @update 27/09/2021
 */

import { compressToBase64, decompressFromBase64 } from 'lz-string';
import { parse, stringify } from 'flatted';

import IndexedDB from '@/src/core/indexedDB';
import LocalStorageEx from '@/src/core/localStorageEx';
import MemoryDB from '@/src/core/memoryDB';

export type Technology = 'IndexedDB' | 'LocalStorageEx' | 'Memory';

export interface Value {
  id: string;
  value: string;
  compress: boolean;
}

export default class Core_Database {
  private db: IndexedDB | LocalStorageEx | MemoryDB;
  private name = 'app_gmd';
  private version = 1;

  constructor(name: string, version: number, technology: Technology) {
    this.name = name;
    this.version = version;

    if (technology === 'IndexedDB') {
      // Verifica se o indexedDB é suportado pelo navegador
      try {
        this.db = new IndexedDB(this.name, this.version);
      } catch {
        this.db = new LocalStorageEx(this.name, this.version);
      }
    } else if (technology === 'LocalStorageEx') {
      this.db = new LocalStorageEx(this.name, this.version);
    }
    else {
      this.db = new MemoryDB(this.name, this.version);
    }
  }

  /**
   * @description Faz a compressão da variável
   */
  private compress(value: string): string {
    return compressToBase64(stringify(value) || "");
  }

  /**
   * @description Faz a descompressão da variavel
   */
  private decompress(value: string): string {
    return parse(decompressFromBase64(value) || "");
  }

  /**
   * @description Formata os valores para o armazenamento
   */
  private format_value(name: string, value: any) {
    if (typeof value === 'string') {
      return {
        id: name,
        value: this.compress(value),
        compress: true
      }
    } else {
      return {
        ...value,
        id: name,
        compress: false
      }
    }
  }

  /**
   * @description Adiciona um valor há store
   */
  public async store_add(store: string, name: string, value: any): Promise<void> {
    try {
      return await this.db.storeAdd(store, 'id', this.format_value(name, value));
    } catch (error: any) {
      throw new Error(error);
    }
  }

  /**
   * @description Atualiza um valor da store
   */
  public async store_update(store: string, name: string, newValue: any): Promise<void> {
    try {
      return await this.db.storeUpdate(store, 'id', name, this.format_value(name, newValue))
    } catch (error: any) {
      throw new Error(error);
    }
  }

  /**
   * @description Retorna um valor da store
   */
  public async store_get<Type>(store: string, name: string): Promise<Type> {
    try {
      const variable: any = await this.db.storeGet(store, 'id', name);

      if (variable) {
        if (variable.compress)
          variable.value = this.decompress(variable.value);

        if (Object.keys(variable).length <= 0) {
          return undefined;
        } else {
          if (variable.compress) {
            return variable.value;
          } else {
            let data: any = undefined;

            Object.keys(variable).forEach(key => {
              if (key !== 'id' && key !== 'compress') {
                if (!data && Number.isNaN(key) !== true)
                  data = [];
                else
                  data = {};

                if (data instanceof Array)
                  data.push(variable[key]);
                else
                  data[key] = variable[key];
              }
            });

            return data;
          }
        }
      }

      return undefined;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  /**
   * @description Retorna todos os valores da store
   */
  async store_get_all<Type>(store: string): Promise<Type[]> {
    try {
      const variables: any[] = await this.db.storeGetAll(store, 'id');

      return variables
        .map(variable => {
          if (variable.compress)
            variable.value = this.decompress(variable.value);

          return variable.value;
        });
    } catch (error: any) {
      throw new Error(error);
    }
  }

  /**
   * @description Remove um valor da store
   */
  async store_remove(store: string, name: string): Promise<boolean> {
    try {
      await this.db.storeRemove(store, 'id', name);

      return true;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  /**
   * @description Limpa toda a data da store
   */
  async store_clear(store: string): Promise<boolean> {
    try {
      await this.db.storeClear(store, 'id');

      return true;
    } catch (error: any) {
      throw new Error(error);
    }
  }
}