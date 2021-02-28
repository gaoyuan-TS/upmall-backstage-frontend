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
            <DatePicker
              class="txt"
              @on-change="handleFinishTime"
              :value="FinishTime"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
            ></DatePicker>
            <!-- <Date-picker
              type="datetimerange"
              split-panels
              placeholder="选择日期和时间"
              class="txt"
              :value="FinishTime"
              format="yyyy-MM-dd"
              @on-change="handleFinishTime"
            ></Date-picker>-->
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
              v-if="Number(status) === 1"
              v-model="createInfo.groupCount"
              placeholder="请输入"
              class="txt"
              disabled
              clearable
              type="number"
            />
            <Input
              v-else
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
              v-if="Number(status) === 1"
              v-model="createInfo.prizeCount"
              placeholder="请输入"
              class="txt"
              disabled
              clearable
              type="number"
            />
            <Input
              v-else
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
              placeholder="请输入奖励金额(元)"
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
            <Input v-model="goodName" class="txt" disabled />
          </i-col>
          <i-col span="8" class="searchLine">
            <span class="searchBox">拼团价格:</span>
            <span @click="setPrice" class="price" style="margin-left:12px">设置价格</span>
          </i-col>
        </Row>


        <Row>
          <i-col span="8" class="searchLine">
            <span class="searchBox">购买人群:</span>
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
            <div class="share">
              <el-upload
                class="avatar-uploader"
                action="https://zs.cntracechain.com/imageService/image/add"
                :data="upData"
                :show-file-list="false"
                :on-success="activityIconhandleImg"
                :before-upload="beforeIMGUpload"
              >
                <img v-if="createInfo.activityCover" :src="createInfo.activityCover" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
          </i-col>
          <i-col span="8" class="searchLine">
            <span class="searchBox">分享封面：</span>
            <div class="share">
              <el-upload
                class="avatar-uploader"
                action="https://zs.cntracechain.com/imageService/image/add"
                :data="upData"
                :show-file-list="false"
                :on-success="shareIconhandleImg"
                :before-upload="beforeIMGUpload"
              >
                <img v-if="createInfo.shareCover" :src="createInfo.shareCover" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
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
              clearable
              maxlength="30"
            />
          </i-col>
          <i-col span="8" class="searchLine">
            <span class="searchBox">分享描述：</span>
            <Input
              v-model="createInfo.shareDesc"
              maxlength="30"
              placeholder="请输入（分享朋友圈）"
              class="txt"
              clearable
            />
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
              <td v-for="(sku,skuIndex) in item.sku.skuSpecValue" :key="skuIndex">{{sku.value}}</td>
              <td>
                <Input v-model="item.grouponStock" disabled />
              </td>
              <td>
                <Input v-model="item.grouponPrice" v-if="Number(status) === 1" disabled />
                <Input v-model="item.grouponPrice" v-else />
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
      spuid: '',
      goodName: '',
      // tableParmas: {
      //   spuId: "",  // 商品spuid
      //   grouponPrice: 0,  // 拼团价
      //   stock: 0,  // 库存】
      // },
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
      FinishTime: ['', ''],
      value2: ['2017-01-01 00:00:00', '2018-02-15 00:00:00'],
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
        "weight": '',
        "mode": '',
        "groupCount": '',
                "userLimit":0,
        "maxBuyCount":0,
        "prizeCount": '',
        "bounty": ''
      },
      upData: {
        imgSystemId: 'ryy',
        imgSpecificUniqueValue: 'fddd'
      }, // 上传图片时要带的参数
      value1: 0,
      status: ''
    }
  },
  created () {
    console.log('this.$route', this.$route)
    this.spuid = this.$route.query.activitiesId
    this.status = this.$route.query.status
    this.getGroupInfo(this.spuid)
  },
  methods: {
    back () {
      this.$router.push({ name: 'market-group', params: { type: 'add' } })
    },
    // 获取活动详情
    getGroupInfo (id) {
      this.$get("/grouponActivities/getById/" + id).then(res => {
        // console.log('获取活动详情', res);
        this.createInfo = res
        // 获取默认时间
        this.FinishTime = this.value2
        this.FinishTime[0] = this.createInfo.startTime
        this.FinishTime[1] = this.createInfo.endTime
        this.getGoodsName(res.spuId)
        this.getGoodsSpuid(res.spuId)
      });
    },
    // 商品名称
    getGoodsName (id) {
      this.$get("/spu/getById/" + id).then(res => {
        // console.log(res);
        this.goodName = res.spuName
      });
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
      this.createInfo.startTime = [date[0], "00:00:00"].join(' ')
      this.createInfo.endTime = [date[1], "00:00:00"].join(' ')
    },
    // 活动文件上传
    activityIconhandleImg (res, file) {
      console.log(res)
      if (res.code === 200) {
        this.$Message.success(res.message)
        this.createInfo.activityCover = res.data.imgUrl
      } else {
        this.$Message.error("上传失败")
      }
    },
    // 分享文件上传
    shareIconhandleImg (res, file) {
      // console.log(response)
      if (res.code === 200) {
        this.$Message.success(res.message)
        this.createInfo.shareCover = res.data.imgUrl
      } else {
        this.$Message.error("上传失败")
      }
    },
    // 限制商品图片上传格式和大小
    beforeIMGUpload (file) {
      var testIMG = file.name.substring(file.name.lastIndexOf('.') + 1)
      const exten = testIMG === 'jpg'
      const exten2 = testIMG === 'png'
      const exten3 = testIMG === 'jpeg'
      const isLt3M = file.size / 1024 / 1024 < 10
      if (!exten && !exten2 && !exten3) {
        this.$Message.error('上传图片文件只能是jpg,png,jpeg格式!')
        return false
      }
      if (!isLt3M) {
        this.$Message.error('上传图片文件不能超过 10MB!')
        return false
      }
      return true
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
        console.log('colSkuValue', this.colSkuValue)
      })
    },
    // 获取规格值
    // getSpecValue () {
    //   this.$get(`/spu/getById/` + this.createInfo.spuId, false, true).then(res => {
    //     console.log('获取规格值', res.sku)
    //     this.SpecValueList = res.sku
    //     for (let l = 0; l < this.SpecValueList.length; l++) {
    //       this.SpecValueList[l].grouponPrice = 0
    //       this.SpecValueList[l].grouponStock = 0
    //       this.SpecValueList[l].skuId = this.SpecValueList[l].id
    //       for (let g = 0; g < this.SpecValueList[l].skuSpecValue.length - 1; g++) {
    //         for (let h = 0; h < this.SpecValueList[l].skuSpecValue.length - g - 1; h++) {
    //           if (this.SpecValueList[l].skuSpecValue[h].specId > this.SpecValueList[l].skuSpecValue[h + 1].specId) {
    //             //把大的数字放到后面
    //             let swap2 = this.SpecValueList[l].skuSpecValue[h];
    //             this.SpecValueList[l].skuSpecValue[h] = this.SpecValueList[l].skuSpecValue[h + 1];
    //             this.SpecValueList[l].skuSpecValue[h + 1] = swap2;
    //           }
    //         }
    //       }
    //     }
    //     console.log('this.SpecValueList', this.SpecValueList)
    //   })
    // },
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
    // 获取商品SPUID
    getGoodsSpuid () {
      this.getSpecName()
      this.getGrouponPrice()
    },
    // 设置价格弹窗
    setPrice () {
      console.log(1)
      this.model1 = true
    },
    // 设置完价格
    setSpec () {
      console.log('this.tableData', this.SpecValueList)
      this.$post('/skuGrouponPrice/insertList', this.SpecValueList, false, true).then(res => {
        // console.log(res)
        this.$Message.success(res)
      })
    },
    // 提交
    submit () {
      delete this.createInfo.skuGrouponPrice
      if (Number(this.createInfo.mode) === 0) {
        this.createInfo.bounty = 0
      }
      console.log(this.createInfo)
      this.$post2('/grouponActivities/update', this.createInfo, false, true).then(res => {
        console.log(res)
        if (res.data.code === 200) {
          this.$Message.success(res.data.message)
          this.$router.push('/marketGroup')
        } else {
          this.$Message.error('修改失败')
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
  .share {
    width: 210px;
    display: flex;
    justify-content: center;
    // overflow: hidden;
    /deep/ .avatar-uploader {
      width: 200px;
      height: 200px;
      .el-upload {
        width: 200px;
        height: 200px;
        img {
          width: 100%;
          height: 100%;
        }
      }
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