import { MenuResponse, MenuDisable, MenuOptions } from "@/pages/_app"

export function GetMenuMain(firstId?: MenuOptions): MenuResponse {
  const disable: MenuDisable = {
    "mn-admin": true,
    "mn-dashboard": true,
    "mn-helping": false,
    "mn-herculesStorage": true,
    "mn-home": false,
    "mn-integration": false,
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
          name: 'tools',
        },
        name: 'Administração',
        link: '/admin',
        disabled: disable['mn-admin'] ? true : false,
      },
      {
        id: 'mn-account',
        active: firstId === 'mn-account' ? true : false,
        icon: {
          family: 'fas',
          name: 'id-card',
        },
        type: 'dropdown',
        name: 'Minha Conta',
        dropdownId: 'navbarDropdown',
        content: [
          {
            id: 'mn-account-profile',
            icon: {
              family: 'fas',
              name: 'user-alt',
            },
            name: 'Perfil',
            link: '/system',
            disabled: disable['mn-account-profile'] ? true : false,
          },
          {
            id: 'mn-account-separator-1',
            type: 'separator',
          },
          {
            id: 'mn-account-cards',
            icon: {
              family: 'far',
              name: 'id-badge',
            },
            name: 'Cartão Digital',
            link: '/system/cards',
            disabled: disable['mn-account-cards'] ? true : false,
          }
        ]
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
            id: 'mn-payback-cashier',
            icon: {
              family: 'fas',
              name: 'cash-register',
            },
            name: 'Caixinha',
            link: '/payback/cashier',
            disabled: disable['mn-payback-cashier'] ? true : false,
          },
          {
            id: 'mn-payback-separator-1',
            type: 'separator',
          },
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
            id: 'mn-payback-separator-2',
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
            link: '/support',
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
          name: 'door-open',
        },
        name: 'Desconectar',
        link: '/auth/logout',
        disabled: disable['mn-logout'] ? true : false,
      },
    ]
  }
}