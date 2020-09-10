<template>
  <scroll class="player-list-scroll" ref="scroll" :bounce="false" :inner="true" :h="height">
    <div class="player-list" :class="{ hide: !hide }">
      <div class="history" ref="history" :style="{ marginTop: -height + 'px' }">
        <div class="title-history" @click="$emit('help')">
          <p>历史记录</p>
          <p @click="clear">清除</p>
        </div>
        <list-item :playlist="history" :history="true" :bordertop="true" ref="historyList"></list-item>
      </div>
      <div class="rest-list">
        <div class="title-rest">
          <div class="title-left">
            <p>待播清单</p>
            <p class="elellipsis">
              来自
              <span v-if="song.al">{{ song.al.name }}</span>
            </p>
          </div>
          <div class="title-right">
            <span class="iconfont icon-random" @click="random" :class="{picked:randomMode}"></span>
            <span class="iconfont icon-xunhuan" @click="xunhuan" :class="{picked:xunhuanMode}"></span>
          </div>
        </div>
        <list-item
          ref="restList"
          :playlist="playlist"
          :bordertop="true"
          :remove="true"
          class="lists"
        ></list-item>
      </div>
    </div>
    <div class="player-lyric" v-show="isLyric" :class="{ hide: !isLyric }" ref="lyricRef">
      <div v-for="(item, index) in lyric" :key="index" class="lyric">{{ item }}</div>
      <div class="lyric"></div>
      <div class="lyric"></div>
      <div class="lyric"></div>
      <div class="lyric"></div>
    </div>
  </scroll>
</template>

<script>
import ListItem from "@/components/content/listItem/ListItem";
import Scroll from "@/components/content/scroll/Scroll";
import { getLyric_ } from "@/network/content";
export default {
  name: "PlayerList",
  components: {
    ListItem,
    Scroll,
  },
  props: {
    hide: {
      type: Boolean,
      default: false,
    },
    isLyric: {
      type: Boolean,
      default: false,
    },
    currentTime: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      height: 0,
      isClear: false,
      lyric: [],
      lyricT: [],
      lyricH: 0,
      vw: 0,
      scrolling: false,
      timer: null,
      lastMove: null,
      randomMode: false,
      xunhuanMode: false,
      randomList: [],
      originList: [],
      delayHide: null,
    };
  },
  watch: {
    song: {
      handler(n) {
        this.getLyric();
        setTimeout(() => {
          this.lyricH = this.$refs.lyricRef.offsetHeight;
        }, 300);
      },
      immediate: true,
    },
    currentTime: {
      handler(n) {
        if (this.isLyric) {
          if (!this.scrolling) {
            let time = this.lyricT.findIndex((v) => {
              return n - v < 0.1;
            });

            if (this.lastMove == -this.vw * time + 3 * this.vw) return 0;
            this.$refs.scroll.scrollTo(0, -this.vw * time + 3 * this.vw);
            this.lastMove = -this.vw * time + 3 * this.vw;
          }
        }
      },
      immediate: true,
    },
  },
  mounted() {
    this.vw = window.innerWidth * 0.15;
    let scroll = this.$refs.scroll.scroll;
    this.$nextTick((_) => {
      scroll.on("scrollStart", (_) => {
        this.scrolling = true;
      });
      scroll.on("scrollEnd", (_) => {
        if (this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.scrolling = false;
        }, 3000);
      });
    });
  },
  updated() {
    setTimeout(() => {
      let scroll = this.$refs.scroll.scroll;
      scroll.on("touchEnd", (_) => {
        if (scroll.movingDirectionY == -1) {
          this.$emit("hideBtn");
        } else if (scroll.movingDirectionY == 1) {
          this.$emit("showBtn");
        }
      });

      scroll.refresh();
    }, 30);
    this.$nextTick((_) => {
      this.height = this.$refs.history.offsetHeight;
    });
  },
  computed: {
    song() {
      return this.$store.state.song;
    },
    playlist() {
      return this.$store.state.playlist;
    },
    setRandomList: {
      get() {
        return this.randomList;
      },
      set(v) {
        this.randomList = v;
      },
    },
    history() {
      return this.$store.state.songHistory;
    },
  },

  methods: {
    show() {
      console.log(123);
    },
    clear() {
      setTimeout(() => {
        this.$refs.scroll.refresh();
      }, 100);
      this.$store.commit("clearHistory");
    },
    async getLyric() {
      let res = await getLyric_(this.song.id);
      if (res.nolyric || !res.lrc) {
        this.lyric = [" "];
      } else {
        this.lyric = [];
        this.lyricT = [];
        let lyric = res.lrc.lyric;
        lyric.split(/\n/).forEach((v) => {
          let i = v.indexOf("]");
          let time = this.formatTime(v.slice(0, i + 1));
          this.lyric.push(v.slice(i + 1));
          this.lyricT.push(time);
        });
      }
    },
    random(v) {
      if (!this.randomMode || v == true) {
        this.originList = [...this.playlist];
        this.setRandomList = this.makeRandom();
        this.$store.commit("randomList", this.setRandomList);
      } else {
        this.$store.commit("randomList", this.originList);
      }
      if (v == true) return (this.randomMode = true);
      this.randomMode = !this.randomMode;
    },
    makeRandom() {
      if (this.playlist.length != 0) {
        let randomList = [];
        let had = [];
        let i = 0;
        let total = this.playlist.length;
        while (had.length != total) {
          i = Math.floor(total * Math.random());
          if (!had.includes(i)) {
            had.push(i);
            randomList.push(this.playlist[i]);
          }
        }
        return randomList;
      }
    },
    xunhuan() {
      if (!this.xunhuanMode) {
        this.$emit("xunhuan", true);
      } else {
        this.$emit("xunhuan", false);
      }
      this.xunhuanMode = !this.xunhuanMode;
    },
    formatTime(v) {
      let min = v.substr(1, 2);
      let sec = null;
      if (v.length < 8) {
        sec = v.substr(4, 2);
      } else {
        sec = v.substr(4, 5);
      }

      return min * 60 + sec * 1;
    },
  },
};
</script>

<style lang="scss" scoped>
.lyric-show {
  background-color: #333;
}
.hide {
  position: absolute;
  pointer-events: none !important;
  opacity: 0 !important;
}
.picked {
  color: #ff2c55;
}
.player-list {
  transition: 0.5s;
  .history {
    background-color: #f3f2f7;
    margin: 0 -2.5rem;
    padding: 0 2.5rem;
    .title-history {
      display: flex;
      justify-content: space-between;
      height: 4rem;
      p {
        font-size: 1.4rem;
        line-height: 4rem;
      }
      :first-child {
        color: #111;
      }
      :last-child {
        color: #ff2c55;
      }
    }
  }
  .rest-list {
    .title-rest {
      display: flex;
      justify-content: space-between;
      height: 5rem;
      align-items: center;
      .title-left {
        width: 70%;
        :first-child {
          font-size: 1.4rem;
          color: #111;
          padding-bottom: 0.3rem;
        }
        :last-child {
          span {
            color: #ff2c55;
            font-size: 1.2rem;
          }
        }
      }
      .title-right {
        span {
          font-size: 2rem;
        }
        :last-child {
          margin-left: 1.5rem;
        }
      }
    }
  }
}
.player-lyric {
  top: 0;
  transition: 0.5;
  opacity: 1;
  width: 100%;
  z-index: 20;
  .lyric {
    width: 100%;
    font-size: 5vw;
    padding: 5vw 0;
    text-align: center;
  }
}
</style>
