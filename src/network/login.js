import axios from '@/network/axios'

export function userLogin_(phone,password){
  return axios({
    method:'post',
    url:`/login/cellphone`,
    data:{
      phone,
      password
    }
  })
}

