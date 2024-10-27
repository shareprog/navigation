import { CaretDownOutlined } from "@ant-design/icons";
import { Col, Input, Row, Segmented, Tabs } from "antd";
import { useState } from "react";

interface SearchEngines {
  value: string;
  label: string;
  placeholder: string;
  url: string;
}

type TabItem = {
  key: string;
  label: string;
  children: SearchEngines[]
}

const tabItems: TabItem[] = [
  {
    key: 'common',
    label: '常用',
    children: [
      {
        value: 'baidu',
        label: '百度',
        placeholder: '百度一下，你就知道',
        url: 'https://www.baidu.com/s?wd='
      },
      {
        value: 'bing',
        label: '必应',
        placeholder: '微软必应搜索',
        url: 'https://cn.bing.com/search?q='
      },
      {
        value: 'google',
        label: '谷歌',
        placeholder: '谷歌搜索',
        url: 'https://www.google.com/search?q='
      },
      {
        value: 'anaconda',
        label: '软件',
        placeholder: 'Anaconda 软件搜索',
        url: 'https://anaconda.org/search?q='
      },
      {
        value: 'pubmed',
        label: '文献',
        placeholder: 'PubMed 搜索/文章标题/关键字',
        url: 'https://pubmed.ncbi.nlm.nih.gov/?term='
      }
    ]
  },
  {
    key: 'search',
    label: '搜索',
    children: [
      {
        value: 'baidu',
        label: '百度',
        placeholder: '百度一下，你就知道',
        url: 'https://www.baidu.com/s?wd='
      },
      {
        value: 'bing',
        label: '必应',
        placeholder: '微软必应搜索',
        url: 'https://cn.bing.com/search?q='
      },
      {
        value: '360',
        label: '360',
        placeholder: '360 好搜',
        url: 'https://www.so.com/s?q='
      },
      {
        value: 'sogo',
        label: '搜狗',
        placeholder: '搜狗搜索',
        url: 'https://www.sogou.com/web?query='
      },
      {
        value: 'google',
        label: '谷歌',
        placeholder: '谷歌搜索',
        url: 'https://www.google.com/search?q='
      },
      {
        value: 'sm',
        label: '神马',
        placeholder: 'UC 移动端搜索',
        url: 'https://yz.m.sm.cn/s?q='
      },
    ]
  },
  {
    key: 'tool',
    label: '工具',
    children: [
      {
        value: 'br',
        label: '权重查询',
        placeholder: '请输入网址(不带 https://)',
        url: 'https://rank.chinaz.com/all/'
      },
      {
        value: 'links',
        label: '友链检测',
        placeholder: '请输入网址(不带 https://)',
        url: 'https://link.chinaz.com/'
      },
      {
        value: 'whois',
        label: '域名查询',
        placeholder: '请输入网址(不带 https://)',
        url: 'https://who.is/whois/'
      },
      {
        value: 'ping',
        label: 'PING 检测',
        placeholder: '请输入网址(不带 https://)',
        url: 'https://ping.chinaz.com/'
      },
      {
        value: '404',
        label: '死链检测',
        placeholder: '请输入网址(不带 https://)',
        url: 'https://tool.chinaz.com/Links/?DAddress='
      },
      {
        value: 'ciku',
        label: '关键词挖掘',
        placeholder: '请输入网址(不带 https://)',
        url: 'https://www.ciku5.com/s?wd='
      }
    ]
  },
  {
    key: 'community',
    label: '社区',
    children: [
      {
        value: 'zhihu',
        label: '知乎',
        placeholder: '有问题，就会有答案',
        url: 'https://www.zhihu.com/search?type=content&q='
      },
      {
        value: 'wechat',
        label: '微信',
        placeholder: '微信',
        url: 'https://weixin.sogou.com/weixin?type=2&query='
      },
      {
        value: 'weibo',
        label: '微博',
        placeholder: '微博',
        url: 'https://s.weibo.com/weibo/'
      },
      {
        value: 'douban',
        label: '豆瓣',
        placeholder: '豆瓣',
        url: 'https://www.douban.com/search?q='
      }
    ]
  },
  {
    key: 'live',
    label: '生活',
    children: [
      {
        value: 'taobao',
        label: '淘宝',
        placeholder: '淘宝',
        url: 'https://s.taobao.com/search?q='
      },
      {
        value: 'jd',
        label: '京东',
        placeholder: '京东',
        url: 'https://search.jd.com/Search?keyword='
      },
      {
        value: 'xiachufang',
        label: '下厨房',
        placeholder: '下厨房',
        url: 'https://www.xiachufang.com/search/?keyword='
      },
      {
        value: 'xiangha',
        label: '香哈菜谱',
        placeholder: '香哈菜谱',
        url: 'https://www.xiangha.com/so/?q=caipu&s='
      },
      {
        value: '12306',
        label: '12306',
        placeholder: '12306',
        url: 'https://www.12306.cn/?'
      },
      {
        value: 'qunar',
        label: '去哪儿',
        placeholder: '去哪儿',
        url: 'https://www.qunar.com/?'
      }
    ]
  },
  {
    key: 'job',
    label: '求职',
    children: [
      {
        value: 'zhaopin',
        label: '智联招聘',
        placeholder: '智联招聘',
        url: 'https://sou.zhaopin.com/jobs/searchresult.ashx?kw='
      },
      {
        value: '51job',
        label: '前程无忧',
        placeholder: '前程无忧',
        url: 'https://search.51job.com/?'
      },
      {
        value: 'lagou',
        label: '拉钩网',
        placeholder: '拉钩网',
        url: 'https://www.lagou.com/jobs/list_'
      },
      {
        value: 'liepin',
        label: '猎聘网',
        placeholder: '猎聘网',
        url: 'https://www.liepin.com/zhaopin/?key='
      }
    ]
  }
]


const Search = () => {

  const [search, setSearch] = useState<SearchEngines>({
    value: 'baidu',
    label: '百度',
    placeholder: '百度一下，你就知道',
    url: 'https://www.baidu.com/s?wd='
  });

  return (<Tabs 
          indicator={{size: 30, align: 'center'}}
          animated={true}
          centered={true}
          size='large'
          onChange={activeKey => {
            let tab = tabItems.find(item => item.key == activeKey)
            if (tab) {
              setSearch(tab.children[0])
            }
          }}
          // tabBarGutter={10}
          tabBarStyle={{margin: 10, position: 'inherit', height: 36}}
          items={
            tabItems.map(item => ({
              key: item.key,
              label: item.label,
              children: (<div>
                <Input.Search size='large' placeholder={search.placeholder} allowClear onSearch={(value) => {
                  window.open(search.url + value)
                }} style={{ width: '50%' }} />
                <Row>
                  <Col span={8}/>
                  <Col span={8}>
                    <Segmented 
                      block 
                      size='large'
                      style={{ backgroundColor: '#fff', height: 48}}
                      value={search.value}
                      onChange={changeValue => {
                        let first = item.children.find((item) => changeValue == item?.value)
                        if (first) {
                          setSearch(first)
                        }
                      }}
                      options={item.children.map(child => ({
                        label: (<div style={{minHeight: 20, lineHeight: '20px'}}>
                          <CaretDownOutlined style={{visibility: search.value == child.value?'visible':'hidden'}} />
                          <div>{child.label}</div>
                        </div>),
                        value: child.value
                      }))}
                    />
                  </Col>
                  <Col span={8}/>
                </Row>
              </div>)
            }))
          }
        />);
}

export default Search;