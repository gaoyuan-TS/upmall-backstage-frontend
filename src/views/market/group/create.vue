<template>
  <div class="Newcreate">
    <div class="activity">
      <div class="search">
        <Row>
          <i-col span="8" class="searchLine">
            <span class="searchBox">活动主题:</span>
            <Input
              v-model="createInfo.activityTitle"
              placeholder="请输入 (不多于100字)"
              class="txt"
              clearable
              maxlength="100"
            />
          </i-col>
          <i-col span="8" class="searchLine">
            <span class="searchBox">活动日期:</span>
            <Date-picker
              type="datetimerange"
              split-panels
              placeholder="选择日期和时间"
              class="txt"
              format="yyyy-MM-dd HH:mm:ss"
              @on-change="handleFinishTime"
            ></Date-picker>
          </i-col>
          <i-col span="8" class="searchLine">
            <span class="searchBox">拼团方式：</span>
            <Select v-model="createInfo.mode" class="txt">
              <i-option
                v-for="(item,index) in type"
                :value="item.value"
                :key="index"
              >{{ item.label }}</i-option>
            </Select>
          </i-col>
        </Row>

        <Row>
          <i-col span="8" class="searchLine">
            <span class="searchBox">成团有效时间:</span>
            <Input
              v-model="createInfo.expireHour"
              placeholder="请输入（以小时为基础单位）"
              class="txt"
              clearable
              type="number"
            />
          </i-col>
          <i-col span="8" class="searchLine">
            <span class="searchBox">成团人数:</span>
            <Input
              v-model="createInfo.groupCount"
              placeholder="请输入"
              class="txt"
              clearable
              type="number"
            />
          </i-col>
          <i-col span="8" class="searchLine">
            <span class="searchBox">结算份数:</span>
            <Input
              v-model="createInfo.prizeCount"
              placeholder="请输入"
              class="txt"
              clearable
              type="number"
            />
          </i-col>
        </Row>

        <Row>
          <i-col span="8" class="searchLine" v-if="Number(this.createInfo.mode) === 0">
            <span class="searchBox">奖励金：</span>
            <Input
              v-model="value1"
              placeholder="请输入奖励金(元)"
              class="txt"
              clearable
              disabled
              type="number"
            />
          </i-col>
          <i-col span="8" class="searchLine" v-else>
            <span class="searchBox">奖励金：</span>
            <Input
              v-model="createInfo.bounty"
              placeholder="请输入奖励金额(元)"
              class="txt"
              clearable
              type="number"
            />
          </i-col>
          <i-col span="8" class="searchLine">
            <span class="searchBox">活动指向商品:</span>
            <Select
              v-model="createInfo.spuId"
              filterable
              remote
              :remote-method="remoteMethod1"
              :loading="loading1"
              class="txt"
              @on-change="getGoodsSpuid"
            >
              <Option
                v-for="(optio1, index1) in options1"
                :value="optio1.value"
                :key="index1"
              >{{optio1.label}}</Option>
            </Select>
          </i-col>
          <i-col span="8" class="searchLine">
            <span class="searchBox">拼团价格:</span>
            <span @click="setPrice" class="price" style="margin-left:12px">设置价格</span>
          </i-col>
        </Row>

        <Row>
          <i-col span="8" class="searchLine">
            <span class="searchBox">限制人群:</span>
            <Select v-model="createInfo.userLimit" class="txt">
              <i-option
                v-for="(item4,index4) in astrict"
                :value="item4.value"
                :key="index4"
              >{{ item4.label }}</i-option>
            </Select>
          </i-col>
          <i-col span="8" class="searchLine">
            <span class="searchBox">限制购买数量:</span>
            <Input
              v-model="createInfo.maxBuyCount"
              placeholder="请输入限购数量"
              class="txt"
              clearable
              type="number"
            />(0:无限制)
          </i-col>
          <i-col span="8" class="searchLine">
          </i-col>
        </Row>

        <Row>
          <i-col span="8" class="searchLine">
            <span class="searchBox">活动主图：</span>
            <Upload
              action="http://zs-beta.cntracechain.com/imageService/file/upload"
              :format="['jpg','jpeg','png']"
              :on-remove="removeActivityCover"
              :on-success="uploadActivityCover"
            >
              <Button icon="ios-cloud-upload-outline" style="margin-left:8px;">限JPG,JPEG,,PNG</Button>
            </Upload>
          </i-col>
          <i-col span="8" class="searchLine">
            <span class="searchBox">分享封面：</span>
            <Upload
              action="http://zs-beta.cntracechain.com/imageService/file/upload"
              :format="['jpg','jpeg','png']"
              :on-remove="removeShareCover"
              :on-success="uploadShareCover"
            >
              <Button icon="ios-cloud-upload-outline" style="margin-left:8px;">限JPG,JPEG,,PNG</Button>
            </Upload>
          </i-col>
          <i-col span="8" class="searchLine"></i-col>
        </Row>
        <Row>
          <i-col span="24" class="searchLine">
            <span class="searchBox">活动说明：</span>
            <Input
              v-model="createInfo.activityDescribe"
              type="textarea"
              :rows="4"
              class="txts"
              clearable
            />
          </i-col>
        </Row>
        <Row>
          <i-col span="8" class="searchLine">
            <span class="searchBox">分享标题：</span>
            <Input
              v-model="createInfo.shareTitle"
              placeholder="请输入（分享至好友/微信群）"
              class="txt"
              maxlength="30"
              clearable
            />
          </i-col>
          <i-col span="8" class="searchLine">
            <span class="searchBox">分享描述：</span>
            <Input v-model="createInfo.shareDesc" maxlength="30" placeholder="请输入（分享朋友圈）" class="txt" clearable />
          </i-col>
          <i-col span="8" class="searchLine">
            <span class="searchBox">主页显示权重：</span>
            <Input
              v-model="createInfo.weight"
              placeholder="请输入"
              class="txt"
              clearable
              type="number"
            />
          </i-col>
        </Row>
      </div>
    </div>
    <div class="footer">
      <Button type="info" class="sure" @click="submit">确定</Button>
      <Button type="error" @click="back">返回</Button>
    </div>
    <Modal
      title="设置价格"
      v-model="model1"
      class-name="vertical-center-modal"
      width="760"
      @on-ok="setSpec"
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
              <td v-for="(sku,skuIndex) in item.skuSpecValue" :key="skuIndex">{{sku.value}}</td>
              <td>
                <Input v-model="item.grouponStock" disabled />
              </td>
              <td>
                <Input v-model="item.grouponPrice" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Modal>
  </div>
</template>

<script>
import Utils from 'utils/utils.js'
export default {
  name: 'market-create',
  data () {
    return {
      astrict:[
                {
          value: 0,
          label: "不限制"
        },
                        {
          value: 1,
          label: "新用户"
        },
                        {
          value: 2,
          label: "老用户"
        }
      ],
      tableParmas: {
        spuId: "",  // 商品spuid
        grouponPrice: 0,  // 拼团价
        stock: 0,  // 库存
      },
      SpecValueList: [],
      sku_group: [],
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
      FinishTime: [],
      list: [],
      options1: [],
      loading1: false,
      type: [
        {
          value: 0,
          label: "普通团"
        },
        {
          value: 1,
          label: "抽奖团"
        },
        {
          value: 2,
          label: "阶梯团"
        }
      ],
      createInfo: {
        "spuId": '',
        "activityTitle": "",
        "activityCover": "",
        "activityDescribe": "",
        "shareTitle": "",
        "shareDesc": "",
        "shareCover": "",
        "startTime": "",
        "endTime": "",
        "expireHour": '',
        "weight": 1,
        "mode": 0,
        "groupCount": '',
        "prizeCount": '',
        "bounty": '',
        "userLimit":0,
        "maxBuyCount":0,
        "skuGrouponPrice": [
        ]
      },
      cityList: [
        {
          value: 'Zhuti1',
          label: '主题1'
        },
        {
          value: 'Zhuti2',
          label: '主题2'
        }
      ],
      value1:0
    }
  },
  methods: {
    back () {
      this.$router.push({ name: 'market-group', params: { type: 'add' } })
    },
    // 时间戳
    handleFinishTime (date) {
      // 结单
      for (let item2 of date) {
        if (!item2) {
          this.filterParam.startDate = item2
          this.filterParam.endDate = item2
          return
        }
      }
      this.createInfo.startTime = date[0]
      this.createInfo.endTime = date[1]
    },
    // 活动文件上传
    uploadActivityCover (response, file, fileList) {
      // console.log(response)
      if (response.code === 200) {
        this.$Message.success(response.message)
        this.createInfo.activityCover = response.data.url
      } else {
        this.$Message.error("上传失败")
      }
    },
    // 删除活动主图
    removeActivityCover (file, fileList) {
      // console.log(file, fileList)
      this.createInfo.activityCover = ''
    },
    // 分享文件上传
    uploadShareCover (response, file, fileList) {
      // console.log(response)
      if (response.code === 200) {
        this.$Message.success(response.message)
        this.createInfo.shareCover = response.data.url
      } else {
        this.$Message.error("上传失败")
      }
    },
    // 删除分享主图
    removeShareCover (file, fileList) {
      // console.log(file, fileList)
      this.createInfo.shareCover = ''
    },
    // 远程搜索商品
    remoteMethod1 (query) {
      // console.log(query)
      if (query !== '') {
        this.loading1 = true
        let quer = query.replace(/(^\s*)|(\s*$)/g, '')
        this.$get('/spu/keywords?name=' + quer).then((data) => {
          // console.log(data)
          if (data.length > 0) {
            this.list = data
            // console.log(this.list)
            this.loading1 = false
            const list = this.list.map(item => {
              return {
                value: item.id,
                label: item.spuName
              }
            })
            this.options1 = list
          } else {
            this.list = []
            this.options1 = []
          }
        })
      } else {
        this.options1 = []
      }
    },
    // 获取规格名称
    getSpecName () {
      this.$get(`/spuSpec/getBySpu/` + this.createInfo.spuId, false, true).then(res => {
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
        // console.log(this.tableData)
      })
    },
    // 获取规格值
    getSpecValue () {
      this.$get(`/spu/getById/` + this.createInfo.spuId, false, true).then(res => {
        // console.log('res', res.sku)
        this.SpecValueList = res.sku
        for (let l = 0; l < this.SpecValueList.length; l++) {
          this.SpecValueList[l].grouponPrice = 0
          this.SpecValueList[l].grouponStock = 0
          this.SpecValueList[l].skuId = this.SpecValueList[l].id
          for (let g = 0; g < this.SpecValueList[l].skuSpecValue.length - 1; g++) {
            for (let h = 0; h < this.SpecValueList[l].skuSpecValue.length - g - 1; h++) {
              if (this.SpecValueList[l].skuSpecValue[h].specId > this.SpecValueList[l].skuSpecValue[h + 1].specId) {
                //把大的数字放到后面
                let swap2 = this.SpecValueList[l].skuSpecValue[h];
                this.SpecValueList[l].skuSpecValue[h] = this.SpecValueList[l].skuSpecValue[h + 1];
                this.SpecValueList[l].skuSpecValue[h + 1] = swap2;
              }
            }
          }
        }
        console.log('this.SpecValueList', this.SpecValueList)
      })
    },
    // 获取商品SPUID
    getGoodsSpuid () {
      this.getSpecName()
      this.getSpecValue()
    },
    // 设置价格弹窗
    setPrice () {
      console.log(1)
      this.model1 = true
    },
    // 设置完价格
    setSpec () {
      this.createInfo.skuGrouponPrice = this.SpecValueList
      console.log('this.tableData', this.SpecValueList)
    },
    // 提交
    submit () {
      if(Number(this.createInfo.mode) === 0){
        this.createInfo.bounty = 0
      }
      this.$post2('/grouponActivities/insert', this.createInfo, false, true).then(res => {
        console.log(res)
        if (res.data.code === 200) {
        this.$Message.success(res.data.message)
        this.$router.push('/marketGroup')
        } else {
         this.$Message.success(res.data.message)
        }
      })
    }
  }

}
</script>

<style scoped lang="less">
.Newcreate {
  background: #ffffff;
  height: 80vh;
  box-sizing: border-box;
  .searchLine {
    margin-top: 29px;
    display: flex;
    align-items: center;
    .searchBox {
      display: inline-block;
      width: 100px;
      text-align: right;
    }
  }
  .price {
    // width: 56px;
    // height: 22px;
    // line-height: 22px;
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-decoration: underline;
    // text-align: left;
    color: #1890ff;
    cursor: pointer;
  }
  .txt {
    margin-left: 10px;
    width: 280px;
  }
  .txts {
    margin-left: 10px;
    width: 782px;
  }
  .footer {
    margin-top: 100px;
    text-align: center;
    .sure {
      margin-right: 20px;
    }
  }
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