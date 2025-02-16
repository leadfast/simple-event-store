import { EventStore } from '../dist/index';

const eventStore = new EventStore({
  state: {
    name: 'why',
    friends: ['abc', 'cba', 'nba'],
    banners: [],
    recommends: [],
  },
  actions: {
    getHomeMultidata(ctx) {
      fetch(url)
        .then((res) => res.json())
        .then((res) => {
          const banner = res.data.data.banner;
          const recommend = res.data.data.recommend;
          // 赋值
          ctx.banners = banner;
          ctx.recommends = recommend;
        });
    },
  },
});

// 数据监听
// eventStore.onState("name", (value) => {
//   console.log("监听name:", value)
// })

// eventStore.onState("friends", (value) => {
//   console.log("监听friends:", value)
// })

eventStore.onState('banners', (value) => {
  console.log('监听banners:', value);
});

eventStore.onState('recommends', (value) => {
  console.log('监听recommends', value);
});

// 同时监听多个数据
eventStore.onStates(['name', 'friends'], (value) => {
  console.log('监听多个数据:', value); // 数组类型
});

// 数据变化
setTimeout(() => {
  eventStore.setState('name', 'lilei');
  eventStore.setState('friends', ['kobe', 'james']);
}, 1000);

// eventStore.dispatch("getHomeMultidata")
