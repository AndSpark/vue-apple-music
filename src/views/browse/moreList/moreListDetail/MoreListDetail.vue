<template>
  <div class="more-detail">
    <p>{{title}}</p>
    <cover-list :list="list" @refresh="$emit('refresh')"></cover-list>
  </div>
</template>

<script>
import CoverList from "@/components/content/coverList/CoverList";
import { getHighQualityList_ } from "@/network/content";
import { filterList2 } from "@/common/util";

export default {
  name: "MoreListDetail",
  components: {
    CoverList,
  },
  data() {
    return {
      list: [],
    };
  },
  created() {
    this.getHighQualityList();
  },
  computed: {
    title() {
      return this.$route.params.title;
    },
  },
  methods: {
    async getHighQualityList() {
      let { playlists } = await getHighQualityList_(this.title, 20);
      this.list = filterList2(playlists);
    },
  },
};
</script>

<style lang='scss' scoped>
.more-detail {
  padding: 1rem;
  box-sizing: border-box;
  p {
    font-size: 2.5rem;
    font-weight: 700;
    color: #111;
    padding-left: 0.5rem;
    border-bottom: 1px solid #8a898e65;
    padding-bottom: 1rem;
  }
}
</style>