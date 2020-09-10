<template>
  <div id="app" >
    <router-view ></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  data(){
    return {
    }
  },
  components:{
  }
};
</script>

<style lang="scss">
#app{
  height: 100vh;
  overflow: hidden;
}
@import url("./assets/css/normalize.css");
@import url("./assets/css/base.css");

</style>;
