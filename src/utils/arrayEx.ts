/**
 * @description Métodos essenciais para se trabalhar com listas
 * @author GuilhermeSantos001
 * @update 07/01/2022
 */


class ArrayEx {
  /**
   * @description Retorna todos os itens da lista A que não estão na lista B
   */
  not(a: readonly string[], b: readonly string[]): string[] {
    return a.filter((value) => b.indexOf(value) === -1);
  }

  /**
   * @description Retorna todos os itens da lista A que estão na lista B
   */
  intersection(a: readonly string[], b: readonly string[]): string[] {
    return a.filter((value) => b.indexOf(value) !== -1);
  }

  /**
   * @description Faz a união da lista A com os itens da lista B
   */
  union(a: readonly string[], b: readonly string[]): string[] {
    return [...a, ...this.not(b, a)];
  }
}

export default new ArrayEx();