<template>
  <div v-swiper:mySwiper="swiperOption" class="horizon-list">
    <div class="swiper-title">
      <p>{{titleL}}</p>
      <p @click="$emit('title')">{{titleR}}</p>
    </div>
    <div class="swiper-wrapper">
      <div v-for="(item, index) in rowList" :key="index" class="swiper-slide">
        <list-item :playlist="item" :playlistAll="list" @refresh="$emit('refresh')"></list-item>
      </div>
    </div>
  </div>
</template>

<script>
import ListItem from "@/components/content/listItem/ListItem";
export default {
  name: "HorizonList",
  components: {
    ListItem,
  },
  props: {
    list: {
      type: Array,
      default() {
        return [];
      },
    },
    row: {
      type: Number,
      default: 4,
    },
    titleL: {
      type: String,
      default: "新歌",
    },
    titleR: {
      type: String,
      default: "查看更多",
    },
  },
  data() {
    return {
      swiperOption: {
        slidesPerView: "1",
        observer: true,
        observeParents: true,
      },
    };
  },
  computed: {
    rowList() {
      let newList = [];
      this.list.reduce((pre, cur, i) => {
        pre.push(cur);
        if ((i + 1) % this.row == 0) {
          newList.push(pre);
          pre = [];
        } else if (i + 1 == this.list.length) {
          newList.push(pre);
        }
        return pre;
      }, []);
      return newList;
    },
  },
  methods: {},
};
</script>

<style lang='scss' scoped>
.horizon-list {
  box-sizing: border-box;
  border-top: 1px solid #8a898e23;
  padding-bottom: 1rem;
}
.swiper-title {
  display: flex;
  border-bottom: 1px solid #8a898e23;

  justify-content: space-between;
  p {
    font-size: 2rem;
    color: #111;
    padding: 1.5rem;
  }
  p:last-of-type {
    font-size: 1.3rem;
    color: #ff2c55;
    padding-top: 2rem;
  }
}
.swiper-slide {
  padding: 0 1rem;
  box-sizing: border-box;
}
</style>