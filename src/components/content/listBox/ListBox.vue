<template>
  <msg-box ref="msgBox">
    <div class="list-box">
      <h2>添加到歌单</h2>
      <scroll ref="scroll" class="scroll">
        <div class="list">
          <p
            v-for="list in myLists"
            :key="list.id"
            class="my"
            @click="addToList('add',list.id,songId)"
          >{{ list.name }}</p>
        </div>
      </scroll>
    </div>
  </msg-box>
</template>

<script>
import MsgBox from "@/components/common/msgBox/MsgBox";

import Scroll from "@/components/content/scroll/Scroll";
import { filterList2 } from "@/common/util";
import { getUserPlaylist_ } from "@/network/userInfo";
import { playlistTracks_ } from "@/network/content";
export default {
  name: "ListBox",
  components: {
    MsgBox,
    Scroll,
  },
  props: {
    songId: String,
  },
  data() {
    return {
      myLists: [],
    };
  },
  computed: {},
  created() {
    if (this.$store.state.user) this.getUserPlaylist_();
  },
  watch: {
    songId(n) {
      setTimeout(() => {
        this.$refs.scroll.refresh();
      }, 100);
    },
  },
  methods: {
    show() {
      this.$refs.msgBox.show();
    },
    back() {
      this.$refs.msgBox.back();
    },
    async getUserPlaylist_() {
      let { playlist } = await getUserPlaylist_(this.$store.state.user.uid);
      this.myLists = filterList2(
        playlist.filter((v) => {
          return v.subscribed == false;
        })
      );
      return Promise.resolve();
    },
    async addToList(op, pid, tracks) {
      let res = await playlistTracks_(op, pid, tracks);
      if (res.status != 200) {
        this.$toast.show("添加失败");
        return this.back();
      } else if (res.body.code != 200) {
        this.$toast.show(res.body.message);
        return this.back();
      }
      this.$toast.show("添加成功");
      this.$store.commit("needRefreshList", pid);
      if (this.$route.name == "ListDetail") {
        this.$parent.$refs.view.getListDetail();
      }
      return this.back();
    },
  },
};
</script>

<style lang='scss' scoped>
.list-box {
  box-sizing: border-box;
  width: 80%;
  height: 40%;
  background-color: #fff;
  border-radius: 5%;
  padding: 1rem;
  border: 1px solid #8a898e69;
  box-shadow: 0 0 10px 2px #8a898e;
  overflow: hidden;
  h2 {
    font-size: 2rem;
    color: #111;
    border-bottom: 1px solid #8a898e4f;
    padding-bottom: 1rem;
  }
  .list {
    padding-bottom: 1rem;
    .my {
      color: #ff2c55;
      font-size: 1.4rem;
      line-height: 1.8rem;
      padding: 0.6rem 0;
      border-bottom: 1px solid #8a898e4f;
    }
  }
  .scroll {
    height: 80%;
    overflow: hidden;
  }
}
</style>