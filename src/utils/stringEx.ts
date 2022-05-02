import { v4 as uuidv4 } from 'uuid';
import { compressToBase64 } from 'lz-string';

class StringEx {
  /**
   * @description Retorna um texto representando um identificador único
   */
  id(): string {
    return compressToBase64(uuidv4());
  }

  /**
   * @description Retorna um texto aleatório
   */
  randomText(length: number = 100): string {
    const
      characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
      charactersLength = characters.length;

    let result = '';

    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  /**
   * @description Remove os espaços em branco do texto
   */
  trim(value: string, spaces: number = 2): string {
    const regExp = new RegExp(`\\s{${spaces},}`, 'g');
    return value.replace(regExp, '').trim();
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
    const words: { [keyof: string]: number } = {};

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

  isValidEmail(email: string): boolean {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
  }

  /**
   * @description Retorna somente os numeros da mascara em formato numero
   */
  removeMaskNum(value: string): number {
    return parseInt(value.replace(/\D/g, ''));
  }

  /**
   * @description Retorna somente o texto da mascara em formato texto
   */
  removeMaskLetter(value: string): string {
    return value.replace(/[^a-zA-Z]/g, '');
  }

  /**
   * @description Retorna somente os numeros da mascara em formato texto
   */
  removeMaskNumToString(value: string): string {
    return value.replace(/\D/g, '');
  }

  /**
   * @description Retorna o texto com a mascara do dinheiro aplicada
   */
  maskMoney(value: number): string {
    const formatter =
      value
        .toLocaleString('pt-br', {
          minimumFractionDigits: 2
        });

    return `R$ ${formatter}`;
  }

  /**
   * @description Retorna o texto com a mascara de telefone aplicada
   */
  maskPhone(value: string, type: 'cell' | 'tel'): string {
    switch (type) {
      case 'cell':
        return value
          .toString()
          .replace(/[\D]/g, '')
          .replace(/(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{5})(\d)/, '$1-$2')
          .replace(/(-\d{4})(\d+?)/, '$1');
      case 'tel':
        return value
          .toString()
          .replace(/[\D]/g, '')
          .replace(/(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{4})(\d)/, '$1-$2')
          .replace(/(-\d{4})(\d+?)/, '$1');
    }
  }

  /**
   * @description Retorna o texto com a mascara do numero da casa aplicada
   */
  maskHouseNumber(value: string): string {
    const
      formatter =
        value
          .toString()
          .replace(/[\D]/g, '')
          .replace(/(\d{4})(\d+?)/, '$1');

    return formatter;
  }

  /**
   * @description Retorna o texto com a mascara de cep aplicada
   */
  maskZipcode(value: string): string {
    const formatter =
      value
        .toString()
        .replace(/[\D]/g, '')
        .replace(/(\d{5})(\d+?)/, '$1-$2')
        .replace(/(-\d{3})(\d+?)/, '$1');

    return formatter;
  }

  /**
   * @description Retorna o texto com a mascara da matricula aplicada
   */
  maskMatricule(value: string): string {
    const formatter =
      value
        .toString()
        .replace(/[\D]/g, '')
        .replace(/(\d{5})(\d+?)/, '$1');

    return formatter;
  }

  /**
   * @description Retorna o texto com a mascara de CNPJ aplicada
   */
  maskCNPJ(value: string): string {
    const formatter =
      value
        .toString()
        .replace(/[\D]/g, '')
        .replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
        .replace(/(-\d{2})(\d+?)/, '$1');

    return formatter;
  }

  /**
   * @description Retorna o texto com a mascara de cpf aplicada
   */
  maskCPF(value: string): string {
    const formatter =
      value
        .toString()
        .replace(/[\D]/g, '')
        .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
        .replace(/(-\d{2})(\d+?)/, '$1');

    return formatter;
  }

  /**
   * @description Retorna o texto com a mascara de rg aplicada
   */
  maskRG(value: string): string {
    const formatter =
      value
        .toString()
        .replace(/[\D]/g, '')
        .replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4')
        .replace(/(-\d{1})(\d+?)/, '$1');

    return formatter;
  }
}

export default new StringEx();