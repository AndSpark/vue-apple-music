<template>
  <div class="artist-page" v-if="artist">
    <div class="artist-title">
      <img :src="artist.picUrl" @load="$emit('refresh')" />
      <p class="elellipsis">{{ artist.name }}</p>
    </div>
    <horizon-list
      :list="hotSongs"
      titleL="歌曲排行"
      v-if="hotSongs && hotSongs.length > 0"
      @refresh="$emit('refresh')"
    ></horizon-list>
    <swiper-list
      :list="albums"
      v-if="albums && albums.length > 0"
      @refresh="$emit('refresh')"
      titleL="专辑"
      titleR="查看全部"
      @title="moreAlbums"
      @itemClick="itemClick"
    ></swiper-list>
    <swiper-list
      :list="mvs"
      v-if="mvs && mvs.length > 0"
      imgSize="?param=500y250"
      @refresh="$emit('refresh')"
      titleL="MV"
      @itemClick="MVClick"
      :swiperOption="swiperOption"
    ></swiper-list>
    <div class="artist-desc">
      <h2 class="elellipsis">
        <span>关于</span>
        <span>{{ artist.name }}</span>
      </h2>
      <p v-for="(item, index) in desc" :key="index">{{ item }}</p>
    </div>
  </div>
</template>

<script>
import SwiperList from "@/components/content/swiperList/SwiperList";
import HorizonList from "@/components/content/horizonList/HorizonList";
import { getArtists_, getArtistsAlbum_ } from "@/network/content";
import { getArtistMV_ } from "@/network/mv";
import { filterList, filterList4, filterListMV } from "@/common/util";
export default {
  name: "Artist",
  components: {
    HorizonList,
    SwiperList,
  },
  props: {},
  data() {
    return {
      swiperOption: {
        slidesPerView: "1",
        observer: true,
        observeParents: true,
      },
      artist: null,
      hotSongs: null,
      albums: null,
      mvs: null,
    };
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
    desc() {
      return this.artist.briefDesc.split(/\n/);
    },
  },
  created() {
    this.getArtists();
  },
  watch: {
    id(n) {
      this.getArtists();
    },
  },
  mounted() {
    setTimeout(() => {
      this.$emit("refresh");
    }, 1000);
  },
  methods: {
    async getArtists() {
      let { hotAlbums } = await getArtistsAlbum_(this.id, 5);
      this.albums = filterList4(hotAlbums);

      let res = await getArtists_(this.id);
      this.artist = res.artist;

      let list = await filterList(res.hotSongs);
      this.hotSongs = list;

      let { mvs } = await getArtistMV_(this.id);
      this.mvs = await filterListMV(mvs);
    },
    moreAlbums() {
      this.$router.push({
        name: "ArtistAlbums",
        params: { id: this.id },
      });
    },
    itemClick(item) {
      this.$router.push({ name: "ListDetail", params: { id: item.id } });
    },
    MVClick(item) {
      let i = this.mvs.findIndex((v) => v.id == item.id);
      let originList = this.mvs;
      let playlist = this.mvs.slice(i + 1);
      this.$store.commit("sendPlaylist", originList);
      this.$store.commit("playSong", { item, playlist });
    },
  },
};
</script>

<style lang="scss" scoped>
.artist-page {
  min-height: 80vh;

  .artist-title {
    width: 100vw;
    img {
      width: 100%;
      margin-top: -4rem;
      box-shadow: 0 2px 5px #8a898e65;
    }
    p {
      padding-left: 1.5rem;
      font-size: 3rem;
      color: #fff;
      text-shadow: 1px 1px 2px #111;
      margin-top: -5rem;
      font-weight: 700;
    }
  }
  .horizon-list {
    padding-top: 1rem;
  }
  .artist-desc {
    padding: 1rem;

    h2 {
      border-top: 1px solid #8a898e65;
      border-bottom: 1px solid #8a898e65;
      padding: 1rem;
      margin-bottom: 1rem;
      font-size: 2rem;
      color: #111;
      :last-child {
        color: #ff7675;
        padding-left: 1rem;
      }
    }
    p {
      text-indent: 2.6rem;
      font-size: 1.3rem;
      line-height: 1.5rem;
      padding: 0.3rem 0;
    }
  }
}
</style>
