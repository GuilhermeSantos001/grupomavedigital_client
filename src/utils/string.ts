/**
 * @description Métodos essenciais para se trabalhar com textos
 * @author @GuilhermeSantos001
 * @update 10/10/2021
 */

class String {
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
}

export default new String();