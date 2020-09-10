<template>
  <div class="loader"></div>
</template>

<script>
export default {
  name: "Loading",
};
</script>

<style lang='scss' scoped>
.loader {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: #ff2c55;
  border-right-color: #ff2c55;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>