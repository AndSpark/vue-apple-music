<template>
  <div class="wrapper" ref="wrapper">
    <div class="content" @click="$emit('tap')">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from "@better-scroll/core";
import Pullup from "@better-scroll/pull-up";
BScroll.use(Pullup);

export default {
  name: "Scroll",
  components: {},
  props: {
    probeType: {
      type: Number,
      default: 0,
    },
    pullUpLoad: {
      type: Boolean,
      default: false,
    },
    bounce: {
      type: Boolean,
      default: true,
    },
    inner: {
      type: Boolean,
      default: false,
    },
    h: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      scroll: null,
      rem: 12,
			inH:''
    };
  },
  computed: {
    topRem() {
      return -this.inH + 9.5 * this.rem;
    },
  },
  mounted() {
		setInterval(() => {
			this.inH = window.innerHeight
		}, 1000);

    this.scroll = new BScroll(this.$refs.wrapper, {
      probeType: this.probeType,
      pullUpLoad: this.pullUpLoad,
      bindToTarget: true,
      bounce: this.bounce,
      click: true,
      stopPropagation: true,
    });
    if (this.pullUpLoad == true) {
      this.scroll.on("pullingUp", () => {
        this.$emit("pullingUp");
      });
    }
    if (this.probeType === 3) {
      this.scroll.on("scroll", (position) => {
        let y = Math.round(position.y);
        if (y == this.topRem) {
          this.scroll.stop();
        }
        this.$emit("scrolling", y);
        if (
          (y > this.topRem - 20 && y < this.topRem + 20) ||
          (y >= -20 && y < 20)
        ) {
          this.$refs.wrapper.classList.add("pointer-none");
        } else {
          if (this.$refs.wrapper.classList.contains("pointer"))
            this.$refs.wrapper.classList.remove("pointer-none");
        }
        if (y < this.topRem) {
          this.scrollTo(0, this.topRem);
        }
      });

      this.scroll.on("touchEnd", (position) => {
        if (this.scroll.movingDirectionY == 1) {
          this.scroll.stop();
          setTimeout(() => {
            this.scrollTo(0, this.topRem);
          }, 0);
        } else if (this.scroll.movingDirectionY == -1) {
          this.scroll.stop();
          setTimeout(() => {
            this.scrollTo(0, 0);
          }, 0);
        }
      });
    }
    // 嵌套滚动
    if (this.inner == true) {
      this.scroll.on("beforeScrollStart", (_) => {
        if (this.scroll.y > this.h - 20) {
          this.$parent.$parent.scroll.enable();
        } else {
          this.$parent.$parent.scroll.disable();
        }
      });
      this.scroll.on("touchEnd", (_) => {
        setTimeout(() => {
          this.$parent.$parent.scroll.enable();
        }, 10);
      });
    }

    this.$bus.$off("refresh");
    this.$bus.$off("scrollTop");
    this.$bus.$on("refresh", this.refresh);
    this.$bus.$on("scrollTop", this.scrollTo(0, 0));
  },

  methods: {
    scrollTo(x, y, time = 500) {
      this.scroll && this.scroll.scrollTo(x, y * 1, time);
    },
    finishPullUp() {
      this.scroll && this.scroll.finishPullUp();
    },
    refresh() {
      if (this.scroll) {
        setTimeout(() => {
          this.scroll.refresh();
        }, 100);
      }
    },
  },
};
</script>

<style lang="scss">
.wrapper {
  height: 100%;
}
.pointer-none {
  pointer-events: none !important;
}
</style>
