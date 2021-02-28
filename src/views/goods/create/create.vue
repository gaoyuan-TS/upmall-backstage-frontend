<template>
  <div class="create-good" ref="container">
     <Tabs :value="tabName" @on-click="clickTabName" :animated="false">
        <TabPane label="第一步" name="first" :disabled="tabName !== 'first'">
           <first-step @firstNext="handleFirstNext" :shop-list="shopList"></first-step>
        </TabPane>
        <TabPane label="第二步" name="second" :disabled="tabName !== 'second'">
          <second-step @secondNext="handleSecondNext" @edit="editCategory"></second-step>
        </TabPane>
        <TabPane label="第三步" name="third" :disabled="tabName !== 'third'">
          <third-step v-if="tabName==='third'"></third-step>
        </TabPane>
    </Tabs>
  </div>
</template>

<script>
import FirstStep from './child-comp/FirstStep'
import SecondStep from './child-comp/SecondStep'
import ThirdStep from './child-comp/ThirdStep'
export default {
  // 依赖注入
  provide() {
    return {
      create: this
    }
  },
  name: 'create-good',
  components: {
    FirstStep,
    SecondStep,
    ThirdStep
  },
  data() {
    return {
      tabName: "first",
      type: null,  // 当前页面类型  add新建  edit 编辑
      spuid: null,
      goodInfo: {},
      shopList: []   // 店铺信息
    }
  },
  watch: {
    tabName() {
      this.$nextTick(() => {
        this.$refs.container.scrollIntoView(true)
      })
    }
  },

  created(){
    console.log(this.$route)
    if(this.$route.params.type === 'edit') {
      this.tabName = "second"
    }
    this.getShopList()
  },

  methods: {
    getShopList() {
      this.$get('/shop/pull?shopName=').then(res => {
        this.shopList = res

        console.log(res)
      })
    },
    clickTabName(name) {
      this.tabName = name
    },
    handleFirstNext(value) {
      this.tabName = value
    },
    handleSecondNext(value) {
      this.tabName = value
    },
    editCategory(value) {
      this.tabName = value
    }
  }
}
</script>

<style lang="less" scoped>
.create-good {
  padding: 0 20px 34px;
}
</style>

<style lang="less" scoped>
/deep/.ivu-tabs-tab {
  padding: 18px 35px!important;
}
/deep/.ivu-tabs-tab-active {
  color: @theme-color-s!important;
}
/deep/.ivu-tabs-ink-bar {
  width: 33%;
  background-color: @theme-color-s!important;
}
</style>