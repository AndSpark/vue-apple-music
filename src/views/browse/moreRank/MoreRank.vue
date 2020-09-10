<template>
  <div class="more-rank">
    <h2 class="title">排行榜</h2>
    <rank-list
      v-for="(item, index) in rankList1"
      :key="index"
      :rankList="item"
      titleR=" "
      titleL=" "
    ></rank-list>
    <cover-list :list="rankList2"></cover-list>
  </div>
</template>

<script>
import RankList from "@/views/browse/comps/RankList";
import CoverList from "@/components/content/coverList/CoverList";
import { getTopList_ } from "@/network/content";
export default {
  name: "MoreRank",
  components: {
    RankList,
    CoverList,
  },
  props: {},
  data() {
    return {
      rankList1: [],
      rankList2: [],
    };
  },
  created() {
    this.getTopList();
  },
  computed: {},
  methods: {
    async getTopList() {
      let { list } = await getTopList_();
      this.rankList1 = list.splice(0, 4);
      this.rankList2 = list.map((v) => {
        return {
          name: v.name,
          picUrl: v.coverImgUrl,
          id: v.id,
          creator: v.tags.join(","),
        };
      });
    },
  },
};
</script>

<style lang='scss' scoped>
.more-rank {
  .title {
    font-size: 3rem;
    color: #111;
    padding: 0 1.5rem 1.5rem;
  }
  .cover-list {
    padding: 0 1rem;
  }
}
</style>