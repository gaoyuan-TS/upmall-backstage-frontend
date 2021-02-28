export default {
  state: {
    choose_category: {  // 已选择分类
      id: "",  // 四级最后一级id
      category: []
    },  
    spu: {
      uniqueCode: "",
      spuName: "",  // 商家名
      spuid: null,  // 商品spuid
      status: null
    },
    shop: {
      shopId: '',  // 商家id
      shopName: '',  // 商家名称
      code: ''   // 商品条形码
    },
    baseProperty: [],  // 基础属性分类
    goodInfo: {},   // 商品详情
    goodSku: [],  // 商品规格
    spuSpec: []    // 一个spu的所有规格
  },

  getters: {
    categoryId(state) {
      return state.choose_category.id
    },

    category(state) {
      return state.choose_category.category
    }
  },

  mutations: {
    setChooseCategory(state,playload) {
      state.choose_category = playload
    },

    setSpu(state,playload) {
      state.spu = playload
    },

    setBaseProperty(state,playload) {
      state.baseProperty = playload
    },

    setGoodInfo(state,playload) {
      state.goodInfo = playload
    },

    setSpuSpec(state,playload) {
      state.spuSpec = playload
    },
    
    setGoodSku(state,playload) {
      state.goodSku = playload
    },

    setShop(state,playload) {
      state.shop = playload
    }
  }
}