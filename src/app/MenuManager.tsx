
import { message, Modal } from "antd";
import {
  ActionType,
  EditableProTable,
  ProColumns,
} from '@ant-design/pro-components';
import { Key, useEffect, useRef, useState } from "react";
import axios from "axios";
import Iconfont from "../components/Iconfont";

type DataSourceType = {
  key: Key;
  label: string;
  icon: string;
  parent: string;
};

interface IMenuModel {
  key: string
  icon: string
  label: string
  parent: string 
}

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
          parent: value.parent,
        })
      }
    } else {
      menuData.push(value)
    }
  }
  return menuData;
}

function MenuManager({
  openMenu, setOpenMenu
}:{
  openMenu: boolean,
  setOpenMenu: (open: boolean) => void
}) {
  // const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  // const [dataSource, setDataSource] = useState<readonly DataSourceType[]>([]);
  const [menuSelect, setMenuSelect] = useState<[]>([]);
  const [menuKeys, setMenuKeys] = useState<string[]>([]);

  const actionRef = useRef<ActionType>();
  useEffect(() => {
    axios.get('/api/menu/list').then(res => {
      if (res.status === 200) {
        const keys = res.data.map((item: { key: any; }) => item.key);
        setMenuKeys(keys)
        setMenuSelect(res.data.filter(({ key }: { key: any; }) => keys.includes(key))
        .map((item: { label: any; key: any; }) => ({label: item.label, value: item.key})))
      }
    })
  }, [openMenu])

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: '编码',
      dataIndex: 'key',
      // readonly: true,
      width: '20%',
      index: 1,
      editable: (_, __, index) => {
        return index == 0;
      },
    },
    {
      title: '名称',
      dataIndex: 'label',
      formItemProps: (_, { rowIndex }) => {
        return {
          rules:
            rowIndex > 1 ? [{ required: true, message: '此项为必填项' }] : [],
        };
      },
      width: '30%',
      index: 3,
    },
    {
      title: '图标',
      dataIndex: 'icon',
      width: '10%',
      index: 2,
      // editable: (_, record) => {
      //   return !record?.parent;
      // },
      render: (text) => {
        return text !== '-' ? <Iconfont icon={text} /> : ''
      },
    },
    {
      title: '所属菜单',
      key: 'parent',
      dataIndex: 'parent',
      width: '20%',
      valueType: 'select',
      fieldProps: {
        options: menuSelect
      },
      index: 4,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      index: 5,
      render: (_, record, __, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.key);
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            axios.delete(`/api/menu/${record.key}`).then(res => {
              if (res.status === 200) {
                message.success('删除成功')
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            })
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  return ( <Modal
    open={openMenu}
    title="卡片管理"
    okText="确认"
    onOk={() => setOpenMenu(false)}
    cancelText="取消"
    maskClosable={false}
    onCancel={() => setOpenMenu(false)}
    cancelButtonProps={{
      hidden: true,
    }}
    destroyOnClose
    width={'50vw'}
    style={{ width: '100vw' , height: '90vh' }}
  >
    <EditableProTable
      rowKey="key"
      headerTitle="卡片管理"
      toolBarRender={false}
      scroll={{
        x: 920,
        y: 400,
      }}
      request={async () => {
        const data = await axios.get('/api/menu/list');
        // setmenuSelect(data.data.map(item => ({label: item.label, value: item.key})))
        return ({
          data: data.data,
          success: true,
        });
      }}
      postData={(dataSource: IMenuModel[]) => convertTree(dataSource)}
      actionRef={actionRef}
      columns={columns}
      // onValuesChange={(value, record) => {
      //   console.log(value, record)
      // }}
      // value={dataSource}
      // onChange={(values)=> {
      //   setDataSource(values)
      // }}
      recordCreatorProps={
        {
          newRecordType: 'cache',
          // parentKey: 1,
          position: 'top',
          record: () => ({ 
            key: 'default',
            icon: 'MenuOutlined',
            label: 'NEW MENU',
            parent: '',
            new: true
          }),
        }
      }
      editable={{
        type: 'single',
        // editableKeys,
        // onChange: setEditableRowKeys,
        onSave: async (key, record) => {
          if (menuKeys.includes(key as string)) {
            axios.put('/api/menu', {...record}).then(res => {
              if (res.status === 200) {
                message.success('保存成功')
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            })
          } else {
            axios.post('/api/menu', {...record, id: null}).then(res => {
              if (res.status === 201) {
                message.success('保存成功')
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            })
          }
        },
        deletePopconfirmMessage: '是否删除',
        // onCancel: (key) => actionRef.current.reload(),
        actionRender: (row, _, defaultDom) => {
          if (row.parent) {
            return [defaultDom.save, defaultDom.delete]
          }
          return [defaultDom.save, defaultDom.delete, defaultDom.cancel]
        },
      }}
    />
  </Modal> );
}

export default MenuManager;