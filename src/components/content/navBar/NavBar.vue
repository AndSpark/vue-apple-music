<template>
  <div class="nav-bar">
    <div class="nav-bar-1" :class="{bg:!opacity}" v-if="!search">
      <div>
        <span class="iconfont icon-search" ref="search" @click="searchClick"></span>
        <span class="iconfont icon-icon" ref="option" @click="optionClick"></span>
      </div>
      <div class="slot">
        <slot></slot>
      </div>
    </div>
    <div class="nav-bar-2" v-if="search">
      <div class="search">
        <span class="iconfont icon-back" @click="back"></span>
        <input type="text" placeholder="搜索音乐" v-model="keywords" @input="$emit('input',keywords)" />
      </div>
    </div>
    
  </div>
</template>

<script>
export default {
  name: "NavBar",
  components: {},
  props: {
    opacity: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      search: false,
      keywords: "",
    };
  },
  computed: {},

  methods: {
    searchClick() {
      this.$tap("search");
      this.search = true;
      this.$router.push("/search");
    },
    optionClick() {
      this.$tap("option");
      this.$router.push("/login");
    },
    back() {
      this.search = false;
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="scss" scoped>
.nav-bar-1 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row-reverse;
  height: 4rem;
  margin-bottom: 0.2rem;

  .iconfont {
    position: relative;
    font-size: 2rem;
    color: #ff2c55;
    margin: 0 1rem;
  }
  .slot {
    margin-left: 0.5rem;
  }
}
.nav-bar-2 {
  background: #fff;
  padding: 1rem 1.5rem;
  .search {
    position: relative;
    input {
      width: 100%;
      height: 3rem;
      background-color: #8a898e21;
      border: none;
      border-radius: 5%;
      text-indent: 4rem;
      font-size: 1.4rem;
    }
    span {
      position: absolute;
      color: #ff2c55;
      font-size: 2rem;
      left: 1rem;
      top: 0.5rem;
    }
  }
}
.bg {
  background-color: #fff;
}
</style>
