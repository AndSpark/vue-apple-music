<template>
  <div class="artist-page" v-if="artist">
    <div class="artist-title">
      <img :src="artist.picUrl" @load="$emit('refresh')" />
      <p class="elellipsis">{{artist.name}}</p>
    </div>
    <horizon-list
      :list="hotSongs"
      titleL="歌曲排行"
      titleR=" "
      v-if="hotSongs"
      @refresh="$emit('refresh')"
    ></horizon-list>
    <swiper-list
      :list="albums"
      v-if="albums"
      @refresh="$emit('refresh')"
      titleL="专辑"
      titleR="查看全部"
      @title="moreAlbums"
      @itemClick="itemClick"
    ></swiper-list>
    <div class="artist-desc">
      <h2 class="elellipsis">
        <span>关于</span>
        <span>{{artist.name}}</span>
      </h2>
      <p v-for="(item, index) in desc" :key="index">{{item}}</p>
    </div>
  </div>
</template>

<script>
import SwiperList from "@/components/content/swiperList/SwiperList";
import HorizonList from "@/components/content/horizonList/HorizonList";
import { getArtists_, getArtistsAlbum_ } from "@/network/content";
import { filterList, filterList4 } from "@/common/util";
export default {
  name: "Artist",
  components: {
    HorizonList,
    SwiperList,
  },
  props: {},
  data() {
    return {
      artist: null,
      hotSongs: null,
      albums: null,
    };
  },
  computed: {
    id() {
      return this.$store.state.artistId;
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
      getArtistsAlbum_(this.id, 5).then(({ hotAlbums }) => {
        this.albums = filterList4(hotAlbums);
      });
      let res = await getArtists_(this.id);
      this.artist = res.artist;
      filterList(res.hotSongs).then((list) => {
        this.hotSongs = list;
      });
    },
    moreAlbums() {
      getArtistsAlbum_(this.id)
        .then(({ hotAlbums }) => {
          return filterList4(hotAlbums);
        })
        .then((list) => {
          this.$router.push({
            name: "MoreListDetail",
            params: { list, title: "专辑" },
          });
        });
    },
    itemClick(item) {
      this.$store.commit("sendListId", item.id);
      this.$router.push("/listdetail");
    },
  },
};
</script>

<style lang='scss' scoped>
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