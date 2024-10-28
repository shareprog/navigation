import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Form, Input, message, Modal } from "antd";
import axios from "axios";

// interface User {
//   username: string;
//   password: string;
// }
function Login({
  open, setOpen
}:{
  open: boolean, 
  setOpen: (open: boolean) => void
}) {
  
  const [form] = Form.useForm();
  // const [formValues, setFormValues] = useState<User>();

  const onFinish = (values: any) => {
    axios.post('/api/token', values).then(res => {
      if (res.status === 200) {
        sessionStorage.setItem('token', res.data.token)
        setOpen(false)
      }
    }).catch((e) => {
      console.log(e)
      message.error('登录失败');
    })
  };
  

  return ( 
    <Modal
      open={open}
      title="登录"
      okText="登录"
      cancelText="取消"
      okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
      onCancel={() => setOpen(false)}
      destroyOnClose
      style={{ width: '30vw' , height: '30vh' }}
      modalRender={(dom) => (
        <Form
          layout="vertical"
          form={form}
          clearOnDestroy
          onFinish={onFinish}
        >
          {dom}
        </Form> )}
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: '请输入你的用户名!' }]}
      >
        <Input prefix={<UserOutlined />} placeholder="用户名" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: '请输入你的密码!' }]}
      >
        <Input prefix={<LockOutlined />} type="password" placeholder="密码" />
      </Form.Item>
    </Modal>
    );
}

export default Login;