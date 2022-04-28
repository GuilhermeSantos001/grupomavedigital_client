/**
 * @description Retorna o valor do dinheiro inputado pelo usuário, em formato
 * de moeda correto para cálculos
 * @author GuilhermeSantos001
 * @update 14/01/2022
 */

export default function getValueMoney(money: number): number {
  return money * 100 / 10000;
}