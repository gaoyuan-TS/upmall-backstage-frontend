import Vue from 'vue'
import axios from 'axios' 
import api from './api'
import  {Message} from 'iview';
import myStorage from 'utils/localstore'   //引入二次封装的localStorage
import tips from '../utils/tips'
import {  resetTokenAndClearUser } from '../utils/index'
import router from './../router/index';

let baseUrl = process.env.NODE_ENV === 'development' ? '/api/admin' : '/admin'

// 取消请求
let CancelToken = axios.CancelToken

// const token = myStorage.get('token')
// // 设置默认请求头, 如果每次请求都携带token 建议写在这里 如果不需要可以取消这一步
// axios.defaults.headers = {
//     token
// }

// 请求超时间限制
axios.defaults.timeout = 20000

// 开始设置请求  发起的拦截处理
// config 代表发起请求的参数的实体
// 请求拦截
axios.interceptors.request.use(config => {
    // 得到参数中的requestName字段, 用于决定下次发起请求, 取消对应的相同字段的请求
    // 如果没有requestName就默认添加一个不同的时间戳
    config.headers['token'] =  myStorage.get('token')
    // let requestName
    // if (config.method === 'post') {
    //     if (config.data && config.data.requestName) {
    //         requestName = config.data.requestName
    //     } else {
    //         requestName = new Date().getTime()
    //     }
    // } else {
    //     if (config.params && config.params.requestName) {
    //         requestName = config.params.requestName
    //     } else {
    //         requestName = new Date().getTime()
    //     }
    // }

    // 判断 如果这里拿到的参数中的requestName在上一次请求中已经存在, 就取消上一次的请求
    // if (requestName) {
    //     if (axios[requestName] && axios[requestName].cancel) {
    //         axios[requestName].cancel()
    //     }
    //     config.cancelToken = new CancelToken(c => {
    //         axios[requestName] = {}
    //         axios[requestName].cancel = c
    //     })
    // }
    // Spin.show();
    return config
}, error => {
    console.log(error)
    return Promise.reject(error)
})

// 响应的拦截处理
axios.interceptors.response.use(config => {
    api.hideLoading()  // 隐藏loading
    // 返回请求正确的结果
    // Spin.hide();
 return config
}, error => {
    api.hideLoading()  // 隐藏loading
    // 错误的请求结果处理,这里的代码根据后台的状态码来决定错误的输出信息
    if(error && error.response) {
        switch(error.response.status) {
            case 400:
                error.message = '错误请求'
                break
            case 401:
                error.message = '未授权,请重新登录'
                break
            case 403: 
                error.message = '拒绝访问'
                break
            case 404:
                error.message = '请求错误,未找到该资源'
                break
            case 405:
                error.message = '请求方法为允许'
                break
            case 408:
                error.message = '请求超时'
                break
            case 500:
                error.message = '服务器端出错'
                break
            case 501: 
                error.message = '网络未实现'
                break
            case 502:
                error.message = '网络错误'
                break
            case 503: 
                error.message = '服务不可用'
                break
            case 504:
                error.message = '网络超时'
                break
            case 505:
                error.message = 'http版本不支持该请求'
                break
            default:
                error.message = `连接错误${error.response.status}`
        }
    }else {
        error.message = '连接到服务器失败'
    }
    // Message.error('This is an error tip');
    return Promise.reject(error.message)
})


// 将axios的 get 方法, 绑定到vue上面 $get
/**
 * get 请求方法
 * @param {String} url 传入的路径
 * @param {*} params  传入的参数
 */
Vue.prototype.$get = (url, params,loading=false) => {
    api.showLoading(loading)  // 显示loading
    return new Promise((resolve, reject) => {
        axios.get(baseUrl + url, {
            params
        }).then(res => {
            console.log(res)
            if (Number(res.data.statusCode === 200) || Number(res.data.code === 200)) {
                // 如果code === 200 直接返回结果
                resolve(res.data.data)
            } 
            else {
                loginTimeOut(res.data)
                reject(res)
            }
        }).catch(err => {
            api.hideLoading()  // 隐藏loading
            reject(err)
        })
    })
}




// 将axios的 post 方法, 绑定到vue实例上 $post
/**
  * post 请求方法
  * @param {String} url  传入的路径
  * @param {Object} params  传入的参数
  */  
Vue.prototype.$post = (url, params,loading=false) => {
    api.showLoading(loading)  // 显示loading
    return new Promise((resolve, reject) => {
        axios.post(baseUrl + url, params).then(res => {
            console.log(res)
            if (Number(res.data.statusCode === 200) || Number(res.data.code === 200)) {
                // 如果code === 200  直接返回结果
                resolve(res.data.data)
            } 
            else {
                loginTimeOut(res.data)
                reject({code:500,message:res.data.message})
            }
        }).catch(err => {
            api.hideLoading()  // 隐藏loading
            reject(err)
        })
    })
}

Vue.prototype.$post2 = (url, params,loading=false) => {
    api.showLoading(loading)  // 显示loading
    return new Promise((resolve, reject) => {
        axios.post(baseUrl + url, params).then(res => {
            resolve(res)
        }).catch(err => {
            api.hideLoading()  // 隐藏loading
            reject(err)
        })
    })
}


function loginTimeOut(data){
    console.log(data)
    switch (data.code) {
        case 401:
          alert('登录已经过期，请重新登录')
          setTimeout( () =>{
            resetTokenAndClearUser()
            router.replace('/login')
          }, 500)
          break
          case 500:
            tips.Message("error",    data.message  ||　data.data ,1)
            break
      }
}


// 请求示例
// requestName 为多余的参数 作为请求的标识，下次发起相同的请求，就会自动取消上一次还没有结束的请求
// 比如正常的请求参数只有一个 name: '123'，但是这里我们需要额外再加上一个 requestName
/**
    this.$post(url, { name: '123', requestName: 'post_1' })
        .then(res => {
            console.log(`请求成功：${res}`)
        })
 */


//  导出axios
export default axios