<template>
  <div class="library">
    <h2>资料库</h2>
    <p
      v-for="list in myLists"
      :key="list.id"
      class="my"
      @click="sendListId(list.id)"
    >{{ list.name }}</p>
    <h3>我的收藏</h3>
    <cover-list :list="collectLists" @refresh="$emit('refresh')"></cover-list>
  </div>
</template>

<script>
import CoverList from "@/components/content/coverList/CoverList";
import { filterList2 } from "@/common/util";
import { getUserPlaylist_ } from "@/network/userInfo";

export default {
  name: "Library",
  components: {
    CoverList,
  },
  props: {},
  data() {
    return {
      myLists: null,
      collectLists: null,
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  created() {
    if (this.user) {
      this.getUserPlaylist_();
    }
  },
  watch: {
    user(n) {
      this.getUserPlaylist_();
    },
  },
  methods: {
    async getUserPlaylist_() {
      let { playlist } = await getUserPlaylist_(this.$store.state.user.uid);
      this.myLists = filterList2(
        playlist.filter((v) => {
          return v.subscribed == false;
        })
      );
      this.collectLists = filterList2(
        playlist.filter((v) => {
          return v.subscribed == true;
        })
      );
      this.$store.commit("sendMyLists", this.myLists);
    },
    sendListId(id) {
      this.$router.push({ name: "ListDetail", params: { id } });
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (!vm.$store.state.user) {
        next("/login");
      } else {
        next();
      }
    });
  },
};
</script>

<style lang="scss" scoped>
.library {
  padding: 0 1.5rem;
  h2 {
    font-size: 3rem;
    color: #333;
    border-bottom: 1px solid #8a898e52;
    padding-bottom: 0.6rem;
  }
  .my {
    color: #ff2c55;
    font-size: 1.3rem;
    line-height: 2.3rem;
    padding: 0.8rem 0;
    border-bottom: 1px solid #8a898e4f;
  }
  h3 {
    font-size: 2rem;
    color: #333;
    padding: 1rem 0;
  }
}
</style>
