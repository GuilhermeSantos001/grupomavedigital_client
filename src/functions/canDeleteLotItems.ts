/**
 * @description Função usada para verificar se é possível deletar um cartão
 * beneficio.
 * @author GuilhermeSantos001
 * @update 19/01/2022
 */

import {
  Person
} from '@/app/features/system/system.slice'

import {
  Posting
} from '@/app/features/payback/payback.slice'

export default function canDeleteLotItems(people: Person[], postings: Posting[], itemId: string) {
  const
    person = people.find(person => person.cards.includes(itemId)),
    posting = postings.find(posting => {
      if (
        posting.paymentStatus === 'payable' &&
        posting.coverage
      ) {
        const person = people.find(person => person.id === posting.coverage.id);

        if (person.cards.includes(itemId)) {
          return true;
        }
      }

      return false;
    })

  return person === undefined && posting === undefined;
}