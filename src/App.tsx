import React, { useEffect, useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SignatureOutlined,
  ToolOutlined,
  InfoCircleOutlined,
  UserOutlined,
  DownOutlined,
  MenuOutlined,
  CreditCardOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Dropdown, FloatButton, Image, Layout, Menu, MenuProps, message, Radio, Space, theme } from 'antd';
import Cards from './pages/Cards';
// import ReactWeather, { useOpenWeather } from 'react-open-weather';
import Search from './components/Search';
import Iconfont from './components/Iconfont';
import axios from 'axios';
import Login from './pages/Login';
import Manager from './pages/Manager';
import CardManager from './pages/CardManager';
import MenuManager from './pages/MenuManager';

const { Header, Sider, Content } = Layout;
type MenuItem = Required<MenuProps>['items'][number];

const siderStyle: React.CSSProperties = {
  overflow: 'auto',
  height: '100vh',
  position: 'fixed',
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: 'thin',
  scrollbarGutter: 'stable',
};

const menu1: MenuItem[] = [
  {
    key: 'recommend',
    icon: <Iconfont icon={'StarOutlined'} />,
    label: '常用推荐'
  },
  {
    key: 'information',
    icon: <InfoCircleOutlined />,
    label: '社区资讯'
  },
  {
    key: 'tutorial',
    icon: <SignatureOutlined />,
    label: '学习教程',
    children: [
      {
        key: 'java',
        label: 'JAVA'
      },
      {
        key: 'javascript',
        label: 'JavaScript'
      },
      {
        key: 'synthetical',
        label: '综合'
      },
      {
        key: 'video',
        label: '视频教程'
      }
    ]
  },
  {
      key: 'tool',
      icon: <ToolOutlined />,
      label: '常用工具'
  }
];

interface IMenuModel {
  key: string
  icon: string
  label: string
  parent: string 
}


const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [openCard, setOpenCard] = useState(false);
  const [menus, setMenus] = useState<IMenuModel[]>([])
  const [username, setUsername] = useState("")
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    axios.get('/api/menu/list').then(res => {
      if (res.status === 200) {
        setMenus(res.data);
      }
    }).catch((e) => {
      console.error(e)
      message.error('菜单加载失败');
    })
    const token = sessionStorage.getItem('token')
    if (token) {
      axios.get('/api/user/me', { headers: { Authorization: `Bearer ${token}` } }).then(res => {
        if (res.status === 200) {
          setUsername(res.data);
        }
      })
    }
  }, [])

  const convertTree = (menus: IMenuModel[]) => {
    const menuData: (IMenuModel & {children?: IMenuModel[]})[] = [];
    const map = new Map();
    menus.forEach((item: IMenuModel) => map.set(item.key, item));
    for(let value of map.values()) {
      if (value.parent) {
        const parent = map.get(value.parent);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push({
            key: value.key,
            label: value.label,
          })
        }
      } else {
        menuData.push(value)
      }
    }
    return menuData.map(item => ({
      key: item.key,
      label: item.label,
      children: item.children,
      icon: <Iconfont icon={item.icon} />
    }))
  }

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed} style={siderStyle}>
        <Image 
          src="/assets/images/favicon.png"
          width="100%" 
          preview={false}
          style={{
            objectFit: 'contain',
            padding: 10
          }}
          alt="" 
        />  
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['recommend']}
          items={convertTree(menus)}
          onClick={({key}) => {
            window.location.href = '#' + key;
          }}
        />
      </Sider>
      <Layout style={{ marginInlineStart: collapsed ? 70 : 195 }}>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          {/* <ReactWeather
            isLoading={false}
            errorMessage={"errorMessage"}
            data={[]}
            lang="zh"
            locationLabel="Munich"
            unitsLabels={{ temperature: 'C', windSpeed: 'Km/h' }}
            showForecast
          /> */}
          <Space style={{
            float: 'right'
          }}>
            <Avatar style={{ backgroundColor: '#87d068', float: 'right' }} icon={<UserOutlined />} />
            {
              username? <Manager username={username} setOpenMenu={setOpenMenu} setOpenCard={setOpenCard} /> : <Button type='link' onClick={() => setOpen(true)}>登录</Button>
            }
          </Space>
        </Header>
        <Content
          style={{
            margin: '12px 8px',
            minHeight: 800,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflow: 'initial'
          }}
        >
          <div
            style={{
              padding: 12,
              textAlign: 'center',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Search />
            <Cards menus={menus}/>
            <FloatButton.BackTop />
          </div>
          <Login open={open} setOpen={setOpen} />
          <CardManager openCard={openCard} setOpenCard={setOpenCard} />
          <MenuManager openMenu={openMenu} setOpenMenu={setOpenMenu} />
        </Content>
      </Layout>
      
    </Layout>
  );
};

export default App;