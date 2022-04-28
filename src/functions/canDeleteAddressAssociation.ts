/**
 * @description Função usada para verificar se é possível deletar um item do
 * endereço, como uma rua, bairro, cidade, estado, etc.
 * @author GuilhermeSantos001
 * @update 05/01/2022
 */

import type {
  Workplace
} from '@/app/features/system/system.slice';

export default function canDeleteAddressAssociation(workplaces: Workplace[], key: string, itemId: string) {
  const
    workplace = workplaces.find((item) => item.address[key] === itemId);

  return workplace === undefined;
}