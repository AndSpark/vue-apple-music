<template>
  <div class="recommend-page">
    <div class="top-title">
      <p>{{ formatDate }}</p>
      <p>每日推荐</p>
    </div>
    <div class="songs">
      <div class="song-grid" @click="dailyClick">
        <div class="cover">
          <p>{{ week(new Date().getDay()) }}</p>
          <p>{{ new Date().getDate() }}</p>
        </div>
        <div v-for="(item, index) in coverDailySongs" :key="index">
          <img :src="item.al.picUrl" @load="$emit('refresh')" />
        </div>
        <div class="icon">
          <span class="iconfont icon-arrowrightol"></span>
        </div>
      </div>
    </div>
    <div class="person-FM">
      <p>私人FM</p>
      <span class="iconfont icon-youtube" @click="getPersonalFM"></span>
    </div>
    <div class="resource">
      <swiper-list :list="resource" titleL="猜你喜欢" @refresh="$emit('refresh')" @itemClick="sendList"></swiper-list>
    </div>
  </div>
</template>

<script>
import SwiperList from "@/components/content/swiperList/SwiperList";
import {
  getRecommendResource_,
  getRecommendSongs_,
  getPersonalFM_,
} from "@/network/content";
import { filterList, filterList2, filterListFM } from "@/common/util";
export default {
  name: "Recommend",
  components: {
    SwiperList,
  },
  props: {},
  data() {
    return {
      dailySongs: [],
      resource: [],
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    coverDailySongs() {
      return this.dailySongs.slice(0, 7);
    },
    formatDate() {
      let time = new Date();
      let month = time.getMonth() + 1;
      let date = time.getDate();
      let day = time.getDay();
      return `${month}月${date}日${this.week(day)}`;
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (!vm.$store.state.user) {
        next("/login");
      } else {
        next();
      }
    });
  },
  created() {
    if (this.user) {
      this.getRecommendSongs();
      this.getRecommendResource_();
    }
  },
  watch: {
    user(n) {
      this.getRecommendSongs();
      this.getRecommendResource_();
    },
  },
  methods: {
    async getRecommendSongs() {
      let res = await getRecommendSongs_();
      this.dailySongs = await filterList(res.data.dailySongs);
    },
    async getRecommendResource_() {
      let res = await getRecommendResource_();
      this.resource = filterList2(res.recommend);
    },
    async getPersonalFM() {
      let { data } = await getPersonalFM_();
      let list = await filterListFM(data);

      this.$store.commit("sendPlaylist", [...list]);
      let item = list.shift();
      this.$store.commit("playSong", { item, playlist: list });
    },
    dailyClick() {
      this.$router.push({ name: "ListDetail", params: { id: "daily" } });
    },
    sendList(item) {
      this.$router.push({ name: "ListDetail", params: { id: item.id } });
    },
    week(day) {
      switch (day) {
        case 0:
          day = "日";
          break;
        case 1:
          day = "一";
          break;
        case 2:
          day = "二";
          break;
        case 3:
          day = "三";
          break;
        case 4:
          day = "四";
          break;
        case 5:
          day = "五";
          break;
        case 6:
          day = "六";
          break;
        default:
          break;
      }
      return `星期${day}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.recommend-page {
  display: flex;
  flex-direction: column;
  .top-title {
    margin: 0 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #8a898e65;
    :first-child {
      font-size: 1.6vh;
    }
    :last-child {
      font-size: 4vh;
      color: #111;
      font-weight: 600;
    }
  }
  .songs {
    flex: 1;
    display: flex;
    padding: 1vh 1.5rem;
    justify-content: center;
    align-items: center;
    background-image: linear-gradient(-180deg, white, white, #8a898e21);
    .song-grid {
      display: grid;
      border: 1px solid #8a898e65;
      border-radius: 3%;
      padding: 0.5rem;
      grid-template-columns: repeat(5, 15vw);
      grid-template-rows: repeat(3, 15vw);
      box-shadow: 0 0 10px 1px #8a898e65;
      div {
        margin: 0.3rem;
        img {
          border: 1px solid #8a898e65;
          border-radius: 5%;
          width: 100%;
          height: 100%;
        }
      }
      .cover {
        grid-column: 1 /3;
        grid-row: 1 / 3;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        background-color: #d5d4db65;
        border: 1px solid #8a898e65;
        border-radius: 5%;
        :first-child {
          font-size: 5vw;
          color: #333;
        }
        :last-child {
          font-size: 15vw;
          color: #ff2c55;
        }
      }
      :nth-child(3) {
        grid-column: 4 /6;
        grid-row: 1 / 3;
      }
      .icon {
        border: 1px solid #8a898e65;

        text-align: center;
        line-height: 14vw;
        border-radius: 5%;
        span {
          font-size: 12vw;
          color: #ff2c55;
        }
      }
    }
  }
  .person-FM {
    display: flex;
    height: 1rem;
    justify-content: space-between;
    align-items: center;
    padding: 2rem 1.5rem;
    margin: 2rem 0;
    box-shadow: 0 1px 5px 1px #8a898e65;
    p {
      font-size: 2rem;
      color: #111;
    }
    span {
      font-size: 3.5rem;
      color: #ff2c55;
    }
  }
  .resource {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
}
</style>
