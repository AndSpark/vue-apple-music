<template>
  <div class="rank-list">
    <div class="rank-title">
      <p>{{titleL}}</p>
      <p @click="$emit('title')">{{titleR}}</p>
    </div>
    <div class="rank-content">
      <img
        :src="rankList.coverImgUrl + '?param=500y500'"
        @load="$emit('refresh')"
        @click="sendListId(rankList.id)"
      />
      <div class="rank-text">
        <h2>{{rankList.name}}</h2>
        <div class="elellipsis">
          <div class="elellipsis" v-for="(item, index) in rankList.tracks" :key="index">
            <p class="elellipsis first">
              <span>{{index + 1 + '.'}}</span>
              <span>{{item.first}}</span>
            </p>
            <span class="elellipsis second">{{item.second}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RankList",
  components: {},
  props: {
    rankList: {
      type: Object,
    },
    titleL: {
      type: String,
      default: "榜单",
    },
    titleR: {
      type: String,
      default: "查看更多",
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
.rank-list {
  border-top: 1px solid #8a898e23;

  background-image: linear-gradient(90deg, white, white, #8a898e21);
  padding-bottom: 1rem;
  .rank-title {
    display: flex;
    justify-content: space-between;
    p {
      font-size: 2rem;
      color: #111;
      padding: 1.5rem;
    }
    p:last-of-type {
      font-size: 1.3rem;
      color: #ff2c55;
      padding-top: 2rem;
    }
  }
  .rank-content {
    display: flex;
    padding: 0 1rem;
    img {
      flex: 1;
      width: 45%;
      border-radius: 5%;
      border: 1px solid #8a898ea9;
    }
    .rank-text {
      flex: 1;
      padding-left: 2rem;
      width: 50%;
      box-sizing: border-box;
      h2 {
        font-size: 1.5rem;
        color: rgb(24, 24, 24);
      }
      div {
        padding: 0.3rem 0;
        .first {
          padding: 0.2rem 0;
          span {
            font-size: 1.3rem;
            color: #111;
          }
        }
        .second {
          padding-left: 1rem;
        }
      }
    }
    @media screen and (min-width: 768px) {
      .rank-text {
        flex: 1;
        padding-left: 2rem;
        h2 {
          font-size: 3rem;
          color: rgb(24, 24, 24);
        }
        div {
          padding: 1rem 0;
          .first {
            padding: 1rem 0.5rem;
            span {
              font-size: 2rem;
              color: #111;
            }
          }
          .second {
            font-size: 1.5rem;
            padding-left: 2rem;
          }
        }
      }
    }
  }
}
</style>