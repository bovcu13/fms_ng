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
      },
      {
        name: '國際運送安排',
        sequence: '2',
        origin: "鼎山家樂福",
        destination: "瑞豐夜市",
      },
      {
        name: '訂單運輸安排',
        sequence: '3',
        origin: "高第一女宿",
        destination: "開漳聖王廟",
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

