<template>
  <div class="third-step">
    <!-- 商品规格 -->
    <div class="title">商品规格</div>
    <Form :label-width="100">
      <FormItem label="商品规格：" style="margin-bottom:15px">
        <span style="font-size:12px;"><span style="color:red;margin-right:5px">*</span>每次添加规格表格数据会刷新,请确保完善规格信息后再填写表格信息</span>
        <span style="font-size:12px;margin-left:10px">最多添加三个商品规格</span>
      </FormItem>
      <FormItem>
        <div class="sku-group" v-for="(item,index) in sku_group" :key="index">
          <div class="header">
            <Input placeholder="规格1" style="width: 335px;" :disabled="item.isFinish" v-model="item.specName" @on-blur="nameBlur(item,index)" />
            <div>
              <Button type="text" class="btn-text" @click="commitSkuGroup(item,index)" v-if="!item.isFinish">完成</Button>
              <!-- <Button type="text" class="btn-text" @click="editSkuGroup(item,index)" v-show="item.isFinish">修改</Button> -->
              <Button type="text" class="btn-text" v-else @click="removeSkuGroup(item,index)">删除规格</Button>
            </div>
          </div>
          <div class="sku-list">
            <div class="sku-item" v-for="(sku,skuIndex) in item.value" :key="skuIndex">
              <template>
                <!-- 用盒子替代 checkbox -->
                <span class="checkbox" v-if="!sku.isChecked"></span>
                <span class="checkbox checkbox-active" v-show="!item.isFinish" v-else @click="handleChange(index,skuIndex,sku)">
                  <Icon type="ios-checkmark" size="20" class="checkbox-icon" />
                </span>
              </template>
              <Input placeholder="规格1" style="width: 80%" v-model="sku.specValue" :disabled="item.isFinish"
               @on-blur="valueBlur(index,skuIndex,sku)" />
            </div>

            <div class="add-value-btn" v-show="!item.isFinish" @click="addSkuValue(index)">
              <Icon type="md-add" style="margin-right:10px" size="16" />
              <span>增加规格值</span>
            </div>
          </div>
        </div>
        <template>
           <div class="add-btn" @click="addSkuGroup" v-show="isShowAdd" v-if="sku_group.length < 3">
            <Icon type="md-add" style="margin-right:10px" size="16" />
            <span>添加规格</span>
          </div>
        </template>
       
      </FormItem>
    </Form>

    <!-- 表格 -->
    <table class="table" cellspacing="0" cellpadding="0">
      <thead class="thead">
        <tr>
          <template v-if="colSkuValue.length>0">
            <td v-for="skuTh in colSkuValue" :key="skuTh.time" style="width:7%">{{skuTh}}</td>
          </template>
          <td v-for="(th,thIndex) in tableThs" :key="thIndex" class="thead-th" style="width:7%">{{th.name}}</td>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(item,index) in tableData" :key="index">
          <td v-for="(sku,skuIndex) in item.sku" :key="skuIndex">{{sku.specValue}}</td>
          <td><Input v-model="item.stock"/></td>
          <td><Input v-model="item.costPrice"/></td>
          <td><Input v-model="item.retailPrice"/></td>
          <td><Input v-model="item.newsPrice"/></td>
          <td><Input v-model="item.bronzePrice"/></td>
          <td><Input v-model="item.silverPrice"/></td>
          <td><Input v-model="item.goldPrice"/></td>
          <td><Input v-model="item.partnerPrice"/></td>
          <td><Input v-model="item.dealerPrice"/></td>
          <td><Input v-model="item.agentPrice"/></td>
          <td>
            <el-upload
              class="avatar-uploader"
              action="https://zs.cntracechain.com/imageService/file/upload"
              :show-file-list="false"
              @click.native="clickUpload(index)"
              :on-success="handleSuccess">
              <img v-if="item.skuPicture" :src="item.skuPicture" style="width:40px;height:40px" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 按钮 -->
    <div class="btn-wrap" style="margin-top:60px" ref="container">
      <Button type="primary" class="btn" style="margin-right:40px" :disabled="isSave" @click="handleSave">保存</Button>
      <!-- <Button class="btn">取消</Button> -->
    </div>
  </div>
</template>

<script>
import Utils from 'utils/utils.js'
import { mapState } from 'vuex'
import myStorage from "utils/localstore";
export default {
  inject: ['create'],
  name: 'third-step',
  data() {
    return {
      sku_group: [],
      isShowAdd: true,
      // 表头  -- 默认
      tableThs:[
        {name:"库存"},
        {name: "成本价"},
        {name: "市场价"},
        {name: "新人价"},
        {name: "铜牌价"},
        {name: "银牌价"},
        {name: "金牌价"},
        {name: "事业伙伴"},
        {name: "经销商"},
        {name: "官方代理"},
        {name: "预览图"}
      ],
      colSkuValue: [],
      tableParmas: {
        spuId: "",  // 商品spuid
        uniqueCode: "",  // 商品唯一标识
        skuName: "",  // 商品sku名称
        costPrice: 0,  // 成本价
        retailPrice: 0,  // 销售价
        stock: 0,  // 库存
        skuPicture: "",  // 预览图
        newsPrice: 0,  // 新人价
        bronzePrice: 0,  // 铜牌价
        silverPrice: 0,  // 银牌价格
        goldPrice: 0,  // 金牌价
        partnerPrice: 0,  // 事业伙伴价
        dealerPrice: 0,   // 经销商价
        agentPrice: 0,  // 官方代理价
        skuSpecValue: []
      },
      tableData: [],
      uploadIndex: 0,
      // enteredList: [{list:[]},{list:[]},{list:[]}]   // 存放已经输入的skuValue 这个方法不可行  规格值和规格名称要分开存放
      enterNameList: [], // 存放规格名称
      enterValList: [[],[],[]],  // 存放规格值
      skuList: [],   // 排序好的sku
      isSave: false  // 用来控制只能保存一次
    }
  },
  computed: {
    ...mapState({
      spu: state => state.goods.spu,
      goodInfo: state => state.goods.goodInfo,
      spuSpec: state => state.goods.spuSpec
    }),

    // 筛选出规格名称不为空
    skuLabels() {
       return this.sku_group.filter(v => v.specName && v.specName.length > 0)
    },

    // 筛选出规格值不为空
    skuValues() {
      if(this.skuLabels === 0) return
      let list = []
      for(let item of this.skuLabels) {
        if(item.value.length === 0) return []
        if(item.value[0].specValue && item.value[0].specValue.length > 0) {
          list.push(item)
        }
      }
      return list
    },
    // tableData() {
    //   if(this.$route.params.type === 'add') {
    //     let param = this.skuList.map(v => {
    //       return {
    //         sku : v,
    //         ...this.tableParmas
    //       }
    //     })
    //     console.log('tabledata')
    //     console.log(param,"param")
    //     return param
    //   }else if(this.$route.params.type === 'edit'){
    //     // this.skuList = this.goodInfo.sku
    //     if(this.skuList.length > 0) {
    //       for(let item of this.skuList) {
    //       if(item.skuSpecValue.length > 0) {
    //         for(let sku of item.skuSpecValue) {
    //           sku.specValue = sku.value   // 增加specValue  字段
    //         }
    //       }
    //     }
    //     console.log(this.skuList,"this.skuList")
    //     let param = this.skuList.map(v => {
    //         return {
    //           spuId: v.spuId,
    //           uniqueCode: v.uniqueCode,
    //           skuName: v.skuName,
    //           costPrice: v.costPrice,
    //           retailPrice: v.retailPrice,
    //           stock: v.stock,
    //           status: v.status,
    //           skuPicture: v.skuPicture,
    //           newsPrice: v.specialPrice.newsPrice,
    //           bronzePrice: v.specialPrice.bronzePrice,
    //           silverPrice: v.specialPrice.silverPrice,
    //           goldPrice: v.specialPrice.goldPrice,
    //           partnerPrice: v.specialPrice.partnerPrice,
    //           dealerPrice: v.specialPrice.dealerPrice,
    //           agentPrice: v.specialPrice.agentPrice,
    //           sku: v.skuSpecValue
    //         }
    //       })
    //       console.log(param)
    //       return param
    //     }
    //   }
    // }
  },

  mounted() {
    console.log(this.$route.params)
    if(this.$route.params.type === 'edit') {
      this.sku_group = this.spuSpec
      console.log(' this.spuSpec', this.spuSpec)
      if(this.sku_group.length === 0) {
        return this.isShowAdd = true
      }
      for(let item of this.sku_group) {
        item.isFinish = true
        for(let sku of item.value) {
          sku.isChecked = true
        }
      }
      this.colSkuValue = this.spuSpec.map(v => v.specName)
      this.skuList = this.goodInfo.sku
      console.log(this.skuList,"this.skuList")
      if(this.skuList.length > 0) {
        for(let item of this.skuList) {
          if(item.skuSpecValue.length > 0) {
            for(let sku of item.skuSpecValue) {
              sku.specValue = sku.value   // 增加specValue  字段
              sku.id = sku.specValueId   // 增加specValue  字段
            }
          }
        }
         this.tableData = this.skuList.map(v => {
            return {
              id: v.id,
              spuId: v.spuId,
              uniqueCode: v.uniqueCode,
              skuName: v.skuName,
              costPrice: v.costPrice,
              retailPrice: v.retailPrice,
              stock: v.stock,
              status: v.status,
              skuPicture: v.skuPicture,
              newsPrice: v.specialPrice.newsPrice,
              bronzePrice: v.specialPrice.bronzePrice,
              silverPrice: v.specialPrice.silverPrice,
              goldPrice: v.specialPrice.goldPrice,
              partnerPrice: v.specialPrice.partnerPrice,
              dealerPrice: v.specialPrice.dealerPrice,
              agentPrice: v.specialPrice.agentPrice,
              sku: v.skuSpecValue
            }
          })
      }
      console.log('tableData',this.tableData)
    }

     // 监听页面的刷新事件
    window.onbeforeunload = e => {
      myStorage.set("routerParam", this.$route.params);
      e.returnValue = "您是否确认离开此页面-您输入的数据可能不会被保存";
      this.handleSave()
    };
  },

  methods: {
    // 生成随机code
    createRandomId() {
      return (new Date()).getTime();
    },
    // 添加规格
    addSkuGroup() {
      console.log(this.spu,"this.spu")
      let obj =  {
        spuId: this.spu.spuid,  // 商品spuid
        specName: "",  // 规格名称
        value:[  // 规格值组
          {specValue: "",isChecked:false},
        ],
        isFinish: false   // 增加是否完成判断
      }
      this.sku_group.push(obj)
      this.isShowAdd = false
    },

    // 增加规格值
    addSkuValue(index) {
      this.sku_group[index].value.push({specValue: "",isChecked:false})
    },

    /**
     * 完成添加规格
     * 需要过滤掉值为空的sku值
     */ 
    commitSkuGroup(item,index) {
      if(!item.specName.toString().trim()) {
        this.$Message.warning({ background: true, content: '请输入规格名称'});
        return
      }
      let res = item.value.every(value => !value.specValue.toString().trim())  // 要判断是否填写了规格值
      if(res) {
        this.$Message.warning({ background: true, content: '请最少输入一种规格'});
        return
      }
      let temp = JSON.parse(JSON.stringify(item))
      temp.value = item.value.filter(v => v.specValue.toString().trim())
      for(let item of temp.value) {
        delete item.isChecked
      }
      this.isShowAdd = true
      item.isFinish = true
      item.time = this.createRandomId()
      // 发送新增规格请求
      this.$post('/spuSpec/create',temp).then(res => {
        console.log(res)
        this.$Message.success({ background: true, content: '添加成功' });
        // 发送完之后就拉取
        this.getSpuSpec(this.spu.spuid)
        // this.getSpuSpec(293)
      })
    },

    // 修改规格
    editSkuGroup(item,index) {
      console.log(item)
      for(let item of item.value) {
        item.isChecked = true
      }
      delete item.isFinish
      item.time = this.createRandomId()
      this.$set(this.sku_group[index],"isFinish",false)
    },

    // 拉取一个spu的所有规格
    getSpuSpec(id) {
      this.$get(`/spuSpec/getBySpu/${id}`,false,true).then(res => {
        console.log(res)
        this.skuList = []
        this.sku_group = res
        this.tableData = []
        console.log(this.sku_group,"res")
        if(this.sku_group.length === 0) {
          return this.isShowAdd = true
        }
        let spuSpec = res
        for(let item of this.sku_group) {
          item.isFinish = true
          for(let sku of item.value) {
            sku.isChecked = true
          }
        }
        let list = []
        this.colSkuValue = spuSpec.map(v => v.specName)
        for(let item of spuSpec) {
          list.push(item.value)
        }
        let arr = Utils.cartesianProductOf(...list)
        console.log(arr,'arr')
        this.tableData = arr.map(v => {   
          let arrObj = {
            sku: v,
            ...this.tableParmas
          }
          return arrObj
        })
        // for(let item of arr) {
        //   this.skuList.push(item)
        // }
        console.log(this.tableData)
      })
    },

    // 删除规格
    removeSkuGroup(item,index) {
       this.$Modal.confirm({
          title: '删除提示',
          content: '<p>是否确认删除改规格?</p><p>删除规格后,在编辑完成时请记得保存！！</p>',
          onOk: () => {
              this.$get(`/spuSpec/delete/${item.id}`,false).then(res => {
              this.sku_group.splice(index,1)
              this.tableData.splice(index,1)
              this.getSpuSpec(this.spu.spuid)
              this.enterNameList[index] = ""
              this.$Message.success({ background: true, content: '成功删除spu应用规格'});
            })   
          }
      });
    },

    // 输入规格名称失焦 -- 检测是否有相同的
    // 如果删掉内容 ,那么对应的enteredList也需要删除
    nameBlur(value,index) {
      this.enterNameList[index] = ""  /// 最最最最最重要这里要做初始化
      if(value.specName === "") return
      for(let item of this.enterNameList) {
        if(item === value.specName) {
          this.$Message.warning('规格名称不能相同');
          this.$set(this.sku_group[index],"specName","")
          return
        }
      }
      this.enterNameList[index] = value.specName
    },

    /**
     * 改变复选框状态 -- 规格值
     * 第一个不能删除
     * 删除之后还要把enterValList 对应的删除
     */
    handleChange(index,skuIndex,sku) {
      if(skuIndex === 0 && !sku.specValue.toString().trim())  return
      this.sku_group[index].value.splice(skuIndex,1)
      this.enterValList[index].splice(skuIndex,1)
    },

    /**规格值失焦触发
     * 第一个如果没有输入内容不能勾选状态 失焦之后自动更改状态
     * 在失焦要判断内容是否为空 为空不增加
     * 在失焦时要判断规格值有没有重复
     */
    valueBlur(index,skuIndex,sku) {
      if(!sku.specValue.toString().trim())  return
      // let currentList = this.sku_group[index].value
      // let valueIndex = this.enterValList[index].findIndex(v => v === sku.specValue)
      // if(valueIndex !== -1) {  // 则证明有重复的规格值
      //    this.$Message.warning('规格名称不能相同');
      //    this.$set(this.sku_group[index].value[skuIndex],"specValue","")
      //    return
      // }
      // this.enterValList[index].push(sku.specValue)
      sku.isChecked = true  // 改变状态
      // if(currentList[skuIndex+1] && currentList[skuIndex+1].specValue)  return
      // this.$set(this.sku_group[index].value,[skuIndex+1],{specValue:"",isChecked:false})
    },

    clickUpload(index) {
      this.uploadIndex = index
    },
    // 上传预览图
    handleSuccess(res) {
      console.log(res)
      const {code,data} = res
      if(code === 200) {
        this.$set(this.tableData[this.uploadIndex],"skuPicture",data.url)
      }else {
        this.$Message.warning('图片上传失败，请重新上传！');
      }
    },


    // 点击保存
    // handleSave() {
    //   if(this.tableData.length === 0) {
    //     return  this.$Message.error({ background: true, content: '请完善规格信息'})
    //   }

    //   for(let item of this.tableData) {
    //     item.skuName = this.spu.spuName
    //     if(item.sku && item.sku.length > 0) {
    //       for(let sku of item.sku) {
    //         sku.specValueId =  JSON.parse(JSON.stringify(sku.id))
    //         console.log(sku.specValue)
    //         item.skuName = item.skuName + sku.specValue
    //       }
    //     }
    //   }

    //   for(let item of this.tableData) {
    //     if(item.sku && item.sku.length > 0) {
    //       for(let sku of item.sku) {
    //         delete sku.createTime
    //         delete sku.id
    //         delete sku.isChecked
    //         delete sku.specId
    //         delete sku.updateTime
    //         delete sku.specValue
    //       } 
    //     }
    //   }

    //   // 构造参数
    //   let newTableData = this.tableData.map((v,index) => {
    //     return {
    //       spuId: this.spu.spuid,
    //       uniqueCode: this.spu.uniqueCode + index,
    //       skuName: v.skuName,
    //       costPrice: Number(v.costPrice),
    //       retailPrice: Number(v.retailPrice),
    //       stock: Number(v.stock),
    //       status: 0,
    //       skuPicture: v.skuPicture,
    //       specialPrice: {
    //         newsPrice: Number(v.newsPrice),
    //         bronzePrice: Number(v.bronzePrice),
    //         silverPrice: Number(v.silverPrice),
    //         goldPrice: Number(v.goldPrice),
    //         partnerPrice: Number(v.partnerPrice),
    //         dealerPrice: Number(v.dealerPrice),
    //         agentPrice: Number(v.agentPrice)
    //       },
    //       skuSpecValue: v.sku
    //     }
    //   })
    //   console.log(newTableData,"newTableData")
    //   let requestUrl = this.$route.params.type === 'add' ? '/sku/insertList' : '/sku/updateList'
    //   this.$post(requestUrl,newTableData).then(res => {
    //       this.$Message.success({ background: true, content: res});
    //       this.$router.push({name: 'good-list'})
    //   })
    // },
    handleSave() {
      if(this.tableData.length === 0) {
        return  this.$Message.error({ background: true, content: '请完善规格信息'})
      }
      console.log(this.tableData)
      for(let item of this.tableData) {
        item.skuName = this.spu.spuName
        item.status = this.$route.params.type === 'add' ? 0 : this.spu.status
        if(item.sku && item.sku.length > 0) {
          for(let sku of item.sku) {
            sku.specValueId =  JSON.parse(JSON.stringify(sku.id))
            console.log(sku.specValue)
            item.skuName = item.skuName + sku.specValue
          }
        }
      }

      for(let item of this.tableData) {
        if(item.sku && item.sku.length > 0) {
          for(let sku of item.sku) {
            delete sku.createTime
            delete sku.id
            delete sku.isChecked
            delete sku.specId
            delete sku.updateTime
            delete sku.specValue
          } 
        }
      }

      // 构造参数
      let newTableData = this.tableData.map((v,index) => {
        return {
          spuId: this.spu.spuid,
          uniqueCode: this.spu.uniqueCode + index,
          skuName: v.skuName,
          costPrice: Number(v.costPrice),
          retailPrice: Number(v.retailPrice),
          stock: Number(v.stock),
          status: v.status,
          skuPicture: v.skuPicture,
          specialPrice: {
            newsPrice: Number(v.newsPrice),
            bronzePrice: Number(v.bronzePrice),
            silverPrice: Number(v.silverPrice),
            goldPrice: Number(v.goldPrice),
            partnerPrice: Number(v.partnerPrice),
            dealerPrice: Number(v.dealerPrice),
            agentPrice: Number(v.agentPrice)
          },
          skuSpecValue: v.sku
        }
      })
      console.log(newTableData,"newTableData")
      let requestUrl = this.$route.params.type === 'add' ? '/sku/insertList' : '/sku/updateList'
      this.$post(requestUrl,newTableData,true).then(res => {
          this.$Message.success({ background: true, content: res});
          this.$router.push({name: 'good-list'})
          this.isSave = true
      })
    }
  }
}
</script>

<style lang="less" scoped>
.third-step {
  .title {
    font-size: @fontsize-large-x;
    color: @color-dark;
    // margin-bottom: 20px;
    padding: 10px 15px 25px;
  }
  .sku-group {
    padding-right: 30px;
    margin-bottom: 30px;
    .header {
      display: flex;
      align-items: center;
      height: 50px;
      background: #F2F2F2;
      padding: 10px;
      justify-content: space-between;
      .btn-text {
        color: @theme-color-s;
        font-size: @fontsize-small;
      }
    }
    .sku-list {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      background: #FAFAFA;
      padding: 30px 20px;
      .sku-item {
        width: 33%;
        display: flex;
        align-items: center;
        margin-bottom: 30px;
        .checkbox {
          width:16px;
          height:16px;
          border:1px solid #D9D9D9;
          margin-right: 14px;
          border-radius: 2px;
        }
        .checkbox-active {
          position: relative;
          border-color: @theme-color-s;
          background: @theme-color-s;
          .checkbox-icon {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            color: #fff;
          }
        }
      }
      .add-value-btn {
        position: absolute;
        bottom: 4px;
        left: 20px;
        display: flex;
        align-items: center;
        font-size: 13px;
        color: @theme-color-s;
        &:hover {
          cursor: pointer;
        }
      }
    }
  }
  .add-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 32px;
    font-size: @fontsize-small;
    color: @color-dark-ss;
    box-sizing: border-box;
    text-align: center;
    line-height: 32px;
    border-radius: 2px;
    border: 1px solid #D3D7DA;
    &:hover {
      border-color: @theme-color-s;
      color: @theme-color-s;
      cursor: pointer;
    }
  }
  .table {
    width: 100%;
    margin-top: 60px;
    text-align: center;
    .thead {
      line-height: 50px;
      background: @bd-color-ss;
      text-align: center;
      color: #252525;
    }
  }
  table,table tr th, table tr td { 
    border:1px solid #F0F0F0;
  }
  .serveFreight-wrap {
    .time-item {
      width: 72px;
      height: 28px;
      text-align: center;
      line-height: 28px;
      font-size: @fontsize-small;
      color: #fff;
      background: #ACD7FF;
      margin-right: 26px;
      &:hover {
        cursor: pointer;
      }
    }
    .time-item-active {
      background: @theme-color-s;
    }

    .other-wrap {
      display: flex;
      align-items: center;
      .radio {
        position: relative;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 1px solid #D9D9D9;
        &:hover {
          cursor: pointer;
        }
      }
      .radio-active {
        &::after {
          position: absolute;
          content: "";
          top: 50%;
          left: 50%;
          transform: translate(-50%,-50%);
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: @theme-color-s;
        }
      }
    }
  }

  .btn-wrap {
    text-align: center;
  }
}
</style>
<style lang="less" scoped>
.table {
  // margin-bottom: 70px;
  /deep/.ivu-input {
    border-color: #fff;
    width: 98%;
    border-radius: 0px!important;
    text-align: center;
    height: 50px;
  }
  /deep/.ivu-input:focus {
    box-shadow: 0 0 0 1px #1890FF;
  }
}
</style>