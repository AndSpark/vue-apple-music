<template>
  <div class="more-detail">
    <p>专辑</p>
    <cover-list :list="list" @refresh="$emit('refresh')"></cover-list>
  </div>
</template>

<script>
import CoverList from "@/components/content/coverList/CoverList";
import { getArtistsAlbum_ } from "@/network/content";
import { filterList4 } from "@/common/util";

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
    this.getArtistsAlbum();
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
  },
  methods: {
    async getArtistsAlbum() {
      let { hotAlbums } = await getArtistsAlbum_(this.id, 20);
      this.list = filterList4(hotAlbums);
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