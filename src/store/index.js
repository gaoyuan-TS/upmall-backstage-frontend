import Vue from 'vue'
import Vuex from 'vuex'

import goods from './modules/goods'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // 左侧菜单栏数据
    menuItems: [
      // {
      //   text: '店铺模块',
      //   type: 'https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/5/29/1bfdb2ac-7407-486e-872f-a5a654b7c219.png',
      //   children: [
      //     {
      //       name: 'shop-list',
      //       text: '店铺列表'
      //     },
      //     {
      //       name: 'create-shop',
      //       text: '新增店铺'
      //     },
      //     {
      //       name: 'detail-shop',
      //       text: '店铺详情',
      //       hidden: true
      //     }
      //   ]
      // },
      {
        text: '供应商模块',
        type: 'https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/5/29/1bfdb2ac-7407-486e-872f-a5a654b7c219.png',
        children: [
          {
            name: 'Supplier-list',
            text: '供应商列表'
          },
          {
            name: 'create-Supplier',
            text: '新增供应商',
            hidden: true
          },
          {
            name: 'detail-Supplier',
            text: '供应商详情',
            hidden: true
          }
        ]
      },
      {
        text: '商品模块',
        type: 'https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/5/29/b67eceab-0cf5-44bc-a596-87ed746531a1.png',
        children: [
          {
            name: 'good-list',
            text: '商品列表'
          },
          {
            name: 'create-good',
            text: '新建商品',
            hidden: true
          },
          {
            name: 'edit-good',
            text: '编辑商品',
            hidden: true
          },
          {
            name: 'content-good',
            text: '推文商品',
            hidden: true
          }
        ]
      },
      {
        text: '订单模块',
        type: 'https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/5/29/e090aa36-41fc-4a6a-8760-bd001560e533.png',
        children: [
          {
            name: 'order-list',
            text: '订单列表'
          },
          // {
          //   name: 'refund-list',
          //   text: '退款列表'
          // },
          // {
          //   name: 'after-list',
          //   text: '售后列表'
          // }
          // ,
          {
            name: 'order-detail',
            text: '订单详情',
            hidden: true
          }
        ]
      },
      {
        text: '营销活动',
        type: 'https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/5/29/e090aa36-41fc-4a6a-8760-bd001560e533.png',
        children: [
          {
            name: 'market-group',
            text: '拼团列表'
          },
          {
            name: 'market-create',
            text: '新建活动',
            hidden: true
          },
          {
            name: 'market-details',
            text: '活动详情',
            hidden: true
          }
          ,
          {
            name: 'market-modification',
            text: '修改活动',
            hidden: true
          }
        ]
      },
      // {
      //   text: '用户模块',
      //   type: 'https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/5/29/2777f208-2557-4e40-9762-00b03ba0ea4c.png',
      //   children: [
      //     {
      //       name: 'user-list',
      //       text: '用户列表'
      //     },
      //     {
      //       name: 'agent-list',
      //       text: '代理商列表'
      //     },
      //     {
      //       name: 'member-list',
      //       text: '会员列表'
      //     }
      //   ]
      // },
      {
        text: '配置模块',
        type: 'https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/5/29/b3fbc46e-3cd6-4f36-9191-3975b91bead8.png',
        children: [
          // {
          //   name: 'mall-set',
          //   text: '商城配置'
          // },
          {
            name: 'category-set',
            text: '分类配置'
          },
          {
            name: 'banner-set',
            text: 'banner配置'
          }
        ]
      },
      // {
      //   text: '营销模块',
      //   type: 'https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/5/29/fd26010a-5b84-4d46-8259-7fb80b718264.png',
      //   children: [
      //     {
      //       name: 'market-advert',
      //       text: '开屏广告'
      //     },
      //     {
      //       name: 'market-push',
      //       text: '营销推送'
      //     },
      //     {
      //       name: 'market-group',
      //       text: '拼团'
      //     }
      //   ]
      // },
      {
        type: 'ios-notifications-outline',
        name: 'msg',
        text: '查看消息',
        hidden: true // 隐藏左侧此菜单 但可以通过在地址栏上输入对应的 URL 来显示页面
      },
      {
        type: 'md-lock',
        name: 'change-password',
        text: '修改密码',
        hidden: true
      },
      {
        type: 'md-person',
        name: 'user-info',
        text: '基本资料',
        hidden: true
      }
    ],
    menuItemsUser:[
      {
        text: '订单模块',
        type: 'https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/5/29/e090aa36-41fc-4a6a-8760-bd001560e533.png',
        children: [
          {
            name: 'Supplier-order-list',
            text: '订单列表'
          },
          // {
          //   name: 'refund-list',
          //   text: '退款列表'
          // },
          // {
          //   name: 'after-list',
          //   text: '售后列表'
          // }
          // ,
          {
            name: 'Supplier-order-detail',
            text: '订单详情',
            hidden: true
          }
        ]
      }
    ]
  },
  mutations: {
    setMenus (state, items) {
      state.menuItems = [...items]
    }
  },
  modules: {
    goods
  }
})

export default store