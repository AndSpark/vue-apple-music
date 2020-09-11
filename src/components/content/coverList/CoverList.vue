<template>
  <div class="cover-list">
    <div v-for="item in list" :key="item.id" class="cover">
      <div class="list" @click="sendListId(item.id)">
        <img :src="item.picUrl + '?param=500y500'" @load="$emit('refresh')" />
        <p class="elellipsis">
          <span>{{ item.name }}</span>
        </p>
        <p class="elellipsis">{{ item.creator}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CoverList",
  components: {},
  props: {
    list: {
      type: Array,
    },
  },
  data() {
    return {};
  },
  computed: {},
  methods: {
    sendListId(id) {
      this.$router.push({ name: "ListDetail", params: { id } });
    },
  },
};
</script>

<style lang='scss' scoped>
.cover-list {
  display: flex;
  flex-wrap: wrap;
  .cover {
    flex: auto;
    width: 50%;
    .list {
      text-align: center;
      margin: 1rem 0;
      img {
        width: 95%;
        height: 95%;
        border-radius: 0.5rem;
        border: 1px solid #8a898ea9;
      }
      p {
        text-align: center;
        padding: 0.1rem;
        span {
          color: #111;
          font-size: 1.3rem;
        }
      }
    }
  }
}
</style>