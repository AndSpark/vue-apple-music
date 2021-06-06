<template>
  <div class="user">
    <div class="image">
      <img :src="user.avatarUrl" alt />
    </div>
    <p class="name">{{user.nickname}}</p>

    <p class="sign">{{user.signature}}</p>
    <div class="logout" @click="logout">登出</div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
export default {
  name: "User",
  components: {},
  props: {},
  data() {
    return {
      user: null,
    };
  },
  computed: {},
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (!vm.$store.state.user) {
        next("/login");
      } else {
        next();
      }
    });
  },
  created() {
    if (Cookies.get("profile")) this.user = JSON.parse(Cookies.get("profile"));
  },
  methods: {
    logout() {
      Cookies.remove("profile");
      Cookies.remove("MUSIC_U");
      Cookies.remove("__csrf");
      Cookies.remove("NMTID");
			document.cookie = 'MUSIC_U=1'
      this.$store.commit("userClear");
      this.$router.push("/login");
    },
  },
};
</script>

<style lang='scss' scoped>
.user {
  height: calc(100vh - 10rem) !important;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .image {
    text-align: center;
    img {
      width: 30vw;
      border: 5px solid #ff2c5685;
    }
  }

  .name {
    font-size: 3.5rem;
    margin: 2rem 0;
    border-bottom: solid 2px #8a898e65;
    border-radius: 2rem;
    width: 100%;
    text-align: center;
    padding-bottom: 3rem;
  }
  .sign {
    width: 100%;
    padding-top: 3rem;
    font-size: 1.5rem;
    text-align: center;
  }
  .logout {
    margin: 10rem 0 -10rem 0;
    font-size: 3rem;
  }
}
</style>