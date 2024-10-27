import { TagOutlined } from "@ant-design/icons";
import { Avatar, Card, Empty, Flex, message, } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

export interface ICardModel {
  title: string
  url: string
  imgUrl: string
  description: string
  group: string
}

interface IMenuModel {
  key: string
  icon: string
  label: string
  parent: string 
}

const Cards = ({ menus }: { menus: IMenuModel[] }) => {

  const getImageUrl = (imgUrl: string | URL) => {
    return new URL(`/assets/images/logos/${imgUrl}`, import.meta.url).href
  }

  const [cards, setCards] = useState<any[]>([])
  
  useEffect(() => {
    if (menus.length < 1) {
      return;
    }
    axios.get('/api/card/list').then(res => {
      if (res.status === 200) {
        const cards = res.data;
        const map = Map.groupBy(cards, (card: ICardModel) => card.group);
        const data = menus.filter(menu => [...map.keys()].includes(menu.key)).map(
          menu => ({
            key: menu.key,
            title: menu.label,
            children: map.get(menu.key)
          })
        );
        setCards(data)
      }
    }).catch((e) => {
      console.log(e)
      message.error('加载失败');
    })
  }, [menus])
  
  if (cards.length == 0) {
    return <Empty description={false} />
  }

  return cards.map(card => 
            <Card 
              size="small"
              title={<span id={card.key} style={{
                fontSize: 18,
                padding: 6,
                float: 'left'
              }}><TagOutlined /> {card.title}</span>}
              bordered={false}
              children={<Flex wrap gap="small">
                {
                  card.children?.map((child: any) => 
                  <Card.Grid
                    style={{ width: 260, border: 0, cursor: 'pointer' }}
                    hoverable
                    onClick={() => {
                      window.open(child.url, child.title)
                    }}
                  >
                    <Card.Meta
                      avatar={<Avatar size="large" src={`/assets/images/logos/${child.imgUrl}`} />}
                      title={child.title}
                      description={child.description}
                    />
                  </Card.Grid>)
                }
                </Flex>}
            />
              
        )
}

export default Cards;