/**
 * @description Menu Principal do sistema
 * @author GuilhermeSantos001
 * @update 14/02/2022
 */

import { MenuResponse, MenuDisable, MenuOptions } from "@/pages/_app"

export function GetMenuMain(firstId?: MenuOptions): MenuResponse {
  const disable: MenuDisable = {
    "mn-admin": false,
    "mn-dashboard": true,
    "mn-helping": false,
    "mn-herculesStorage": true,
    "mn-home": false,
    "mn-integration": false,
    "mn-login": false,
    "mn-logout": false,
    "mn-payback": false,
    "mn-payback-separator": false,
    "mn-payback-cards": false,
    "mn-payback-postings": false,
    "mn-helpdesk": true,
    "mn-helpdesk-separator": false,
    "mn-docs": false,
    "mn-security": false
  };

  return {
    disable,
    options: [
      {
        id: 'mn-home',
        active: firstId === 'mn-home' ? true : false,
        icon: {
          family: 'fas',
          name: 'home',
        },
        name: 'Home',
        link: '/',
        disabled: disable['mn-home'] ? true : false,
      },
      {
        id: 'mn-admin',
        active: firstId === 'mn-admin' ? true : false,
        icon: {
          family: 'fas',
          name: 'user-shield',
        },
        name: 'Administração',
        link: '/admin',
        disabled: disable['mn-admin'] ? true : false,
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
        disabled: disable['mn-login'] ? true : false,
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
        disabled: disable['mn-security'] ? true : false,
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
        disabled: disable['mn-dashboard'] ? true : false,
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
        disabled: disable['mn-herculesStorage'] ? true : false,
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
            name: 'Cartões Alelo',
            link: '/payback/cards',
            disabled: disable['mn-payback-cards'] ? true : false,
          },
          {
            id: 'mn-payback-separator',
            type: 'separator',
          },
          {
            id: 'mn-payback-postings',
            icon: {
              family: 'fas',
              name: 'money-check-alt',
            },
            name: 'Operacional',
            link: '/payback/postings',
            disabled: disable['mn-payback-postings'] ? true : false,
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
        name: 'Suporte',
        dropdownId: 'navbarDropdown',
        content: [
          {
            id: 'mn-helpdesk',
            icon: {
              family: 'fas',
              name: 'headset',
            },
            name: 'HelpDesk',
            link: '/help/helpdesk',
            disabled: disable['mn-helpdesk'] ? true : false,
          },
          {
            id: 'mn-helpdesk-separator',
            type: 'separator',
          },
          {
            id: 'mn-docs',
            icon: {
              family: 'fas',
              name: 'book-reader',
            },
            name: 'Documentação',
            link: '/help/docs',
            disabled: disable['mn-docs'] ? true : false,
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
        disabled: disable['mn-integration'] ? true : false,
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
        disabled: disable['mn-logout'] ? true : false,
      },
    ]
  }
}