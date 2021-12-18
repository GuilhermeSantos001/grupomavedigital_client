/**
 * @description Menu Principal do sistema
 * @author @GuilhermeSantos001
 * @update 13/10/2021
 */

import { Menu } from "@/pages/_app"

type menuId =
  | 'mn-home'
  | 'mn-login'
  | 'mn-security'
  | 'mn-dashboard'
  | 'mn-helping'
  | 'mn-logout'
  | 'mn-herculesStorage'

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
        name: 'user',
      },
      name: 'Dashboard',
      link: '/system',
    },
    {
      id: 'mn-security',
      active: firstId === 'mn-security' ? true : false,
      icon: {
        family: 'fas',
        name: 'shield-alt',
      },
      name: 'Segurança',
      link: '/user/security',
    },
    {
      id: 'mn-dashboard',
      active: firstId === 'mn-dashboard' ? true : false,
      icon: {
        family: 'fas',
        name: 'chart-line',
      },
      name: 'Painéis',
      link: '/dashboard',
      disabled: true
    },
    {
      id: 'mn-herculesStorage',
      active: firstId === 'mn-herculesStorage' ? true : false,
      icon: {
        family: 'fas',
        name: 'folder-open',
      },
      name: 'Storage',
      link: '/storage',
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
          link: '/help/helpdesk'
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
          name: 'DOC',
          link: '/help/docs',
        },
      ],
    },
    {
      id: 'mn-logout',
      active: firstId === 'mn-logout' ? true : false,
      icon: {
        family: 'fas',
        name: 'power-off',
      },
      name: 'Desconectar',
      link: '/auth/logout',
    },
  ]
}