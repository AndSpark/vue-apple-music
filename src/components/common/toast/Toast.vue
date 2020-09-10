<template>
  <div class="toast" v-show="isShow">
    <p>{{message}}</p>
  </div>
</template>

<script>
export default {
  name: "Toast",
  data() {
    return {
      message: "",
      isShow: false,
    };
  },
  methods: {
    show(message, duration = 2000) {
      this.isShow = true;
      this.message = message;
      setTimeout(() => {
        this.isShow = false;
      }, duration);
    },
  },
};
</script>

<style lang='scss' scoped>
.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 1rem;
  font-size: 1.5rem;
  background-color: rgba($color: #000000, $alpha: 0.5);
  color: #fff;
  border-radius: 5%;
  z-index: 9999;
}
</style>