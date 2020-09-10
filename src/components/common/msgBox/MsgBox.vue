<template>
  <div class="msg-box" @click.self="back" v-if="status">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "MsgBox",
  components: {},
  props: {},
  data() {
    return {
      status: false,
    };
  },
  computed: {},
  methods: {
    back() {
      this.status = false;
    },
    show() {
      this.status = true;
    },
  },
};
</script>

<style lang='scss' scoped>
.msg-box {
  position: fixed;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 100;
}
</style>