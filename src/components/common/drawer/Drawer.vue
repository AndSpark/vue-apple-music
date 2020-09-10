<template>
  <div class="wrapper" ref="wrapper" :class="{'pointer-none':!pointer}">
    <div class="content">
      <div
        class="white"
        ref="white"
        :class="{'pointer-none':!pointer}"
        :style="{opacity:pointer ? coverOpcaity : 0}"
        @click="hideDrawer"
      ></div>

      <div ref="section">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from "@better-scroll/core";
export default {
  name: "Drawer",
  components: {},
  props: {
    h: Number,
  },
  data() {
    return {
      bs: null,
      pointer: false,
      contentHeight: 0,
      coverOpcaity: 0,
    };
  },
  mounted() {
    this.bs = new BScroll(this.$refs.wrapper, {
      click: true,
      bounce: false,
    });

    this.contentHeight = -this.$refs.section.offsetHeight;
    this.coverOpcaity = -this.contentHeight / window.innerHeight;

    //自动滚动至边界
    this.bs.on("touchEnd", (position) => {
      if (this.bs.movingDirectionY == 1) {
        this.bs.stop();
        setTimeout(() => {
          this.bs.scrollTo(0, this.contentHeight, 500);
        }, 0);
      } else if (this.bs.movingDirectionY == -1) {
        this.bs.stop();
        setTimeout(() => {
          this.bs.scrollTo(0, 0, 500);
        }, 0);
      }
    });

    this.bs.on("scrollEnd", (p) => {
      if (p.y <= 20 && p.y >= 0) {
        this.pointer = false;
      } else if (p.y == this.contentHeight) {
        this.pointer = true;
      }
    });
  },
  methods: {
    showDrawer() {
      this.pointer = true;
      this.bs.scrollTo(0, this.contentHeight, 500);
    },
    hideDrawer() {
      this.pointer = false;
      this.bs.scrollTo(0, 0, 500);
    },
    refresh() {
      this.contentHeight = -this.$refs.section.offsetHeight;
      this.coverOpcaity = -this.contentHeight / window.innerHeight;
      this.bs.refresh();
    },
  },
};
</script>

<style lang='scss' scoped>
.wrapper {
  z-index: 80;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.pointer-none {
  pointer-events: none !important;
}
.white {
  height: 100vh;
  opacity: 0;
  transition: 0.3s;
  background-color: #333;
}
</style>