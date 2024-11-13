import React, { useState } from 'react';
import { cyan, generate, green, presetPalettes, red } from '@ant-design/colors';
import { Button, Col, ColorPicker, Descriptions, Divider, Flex, Input, QRCode, Row, Segmented, Splitter } from 'antd';
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


function doDownload(url: string, fileName: string) {
  const a = document.createElement('a');
  a.download = fileName;
  a.href = url;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

const downloadCanvasQRCode = () => {
  const canvas = document.getElementById('myqrcode')?.querySelector<HTMLCanvasElement>('canvas');
  if (canvas) {
    const url = canvas.toDataURL();
    doDownload(url, 'QRCode.png');
  }
};

const downloadSvgQRCode = () => {
  const svg = document.getElementById('myqrcode')?.querySelector<SVGElement>('svg');
  const svgData = new XMLSerializer().serializeToString(svg!);
  const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  doDownload(url, 'QRCode.svg');
};

const QR: React.FC = () => {
  const [text, setText] = useState('');
  const [color, setColor] = useState<string>('#000000');
  const [level, setLevel] = useState<QRCodeProps['errorLevel']>('L');
  const [renderType, setRenderType] = React.useState<QRCodeProps['type']>('canvas');

  return (
    <Splitter style={{ height: '60vh', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
      <Splitter.Panel defaultSize="70%" min="20%" max="70%">
        <Flex justify="center" align="center" >
          <Input.TextArea
            placeholder="请输入内容"
            autoSize={{
              minRows: 25,
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
              <Descriptions 
                title="功能" 
                layout="horizontal" 
                column={2} 
                labelStyle={{lineHeight: '30px'}}
                items={[
                  {
                    label: '设置颜色',
                    children: <HorizontalLayout setColor={setColor} color={color}/>
                  },
                  {
                    label: '纠错等级',
                    children: <Segmented<QRCodeProps['errorLevel']> options={['L', 'M', 'Q', 'H']} value={level} onChange={setLevel} />
                  },
                  {
                    label: '类型',
                    children: <Segmented
                      options={['canvas', 'svg']}
                      onChange={(val) => setRenderType(val as QRCodeProps['type'])}
                    />
                  },
                  {
                    label: '下载',
                    children: <Button
                        type="link"
                        onClick={renderType === 'canvas' ? downloadCanvasQRCode : downloadSvgQRCode}
                      >
                        点击这里
                      </Button>
                  },
                ]} />
              
            </Splitter.Panel>
          </Splitter>
      </Splitter.Panel>
    </Splitter>
  );
};

export default QR;