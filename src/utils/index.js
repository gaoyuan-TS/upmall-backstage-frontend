import { asyncRoutes, resetRouter ,asyncRoutesUser} from '../router'
import myStorage from 'utils/localstore'
/**
 * push子路由
 * @param {Array} children  子路由
 * @param {Object} item  store里的左菜单栏的每个对象
 */
function generateRoutes(children, item,userInfo) {
  
    if (item.name) {
        if(userInfo.role.roleName==='ROLE_MERCHANT'){
            children.push(asyncRoutesUser[item.name])
        }else{
            children.push(asyncRoutes[item.name])
        }

    } else if (item.children) {
        item.children.forEach(e => {
            generateRoutes(children, e,userInfo)
        })
    }
}

/**
 * 将左侧菜单信息转成对应的路由信息 动态添加
 * @param {Array} data   store里面存储的左侧菜单栏数据
 */
export function menusToRoutes(data) {
    const result = []  // 父级路由
    const children = []  // 子路由映射
    let userInfo=JSON.parse( myStorage.get("userInfo"))
    if(userInfo.role.roleName==='ROLE_MERCHANT'){
        result.push({
            path: '/',
            component: () => import('@/layout/index.vue'),
            redirect: '/SupplierOrderList',
            children,
        })
        data.menuItemsUser.forEach(item => {
            generateRoutes(children, item,userInfo)
        })
    }else{
        result.push({
            path: '/',
            component: () => import('@/layout/index.vue'),
            redirect: '/goodlist',
            children,
        })
        data.menuItems.forEach(item => {
            generateRoutes(children, item,userInfo)
        })
    }
   

    

    children.push({
        path: 'error',
        name: 'error',
        component: () => import('@/views/error/error.vue')
    })

    // 最后添加404页面 否则会在登陆成功后跳到404页面
    result.push(
        {path: '*', redirect: '/error'},
    )
    console.log("212112",result)
    return result
}



export function resetTokenAndClearUser() {
    // 退出登陆 清除用户资料
    myStorage.set('token', '')
    myStorage.set('userImg', '')
    myStorage.set('userName', '')
    // 重设路由
    resetRouter()
}