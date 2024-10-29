import { LeftCircleOutlined, RightCircleOutlined } from "@ant-design/icons";
import { Row, Col, Flex, Input, Splitter, Button, Divider, Space, Switch } from "antd";
import { useState } from "react";

function Base64() {
  const [url, setUrl] = useState<string>('');
  const [encodedUrl, setEncodeUrl] = useState<string>('');
  const [auto, setAuto] = useState(false)

  const convert = (type: 'encode' | 'decode') => {
    if (type === 'encode') {
      setEncodeUrl(encodeURIComponent(url))
    } else {
      setUrl(decodeURIComponent(encodedUrl))
    }
  }

  return (<Row>
    <Col span={11}>
      <Input.TextArea
        placeholder="请输入未编码的URL"
        autoSize={{
          minRows: 25,
          maxRows: 100
        }}
        maxLength={100}
        value={url}
        onChange={(e) => {
          setUrl(e.target.value)
          if (auto) {
            setEncodeUrl(encodeURIComponent(e.target.value))
          }
        }}
      />
    </Col>
    <Col span={1} style={{textAlign: 'center', margin: 'auto'}} >
      <Space 
        direction="vertical" 
        align="baseline"
        split={<Divider type="vertical" />}
      >
        <Button 
          size="large" 
          type="primary" 
          icon={<RightCircleOutlined />} 
          iconPosition='end'
          onClick={() => convert('encode')}  
        >
          编码
        </ Button>
        <Button 
          size="large" 
          type="primary" 
          icon={<LeftCircleOutlined />} 
          onClick={() => convert('decode')}
        >
          解码
        </ Button>
        <Switch checkedChildren="自动" unCheckedChildren="关闭" value={auto} onChange={setAuto} />
      </Space>
    </Col>
    <Col span={11}>
      <Input.TextArea
        placeholder="请输入编码后的URL"
        autoSize={{
          minRows: 25,
          maxRows: 100
        }}
        maxLength={100}
        value={encodedUrl}
        onChange={(e) => {
          setEncodeUrl(e.target.value)
          if (auto) {
            setUrl(decodeURIComponent(e.target.value))
          }
        }}
      />
    </Col>
  </Row>);
}

export default Base64;