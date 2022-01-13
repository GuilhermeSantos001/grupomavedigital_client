/**
 * @description Métodos essenciais para se trabalhar com textos
 * @author GuilhermeSantos001
 * @update 12/01/2022
 */

import { v4 as uuidv4 } from 'uuid';
import { compressToBase64 } from 'lz-string';
import StringMask from 'string-mask';

class StringEx {
  /**
   * @description Retorna um texto representando um identificador único
   */
  id(): string {
    return compressToBase64(uuidv4());
  }

  /**
   * @description Retorna o texto usado no campo de data de criação
   */
  createdAt(date?: string): string {
    const now = date ? new Date(date) : new Date();

    return `Criado em ${now.toLocaleDateString()} ás ${now.toLocaleTimeString()}`;
  }

  /**
   * @description Retorna o texto usado no campo de data de atualização
   */
  updatedAt(date?: string): string {
    const now = date ? new Date(date) : new Date();

    return `Atualizado em ${now.toLocaleDateString()} ás ${now.toLocaleTimeString()}`;
  }

  /**
   * @description Retorna o texto usado no campo de data de expiração
   */
   expiredAt(date?: string): string {
    const now = date ? new Date(date) : new Date();

    return `Expira em ${now.toLocaleDateString()} ás ${now.toLocaleTimeString()}`;
  }

  /**
   * @description Verifica se o valor informado está presente no texto
   * @param search Valor a ser procurado
   * @param text Texto a ser analisado
   * @param sameCase Informa se o valor deve ser encontrado de forma exata
   */
  contains(search: string, text: string, sameCase = true): boolean {
    const
      contains = text.split(' ').filter(value => search.split(' ').indexOf(value) !== -1);

    if (sameCase)
      return contains.filter(value => text.indexOf(value) === search.indexOf(value)).length >= search.split(' ').length;

    return contains.length >= search.split(' ').length;
  }

  /**
   * @description Retorna as palavras do texto,
   * que não existem no valor informado
   * @param search Valor a ser procurado
   * @param text Texto a ser analisado
   */
  notContains(search: string, text: string): string[] {
    const
      notContains = text.split(' ').filter(value => search.split(' ').indexOf(value) === -1)

    return notContains;
  }

  /**
   * @description Extrai o valor informado do texto
   * @param search Valor a ser procurado
   * @param text Texto a ser analisado
   */
  extract(search: string, text: string): string {
    const
      notContains = text.split(' ').filter(value => search.split(' ').indexOf(value) === -1);

    let clearValue = '';

    text.split(' ').forEach(value => {
      if (notContains.filter(remove => value === remove).length <= 0)
        clearValue += value + ' ';
    })

    return clearValue;
  }

  /**
   * @description Normaliza o texto para o valor informado
   * @param text1 Texto com a normalização
   * @param text2 Texto a ser analisado
   */
  normalize(text1: string, text2: string) {
    const words = {};

    let word = '';

    text1.split(' ').forEach(value => {
      if (!words[value])
        words[value] = 0;

      words[value]++;
    });

    text2.split(' ').forEach(value => {
      if (!words[value])
        words[value] = 0;

      words[value]++;
    });

    Object.keys(words).forEach(value => {
      if (words[value] > 1)
        word += value + ' ';
    });

    return word;
  }

  /**
   * @description Remove a mascara do tipo numeral do texto
   */
  removeMaskNum(str: string): string {
    return str.replace(/\D/g, '');
  }

  /**
   * @description Remove a mascara do tipo letra do texto
   */
  removeMaskLetter(str: string): string {
    return str.replace(/[^a-zA-Z]/g, '');
  }

  /**
   * @description Retorna o texto com a mascara de telefone aplicada
   */
  maskPhone(str: string): string {
    var formatter = new StringMask('(00) 00000-0000');

    return formatter.apply(str);
  }

  /**
   * @description Retorna o texto com a mascara do numero da casa aplicada
   */
  maskHouseNumber(str: string): string {
    var formatter = new StringMask('0000');

    return formatter.apply(str);
  }

  /**
   * @description Retorna o texto com a mascara de cep aplicada
   */
  maskZipcode(str: string): string {
    var formatter = new StringMask('00000-000');

    return formatter.apply(str);
  }

  /**
   * @description Retorna o texto com a mascara da matricula aplicada
   */
  maskMatricule(str: string): string {
    var formatter = new StringMask('00000');

    return formatter.apply(str);
  }

  /**
   * @description Retorna o texto com a mascara de CNPJ aplicada
   */
  maskCNPJ(str: string): string {
    var formatter = new StringMask('00.000.000/0000-00');

    return formatter.apply(str);
  }

  /**
   * @description Retorna o texto com a mascara de cpf aplicada
   */
  maskCPF(str: string): string {
    var formatter = new StringMask('000.000.000-00');

    return formatter.apply(str);
  }

  /**
   * @description Retorna o texto com a mascara de rg aplicada
   */
  maskRG(str: string): string {
    var formatter = new StringMask('00.000.000-0');

    return formatter.apply(str);
  }
}

export default new StringEx();