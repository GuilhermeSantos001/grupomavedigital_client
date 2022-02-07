/**
 * @description Menu Principal do sistema
 * @author GuilhermeSantos001
 * @update 13/10/2021
 */

import { Menu } from "@/pages/_app"

type menuId =
  | 'mn-home'
  | 'mn-login'
  | 'mn-integration'
  | 'mn-security'
  | 'mn-dashboard'
  | 'mn-helping'
  | 'mn-logout'
  | 'mn-herculesStorage'
  | 'mn-payback'

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
      disabled: true
    },
    {
      id: 'mn-payback',
      active: firstId === 'mn-payback' ? true : false,
      icon: {
        family: 'fas',
        name: 'file-invoice-dollar',
      },
      type: 'dropdown',
      name: 'Pagamentos',
      dropdownId: 'navbarDropdown',
      content: [
        {
          id: 'mn-payback-cards',
          icon: {
            family: 'fas',
            name: 'credit-card',
          },
          name: 'Cartões',
          link: '/payback/cards'
        },
        {
          id: 'mn-sp1',
          type: 'separator',
        },
        {
          id: 'mn-payback-postings',
          icon: {
            family: 'fas',
            name: 'money-check-alt',
          },
          name: 'Lançamentos',
          link: '/payback/postings'
        }
      ]
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
      id: 'mn-integration',
      active: firstId === 'mn-integration' ? true : false,
      icon: {
        family: 'fas',
        name: 'rocket',
      },
      name: 'Integração',
      link: '/integration',
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