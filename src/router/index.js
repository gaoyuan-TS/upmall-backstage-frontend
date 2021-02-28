import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const commonRoutes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('views/login/login.vue')
    }
]

// 需要动态生成路由
export const asyncRoutes = {
    // 店铺模块 - 店铺列表
    'shop-list': {
        path: 'shopList',
        name: 'shop-list',
        component: () => import('views/shop/list/list.vue'),
        meta: { title: '店铺列表', breadNumber: 1 }  // 设置面包屑等级
    },


    // 店铺模块 - 新建店铺
    'create-shop': {
        path: 'createShop',
        name: 'create-shop',
        component: () => import('views/shop/create/create.vue'),
        meta: { title: '新建店铺', breadNumber: 1 }  // 设置面包屑等级
    },

    // 店铺模块 - 商品详情
    'detail-shop': {
        path: 'detailShop',
        name: 'detail-shop',
        component: () => import('views/shop/detail/detail.vue'),
        meta: {title: '店铺详情',breadNumber: 1}  // 设置面包屑等级
    },
    // 供应商模块 - 供应商列表
    'Supplier-list': {
        path: 'SupplierList',
        name: 'Supplier-list',
        component: () => import('views/Supplier/list/listSupplier.vue'),
        meta: { title: '供应商列表', breadNumber: 1 }  // 设置面包屑等级
    },


    // 供应商模块 - 新建供应商
    'create-Supplier': {
        path: 'createSupplier/:id',
        name: 'create-Supplier',
        component: () => import('views/Supplier/create/createSupplier.vue'),
        meta: { title: '新建供应商', breadNumber: 1 }  // 设置面包屑等级
    },

    // 供应商模块 - 商品详情
    'detail-Supplier': {
        path: 'detailSupplier/:id',
        name: 'detail-Supplier',
        component: () => import('views/Supplier/detail/detailSupplier.vue'),
        meta: {title: '供应商详情',breadNumber: 1}  // 设置面包屑等级
    },

      // 商品模块 - 商品推文
      'content-good': {
        path: 'contentGood/:id',
        name: 'content-good',
        component: () => import('views/goods/list/edit/contentGood.vue'),
        meta: { title: '推文', breadNumber: 1 }  // 设置面包屑等级
    },

    // 商品模块 - 商品列表
    'good-list': {
        path: 'goodList',
        name: 'good-list',
        component: () => import('views/goods/list/list.vue'),
        meta: { title: '商品列表', breadNumber: 1 }  // 设置面包屑等级
    },

    // 商品模块 - 商品列表
    'order-detail': {
        path: 'orderDetail/:orderId',
        name: 'order-detail',
        component: () => import('views/order/list/orderDetail.vue'),
        meta: { title: '订单详情', breadNumber: 1 }  // 设置面包屑等级
    },
    // 商品模块 - 商品列表  - 编辑商品
    'edit-good': {
        path: 'editGood',
        name: 'edit-good',
        component: () => import('views/goods/list/edit'),
        meta: { title: '编辑商品', breadNumber: 2 }  // 设置面包屑等级
    },

    // 商品模块 - 新建商品
    'create-good': {
        path: 'createGood/:type/:shopId',
        name: 'create-good',
        component: () => import('views/goods/create/create.vue'),
        meta: { title: '新建商品', breadNumber: 1 }  // 设置面包屑等级
    },

    // 订单模块 - 订单列表
    'order-list': {
        path: 'orderList',
        name: 'order-list',
        component: () => import('views/order/list/list.vue'),
        meta: { title: '订单列表', breadNumber: 1 }  // 设置面包屑等级
    },

    // 订单模块 - 退款列表
    'refund-list': {
        path: 'refundList',
        name: 'refund-list',
        component: () => import('views/order/refund/list.vue'),
        meta: { title: '退款列表', breadNumber: 1 }  // 设置面包屑等级
    },

    // 订单模块 - 售后列表
    'after-list': {
        path: 'afterList',
        name: 'after-list',
        component: () => import('views/order/after-sale/list.vue'),
        meta: { title: '售后列表', breadNumber: 1 }  // 设置面包屑等级
    },

    // 用户模块 - 用户列表
    'user-list': {
        path: 'userList',
        name: 'user-list',
        component: () => import('views/user/list/list.vue'),
        meta: { title: '用户列表', breadNumber: 1 }  // 设置面包屑等级
    },

    // 用户模块 - 代理商列表
    'agent-list': {
        path: 'agentList',
        name: 'agent-list',
        component: () => import('views/user/agent/list.vue'),
        meta: { title: '用户列表', breadNumber: 1 }  // 设置面包屑等级
    },

    // 用户模块 - 会员列表
    'member-list': {
        path: 'memberList',
        name: 'member-list',
        component: () => import('views/user/member/list.vue'),
        meta: { title: '用户列表', breadNumber: 1 }  // 设置面包屑等级
    },

    // 配置模块 - 商城配置
    'mall-set': {
        path: 'mallSet',
        name: 'mall-set',
        component: () => import('views/configure/mall/set.vue'),
        meta: { title: '商城配置', breadNumber: 1 }  // 设置面包屑等级
    },

    // 配置模块 - 分类配置
    'category-set': {
        path: 'categorySet',
        name: 'category-set',
        component: () => import('views/configure/category/set.vue'),
        meta: { title: '分类配置', breadNumber: 1 }  // 设置面包屑等级
    },
        // 配置模块 - banner配置
        'banner-set': {
            path: 'bannerSet',
            name: 'banner-set',
            component: () => import('views/configure/bannerset/bannerSet.vue'),
            meta: { title: 'banner配置', breadNumber: 1 }  // 设置面包屑等级
        },

    // 营销模块 - 开屏广告
    'market-advert': {
        path: 'marketAdvert',
        name: 'market-advert',
        component: () => import('views/market/advert/advert.vue'),
        meta: { title: '开屏广告', breadNumber: 1 }  // 设置面包屑等级
    },

    // 营销模块 - 营销推送
    'market-push': {
        path: 'marketPush',
        name: 'market-push',
        component: () => import('views/market/push/push.vue'),
        meta: { title: '营销推送', breadNumber: 1 }  // 设置面包屑等级
    },

    // 营销模块 - 拼团
    'market-group': {
        path: 'marketGroup',
        name: 'market-group',
        component: () => import('views/market/group/group.vue'),
        meta: { title: '拼团', breadNumber: 1 }  // 设置面包屑等级
    },
    // 营销模块 - 新建活动
    'market-create': {
        path: 'marketCreate',
        name: 'market-create',
        component: () => import('views/market/group/create.vue'),
        meta: { title: '新建活动', breadNumber: 2 }  // 设置面包屑等级
    },
    // 营销模块 - 修改活动
    'market-modification': {
        path: 'marketModification',
        name: 'market-modification',
        component: () => import('views/market/group/modification.vue'),
        meta: { title: '修改活动', breadNumber: 2 }  // 设置面包屑等级
    },
    // 营销模块 - 活动详情
    'market-details': {
        path: 'marketDetails/:spuid',
        name: 'market-details',
        component: () => import('views/market/group/details.vue'),
        meta: { title: '活动详情', breadNumber: 2 }  // 设置面包屑等级
    },
    // 修改密码
    'change-password': {
        path: 'changePassword',
        name: 'change-password',
        component: () => import('views/changePassword/changePassword.vue'),
        meta: { title: '修改密码', breadNumber: 1 }
    },
    'msg': {
        path: 'msg',
        name: 'msg',
        component: () => import('../views/Msg.vue')
    },

    // 基本资料
    'user-info': {
        path: 'userInfo',
        name: 'user-info',
        component: () => import('views/userInfo/userInfo.vue'),
        meta: { title: '基本资料', breadNumber: 1 }
    }
}

export const asyncRoutesUser = {
    // 订单模块 - 订单列表
    'Supplier-order-list': {
        path: 'SupplierOrderList',
        name: 'Supplier-order-list',
        component: () => import('views/Supplier/order/list/list.vue'),
        meta: { title: '订单列表', breadNumber: 1 }  // 设置面包屑等级
    },
     // 商品模块 - 商品列表
     'Supplier-order-detail': {
        path: 'SupplierOrderDetail/:orderId',
        name: 'Supplier-order-detail',
        component: () => import('views/Supplier/order/orderDetail.vue'),
        meta: { title: '订单详情', breadNumber: 1 }  // 设置面包屑等级
    }
}

const createRouter = () => new Router({
    routes: commonRoutes
})

const router = createRouter()

export function resetRouter () {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher
}

const originalPush = Router.prototype.push
Router.prototype.replace  = function replace(location) {
   return originalPush.call(this, location).catch(err => err)
}

export default router