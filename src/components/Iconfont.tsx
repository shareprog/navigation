//引入所有图标
import * as Icons from '@ant-design/icons';
import React from 'react';
 
const Iconfont = (props: { icon: any; }) => {debugger
    //这里传入的props是一个对象，里面有icon属性，值是antd图标的名字
    const { icon } = props
    if (!icon) {
        return <Icons.MenuOutlined />
    }
    try {
        return React.createElement(Icons[icon])
    } catch (error) { 
        return <Icons.MenuOutlined />
    }
}
 
export default Iconfont