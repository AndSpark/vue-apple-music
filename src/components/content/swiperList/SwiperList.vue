<template>
  <div v-swiper:mySwiper="swiperOption" class="swiper-list">
    <div class="swiper-title" :class="{'s-title':small}">
      <p>{{titleL}}</p>
      <p @click="$emit('title')">{{titleR}}</p>
    </div>
    <div class="swiper-wrapper">
      <div v-for="(item, index) in list" :key="index" class="swiper-slide" :class="{'s-img':small}">
        <img
          :src="item.picUrl ? item.picUrl + imgSize :item.al.picUrl + imgSize "
          @load="$emit('refresh')"
          @click="itemClick(item)"
        />
        <p class="elellipsis">{{item.name}}</p>
        <p class="elellipsis">{{item.creator || ar(item.ar)}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SwiperList",
  components: {},
  props: {
    list: {
      type: Array,
    },
    swiperOption: {
      type: Object,
      default() {
        return {
          slidesPerView: "2",
          observer: true,
          observeParents: true,
        };
      },
    },
    titleL: {
      type: String,
      default: "",
    },
    titleR: {
      type: String,
      default: "",
    },
    small: {
      type: Boolean,
      default: false,
    },
    imgSize: {
      type: String,
      default: "?param=500y500",
    },
  },
  data() {
    return {
      timer: null,
    };
  },
  computed: {},
  methods: {
    itemClick(item) {
      this.$emit("itemClick", item);
    },
    ar(v) {
      return v.map((x) => x.name).join(",");
    },
    refresh() {
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        console.log(111111111111);
        this.$emit("refresh");
      }, 100);
    },
  },
};
</script>

<style lang='scss' scoped>
.swiper-container {
  width: 100%;
}
.swiper-list {
  box-sizing: border-box;
  border-top: 1px solid #8a898e23;
  padding-bottom: 1rem;
}
.swiper-title {
  display: flex;
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
.s-title {
  p {
    flex: 1;
    font-size: 1.5rem;
    font-weight: 700;
    color: #111;
    padding: 1rem;
    text-align: center;
  }
  p:last-of-type {
    display: none;
  }
}
.swiper-wrapper {
  .swiper-slide {
    text-align: center;
    img {
      width: calc(100% - 2rem);
      border-radius: 5%;
      border: 1px solid #8a898e65;
      box-sizing: border-box;
    }

    p {
      box-sizing: border-box;
      width: 100%;
      padding: 0.3rem 1rem;
    }
    p:first-of-type {
      color: #111;
    }
  }

  .s-img {
    img {
      width: calc(50% - 1rem);
    }
    p {
      width: 100%;
    }
    p:first-of-type {
      color: #111;
      padding: 0;
    }
  }
}
</style>