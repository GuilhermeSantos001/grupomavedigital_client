import { iconsFamily, iconsName } from '@/src/utils/fontAwesomeIcons';

declare type Update = {
  id: string
  iconFamily: iconsFamily
  iconName: iconsName
  title?: string
  message: string
  createdAt: {
    year: number
    month: number
    day: number
  }
}

export function GetUpdates(): Update[] {
  return [
    {
      id: '_update_2022_03_20',
      iconFamily: 'fas',
      iconName: 'bug',
      title: 'Grande Atualização de Segurança',
      message: `
      Essa atualização muda completamente o mecanismo de segurança do
      sistema. Buscamos sempre a melhor forma de segurança possível,
      e isso é uma tarefa extremamente difícil, por isso a cada
      atualização, tentamos implementar melhores práticas de segurança
      e melhorar a segurança já existente.
      `,
      createdAt: {
        year: 2022,
        month: 2,
        day: 2
      }
    },
    {
      id: '_update_2021_05_20',
      iconFamily: 'fas',
      iconName: 'paint-brush',
      message: 'Estamos com um novo visual, o que você achou?',
      createdAt: {
        year: 2021,
        day: 4,
        month: 20
      }
    },
  ]
}