/**
 * @description Banco de dados das variáveis utilizadas no sistema
 * @author GuilhermeSantos001
 * @updated 27/09/2021
 */

import CoreDB, { Technology } from '@/src/db/core';

export default class Variables extends CoreDB {
  constructor(version: number, technology: Technology) {
    super('variables', version, technology);
  }

  /**
   * @description Adiciona/Atualiza uma variável
   */
  public async define(name: string, value: any): Promise<void> {
    if (!await this.get(name)) {
      return await this.store_add('variable', name, value);
    } else {
      return await this.store_update('variable', name, value);
    }
  }

  /**
   * @description Remove uma variável
   */
  public async remove(name: string): Promise<boolean> {
    return await this.store_remove('variable', name);
  }

  /**
   * @description Retorna o valor da variável
   */
  public async get<Type>(name: string): Promise<Type> {
    return await this.store_get<Type>('variable', name);
  }

  /**
   * @description Retorna o valor da variável
   */
  public async getAllKeys(): Promise<string[]> {
    return await this.store_getAllKeys('variable');
  }

  /**
   * @description Limpa as variaveis
   */
  public async clear(): Promise<boolean> {
    return await this.store_clear('variable');
  }
}