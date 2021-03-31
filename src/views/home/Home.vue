<template>
  <div id="home">
    <nav-bar :opacity="artistBg" ref="navBar" v-model="keywords">
      <span
        class="iconfont icon-back"
        v-if="showBack"
        @click="routerBack"
      ></span>
    </nav-bar>
    <scroll ref="scroll" :pullUpLoad="true" @pullingUp="pullingUp">
      <transition name="fade" v-on:after-leave="refresh">
        <keep-alive :include="includeList">
          <router-view
            :class="{ load: loading, posi: true }"
            ref="view"
            @refresh="refresh"
            @randomPlay="randomPlay"
            @clearSearch="clearSearch"
            :keywords="keywords"
            @hot-search="hotSearch"
            @show-comment="showCommentBox"
          ></router-view>
        </keep-alive>
      </transition>
    </scroll>
    <main-bar @scrollTop="scrollTop" ref="mainBar"></main-bar>
    <player class="scroll" ref="player" v-if="song"></player>

    <!-- 弹出评论框 -->
    <transition name="fade">
      <comment-box ref="commentBox" :info="info"></comment-box>
    </transition>
    <transition name="fade">
      <list-box ref="listBox" :songId="songId"></list-box>
    </transition>

    <!-- 音乐选项抽屉弹出框 -->
    <drawer-song ref="drawerSong" v-if="song" @add-list="addList"></drawer-song>
    <!-- 播放器上拉时背景变黑 -->
    <div class="cover" ref="cover"></div>
    <loading v-show="loading"></loading>
  </div>
</template>

<script>
import Loading from "@/components/common/loading/Loading";

import NavBar from "@/components/content/navBar/NavBar";
import MainBar from "@/components/content/mainBar/MainBar";
import Player from "@/views/player/Player";
import DrawerSong from "@/components/content/drawerSong/DrawerSong";
import CommentBox from "@/components/content/commentBox/CommentBox";
import ListBox from "@/components/content/listBox/ListBox";
import Scroll from "@/components/content/scroll/Scroll";
export default {
  name: "Home",
  components: {
    NavBar,
    MainBar,
    Player,
    Scroll,
    Loading,
    CommentBox,
    ListBox,
    DrawerSong,
  },
  props: {},
  data() {
    return {
      backList: [
        "ListDetail",
        "MoreList",
        "MoreListDetail",
        "MoreSongs",
        "MoreRank",
        "Comment",
        "Artist",
        "Search",
        "ArtistAlbums",
      ],
      includeList: "Library,Recommend,Browse",
      artistBg: false,
      keywords: "",
      showInput: false,
      info: {},
      songId: "",
    };
  },
  mounted() {
    setTimeout(() => {
      this.$bus.$emit("refresh");
    }, 100);
  },
  computed: {
    song() {
      return this.$store.state.song;
    },
    loading() {
      return this.$store.state.loading;
    },
    showBack() {
      return this.backList.includes(this.$route.name);
    },
    name() {
      return this.$route.name;
    },
  },
  watch: {
    name: {
      handler(n) {
        this.$nextTick((_) => {
          this.artistBg = n == "Artist";
          this.$refs.scroll.refresh();
          this.$refs.scroll.scrollTo(0, 0, 0);
        });
      },
      immediate: true,
    },
  },
  methods: {
    scrollTop() {
      this.$refs.scroll.scrollTo(0, 0);
    },
    routerBack() {
      this.$router.go(-1);
    },
    refresh() {
      this.$nextTick((_) => {
        this.$refs.scroll.refresh();
      });
    },
    randomPlay() {
      this.$refs.player.$refs.playerList.random(true);
    },
    async pullingUp() {
      if (this.$route.name == "Comment") {
        if (this.$refs.view.hot) {
          await this.$refs.view.gethotComments();
          this.$refs.scroll.scroll.finishPullUp();
        } else {
          await this.$refs.view.getComment();
          this.$refs.scroll.scroll.finishPullUp();
        }
      } else {
        this.$refs.scroll.scroll.finishPullUp();
      }
    },
    hotSearch(item) {
      this.$refs.navBar.keywords = item;
      this.keywords = item;
    },
    clearSearch() {
      this.$refs.navBar.search = false;
      this.$refs.navBar.keywords = "";
      this.keywords = "";
    },
    showCommentBox(info) {
      this.info = info;
      this.$refs.commentBox.show();
    },
    addList(id) {
      this.songId = id.toString();
      this.$refs.listBox.show();
    },
  },
};
</script>

<style lang="scss" scoped>
#home {
  height: 100%;
  padding: 4rem 0 10.5rem 0;
  box-sizing: border-box;
}

.hide {
  pointer-events: none !important;
}

.icon-back {
  transition: 0.5s;
}
.icon-hide {
  opacity: 0;
  pointer-events: none;
}
.cover {
  position: absolute;
  background-color: rgb(0, 0, 0);
  opacity: 0;
  top: 0;
  height: 100%;
  width: 100%;
  z-index: 10;
  pointer-events: none;
}
.posi {
  // position: absolute;
  box-sizing: border-box;
  height: calc(100% - 13.5rem);
  width: 100%;
}
.scroll {
  z-index: 20;
  position: fixed;
  bottom: 9.5rem;
  left: 0;
  right: 0;
}
.nav-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
}
.main-bar {
  position: fixed;
  z-index: 21;
  bottom: 0;
  left: 0;
  right: 0;
}
.scroll {
  height: 100%;
}

.loader {
  position: fixed;
  left: 50%;
  top: 50%;
  margin: -2rem 0 0 -2rem;
}
.load {
  opacity: 0.3;
}
.fade-enter-active,
.fade-leave-active {
  position: absolute;
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
