<template>
  <div class="orderDetail-contaniner">
    <div class="title">订单信息</div>
    <div class="orderDetail">
      <Row class="orderDetailLine">
        <i-col span="8" class="orderLine">
          <div>主订单编号：</div>
          <span>{{orderInfo.systemOrderNo}}</span>
          <span
            style="color:blue;margin-left:12px;    cursor: pointer;"
            @click="handleCopy(orderInfo.systemOrderNo,$event)"
          >复制</span>
        </i-col>
        <i-col span="8" class="orderLine">
          <div>子订单编号:</div>
          <span>{{orderInfo.orderNo}}</span>
          <span
            style="color:blue;margin-left:12px;    cursor: pointer;"
            @click="handleCopy(orderInfo.orderNo,$event)"
          >复制</span>
        </i-col>
        <i-col span="8" class="orderLine">
          <div>支付日期：</div>
          <span>{{orderInfo.payTime}}</span>
        </i-col>
      </Row>
      <Row class="orderDetailLine">
        <i-col span="8" class="orderLine">
          <div>商家信息:</div>
          <span>{{orderInfo.shopName}}</span>
        </i-col>
        <i-col span="8" class="orderLine">
          <div>子订单状态：</div>
          <span>{{orderInfo.orderStatus}}</span>
        </i-col>
        <!-- <i-col span="8" class="orderLine" v-if="'待发货'===orderInfo.orderStatus">
          <i-button type="primary" @click="modal10=true; orderNoInput=''" class="btn">发货</i-button>
        </i-col>-->
      </Row>
    </div>
    <div class="orderDetail-item">
      <div class="orderItem">
        <!-- <div class="orderHeader">
          <div class="orderNumber">订单编号：788888888888888</div>
          <div class="orderType">订单类型：普通订单</div>
          <div class="orderType">订单类型：普通订单</div>
          <div class="orderType">订单类型：普通订单</div>
        </div>-->

        <div class="orderMess">
          <Row class="header">
            <i-col span="6" class="orderLine message">
              <div>商品信息</div>
            </i-col>
            <i-col span="3" class="orderLine orderNum">
              <div>价格</div>
            </i-col>
            <i-col span="3" class="orderLine ordertime">
              <div>数量</div>
            </i-col>
            <i-col :span="getSpanNum(orderType)" class="orderLine ordertime">
              <div>活动类型</div>
            </i-col>
            <i-col :span="getSpanNum(orderType)" class="orderLine ordertime">
              <div>商品总价（元）</div>
            </i-col>
            <i-col :span="getSpanNum(orderType)" class="orderLine ordertime">
              <div>实际支付（元）</div>
            </i-col>
            <i-col span="3" class="orderLine ordertime" v-if="orderType==='拼团'">
              <div>拼团状态</div>
            </i-col>
          </Row>
          <Row class="ListDetail" v-for="(item, index) in orderInfo.skuList" :key="index">
            <i-col span="6" class="orderLine orderNum">
              <div class="orderGoodsMess">
                <div class="imgLeft">
                  <img :src="item.goodsImg" alt srcset />
                </div>
                <div class="rightMess">
                  <div class="goodsOrderNum">商品ID:{{item.skuId}}</div>
                  <div class="goodsOrderName">{{item.goodsName}}</div>
                  <div class="goodsOrderSpu">{{item.goodsSpec}}</div>
                </div>
              </div>
            </i-col>
            <i-col span="3" class="orderLine ordertime">
              <div>¥{{item.goodsPrice}}</div>
            </i-col>
            <i-col span="3" class="orderLine ordertime">
              <div>{{item.goodsCount}}</div>
            </i-col>
            <i-col :span="getSpanNum(orderType)" class="orderLine ordertime">
              <div>{{item.orderType}}</div>
            </i-col>
            <i-col :span="getSpanNum(orderType)" class="orderLine ordertime">
              <div>¥{{item.goodsAmount}}</div>
            </i-col>

            <i-col :span="getSpanNum(orderType)" class="orderLine ordertime">
              <div>¥{{item.practicalClearing}}</div>
            </i-col>
            <i-col span="3" class="orderLine ordertime" v-if="orderType==='拼团'">
              <div>{{item.clearingInfo===''? (Number(item.grouponStatus )===1?'拼中' :'拼不中') : (Number(item.clearingInfo )===0? '拼不中' :'拼中') }}</div>
            </i-col>
          </Row>
        </div>
        <div class="title" style="margin-top:60px">收货信息</div>
        <div class="orderMess">
          <Row class="header">
            <i-col span="4" class="orderLine message">
              <div>收货人</div>
            </i-col>
            <i-col span="4" class="orderLine orderNum">
              <div>收货人手机号</div>
            </i-col>
            <i-col span="4" class="orderLine ordertime">
              <div>买家昵称</div>
            </i-col>
            <i-col span="6" class="orderLine ordertime">
              <div>收货地址</div>
            </i-col>
            <i-col span="4" class="orderLine ordertime">
              <div>买家备注</div>
            </i-col>
          </Row>
          <Row class="contanier white">
            <i-col span="4" class="orderLine message">
              <div>{{siteInfo.consignee}}</div>
            </i-col>
            <i-col span="4" class="orderLine orderNum">
              <div>{{siteInfo.tel}}</div>
            </i-col>
            <i-col span="4" class="orderLine ordertime">
              <div>{{siteInfo.purchaser}}</div>
            </i-col>
            <i-col span="6" class="orderLine ordertime">
              <div>{{siteInfo.addressDetail}}</div>
            </i-col>
            <i-col span="4" class="orderLine ordertime">
              <div></div>
            </i-col>
          </Row>
        </div>
        <div class="title" style="margin-top:60px">
          物流信息
          <!-- <span
            v-if="trackingInfo"
            style="color:#1890FF;margin-left:12px; cursor: pointer;font-weight: normal;
    font-size: 17px;"
            @click="editorMess()"
          >修改</span>-->
        </div>
        <Row class="header white" v-if="trackingInfo">
          <i-col span="8">
            <div class="trackingInfo">
              <div class="company">快递公司: {{trackingInfo.trackingCompanyName || '暂无'}}</div>
              <div class="company">
                快递单号: {{trackingInfo.trackingNumber || '暂无'}}
                <span
                  style="color:blue;margin-left:12px;    cursor: pointer;"
                  @click="handleCopy(trackingInfo.trackingNumber,$event)"
                >复制</span>
              </div>
            </div>
          </i-col>
          <i-col span="16">
            <logisticsList :TrackInfo="TrackInfo"></logisticsList>
          </i-col>
        </Row>
        <Row class="header white" v-if="trackingSubpackageList.length > 0">
          <i-col span="8">
            <div class="trackingInfo">
              <div class="company">
                选择快递公司:
                <Select v-model="trackingOrder" @on-change="getTrackingList" style="width:200px">
                  <Option
                    v-for="(tracking,List) in trackingSubpackageList"
                    :value="tracking.trackingNumber"
                    :key="List"
                  >{{ tracking.trackingCompanyName }}</Option>
                </Select>
              </div>
              <div class="company">
                快递单号: {{trackingOrder}}
                <span
                  style="color:blue;margin-left:12px;    cursor: pointer;"
                  @click="handleCopy(trackingOrder,$event)"
                >复制</span>
                     <span
                  style="color:blue;margin-left:12px;    cursor: pointer;"
                  @click="handlehandleCopy(trackingOrder,$event)"
                >修改快递单号</span>
              </div>
            </div>
          </i-col>
          <i-col span="16">
            <logisticsList :TrackInfo="TrackInfo"></logisticsList>
          </i-col>
        </Row>
        <div
          v-if="!trackingInfo && trackingSubpackageList.length === 0"
          class="Nosend"
        >该订单暂未发货,请联系运营人员，谢谢！</div>
      </div>
    </div>
  </div>
</template>

<script>
import clip from "@/utils/clipboard";
import logisticsList from "@/components/logisticsList";
export default {
  name: "order-detail",
  components: {
    logisticsList
  },
  data () {
    return {
      orderType: '',
      orderNoInput: "",
      modal10: false,
      orderNo: "",
      orderInfo: {},
      siteInfo: {},
      trackingInfo: {},
      CompanyInfo: {},
      TrackInfo: {},
      orderType: '',
      trackingSubpackageList: [],//分包列表
      trackingOrder: '',//分包物流单号
    };
  },
  created () {
    this.orderNo = this.$route.params.orderId;
    this.getorderInfo();
  },
  watch: {
    '$route.params.orderId' () {
      this.orderNo = this.$route.params.orderId;
      if (this.orderNo) {
        this.getorderInfo();
      }
    },
    orderNoInput () {
      this.getCompany(this.orderNoInput);
    }
  },
  methods: {
    getSpanNum (val) {
      if (val === "拼团") {
        return 3;
      } else {
        return 4;
      }
    },
    ModalOK () {
      if (this.orderNoInput) {
        if (this.CompanyInfo.trackingId) {
          this.$Modal.confirm({
            title: "请确认物流公司信息，执行此操作将无法回复？",
            onOk: () => {
              this.setSendGood(
                this.orderInfo.orderNo,
                this.orderNoInput,
                this.CompanyInfo.trackingId
              );
            },
            onCancel: () => {
              this.$Message.info("取消发货");
            }
          });
        } else {
          this.$tips.Message("error", `无法定位物流公司！≧◠◡◠≦✌'`, 3);
        }
      } else {
        this.$tips.Message("error", `请输入物流单号！≧◠◡◠≦✌'`, 3);
      }
    },
    setSendGood (orderSn, trackingSn, trackingCompanyId) {
      this.$get(
        `/tracking/deliver?orderSn=${orderSn}&trackingSn=${trackingSn}&trackingCompanyId=${trackingCompanyId}`
      ).then(data => {
        this.orderNoInput = "";
        this.$Message.info("已发货");
        this.getorderInfo();
      });
    },
    editorMess () {
      this.modal10 = true;
      this.orderNoInput = this.trackingInfo.trackingNumber;
    },
    //獲取物流此信息
    getTracking (val) {
      this.$get("/tracking/getTracking/" + val).then(data => {
        this.TrackInfo = data;
        console.log('物流查询', this.TrackInfo)
      });
    },
    // 分包物流查询
    getTrackingList (value) {
      this.$get("/tracking/getTracking/subpackage?trackingSn=" + value).then(data => {
        this.TrackInfo = data;
        console.log('分包物流查询', this.TrackInfo)
      });
    },
    getCompany (val) {
      this.$get("/tracking/autoCom?trackingSn=" + val).then(data => {
        this.CompanyInfo = data;
      });
    },
    handleCopy (text, event) {
      clip(text, event);
    },
       //修改快递单号
    handlehandleCopy(value){
      let {trackingId} = this.trackingSubpackageList.find((v)=> v.trackingNumber==value)
      this.$Modal.confirm({
        title: "编辑快递单号",
        onOk: () => {

          if(this.trackingSn){
             this.$get("/tracking/update?trackingSn=" + this.trackingSn+'&trackingId='+trackingId).then(data => {
                 this.$Message.success(data)
                 this.getorderInfo()
                 this.trackingSn=''
            });
          }else{
               this.$tips.Message("error", `请输入物流单号！≧◠◡◠≦✌'`, 3);
          }


          
        },
        render: h => {
          return h("Input", {
            props: {
              value: this.trackingSn,
              autofocus: true,
              placeholder: "请输入快递单号"
            },
            on: {
              input: val => {
                this.trackingSn= val;
              }
            }
          });
        }
      });
    },
    // 订单详情
    getorderInfo () {
      this.$get("/orderMaster/info?orderNo=" + this.orderNo).then(data => {
        this.orderInfo = data;
        this.orderType = this.orderInfo.skuList[0].orderType
        this.siteInfo = data.siteInfo;
        this.trackingInfo = data.trackingInfo;
        this.trackingSubpackageList = data.trackingSubpackageList || []
        // 默认选择第一个
        if (data.trackingSubpackageList.length > 0) {
          this.trackingOrder = data.trackingSubpackageList[0].trackingNumber
          this.getTrackingList(this.trackingOrder)
        }
        if (this.trackingInfo) {
          this.getTracking(data.orderId);
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.orderDetail-contaniner {
  min-height: 750px;
  padding: 15px;
  .title {
    font-size: 20px;
    font-weight: 700;
  }
  .orderDetail {
    margin-top: 30px;
    .orderDetailLine {
      margin-bottom: 15px;
      .orderLine {
        display: flex;
      }
    }
    .orderDetailLine:last-child {
      margin-bottom: 30px;
    }
  }
  //列表
  .orderDetail-item {
    .orderItem {
      //   height: 48px;

      .orderHeader {
        display: flex;
        background: rgba(250, 250, 250, 1);
        box-shadow: 0px 1px 0px 0px rgba(240, 240, 240, 1);
        align-items: center;
        // padding: 15px 0;
        .orderNumber {
          margin-left: 25px;
        }
        .orderType {
          margin-left: 60px;
        }
      }
      .title {
        font-size: 20px;
        font-weight: 700;
      }
      .trackingInfo {
        .company {
          margin-top: 20px;
          margin-left: 20px;
        }
      }
      .orderMess {
        // padding: 15px 0;
        font-size: 14px;
        border: 1px solid #ccc;
        .message {
          text-align: left;
        }
        .header {
          background: rgb(242, 242, 242);
          height: 46px;
          text-align: center;
          line-height: 46px;
          div {
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
          }
        }
        .contanier {
          padding: 15px 0;
          background: rgb(242, 242, 242);
          min-height: 46px;
          text-align: center;
          // line-height: 46px;
          div {
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
          }
        }
        .white {
          background-color: #fff;
        }
        .ListDetail {
          display: flex;
          align-items: center;
          .ordertime {
            div {
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }
        }
        .orderNum {
          text-align: left;
          .orderGoodsMess {
            margin: 20px 10px;
            display: flex;
            .imgLeft {
              width: 80px;
              height: 80px;
              // background: red;
              img {
                width: 100%;
                height: 100%;
              }
            }
            .rightMess {
              padding-left: 20px;
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: space-around;
              .goodsOrderNum {
                color: #c8c8c8;
              }
              .goodsOrderSpu {
                color: #c8c8c8;
              }
            }
          }
        }
        .ordertime {
          text-align: center;
        }
        .ordertype {
          text-align: center;
          padding-right: 20px;
          display: flex;
          flex-direction: row-reverse;
          .type {
            width: 70px;
            padding: 2px 0;
            background: rgba(255, 255, 255, 1);
            color: #ff6c6a;
            border: 1px solid rgba(255, 108, 106, 1);
            border-radius: 1px;
            border-radius: 4px;
          }
        }
      }
    }
  }
  .Nosend {
    font-size: 18px;
    color: crimson;
    margin: 15px 30px;
  }
}
.vertical-center-modal {
  .item {
    display: flex;
    align-items: center;
    margin: 15px 0;
    span {
      display: inline-block;
      width: 100px;
    }
  }
}
</style>