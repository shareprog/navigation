import { Avatar, message, Modal } from "antd";
import {
  ActionType,
  EditableProTable,
  ProColumns,
} from '@ant-design/pro-components';
import { useEffect, useRef, useState } from "react";
import axios from "axios";

type DataSourceType = {
  id: React.Key;
  title: string;
  imgUrl: string;
  url: string;
  description: string;
  group: string;
  enabled: boolean;
};

const showFavicon = (card: DataSourceType) => {
  if (card.imgUrl.startsWith("http")) {
    return <img src = {card.imgUrl} />
  } else if (card.imgUrl) {
    return <img src = {`/assets/images/logos/${card.imgUrl}`} />
  } else {
    const url = new URL(card.url);
    return <img src = {`${url.origin}/favicon.ico`} />
  }
}

function CardManager({
  openCard, setOpenCard
} : {
  openCard: boolean,
  setOpenCard: (open: boolean) => void
}) {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<readonly DataSourceType[]>([]);
  const [menuSelect, setmenuSelect] = useState<[]>([]);

  const actionRef = useRef<ActionType>();
  useEffect(() => {
    axios.get('/api/menu/listChild').then(res => {
      if (res.status === 200) {
        setmenuSelect(res.data.map((item: {key: string, label: string}) => ({label: item.label, value: item.key})))
      }
    })
  }, [openCard])

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: '名称',
      key: 'title',
      dataIndex: 'title',
      formItemProps: (_, { rowIndex }) => {
        return {
          rules:
            rowIndex > 1 ? [{ required: true, message: '此项为必填项' }] : [],
        };
      },
      width: '10%',
    },
    {
      title: '图片',
      dataIndex: 'imgUrl',
      key: 'imgUrl',
      width: '10%',
      render: (_, record) => (
        <Avatar
          shape="square"
          src={showFavicon(record)}
        />
      )
    },
    {
      key: 'url',
      title: '链接',
      dataIndex: 'url',
      width: '15%',
      render: (text) => <a href={text as string} target="_blank">{text}</a>,
    },
    {
      key: 'description',
      title: '描述',
      dataIndex: 'description',
      width: '30%',
    },
    {
      key: 'group',
      title: '所属分组',
      dataIndex: 'group',
      valueType: 'select',
      fieldProps: {
        options: menuSelect
      },
    },
    {
      key: 'enabled',
      title: '启用',
      dataIndex: 'enabled',
      width: '10%',
      valueType: 'select',
      fieldProps: {
        options: [
          {
            value: 1,
            label: '是'
          },
          {
            value: 0,
            label: '否'
          },
        ]
      }
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (_, record, __, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            axios.delete(`/api/card/${record.id}`).then(res => {
              if (res.status === 200) {
                message.success('删除成功')
                setDataSource(dataSource.filter(item => item.id !== record.id))
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
    open={openCard}
    title="卡片管理"
    okText="确认"
    cancelText="取消"
    maskClosable={false}
    onCancel={() => setOpenCard(false)}
    onOk={() => setOpenCard(false)}
    destroyOnClose
    width={'80vw'}
    style={{ width: '100vw' , height: '90vh' }}
  >
    <EditableProTable
      rowKey="id"
      headerTitle="卡片管理"
      toolBarRender={false}
      scroll={{
        x: 920,
        y: 400,
      }}
      request={async (params: {
        pageSize: number;
        current: number;
      },) => {
        return (await axios.get('/api/card/page', {params: {start: params.current, limit: params.pageSize}})).data;
      }}
      actionRef={actionRef}
      columns={columns}
      value={dataSource}
      onChange={setDataSource}
      recordCreatorProps={
        {
          newRecordType: 'cache',
          position: 'top',
          record: () => ({ 
            id: 0,
            title: 'New Card',
            imgUrl: 'default.png',
            url: '',
            description: '',
            group: '',
            enabled: true,
          }),
        }
      }
      editable={{
        type: 'single',
        editableKeys,
        onChange: setEditableRowKeys,
        onSave: async (key, record) => {
          if (key) {
            axios.put('/api/card', {...record}).then(res => {
              if (res.status === 200) {
                message.success('保存成功')
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            })
          } else {
            axios.post('/api/card', {...record, id: null}).then(res => {
              if (res.status === 201) {
                message.success('保存成功')
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            })
          }
        },
      }}
      pagination={{ defaultPageSize: 10 }}
    />
  </Modal> );
}

export default CardManager;