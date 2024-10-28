//引入所有图标
import Icon, { MenuOutlined } from '@ant-design/icons';
import * as Icons from '@ant-design/icons';

type IconType = keyof typeof Icons;
const Iconfont = (props: { icon?: any; }) => {
    //这里传入的props是一个对象，里面有icon属性，值是antd图标的名字
    const { icon } = props
    if (!icon) {
        return <MenuOutlined />
    }
    try {
        return <Icon component={Icons[icon as IconType] as React.ForwardRefExoticComponent<any>} {...props} />
        // React.createElement(Icons[icon])
    } catch (error) { 
        return <MenuOutlined />
    }
}
 
export default Iconfont