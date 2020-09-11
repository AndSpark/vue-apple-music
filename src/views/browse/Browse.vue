<template>
  <div class="browse-page">
    <h2 class="browse-title">浏览</h2>
    <div class="browse-banner">
      <div v-swiper="swiperOption" instance-name="Swiper">
        <div class="swiper-wrapper">
          <div v-for="(item, index) in banner" :key="index" class="swiper-slide">
            <p>{{item.title}}</p>
            <p class="elellipsis">
              <span>{{item.name}}</span>
              <span>{{item.ar | ar}}</span>
            </p>
            <img :src="item.bPic" @load="$emit('refresh')" @click="bannerClick(item)" />
          </div>
        </div>
      </div>
    </div>
    <swiper-list
      :list="huayuList"
      titleL="华语"
      titleR="更多类型"
      @title="more"
      @refresh="$emit('refresh')"
      @itemClick="sendList"
    ></swiper-list>
    <swiper-list
      :list="relatedList"
      titleL="热门"
      :swiperOption="swiperOption2"
      @refresh="$emit('refresh')"
      class="hot-list"
      @itemClick="sendList"
    ></swiper-list>
    <horizon-list :list="newSongs" @title="moreNewSongs" titleR="探索更多"></horizon-list>
    <rank-list :rankList="rankList" @refresh="$emit('refresh')" @title="moreRank"></rank-list>
  </div>
</template>

<script>
import SwiperList from "@/components/content/swiperList/SwiperList";
import HorizonList from "@/components/content/horizonList/HorizonList";
import ListDetail from "@/views/listDetail/ListDetail";
import RankList from "@/views/browse/comps/RankList";

import {
  getBanner_,
  getHighQualityList_,
  getRelatedList_,
  getNewSongs_,
  getTopList_,
} from "@/network/content";
import { filterList, filterList2, filterList3 } from "@/common/util";
export default {
  name: "Browse",
  components: {
    ListDetail,
    SwiperList,
    HorizonList,
    RankList,
  },
  props: {},
  data() {
    return {
      banner: [],
      huayuList: [],
      relatedList: [],
      newSongs: [],
      rankList: {},
      swiperOption: {
        slidesPerView: "1",
        observer: true,
        observeParents: true,
      },
      swiperOption2: {
        slidesPerView: "1",
        observer: true,
        observeParents: true,
      },
    };
  },
  computed: {
    ar() {
      return Vue.filter("ar");
    },
  },
  created() {
    this.getBanner();
    this.getHighQualityList();
    this.getRelatedList();
    this.getNewSongs();
    this.getTopList();
  },
  activated() {},
  methods: {
    async getBanner() {
      let { banners } = await getBanner_();
      filterList(banners.filter((v) => v.song).map((v) => (v = v.song))).then(
        (list) => {
          this.banner = list.map((x) => {
            let c = banners.find((z) => {
              if (z.song) return z.song.id == x.id;
            });
            return { ...x, bPic: c.pic, title: c.typeTitle };
          });
        }
      );
    },
    async getRelatedList() {
      let { playlists } = await getRelatedList_(1);
      this.relatedList = playlists.map((v) => {
        return {
          creator: v.creator.nickname,
          picUrl: v.coverImgUrl,
          name: v.name,
          id: v.id,
        };
      });
    },
    getHighQualityList() {
      getHighQualityList_("华语").then(({ playlists }) => {
        this.huayuList = filterList2(playlists);
      });
    },
    async getNewSongs() {
      let { data } = await getNewSongs_(0);
      filterList3(data).then((list) => {
        this.newSongs = list.filter((v, i) => i < 30);
      });
    },
    async getTopList() {
      let { list } = await getTopList_();
      this.rankList = list[0];
    },
    bannerClick(item) {
      this.$store.commit("playSong", {
        item,
        playlist: this.$store.state.playlist,
      });
    },
    sendList(item) {
      this.$router.push({ name: "ListDetail", params: { id: item.id } });
    },
    more() {
      this.$router.push("/morelist");
    },
    moreNewSongs() {
      this.$router.push("/moresongs");
    },
    moreRank() {
      this.$router.push("/morerank");
    },
  },
};
</script>

<style lang='scss' scoped>
.browse-page {
  .browse-title {
    font-size: 3rem;
    font-weight: 700;
    color: #111;
    padding: 0 1.5rem 1.5rem;
  }
  .browse-banner {
    background-image: linear-gradient(-180deg, white, white, #8a898e21);

    .swiper-slide {
      padding: 1rem;
      box-sizing: border-box;
      border-top: 1px solid #8a898e23;
      p:first-of-type {
        color: #ff2c55;
        padding-left: 0.5rem;
      }
      p:last-of-type {
        padding-left: 0.5rem;
        line-height: 3rem;
        span:first-of-type {
          color: #111;
          font-size: 2rem;
        }
        span:last-of-type {
          font-size: 1.6rem;
          padding-left: 1rem;
        }
      }

      img {
        box-sizing: border-box;
        width: 100%;
        border-radius: 1rem;
        border: 1px solid #8a898e8f;
      }
    }
  }
  .hot-list {
    background-image: linear-gradient(-90deg, white, white, #8a898e21);
  }
}
</style>