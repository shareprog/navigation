import { CreditCardOutlined, DownOutlined, LogoutOutlined, MenuOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";
import CardManager from "./CardManager";

const items = [
  {
    key: 'menu',
    label: '菜单管理',
    icon: <MenuOutlined />
  },
  {
    key: 'card',
    label: '卡片管理',
    icon: <CreditCardOutlined />
  },
  {
    key: 'logout',
    label: '退出登录',
    icon: <LogoutOutlined />
  }
]
function Manager({username, setOpenMenu, setOpenCard}) {
  return (<Dropdown 
    menu={{
      items,
      onClick: ({key}) => {
        switch (key) {
          case 'logout':
            sessionStorage.removeItem('token')
            window.location.href = '/'
            break;
          case 'menu':
            setOpenMenu(true)
            break;
          case 'card':
            setOpenCard(true)
            break;
          default:
            break;
        }
      },
    }}
  >
    <a onClick={(e) => e.preventDefault()}>
      <Space>
        {username}
        <DownOutlined />
      </Space>
    </a>
  </Dropdown> );
}

export default Manager;