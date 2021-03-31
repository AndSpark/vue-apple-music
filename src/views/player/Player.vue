<template>
  <scroll
    ref="scroll"
    :probeType="3"
    :bounce="false"
    @tap="tap"
    @scrolling="scrolling"
    class="pointer-none"
  >
    <div class="white pointer-none" ref="white" :style="{height:inHeight}"></div>
    <div class="player pointer" ref="player" :style="{height:pHeight}" >
      <div
        :class="{ 'lyric-cover': lyrHide }"
        :style="{ backgroundImage: `url(${song.al.picUrl})` }"
      ></div>
      <div class="top-cover" ref="topCover">
        <img :src="song.al.picUrl + '?param=500y500'" ref="img" @load="refresh" v-if="!song.mv" />
        <video :src="song.url" v-if="song.mv" ref="video" @timeupdate="timeupdate" @ended="ended"></video>
        <div class="title" ref="title">
          <p class="elellipsis" :class="{ 'video-ar': this.song.mv }">{{ song.name }}</p>
          <span class="iconfont icon-play" @click.stop="playMusic" v-show="!playing"></span>
          <span class="iconfont icon-Pause" @click.stop="playMusic" v-show="playing"></span>
          <span class="iconfont icon-playerback_filled a-right" @click.stop="nextSong"></span>
        </div>
        <div class="center-info title-2 hide" ref="title2">
          <div class="info">
            <div class="ar" v-if="song.al" :class="{ 'video-ar': this.song.mv }">
              <p class="elellipsis">{{ song.name }}</p>
              <p class="elellipsis">{{ song.ar | ar }}</p>
            </div>
            <div class="more" @click.stop="showDrawer">
              <span class="iconfont icon-icon"></span>
            </div>
          </div>
        </div>

        <player-list
          class="hide player-list-scroll"
          ref="playerList"
          :hide="listHide"
          :isLyric="lyrHide"
          :currentTime="lyrHide ? realCurTime : 0"
          :duration="duration"
          @showBtn="showBtn"
          @hideBtn="hideBtn"
          @xunhuan="xunhuan"
        ></player-list>
      </div>
      <div class="center-info" ref="centerInfo">
        <div class="info">
          <div class="ar">
            <p class="elellipsis">{{ song.name }}</p>
            <p class="elellipsis">{{ song.ar | ar }}</p>
          </div>
          <div class="more" @click.stop="showDrawer">
            <span class="iconfont icon-icon"></span>
          </div>
        </div>
      </div>
      <div class="process-bar" ref="processBar">
        <div
          class="bar"
          @touchstart="touchstart"
          @touchmove="touchmove"
          @touchend="touchend"
          ref="bar"
        >
          <i ref="i"></i>
          <b ref="b"></b>
        </div>
        <p>
          <span>{{ currentTime | secs }}</span>
          <span>-{{ leftTime | secs }}</span>
        </p>
      </div>
      <div class="opc" ref="opc"></div>
      <div class="play-btn" ref="playBtn">
        <span class="iconfont icon-playerback_filled" @click="backSong" ref="backSong"></span>
        <span class="iconfont icon-play" @click.stop="playMusic" v-show="!playing"></span>
        <span class="iconfont icon-Pause" @click.stop="playMusic" v-show="playing"></span>
        <span class="iconfont icon-playerback_filled aRight" @click="nextSong" ref="nextSong"></span>
      </div>

      <div class="bottom-option" ref="btOp">
        <span class="iconfont icon-Message" @click="lyricClick" ref="lyric"></span>
        <span class="icon-list1 iconfont" @click="listClick"></span>
      </div>
      <audio
        :src="song.url"
        ref="myMusic"
        @timeupdate="timeupdate"
        @ended="ended"
        :loop="xunhuanMode"
      ></audio>
    </div>
  </scroll>
</template>

<script>
import PlayerList from "@/views/player/comps/PlayerList";
import Scroll from "@/components/content/scroll/Scroll";

import { getPersonalFM_ } from "@/network/content";
import { filterListFM } from "@/common/util";

export default {
  name: "Player",
  components: {
    PlayerList,
    Scroll,
  },
  props: {},
  filters: {
    secs(v) {
      let mins = Math.floor(v / 60);
      let sec = (v - 60 * mins).toFixed(0);
      if (sec < 10) {
        sec = "0" + sec;
      }
      if (isNaN(mins)) {
        mins = "00";
        sec = "00";
      }
      return `${mins}:${sec}`;
    },
  },
  data() {
    return {
      rem: 12,
      open: false,
      playing: false,
      isRotate: false,
      realCurTime: 0,
      currentTime: 0,
      duration: 0,
      leftTime: 0,
      windowWidth: 0,
      offsetLeft: 0,
      offsetWidth: 0,
      coverH: 0,
      coverW: 0,
      x: 0,
      rate: 0,
      isMove: false,
      listHide: false,
      lyrHide: false,
      origin: true,
      timer: null,
      delayBtn: null,
      randomMode: false,
      xunhuanMode: false,
			inHeight:'100vh',
			pHeight:'100vh'
    };
  },
  computed: {
    song() {
      return this.$store.state.song;
    },
    playlist() {
      return this.$store.state.playlist;
    },
    songHistory() {
      return this.$store.state.songHistory;
    },
    originPlaylist() {
      return this.$store.state.originPlaylist;
    },
    isEnd() {
      if (this.originPlaylist)
        return this.originPlaylist.length - this.playlist.length;
    },
    topRem() {
			let inh = this.inHeight.replace('px','') * 1
      return -inh + 9.5 * this.rem;
    },
    H() {
      return this.coverH / this.rem;
    },
    W() {
      return this.coverW / this.rem;
    },
    ar() {
      return Vue.filter("ar");
    },
    type() {
      if (this.song.mv) return "video";
      return "myMusic";
    },
    coverType() {
      if (this.song.mv) return "video";
      return "img";
    },
  },
  mounted() {
    this.windowWidth = window.innerWidth;
    this.offsetLeft = this.$refs.bar.offsetLeft;
    this.offsetWidth = this.$refs.bar.offsetWidth;
    this.coverH = this.$refs.topCover.offsetHeight;
    this.coverW = this.$refs.topCover.offsetWidth;

    setTimeout(() => {
      this.playing = true;
      if (this.song.mv) {
        this.$refs.lyric.classList.add("ban");
      }
      this.$refs[this.type].play();
      this.valiRotate();
    }, 0);

		setInterval(() => {
			this.inHeight = window.innerHeight + 'px'
		}, 1000);
  },
  watch: {
    song(n) {
      this.playing = true;
      this.$nextTick((_) => {
        if (this.song.mv) {
          this.$refs.lyric.classList.add("ban");
        } else {
          this.$refs.lyric.classList.remove("ban");
        }
        this.$refs[this.type].play();
        this.valiRotate();
      });
    },
    isEnd: {
      handler(n) {
        this.$nextTick((_) => {
          if (n <= 1) {
            this.$refs.backSong.classList.add("ban");
          } else if (n > 1) {
            if (this.$refs.backSong.classList.contains("ban")) {
              this.$refs.backSong.classList.remove("ban");
            }
          }
        });
      },
      immediate: true,
    },
    playlist: {
      handler(n) {
        this.$nextTick((_) => {
          if (n.length == 0) {
            this.$refs.nextSong.classList.add("ban");
          } else if (n.length > 0) {
            if (this.$refs.nextSong.classList.contains("ban")) {
              this.$refs.nextSong.classList.remove("ban");
            }
          }
        });
      },
    }
  },
  methods: {
    //单击放大
    tap(e) {
			console.log(this.topRem);
      this.$refs.scroll.scrollTo(0, this.topRem);
			
      this.valiRotate();
    },
    //图片滑动缩放效果
    scrolling(y) {
      if (!this.isMove) {
        let rat = y / this.topRem;
        if (this.song.mv) {
					let videoStyle = this.$refs.video.style
          if (!this.origin) {
						Object.assign(videoStyle,{
							width:`${6 + 0.9 * rat}rem`,
							top:`${0.7 + rat}rem`,
							left:`${-1.5 + rat * 1.5}rem`
						})
          } else {
						Object.assign(videoStyle,{
							width:`${6 + (this.W * 1 - 6) * rat}rem`,
							top:`${0.7 + (this.H * 0.5 - this.W * 0.285 - 0.7) * rat}rem`,
							left:`${-1.5 + rat * 1.5}rem`
						})
          }
        } else {
					let imgStyle = this.$refs.img.style
          if (!this.origin) {
						Object.assign(imgStyle,{
							width:`${3.5 + 0.9 * rat}rem`,
							top:`${0.6 + rat}rem`,
							left:`${-1.5 + rat}rem`
						})
          } else {
						Object.assign(imgStyle,{
							width:`${3.5 + (this.H * 0.8 - 3.5) * rat}rem`,
							top:`${0.6 + (this.H * 0.1 - 0.6) * rat}rem`,
							left:`${-1.5 + (this.W * 0.5 + 1.5 - this.H * 0.8 * 0.5) * rat}rem`
						})
          }
        }

        if (rat > 0.2) {
          this.open = true;
        } else if (rat < 0.2) {
          this.open = false;
        }

        this.$refs.title.style.opacity = `${1 - rat * 15}`;
        this.$refs.title2.style.opacity = `${(rat - 0.5) * 2}`;
        this.$parent.$refs.mainBar.$el.style.bottom = `${-4 * rat * 1.5}rem`;
        this.$parent.$refs.cover.style.opacity = `${0 + rat}`;
        this.$refs.player.style.borderRadius = `${2 * rat}rem ${
          2 * rat
        }rem 0 0`;

        this.valiRotate();
      }
    },

    showDrawer() {
      this.$parent.$refs.drawerSong.showDrawer();
    },
    // 播放音乐
    playMusic() {
      if (this.playing) {
        this.playing = false;
        this.$refs[this.type].pause();
        this.valiRotate();
      } else {
        this.playing = true;
        this.$refs[this.type].play();
        this.valiRotate();
      }
    },

    // 图片旋转
    valiRotate() {
      if (this.song.mv) return;
      let h;
      this.$nextTick((_) => {
        h = parseInt(this.$refs.img.style.width);
        if (h >= 3 && h <= 5 && this.playing) {
          this.$refs.img.classList.add("rot");
          this.isRotate = true;
        } else {
          if ((this.isRotate = true)) {
            this.$refs.img.classList.remove("rot");
            this.isRotate = false;
          }
        }
      });
    },
    //更新音乐时间
    timeupdate() {
      if (!this.isMove) {
				let p = this.$refs[this.type]

        this.realCurTime = p.currentTime.toFixed(2) * 1;
        this.currentTime = p.currentTime.toFixed(0) * 1;
        this.duration = p.duration.toFixed(0) * 1;
        this.leftTime =
          this.duration - p.currentTime.toFixed(0) * 1;
        this.$refs.i.style.width = `${
          (this.currentTime / this.duration) * 100
        }%`;
        this.$refs.b.style.left = `${
          (this.currentTime / this.duration) * 100
        }%`;
      }
    },
    ended() {
      this.playing = false;
      if (this.xunhuanMode) {
        return;
      }

      this.nextSong();
      this.valiRotate();
    },

    //移动音乐时间
    touchstart(e) {
      this.isMove = true;
      this.$refs.i.classList.add("active");
      this.$refs.b.classList.add("active", "active-b");
      this.$refs.bar.classList.add("active");
      this.touchmove(e);
    },
    touchmove(e) {
      this.x = e.targetTouches[0].clientX;
      if (this.x <= 2.5 * this.rem) {
        e.targetTouches[0].clientX = 2.5 * this.rem;
      } else if (this.x >= this.windowWidth - 2.5 * this.rem) {
        e.targetTouches[0].clientX = this.windowWidth - 2.5 * this.rem;
      }
      this.rate = (this.x - this.offsetLeft) / this.offsetWidth;
      this.$refs.i.style.width = `${this.rate * 100}%`;
      this.$refs.b.style.left = `${this.rate * 100}%`;
      this.currentTime = this.rate * this.$refs[this.type].duration;
      this.leftTime = this.duration - this.currentTime;
    },
    touchend(e) {
      this.isMove = false;
      this.$refs[this.type].currentTime =
        this.rate * this.$refs[this.type].duration;
      this.currentTime = this.$refs[this.type].currentTime.toFixed(0);
      this.$refs.i.classList.remove("active");
      this.$refs.b.classList.remove("active", "active-b");
      this.$refs.bar.classList.remove("active");
    },

    //打开列表
    listClick() {
      if (this.origin) {
        this.infoHide(this.listHide);
        this.originHide();
        this.listAnimation(this.listHide);

        this.origin = false;
      } else if (this.lyrHide) {
        this.infoHide(this.listHide);
        this.lyrHide = !this.lyrHide;
      } else {
        this.infoHide(this.listHide);
        this.originHide();
        this.listAnimation(this.listHide);

        this.origin = true;
      }

      this.listHide = !this.listHide;

      this.$refs.scroll.scroll.enable();
      this.$refs.playerList.$refs.scroll.scrollTo(0, 0, 0);
    },
    lyricClick() {
      if (this.origin) {
        this.originHide();
        this.infoHide(this.lyrHide);
        this.listAnimation(this.lyrHide);
        this.delayBtn = setTimeout(() => {
          this.showBtn();
        }, 4000);
        this.origin = false;
      } else if (this.listHide) {
        this.delayBtn = setTimeout(() => {
          this.showBtn();
        }, 4000);
        this.infoHide(this.lyrHide);
        this.listHide = !this.listHide;
      } else {
        if (this.delayBtn) clearTimeout(this.delayBtn);
        this.originHide();
        this.infoHide(this.lyrHide);
        this.listAnimation(this.lyrHide);

        this.origin = true;
      }
      this.lyrHide = !this.lyrHide;
    },
    originHide() {
      if (this.origin) {
        this.$refs.centerInfo.classList.add("hide");
        this.$refs.processBar.classList.add("hide");
        this.$refs.title2.classList.remove("hide");
      } else {
        this.$refs.centerInfo.classList.remove("hide");
        this.$refs.processBar.classList.remove("hide");
        this.$refs.title2.classList.add("hide");
      }
    },
    infoHide(v) {
      if (!v) {
        this.$refs.playerList.$el.classList.remove("hide");
        this.$refs.playerList.$el.style.opacity = 1;
        this.$refs.playerList.$refs.scroll.scroll.enable();
      } else if (v) {
        this.$refs.playerList.$el.classList.add("hide");
        this.$refs.playerList.$el.style.opacity = 0;
        this.$refs.playerList.$refs.scroll.scroll.disable();
      }
    },
    refresh() {
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.$refs.scroll.refresh();
      }, 30);
    },

    listAnimation(v) {
      if (this.song.mv) {
				let videoStyle = this.$refs.video.style
        if (!v) {
					Object.assign(videoStyle,{
						transition: ".3s",
						width: `6.9rem`,
						top:`1.7rem`,
						left:`0rem`
					})
          setTimeout(() => {
            this.$refs.video.style.transition = null;
          }, 300);
        } else {
						Object.assign(videoStyle,{
						transition: ".3s",
						width: `${this.W}rem`,
						top:`${0.7 + (this.H * 0.5 - this.W * 0.285 - 0.7)}rem`,
						left:`0rem`
					})
          setTimeout(() => {
            this.$refs.video.style.transition = null;
          }, 300);
        }
        return;
      }
			let imgStyle = this.$refs.img.style
      if (!v) {
				Object.assign(imgStyle,{
					transition:".3s",
					width:'4.4rem',
					top:'1.6rem',
					left:'-0.5rem'
				})
        setTimeout(() => {
          this.$refs.img.style.transition = null;
        }, 300);
      } else {
				Object.assign(imgStyle,{
					transition:".3s",
					width:`${3.5 + (this.H * 0.8 - 3.5)}rem`,
					top:`${0.6 + (this.H * 0.1 - 0.6)}rem`,
					left:`${-1.5 + (this.W * 0.5 + 1.5 - this.H * 0.8 * 0.5)}rem`
				})
        setTimeout(() => {
          this.$refs.img.style.transition = null;
        }, 300);
      }
      this.valiRotate();
    },
    showBtn() {
      this.$refs.opc.classList.add("hide");
      this.$refs.playBtn.classList.add("hide");
      this.$refs.btOp.classList.add("hide");
    },
    hideBtn() {
      this.$refs.opc.classList.remove("hide");
      this.$refs.playBtn.classList.remove("hide");
      this.$refs.btOp.classList.remove("hide");
    },
    backSong() {
      this.$refs.playerList.originList.unshift(this.song);
      this.playlist.unshift(this.song);
      let i = this.originPlaylist.length - this.playlist.length - 1;
      let item = this.originPlaylist[i];
      this.$store.commit("playSong", { item, playlist: this.playlist });
    },
    async nextSong() {
      if (this.playlist.length == 0) return 0;
      let item = this.playlist.shift();
      if (this.playlist.length == 0 && item.FMMode) {
        this.playlist = await this.getPersonalFM();
        this.$store.commit("sendPlaylist", [
          ...this.originPlaylist,
          ...this.playlist,
        ]);
      }
      this.$refs.playerList.originList.shift();
      this.$store.commit("playSong", { item, playlist: this.playlist });
    },
    xunhuan(v) {
      if (v) {
        this.xunhuanMode = true;
      } else {
        this.xunhuanMode = false;
      }
    },
    async getPersonalFM() {
      let { data } = await getPersonalFM_();
      let list = await filterListFM(data);
      return this.playlist.push(...list);
    },
  },
};
</script>

<style lang="scss" scoped>
.hide {
  pointer-events: none;
  opacity: 0 !important;
}
.init {
  margin-top: 5rem;
}
.ban {
  color: #aeadb2 !important;
  pointer-events: none !important;
}
.lyric-cover {
  position: absolute;
  height: 100vh;
  width: 100vw;
  bottom: 0;
  left: 0;
  z-index: 99;
  opacity: 0.2;
  background-size: 300%;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  pointer-events: none;
  animation: bg 60s infinite both linear;
  animation-direction: alternate-reverse;
}
@keyframes bg {
  from {
    background-position: 0% 0%;
  }
  to {
    background-position: 100% 100%;
  }
}
.pointer-none {
  pointer-events: none !important;
}
.pointer {
  pointer-events: auto !important;
}
.white {
  height: 100vh;
  opacity: 0;
  pointer-events: none !important;
}
.player {
  border-top: 1px solid #8a898e65;
  // border-radius: 2rem 2rem 0 0;
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #fff;
  padding: 0 2.5rem;
  z-index: 40;
  .top-cover {
    position: relative;
    padding-top: 2rem;
    display: flex;
    height: 48%;
    justify-content: center;
    img {
      box-sizing: border-box;
      position: absolute;
      border-radius: 2rem;
      box-shadow: 0 2px 10px 1px #aaa;
      // height: 3.5rem;
      width: 3.5rem;
      top: 0.6rem;
      left: -1.5rem;
    }
    video {
      box-sizing: border-box;
      position: absolute;
      border-radius: 0.5rem;
      box-shadow: 0 2px 10px 1px #aaa;
      // height: 3.5rem;
      width: 6rem;

      top: 0.7rem;
      left: -1.5rem;
    }
    .rot {
      animation: rot 10s linear infinite;
    }
    @keyframes rot {
      0% {
        transform: rotate(0);
      }
      100% {
        transform: rotate(360deg);
      }
    }
    .title {
      margin-top: -0.5rem;
      display: flex;
      width: 100%;
      p {
        text-indent: 3rem;
        width: 80%;
        font-size: 1.3rem;
        color: #111;
      }
      .video-ar {
        text-indent: 5rem;
        width: 80%;
      }
      span {
        margin-top: -0.3rem;
        position: absolute;
        font-size: 2rem;
        color: #111;
        top: 1.5rem;
      }
      .icon-play {
        right: 3rem;
      }
      .icon-Pause {
        right: 3rem;
      }
      .a-right {
        margin-top: -0.45rem;
        right: 0;
        transform: rotate(180deg);
      }
    }
    .title-2 {
      transition: none;
      position: absolute;
      height: 4rem;
      box-sizing: border-box;
      width: 100%;
      padding: 0 2.5rem 1.5rem;
      border-bottom: 1px solid #8a898e65;
      box-sizing: content-box;
      z-index: 2;
      .info {
        .ar {
          padding-left: 5rem;
          width: 70%;
          p {
            font-size: 1.3rem;
          }
        }
        .video-ar {
          text-indent: 2.5rem;
        }
      }
    }
    .player-list-scroll {
      position: absolute;
      top: 7.5rem;
      height: calc(100vh - 7.5rem);
      width: 100%;
      margin: 0 -2.5rem;
      padding: 0 2.5rem;
      overflow: hidden;
      transition: 1s;
      opacity: 0;
    }
    .player-lyric {
      position: absolute;
      top: 7.5rem;
      height: calc(100vh - 7.5rem);
      width: 100%;
      margin: 0 -2.5rem;
      padding: 0 2.5rem;
      overflow: hidden;
      transition: 1s;
      opacity: 0;
    }
  }
  .center-info {
    transition: 0.3s;
    opacity: 1;
    .info {
      display: flex;
      justify-content: space-between;
      .ar {
        width: 90%;
        p {
          width: 100%;
          font-size: 1.5rem;
          padding: 0.2rem 0;
        }
        :first-child {
          color: #111;
          font-weight: 700;
        }
        :last-child {
          color: #ff2c55;
        }
      }
      .more {
        background-color: #ffe4e9;
        margin-top: 1rem;
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        text-align: center;
        span {
          color: #ff7992;
          line-height: 2rem;
        }
      }
    }
  }
  .process-bar {
    opacity: 1;
    transition: 0.3s;
    margin-top: 1rem;
    height: 3rem;
    width: 100%;
    .bar {
      position: relative;
      width: 100%;
      height: 2px;
      background-color: #e6e5ea;
      i {
        position: absolute;
        top: 0;
        height: 2px;
        background-color: #aeadb2;
      }
      b {
        position: absolute;
        top: -4px;
        left: 0;
        margin-left: -5px;
        height: 10px;
        width: 10px;
        border-radius: 50%;
        background-color: #aeadb2;
      }
      .active {
        color: #ff2c55;
        background-color: #ff2c55;
      }
      .active-b {
        transform: scale(2.5);
      }
    }
    p {
      padding-top: 1rem;
      display: flex;
      justify-content: space-between;
      font-size: 1rem;
    }
  }
  .opc {
    transition: 0.5s;
    width: 100%;
    margin: 0 -2.5rem;
    padding: 0 2.5rem;
    height: 5rem;
    background-image: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0),
      rgb(255, 255, 255)
    );
    z-index: 20;
    flex: 1;
    pointer-events: none;
  }
  .play-btn {
    display: flex;
    flex: 2.5;
    justify-content: center;
    align-items: flex-start;
    color: #222;
    z-index: 10;
    background-color: #fff;
    margin: 0 -2.5rem;
    padding: 0 2.5rem;
    transition: 0.5s;
    span {
      margin: 0rem 2rem 0;
      font-size: 3.5rem;
    }
    .icon-Pause {
      font-size: 4rem;
      margin-top: -0.3rem;
    }
    .icon-play {
      font-size: 4rem;
      margin-top: -0.3rem;
    }
    .aRight {
      transform: rotate(180deg);
    }
  }
  .bottom-option {
    width: 85%;
    position: fixed;
    height: 2rem;
    bottom: 2rem;
    z-index: 20;
    transition: 0.5s;
    span {
      position: absolute;
      font-size: 1.5rem;
      color: #ff2c55;
    }
    :first-child {
      left: 20%;
    }
    :last-child {
      right: 20%;
    }
  }
}
</style>
