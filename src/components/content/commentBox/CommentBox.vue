<template>
  <msg-box ref="msgBox" v-if="this.$store.state.user">
    <div class="comment-box">
      <p class="user">{{ name }} :</p>
      <p v-if="info.comment" class="reply">@{{ info.comment.name }} :</p>
      <textarea
        placeholder="在此输入评论..."
        cols="30"
        rows="8"
        maxlength="120"
        v-model="words"
        :class="{ pd: info.comment }"
      ></textarea>
      <p>
        <span v-if="info.comment" @click="sendComment">回复</span>
        <span v-else @click="sendComment">发送</span>
      </p>
    </div>
  </msg-box>
</template>

<script>
import MsgBox from "@/components/common/msgBox/MsgBox";
import { sendComment_ } from "@/network/content";
export default {
  name: "CommentBox",
  components: {
    MsgBox,
  },
  props: {
    info: Object,
  },
  data() {
    return {
      words: "",
    };
  },
  computed: {
    name() {
      return this.$store.state.user.nickname;
    },
    type() {
      if (this.info.song.mv) return 1;
      return 0;
    },
  },
  methods: {
    show() {
      this.$refs.msgBox.show();
    },
    back() {
      this.$refs.msgBox.back();
    },
    sendComment() {
      if (this.info.comment) {
        sendComment_(
          2,
          this.type,
          this.info.song.id,
          this.words,
          this.info.comment.commentId
        ).then((res) => {
          if (res.code != 200) return this.$toast.show("回复失败了");
          this.$toast.show("回复成功");
          this.words = "";
          this.back();
          this.$parent.$refs.view.replyComment(res.comment, this.info.comment);
        });
      } else {
        sendComment_(1, this.type, this.info.song.id, this.words).then(
          (res) => {
            if (res.code != 200) return this.$toast.show("评论失败了");
            this.$toast.show("评论成功");
            this.words = "";

            this.back();

            this.$parent.$refs.view.replyComment(res.comment);
          }
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.comment-box {
  box-sizing: border-box;
  padding: 1rem;
  width: 80%;
  height: 30%;
  background-color: #fff;
  border-radius: 5%;
  border: 1px solid #8a898e69;
  box-shadow: 0 0 10px 2px #8a898e;
  z-index: 111;
  .user {
    color: #ff7675;
    font-size: 1.3rem;
    padding: 0.5rem;
    padding-top: 0;
  }
  .reply {
    position: absolute;
    padding: 0.5rem;
  }
  textarea {
    box-sizing: border-box;
    border: 1px solid #8a898e69;
    border-radius: 0.5rem;
    width: 100%;
    height: 13rem;
    resize: none;
    padding: 0.5rem;
    text-indent: 2.4rem;
    &:focus {
      outline: none;
      border: 1px solid #2e7fb669;
      border-radius: 0.5rem;
      padding: 0.5rem;
      text-indent: 2.4rem;
    }
  }
  .pd {
    padding-top: 2rem;
    &:focus {
      padding-top: 2rem;
    }
  }
  p:last-of-type {
    direction: rtl;
    padding: 1rem;
    span {
      border: 1px solid #8a898e69;
      padding: 0.3rem;
      border-radius: 0.5rem;
      color: #111;
    }
  }
}
</style>
