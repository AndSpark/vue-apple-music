<template>
  <div class="list-detail">
    <div class="list-info">
      <img :src="coverImgUrl" @load="$emit('refresh')" />
      <div class="list-title">
        <p>{{ name }}</p>
        <p>{{ creator }}</p>
        <p>{{ desc }}</p>
      </div>
    </div>
    <div class="play">
      <p @click="playSong()">
        <span class="iconfont icon-play">播放</span>
      </p>
      <p @click="playSong(true)">
        <span class="iconfont icon-random">随机播放</span>
      </p>
    </div>
    <list-item :playlist="playlist" :listDetail="true" ref="listItem" @refresh="$emit('refresh')"></list-item>
  </div>
</template>

<script>
import ListItem from "@/components/content/listItem/ListItem";

import {
  getListDetail_,
  getSong_,
  checkSong_,
  getAlbum_,
  getRecommendSongs_,
} from "@/network/content";
import { filterList } from "@/common/util";

export default {
  name: "ListDetail",
  components: {
    ListItem,
  },
  props: {},

  data() {
    return {
      playlist: [],
      relatedList: [],
      coverImgUrl: "",
      name: "",
      creator: "",
      desc: "",
      count: 0,
    };
  },
  created() {
    this.getListDetail();
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
    //如果列表中歌曲发生变动，需要重新获取列表
    timestamp() {
      if (this.$store.state.refreshList == this.id) {
        return new Date().getTime();
      } else {
        return 0;
      }
    },
  },
  watch: {
    id(n) {
      this.getListDetail();
    },
  },
  methods: {
    async getListDetail() {
      //每日列表
      if (this.id == "daily") {
        let res = await getRecommendSongs_();
        let list = await filterList(res.data.dailySongs);
        this.playlist = list;
        this.coverImgUrl = this.playlist[0].al.picUrl;
        this.name = "每日歌曲推荐";
        this.creator = "网易云音乐";
        this.desc = "根据你的音乐口味生成，每天06:00更新";
        return;
      }

      //专辑列表
      let res = await getAlbum_(this.id);
      if (res.code == 200) {
        let list = await filterList(res.songs);
        this.playlist = list;
        this.coverImgUrl = res.album.picUrl;
        this.name = res.album.name;
        this.creator = res.album.artists[0].name;
        this.desc = res.album.description;
        return;
      }

      //歌单列表

      let { playlist } = await getListDetail_(this.id, this.timestamp);
      this.$store.commit("clearRefreshList");
      filterList(playlist.tracks, playlist.id, playlist.name).then((list) => {
        this.playlist = list;
      });

      this.coverImgUrl = playlist.coverImgUrl;
      this.name = playlist.name;
      this.creator = playlist.creator.nickname;
      this.desc = playlist.description;
    },
    //如果V是true，代表随机播放
    playSong(v) {
      if (v) {
        let l = this.$refs.listItem.playlist.length;
        let r = Math.floor(l * Math.random());
        setTimeout(() => {
          this.$emit("randomPlay");
        }, 100);
        if (
          this.$refs.listItem.playSong(this.$refs.listItem.playlist[r], 0) === 0
        ) {
          this.playSong(true);
        } else {
          this.count = 0;
        }
      } else if (
        this.$refs.listItem.playSong(
          this.$refs.listItem.playlist[this.count],
          this.count
        ) === 0
      ) {
        this.count++;
        this.playSong();
      } else {
        this.count = 0;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.list-detail {
  min-height: 80vh;
  padding: 1rem;
  box-sizing: border-box;
  .list-info {
    display: flex;
    width: 100%;
    padding-bottom: 2rem;
    border-bottom: 1px solid #8a898e65;
    img {
      width: 45%;
      border-radius: 0.5rem;
      border: 1px solid #8a898e65;
    }
    .list-title {
      padding: 0.3rem 1rem;
      width: 50%;
      :first-child {
        color: #333;
        font-size: 1.5rem;
        font-weight: 700;
      }
      :nth-child(2) {
        color: #ff2c55;
        padding: 0.5rem 0;
        position: relative;
        &::after {
          content: "......";
          color: #8a898e;
          position: absolute;
          transform: rotateY(180deg);
          font-size: 1.5rem;
          background-color: #fff;
          left: 0rem;
          bottom: -4rem;
        }
      }
      :last-child {
        font-size: 1.2rem;
        line-height: 1.2rem;
        height: 2.4rem;
        overflow: hidden;
        text-indent: 2.4rem;
      }
    }
  }
  .play {
    display: flex;
    height: 5rem;
    justify-content: space-evenly;
    border-bottom: 1px solid #8a898e65;
    align-items: center;
    p {
      width: 45%;
      height: 3rem;
      text-align: center;
      line-height: 3rem;
      background-color: #ededef;
      border-radius: 0.5rem;
      color: #ff2c55;
      span {
        font-size: 1.5rem;
      }
    }
  }
}
</style>
