/**
 * @description Banco de dados dos caches utilizados no sistema
 * @author @GuilhermeSantos001
 * @update 27/09/2021
 * @version 1.0.0
 */

import CoreDB, { Technology } from '@/src/db/core';

export default class Caches extends CoreDB {
  constructor(version: number, technology: Technology) {
    super('caches', version, technology);
  }

  /**
   * @description Adiciona/Atualiza um cache
   */
  public async define(name: string, value: any): Promise<void> {
    if (!await this.get(name)) {
      return await this.store_add('cache', name, value);
    } else {
      return await this.store_update('cache', name, value);
    }
  }

  /**
   * @description Remove um cache
   */
  public async remove(name: string): Promise<boolean> {
    return await this.store_remove('cache', name);
  }

  /**
   * @description Retorna o valor do cache
   */
  public async get<Type>(name: string): Promise<Type> {
    return await this.store_get<Type>('cache', name);
  }
}