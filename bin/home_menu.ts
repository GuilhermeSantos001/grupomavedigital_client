/**
 * @description Menu Inicial do sistema
 * @author @GuilhermeSantos001
 * @update 13/10/2021
 */

import { Menu } from "@/pages/_app"

type menuId =
  | 'mn-home'
  | 'mn-login'
  | 'mn-helping'

export default function getMenu(firstId?: menuId): Menu[] {
  return [
    {
      id: 'mn-home',
      active: firstId === 'mn-home' ? true : false,
      icon: {
        family: 'fas',
        name: 'home',
      },
      name: 'Home',
      link: '/',
    },
    {
      id: 'mn-login',
      active: firstId === 'mn-login' ? true : false,
      icon: {
        family: 'fas',
        name: 'sign-in-alt',
      },
      name: 'Acessar',
      link: '/system',
    },
    {
      id: 'mn-helping',
      active: firstId === 'mn-helping' ? true : false,
      icon: {
        family: 'fas',
        name: 'question-circle',
      },
      type: 'dropdown',
      name: 'Precisa de Ajuda?',
      dropdownId: 'navbarDropdown',
      content: [
        {
          id: 'md-helpdesk',
          icon: {
            family: 'fas',
            name: 'headset',
          },
          name: 'HelpDesk',
          link: 'https://grupomavedigital.com.br/glpi/',
        },
        {
          id: 'md-sp1',
          type: 'separator',
        },
        {
          id: 'md-docs',
          icon: {
            family: 'fas',
            name: 'book-reader',
          },
          name: 'Documentação',
          link: '/help/docs',
        },
      ],
    },
  ]
}