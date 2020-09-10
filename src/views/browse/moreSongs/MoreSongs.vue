<template>
  <div class="more-songs">
    <h2 class="title">新歌速递</h2>
    <div class="options" ref="options">
      <span :class="{checked:checked == 0}" @click="getNewSongs(0)">全部</span>
      <span :class="{checked:checked == 7}" @click="getNewSongs(7)">华语</span>
      <span :class="{checked:checked == 96}" @click="getNewSongs(96)">欧美</span>
      <span :class="{checked:checked == 8}" @click="getNewSongs(8)">日本</span>
      <span :class="{checked:checked == 16}" @click="getNewSongs(16)">韩国</span>
    </div>
    <list-item :playlist="list"></list-item>
  </div>
</template>

<script>
import ListItem from "@/components/content/listItem/ListItem";
import { getNewSongs_ } from "@/network/content";
import { filterList3 } from "@/common/util";

export default {
  name: "MoreSongs",
  components: {
    ListItem,
  },
  props: {},
  data() {
    return {
      list0: [],
      list7: [],
      list8: [],
      list16: [],
      list96: [],
      checked: 0,
    };
  },
  computed: {
    list() {
      switch (this.checked) {
        case 0:
          return this.list0;
        case 7:
          return this.list7;
        case 8:
          return this.list8;
        case 16:
          return this.list16;
        case 96:
          return this.list96;
      }
    },
  },
  created() {
    this.getNewSongs(0);
  },
  methods: {
    async getNewSongs(n) {
      let { data } = await getNewSongs_(n);
      filterList3(data).then((list) => {
        switch (n) {
          case 0:
            this.list0 = list;
            break;
          case 7:
            this.list7 = list;
            break;
          case 96:
            this.list96 = list;
            break;
          case 8:
            this.list8 = list;
            break;
          case 16:
            this.list16 = list;
            break;
          default:
            break;
        }
      });
      this.checked = n;
    },
  },
};
</script>

<style lang='scss' scoped>
.more-songs {
  .title {
    font-size: 3rem;
    color: #111;
    padding: 0 1.5rem 1.5rem;
  }
  .options {
    display: flex;
    border-top: 1px solid #8a898e23;
    padding-top: 1rem;
    align-items: baseline;
    span {
      flex: 1;
      text-align: center;
      font-size: 1.5rem;
      color: #111;
    }
    .checked {
      color: #ff2c55;
      font-size: 2rem;
    }
  }
  .list-item {
    padding: 1rem;
  }
}
</style>