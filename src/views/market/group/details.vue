<template>
  <div class="details">
    <!-- 活动主题 -->
    <div class="first">
      <span class="subject">活动主题：{{data.activityTitle}}</span>
    </div>
    <!-- 活动日期 -->
    <div class="second">
      <i-col span="8" class="datelist">
        <span class="dat">活动日期：</span>
        <span class="time">{{data.startTime}}---{{data.endTime}}</span>
      </i-col>
      <i-col span="8" class="datelist">
        <span class="type">拼团类型:</span>
        <span class="typelis">{{data.mode === 0?'普通团':data.mode === 1?'抽奖团':'阶梯团'}}</span>
      </i-col>
      <i-col span="8" class="datelist">
        <span class="type">成团有效时间:</span>
        <span class="typelis">{{data.expireHour}}小时</span>
      </i-col>
    </div>
    <div class="third">
      <i-col span="8">
        <span>成团人数：</span>
        <span>{{data.groupCount}}</span>
      </i-col>
      <i-col span="8">
        <span>结算份数：</span>
        <span>{{data.prizeCount}}</span>
      </i-col>
      <i-col span="8">
        <span>奖励金：</span>
        <span>{{data.bounty}}元</span>
      </i-col>
    </div>
    <div class="foth">
      <i-col span="24">
        <div class="division"></div>
      </i-col>
    </div>
    <i-col span="24" class="fifth">
      <span class="commodity">活动指向商品：</span>
      <span class="content">{{goodName}}</span>
    </i-col>
    <div class="picture">
      <span class="activityp">活动主图：</span>
      <a href="#">
        <img :src="data.activityCover" alt style="width:120px;height:120px" />
      </a>
      <span class="activityp1">分享封面：</span>
      <a href="#">
        <img :src="data.shareCover" alt style="width:120px;height:120px" />
      </a>
    </div>
    <div class="explain">
      <span class="explain1">
        活动说明:
        <span class="explain2">{{data.activityDescribe}}</span>
      </span>
    </div>
    <div class="share">
      <i-col span="8">
        <span>分享标题：</span>
        <span>{{data.shareTitle}}</span>
      </i-col>
      <i-col span="8">
        <span>分享描述：</span>
        <span>{{data.shareDesc}}</span>
      </i-col>
      <i-col span="8">
        <span>主页显示权重：</span>
        <span>{{data.weight}}</span>
      </i-col>
    </div>
    <div class="see">
      <i-col span="24" class="footer">
        <span>拼团价格：</span>
          <span class="price" @click="setPrice">查看价格</span>
      </i-col>
    </div>
    <div class="bag"></div>
    <Modal
      title="设置价格"
      v-model="model1"
      class-name="vertical-center-modal"
      width="760"
    >
      <div class="priceBox">
        <!-- 表格 -->
        <table class="table" cellspacing="0" cellpadding="0">
          <thead class="thead">
            <tr>
              <template v-if="colSkuValue.length>0">
                <td
                  v-for="(skuTh,colSku) in colSkuValue"
                  :key="colSku"
                  style="width:7%"
                >{{skuTh.specName}}</td>
              </template>
              <td
                v-for="(th,thIndex) in tableThs"
                :key="thIndex"
                class="thead-th"
                style="width:7%"
              >{{th.name}}</td>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(item,index) in SpecValueList" :key="index">
              <td v-for="(sku,skuIndex) in item.sku.skuSpecValue" :key="skuIndex">{{sku.value}}</td>
              <td>
                <Input v-model="item.grouponStock" disabled />
              </td>
              <td>
                <Input v-model="item.grouponPrice" disabled/>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: "market-details",
  data () {
    return {
      goodName: '',
      spuid: '',
      SpecValueList: [],
      // sku_group: [],
      model1: false,
      tableData: [],
      skuList: [],
      colSkuValue: [],
      spuSpec: [],
      // 表头  -- 默认
      tableThs: [
        { name: "库存" },
        { name: "拼团价" },
      ],
      data: {
        "id": 36,
        "spuId": 233,
        "activityTitle": "洗发露 测试新增",
        "activityCover": "https://315-1256645015.cos.ap-guangzhou.myqcloud.com/group66/10.1.jpg",
        "activityDescribe": "可开团/参团",
        "shareTitle": "快来29.9元拼厚希男士氨基酸洗发露/沐浴露",
        "shareDesc": "快来29.9元拼厚希男士氨基酸洗发露/沐浴露",
        "shareCover": "https://315-1256645015.cos.ap-guangzhou.myqcloud.com/systemGoods/2020.6.13-19/1.2.png",
        "startTime": "2020-06-12 15:00:00",
        "endTime": "2020-06-30 23:59:00",
        "expireHour": 24,
        "createTime": "2020-06-16 15:45:06",
        "weight": 1,
        "mode": 1,
        "groupCount": 5,
        "prizeCount": 3,
        "bounty": 9.98,
        "status": "",
        "skuGrouponPrice": ""
      }
    }
  },
  created () {
    // console.log('111', this.$route.params.spuid)
    this.spuid = this.$route.params.spuid
    this.getGroupInfo(this.spuid)
  },
    watch: {
    "$route.params.spuid"() {
      this.spuid = this.$route.params.spuid
      this.getGroupInfo(this.spuid)
    },
  },
  methods: {
    getGroupInfo (id) {
      this.$get("/grouponActivities/getById/" + id).then(res => {
        console.log(res);
        this.data = res
        this.getGoodsName(this.data.spuId)
      });
    },
    // 商品名称
    getGoodsName (id) {
      this.$get("/spu/getById/" + id).then(res => {
        this.goodName = res.spuName
      });
    },
    // 获取规格名称
    getSpecName () {
      this.$get(`/spuSpec/getBySpu/` + this.data.spuId, false, true).then(res => {
        // console.log("res", res)
        // this.skuList = []
        // this.sku_group = res
        // this.tableData = []
        // if(this.sku_group.length === 0) {
        //   return this.isShowAdd = true
        // }
        let spuSpec = res
        // let list = []
        this.colSkuValue = spuSpec.map(v => {
          let arrObj = {
            specId: v.id,
            specName: v.specName
          }
          return arrObj
        })
        for (let i = 0; i < this.colSkuValue.length - 1; i++) {
          for (let j = 0; j < this.colSkuValue.length - i - 1; j++) {
            if (this.colSkuValue[j].specId > this.colSkuValue[j + 1].specId) {
              //把大的数字放到后面
              let swap = this.colSkuValue[j];
              this.colSkuValue[j] = this.colSkuValue[j + 1];
              this.colSkuValue[j + 1] = swap;
            }
          }
        }
        // console.log('this.colSkuValue',this.colSkuValue)
        // for(let item of spuSpec) {
        //   list.push(item.value)
        // }
        // let arr = Utils.cartesianProductOf(...list)
        // // console.log(arr,'arr')
        // this.tableData = arr.map(v => {   
        //   let arrObj = {
        //     sku: v,
        //     ...this.tableParmas
        //   }
        //   return arrObj
        // })
        // for(let item of arr) {
        //   this.skuList.push(item)
        // }
        console.log('colSkuValue', this.colSkuValue)
      })
    },
    // 获取拼团价
    getGrouponPrice () {
      this.$get('/skuGrouponPrice/getByActivitiesId/' + this.spuid, false, true).then(res => {
        // console.log('获取拼团价',res)
        this.SpecValueList = res
        for (let l = 0; l < this.SpecValueList.length; l++) {
          for (let g = 0; g < this.SpecValueList[l].sku.skuSpecValue.length - 1; g++) {
            for (let h = 0; h < this.SpecValueList[l].sku.skuSpecValue.length - g - 1; h++) {
              if (this.SpecValueList[l].sku.skuSpecValue[h].specId > this.SpecValueList[l].sku.skuSpecValue[h + 1].specId) {
                //把大的数字放到后面
                let swap2 = this.SpecValueList[l].sku.skuSpecValue[h];
                this.SpecValueList[l].sku.skuSpecValue[h] = this.SpecValueList[l].sku.skuSpecValue[h + 1];
                this.SpecValueList[l].sku.skuSpecValue[h + 1] = swap2;
              }
            }
          }
        }
        console.log('this.SpecValueList', this.SpecValueList)
      })
    },
    // 设置价格弹窗
    setPrice () {
      this.getSpecName()
      this.getGrouponPrice()
      this.model1 = true
    },
  }
}

</script>

<style lang="less" scoped>
.details {
  width: 1457px;
  height: 790px;
  background: #ffffff;
  border: 1px solid #d3d7da;
  position: relative;
  .ivu-col-span-8 {
    align-items: center;
  }
  .first {
    width: 620px;
    height: 22px;
    font-size: 16px;
    font-family: PingFangSC, PingFangSC-Medium;
    font-weight: 600;
    text-align: left;
    color: #262626;
    line-height: 22px;
    margin-top: 31px;
    margin-left: 35px;
  }
  .second {
    margin-top: 39px;
    margin-left: 35px;
    height: 22px;
    font-size: 14px;
    text-align: left;
    .dat {
      width: 70px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.85);
      line-height: 22px;
    }
    .time {
      width: 312px;
      font-family: HelveticaNeue;
      color: rgba(0, 0, 0, 0.65);
      line-height: 22px;
    }
    .type {
      width: 70px;
      height: 22px;
      font-size: 14px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      text-align: left;
      color: rgba(0, 0, 0, 0.85);
    }
    .typelis {
      width: 42px;
      height: 22px;
      font-size: 14px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      text-align: left;
      color: rgba(0, 0, 0, 0.65);
    }
  }
  .see {
    margin-left: 35px;
    margin-top: 38px;
    .price {
      width: 56px;
      height: 22px;
      font-size: 14px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      text-decoration: underline;
      text-align: left;
      color: #1890ff;
      line-height: 22px;
      cursor: pointer;
    }
    .footer {
      margin-top: 35px;
    }
  }
}

.third {
  margin-top: 29px;
  margin-left: 35px;
}
.division {
  width: 1400px;
  height: 1px;
  background: #f0f0f0;
  margin-top: 29px;
  margin-left: 23px;
}
.fifth {
  margin-top: 29px;
  margin-left: 35px;
  margin-bottom: 45px;
  .content {
    width: 391px;
    height: 44px;
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: left;
    color: rgba(0, 0, 0, 0.65);
    line-height: 22px;
  }
}

.picture .activityp {
  margin-left: 35px;
}
.picture .activityp1 {
  margin-left: 350px;
}
.explain {
  margin-top: 45px;
  margin-left: 35px;
  .explain1 {
    width: 70px;
    height: 22px;
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: left;
    color: rgba(0, 0, 0, 0.85);
    line-height: 22px;
  }
  .explain2 {
    width: 391px;
    height: 154px;
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: left;
    color: rgba(0, 0, 0, 0.65);
    line-height: 22px;
    display: block;
  }
}
.share {
  margin-top: 29px;
  margin-left: 35px;
}

.bag {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
  display: none;
}
.b-price {
  width: 802px;
  height: 520px;
  background: #cccccc;
  position: absolute;
  margin: -525px 537px 370px 240px;
}
.b-head {
  height: 53px;
  line-height: 53px;
}
.table {
  width: 100%;
  // margin-top: 60px;
  text-align: center;
  .thead {
    line-height: 50px;
    background: @bd-color-ss;
    text-align: center;
    color: #252525;
  }
}
table,
table tr th,
table tr td {
  border: 1px solid #f0f0f0;
}
</style>