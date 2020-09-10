<template>
  <div class="more-detail">
    <p>{{title1}}</p>
    <cover-list :list="list1" @refresh="$emit('refresh')"></cover-list>
  </div>
</template>

<script>
import CoverList from "@/components/content/coverList/CoverList";
export default {
  name: "MoreListDetail",
  components: {
    CoverList,
  },
  props: {
    title: {
      type: String,
    },
    list: {
      type: Array,
    },
  },
  data() {
    return {
      title1: "",
      list1: [],
    };
  },
  created() {
    if (this.title) {
      this.title1 = this.title.toString();
      this.list1 = [...this.list];
    }
  },
  activated() {
    if (this.title) {
      this.title1 = this.title.toString();
      this.list1 = [...this.list];
    }
  },
  computed: {},
  methods: {},
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