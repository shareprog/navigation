import React, { useState } from 'react';
import { cyan, generate, green, presetPalettes, red } from '@ant-design/colors';
import { Col, ColorPicker, Divider, Flex, Input, QRCode, Row, Segmented, Space, Splitter } from 'antd';
import type { ColorPickerProps, QRCodeProps } from 'antd';


type Presets = Required<ColorPickerProps>['presets'][number];

const genPresets = (presets = presetPalettes) =>
  Object.entries(presets).map<Presets>(([label, colors]) => ({
    label,
    colors,
  }));
const HorizontalLayout = ({setColor, color} : {
  setColor: (color: string) => void,
  color: string
}) => {
  const presets = genPresets({
    primary: generate(color),
    red,
    green,
    cyan,
  });

  const customPanelRender: ColorPickerProps['panelRender'] = (
    _,
    { components: { Picker, Presets } },
  ) => (
    <Row justify="space-between" wrap={false}>
      <Col span={12}>
        <Presets />
      </Col>
      <Divider type="vertical" style={{ height: 'auto' }} />
      <Col flex="auto">
        <Picker />
      </Col>
    </Row>
  );

  return (
    <ColorPicker
      defaultValue={color}
      styles={{ popupOverlayInner: { width: 480 } }}
      presets={presets}
      panelRender={customPanelRender}
      onChangeComplete={(value) => {
        setColor(value.toHexString())
      }}
    />
  );
};

const QR: React.FC = () => {
  const [text, setText] = useState('');
  const [color, setColor] = useState<string>('#000000');
  const [level, setLevel] = useState<QRCodeProps['errorLevel']>('L');
  
  return (
    <Splitter style={{ height: '60vh', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
      <Splitter.Panel defaultSize="70%" min="20%" max="70%">
        <Flex justify="center" align="center" style={{ height: '50%' }}>
          <Input.TextArea
            placeholder="请输入内容"
            autoSize={{
              minRows: 10,
              maxRows: 100
            }}
            maxLength={100}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </Flex>
      </Splitter.Panel>
      <Splitter.Panel>
          <Splitter 
            layout='vertical'
            style={{height: '60vh', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'}}
          >
            <Splitter.Panel defaultSize="70%" min="20%" max="70%">
              <Flex justify="center" align="center" style={{ height: '100%' }}>
                <QRCode value={text || '-'} errorLevel={level} color={color} />
              </Flex>
            </Splitter.Panel>
            <Splitter.Panel>
              <Space>
                设置颜色：
                <HorizontalLayout setColor={setColor} color={color}/>
              </Space>
              <Divider />
              <Space>
                纠错等级：
                <Segmented<QRCodeProps['errorLevel']> options={['L', 'M', 'Q', 'H']} value={level} onChange={setLevel} />
              </Space>
            </Splitter.Panel>
          </Splitter>
      </Splitter.Panel>
    </Splitter>
  );
};

export default QR;