/**
 * @description Menu Inicial do sistema
 * @author GuilhermeSantos001
 * @update 14/02/2022
 */

import { MenuResponse, MenuDisable, MenuOptions } from "@/pages/_app"

export function GetMenuHome(firstId?: MenuOptions): MenuResponse {
  const disable: MenuDisable = {
    "mn-admin": false,
    "mn-dashboard": false,
    "mn-helping": false,
    "mn-herculesStorage": false,
    "mn-home": false,
    "mn-integration":false,
    "mn-account": false,
    "mn-account-profile": false,
    "mn-account-separator-1": false,
    "mn-account-cards": false,
    "mn-logout": false,
    "mn-payback": false,
    "mn-payback-separator-1": false,
    "mn-payback-separator-2": false,
    "mn-payback-cashier": false,
    "mn-payback-cards": false,
    "mn-payback-postings": false,
    "mn-helpdesk": false,
    "mn-helpdesk-separator":false,
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
        id: 'mn-account',
        active: firstId === 'mn-account' ? true : false,
        icon: {
          family: 'fas',
          name: 'sign-in-alt',
        },
        name: 'Entrar',
        link: '/auth/login',
        disabled: disable['mn-account'] ? true : false,
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
            link: '/glpi',
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
    ]
  }
}