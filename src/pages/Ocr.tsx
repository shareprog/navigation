import { InboxOutlined } from "@ant-design/icons";
import { GetProp, Image, Spin, Splitter, Upload, UploadProps } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import Tesseract, {createWorker} from 'tesseract.js';
import ImgCrop from 'antd-img-crop';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];


const workerTesseract = async (base64: any) => {
  const worker = await createWorker();
  await worker.load('eng+chi_sim');// eng(英文) / chi_sim(简体中文) / chi_tra(繁体中文) / eng+chi_sim(英文+简体中文) / (如果有多种语言用+连接即可)
  await worker.reinitialize('eng+chi_sim'); //使用一种语言会快一些,多种语言混合会慢一些
  const res = await worker.recognize(base64);
  console.log('识别结果:', res); //text是最后识别到的内容
  await worker.terminate(); //终止worker线程,节省内存资源
}

const { Dragger } = Upload;

function Ocr() {

  const [imageUrl, setImageUrl] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('')
  // const [fileList, setFileList] = useState<UploadFile[]>([])

  const getBase64 = (img: FileType, callback: (url: string) => void) => {
    setLoading(true)
    Tesseract.recognize(img, 'eng+chi_sim').then(result => {debugger
      setLoading(false)
      setText(result.data.text);
    })
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file: FileType) => {
    getBase64(file, async (url) => {debugger
      setImageUrl(url);
      // workerTesseract(file)
    });
    return false;
  };

  return ( 
    <Splitter style={{ height: '60vh', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
      <Splitter.Panel defaultSize="50%" min="30%" max="70%">
        <ImgCrop rotationSlider beforeCrop={() => false}>
          <Dragger 
            name="file"
            listType="picture"
            maxCount={1}
            multiple={false}
            showUploadList={false}
            // disabled={!!imageUrl}
            beforeUpload={beforeUpload}
            onRemove={() => {
              setImageUrl('')
            }}
          >
            <div>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">单击或拖动文件到此区域进行上传</p>
              <p className="ant-upload-hint">
                仅支持单个文件上传
              </p>
            </div>
          </Dragger>
        </ImgCrop>
        {
          imageUrl && <Image
            width={'50%'}
            src={imageUrl}
          />
        }
      </Splitter.Panel>
      <Splitter.Panel>
        {loading?<Spin />:<TextArea
          showCount
          maxLength={100}
          value={text}
          // onChange={onChange}
          placeholder="识别结果"
          style={{ height: '95%'}}
        />}
      </Splitter.Panel>
    </Splitter>
   );
}

export default Ocr;