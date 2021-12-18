/**
 * @description Classe usada para controle de cache avançado
 * @author @GuilhermeSantos001
 * @update 24/09/2021
 */

import { compress, decompress } from 'lzutf8';

import { parse, stringify } from 'flatted';

import { Technology } from '@/src/db/core';
import Caches from '@/src/db/caches';

type TimeType =
  | "days"
  | "day"
  | "d"
  | "weeks"
  | "week"
  | "w"
  | "hours"
  | "hours"
  | "h"
  | "minutes"
  | "minute"
  | "m"
  | "seconds"
  | "second"
  | "s"

type Time<T extends TimeType> = `${string}-${T}`;

interface ICache {
  id: string;
  compress: boolean;
  key: string;
  value: string;
  expiry: Date;
}

export default class Cache {
  private id: string;
  private delay: any = false;
  private loading = true;
  private db: Caches;
  public cache: ICache[] = [];

  constructor(id: string, technology: Technology) {
    this.id = id;
    this.db = new Caches(1, technology);
  }

  /**
   * @description Carrega os dados armazenados no disco e inicia o update
   */
  public async initialize(): Promise<void> {
    await this.load();

    this.update();
  }

  /**
   * @description Verifica se os dados do cache estão sendo carregados
   */
  public isLoading(): boolean {
    return this.loading;
  }

  /**
   * @description Faz a compressão do valor
   */
  private compress(value: any): string {
    return compress(stringify(value));
  }

  /**
   * @description Faz a descompressão do valor
   */
  private decompress(value: string): any {
    return parse(decompress(value) || "");
  }

  /**
   * @description Armazena em disco os dados do cache
   */
  private async save(): Promise<void> {
    return await this.db.define(this.id, this.cache);
  }

  /**
   * @description Carrega os dados no disco para o cache
   */
  private async load(): Promise<void> {
    const data: ICache | ICache[] = await this.db.get<ICache>(this.id);

    if (data)
      Object.keys(data).forEach(key => {
        if (key !== 'id')
          this.cache.push(data[key]);
      });

    this.loading = false;
  }

  /**
   * @description Procura por um dado no cache
   */
  public find(key: string): ICache | undefined {
    return this.cache.find(cache => cache.key === key);
  }

  /**
   * @description Executa a limpeza dos dados expirados do cache
   */
  public async clear(): Promise<void> {
    this.cache = this.cache.filter(cache => {
      const
        now = new Date(),
        expiry = new Date(cache.expiry);

      if (now <= expiry) {
        return true;
      }

      return false;
    });

    await this.save();
  }

  /**
   * @description Processa a string de expiração do cache
   */
  private parserExpiry(expiry: string): Date {
    const
      value = parseInt(expiry.replace(/[^0-9]/g, '').trim() || "0"),
      type = (($value) => {
        const value = expiry.replace(String($value), '').toLowerCase().trim();

        return value.replace('-', '');
      })(value),
      now = new Date();

    if (
      type === 'days'
      || type === 'day'
      || type === 'd'
    ) {
      now.setDate(now.getDate() + value);
    }

    if (
      type === 'weeks'
      || type === 'week'
      || type === 'w'
    ) {
      now.setDate(now.getDate() + (7 * value));
    }

    if (
      type === 'hours'
      || type === 'hour'
      || type === 'h'
    ) {
      now.setHours(now.getHours() + value);
    }

    if (
      type === 'minutes'
      || type === 'minute'
      || type === 'm'
    ) {
      now.setMinutes(now.getMinutes() + value);
    }

    if (
      type === 'seconds'
      || type === 'second'
      || type === 's'
    ) {
      now.setSeconds(now.getSeconds() + value);
    }

    return now;
  }

  /**
   * @description Adiciona um novo dado ao cache
   */
  public set<T extends TimeType>(key: string, value: any, expiry: Required<Time<T>>): ICache | false {
    if (this.find(key) === undefined) {
      const cache: ICache = { id: "", key, value: this.compress(value), expiry: this.parserExpiry(expiry), compress: true, };

      this.cache.push(cache);

      return cache;
    }

    return false;
  }

  /**
   * @description Adiciona um novo dado ao cache
   */
  public async remove(key: string): Promise<boolean> {
    const
      index = this.cache.findIndex(cache => cache.key === key);

    if (index !== -1) {
      this.cache.splice(index, 1);

      await this.save();

      return true;
    }

    return false;
  }

  /**
   * @description Retorna um valor do cache
   */
  public get(key: string): ICache | undefined {
    const
      index = this.cache.findIndex(cache => cache.key === key),
      item = this.cache.at(index);

    if (item)
      item.value = this.decompress(item.value);

    return item || undefined;
  }

  /**
   * @description Processamento dos dados do cache
   */
  private async update(): Promise<void> {
    await this.clear();

    if (!this.delay) {
      this.delay = setInterval(this.update.bind(this), 1000);
    }
  }
}