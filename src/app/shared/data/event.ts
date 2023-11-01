export const workData = [
  {
    id: 1,
    title: '客戶訂單分發',
    form: [
      {
        name: '產品配送計劃',
        sequence: '1',
        origin: "季河",
        destination: "環球影城",
        shipping_list: [
          {
            product_name: "軸線",
            unit_price: 10,
            qty: 100,
            tonnage: 5,
          },
          {
            product_name: "螺栓",
            unit_price: 5,
            qty: 50,
            tonnage: 2.5,
          },
          {
            product_name: "螺母",
            unit_price: 2,
            qty: 80,
            tonnage: 1.6,
          },
        ],
      },
      {
        name: '國際運送安排',
        sequence: '2',
        origin: "鼎山家樂福",
        destination: "瑞豐夜市",
        shipping_list: [
          {
            product_name: "鋼管",
            unit_price: 15,
            qty: 60,
            tonnage: 6,
          },
          {
            product_name: "螺栓",
            unit_price: 5,
            qty: 100,
            tonnage: 5,
          },
          {
            product_name: "螺母",
            unit_price: 2,
            qty: 120,
            tonnage: 2.4,
          },
        ],
      },
      {
        name: '訂單運輸安排',
        sequence: '3',
        origin: "高第一女宿",
        destination: "開漳聖王廟",
        shipping_list: [
          {
            product_name: "鋼梁",
            unit_price: 20,
            qty: 40,
            tonnage: 8,
          },
          {
            product_name: "鋼管",
            unit_price: 15,
            qty: 75,
            tonnage: 7.5,
          },
          {
            product_name: "螺栓",
            unit_price: 5,
            qty: 70,
            tonnage: 3.5,
          },
        ],
      }
    ],
    driver: '林宜璇',
    vehicle: '季河27號',
    trailer: '00123',
    start: '2023-11-01',
    end: '2023-11-02',
    color: 'purple', //代表狀態的呈現
  },
  {
    id: 2,
    title: '1112貨物運輸排程',
    form: [
      {
        name: '商品分發管理',
        sequence: '1',
        origin: "季河",
        destination: "高雄高商",
        shipping_list: [
          {
            product_name: "螺絲",
            unit_price: 1,
            qty: 500,
            tonnage: 1,
          },
          {
            product_name: "螺帽",
            unit_price: 2,
            qty: 300,
            tonnage: 0.6,
          },
          {
            product_name: "鋼板",
            unit_price: 25,
            qty: 20,
            tonnage: 5,
          },
        ],
      },
      {
        name: '物流處理訂單',
        sequence: '2',
        origin: "中央公園",
        destination: "夢時代",
      }
    ],
    driver: '李宜蓁',
    vehicle: '季河27號',
    trailer: '00123',
    start: '2023-11-12',
    end: '2023-11-14',
    color: 'orange',
  }
];

