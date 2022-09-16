import getItem, { MenuItem } from '@/constants/sidebar-menu'

import {
  UserOutlined,
  DashboardFilled,
  FileAddOutlined,
  IdcardOutlined,
} from '@ant-design/icons'

const Menu: MenuItem[] = [
  {
    key: 'profile',
    label: 'Minha Conta',
    icon: <UserOutlined />,
    link: '/profile',
  },
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: <DashboardFilled />,
    link: '/dashboard',
  },
  {
    key: 'files',
    label: 'Arquivos',
    icon: <FileAddOutlined />,
    link: '/files',
  },
  {
    key: 'cards',
    label: 'Meus Cartões',
    icon: <IdcardOutlined />,
    link: '/cards',
  },
]

const menuSchema = Menu.map(menu => getItem(menu.label, menu.key, menu.link, menu.icon, menu.children));

export default menuSchema;
