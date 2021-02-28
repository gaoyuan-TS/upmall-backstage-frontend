import router from './router'
import store from './store'
import { menusToRoutes, resetTokenAndClearUser } from './utils'
import myStorage from 'utils/localstore'
import { LoadingBar } from 'iview'
import axios from 'axios'

// 是否有菜单数据
let hasMenus = false
router.beforeEach(async (to, from, next) => {
    LoadingBar.start()
    if (myStorage.get('token')) {
        if (to.path === '/login') {
            next({path: '/'})
        } else {
            if (hasMenus) {
                next()
            } else {
                try {
                    // 这里可以用 await 配合请求后台数据来生成路由
                    // const data = await axios.get('xxx')
                    // const routes = menusToRoutes(data)
                    // console.log(  myStorage.get("userInfo"))
                
              
                    // ROLE_MERCHANT
                    let routes = menusToRoutes(store.state)
                    // const routes = menusToRoutes(store.state.agent)
                    // 动态添加路由
                    console.log("routes",routes)
                    router.addRoutes(routes)
                    hasMenus = true
                    next({path: to.path || '/'})
                } catch (error) {
                    resetTokenAndClearUser()
                    next(`/login?redirect=${to.path}`)
                }
            }
        }
    } else {
        hasMenus = false
        if (to.path === '/login') {
            next()
        } else {
            next(`/login?redirect=${to.path}`)
        }
    }
})

router.afterEach(() => {
    LoadingBar.finish()
})