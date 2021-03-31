<template>
  <div>
    <div class="login-page">
      <p>用户登录</p>

      <form >
        <input type="text" v-model="phone" placeholder="请输入手机号码" ref="phone">
        <br>
        <input type="password" v-model="password" placeholder="请输入密码" >
      </form>

      <p @click="login" ref="login" class="login">登录</p>
    </div>

    <p ref="res1" class="res1">手机号码不合法</p>
    <p ref="res2" class="res2">{{msg}}</p>

  </div>
</template>

<script>
import {userLogin_} from "@/network/login"
import Cookies from 'js-cookie'
export default {
  name:'Login',
  components:{
  },
  props:{
  },
  data(){
   return {
     phone:'',
     password:'',
     msg:'',
   }
  },
  computed:{
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if(vm.$store.state.user){
        next('/user')
      }else{
      next()
      }
    })
  },
  methods:{
    async login(){
      if(!this.checkPhone()) return ;
      let data = await userLogin_(this.phone,this.password)
      if(data.code !== 200) {
        this.msg = res.message
        setTimeout(() => {
          this.$refs.res2.style.opacity = '0'
        }, 2000);
        this.$refs.res2.style.opacity = '1'
        return ;
      }
      let i = data.cookie.indexOf(';')
      document.cookie = data.cookie.slice(0,i)
      Cookies.set('profile',JSON.stringify(data.profile))
      this.$store.commit('userAdd')
      this.$router.push('/user')
    },

    checkPhone(){
      const regPhone = /^[1][3,4,5,7,8][0-9]{9}$/
      if(!regPhone.test(this.phone)){
        setTimeout(() => {
          this.$refs.res1.style.opacity = '0'
        }, 2000);
        this.$refs.res1.style.opacity = '1'
        return false
      }
      return true
    }
  }
}
</script>

<style lang='scss' scoped>
.login-page{
  height: calc(100vh - 10rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  .login{
    position: relative;
    height: 3.5rem;
    user-select: none;
  }
  p {
    
    font-size: 2.5rem;
  }
  input{
    border: solid 2px #8a898e;
    border-radius: 5px;
    height: 4rem;
    width: 25rem;
    margin: 1rem 0;
    text-align: center;
    font-size: 1.5rem;
  }


}
  .res1 {
    width: 100%;
    top: 70%;
    font-size: 2rem;
    position: absolute;
    opacity:0;
    text-align: center;
    transition: .5s;
  }

  .res2 {
    width: 100%;
    top: 70%;
    font-size: 2rem;
    position: absolute;
    opacity:0;
    text-align: center;
    transition: .5s;
  }
</style>