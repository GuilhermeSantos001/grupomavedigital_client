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
      id: '_update_2022_05_09',
      iconFamily: 'fas',
      iconName: 'bug',
      title: 'v1.0.5',
      message: `
      - Alterado o tamanho das caixas "Novidades" e "Meus Cursso" da "Tela Inicial" do usuário.
      - Adicionado opção de mandar o cartão digital por whatsapp via número de telefone.
      - adicionado suporte a tecla enter na tela de login.
      - Corrigido problema de redirecionamento das paginas dentro da pasta password.
      - Corrigido bug onde não estava sendo exibido os direitos autorais da plataforma.
      - Mudança na rota de retorno dos cartões do autor.
      - Pacotes atualizados.
      `,
      createdAt: {
        year: 2022,
        month: 4,
        day: 9
      }
    },
  ]
}