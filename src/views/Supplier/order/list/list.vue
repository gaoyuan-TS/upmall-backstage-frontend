<template>
  <div class="orderList">
    <div class="search">
      <Row class="searchLine">
        <i-col span="6" class="orderLine">
          <div @click="order">订单编号：</div>
          <Input
            v-model="orderInfo.systemOrderNo"
            clearable
            placeholder="请输入订单编号"
            style="width: 250px"
          />
        </i-col>
        <i-col span="6" class="orderLine">
          <div>支付日期：</div>
          <!-- <Input v-model="orderInfo.name" placeholder="请选择支付日期" style="width: 250px" /> -->
          <Date-picker
            :value="datepicker"
            format="yyyy-MM-dd HH:mm:ss"
            @on-change="DateChange"
            type="datetimerange"
            placement="bottom-end"
            placeholder="选择日期"
            style="width: 250px"
          ></Date-picker>
        </i-col>
        <i-col span="6" class="orderLine">
          <div>订单类型：</div>
          <!-- <Input v-model="" placeholder="请选择订单类型" style="width: 250px" /> -->
          <i-select style="width:250px" @on-change="onChangeStaus" clearable>
            <i-option
              v-for="(item,index) in Status"
              :value="item.value"
              :key="index"
            >{{ item.label }}</i-option>
          </i-select>
        </i-col>
        <i-col span="6" class="orderLine">
          <div>订单状态：</div>
          <i-select style="width:250px" @on-change="onChangeorderStaus" clearable>
            <i-option v-for="(item,index) in statusList" :value="index" :key="index">{{ item }}</i-option>
          </i-select>
        </i-col>
      </Row>
      <Row class="searchLine">
        <i-col span="6" class="orderLine">
          <div>收货人名字：</div>
          <Input v-model="orderInfo.name" clearable placeholder="请输入收货人名字" style="width: 250px" />
        </i-col>
        <i-col span="6" class="orderLine">
          <div>收货人手机：</div>
          <Input v-model="orderInfo.tel" clearable placeholder="请输入收货人手机" style="width: 250px" />
        </i-col>
        <Button type="primary" style="margin:0 10px" class="btn" @click="search">搜索</Button>
        <Button type="primary" style="margin:0 10px" class="btn" @click="exportExel">导出订单</Button>
      </Row>
    </div>

    <div class="listTable">
      <div class="orderItem" v-for="(item, index) in records" :key="index">
        <div class="orderItem_orderHeader">
          <div class="orderNumber">
            订单编号：{{item.orderNo}}
            <span
              style="color:blue;cursor: pointer;"
              @click="handleCopy(item.orderNo,$event)"
            >复制</span>
          </div>
          <div class="orderType">收货人：{{item.consignee}}</div>
          <div class="orderType">买家：{{item.purchaser}}</div>
          <div class="orderType">支付日期：{{item.payTime}}</div>
           
          <div class="orderType"  v-if="!item.grouponOrderNo">子订单状态：<span :class="getClass1(item.orderStatus)">{{item.orderStatus}}</span></div>
         <div class="orderType">商品总价：{{item.goodsAmount}}</div>
        </div>
        <div class="orderMess">
          <Row>
            <!-- <i-col span="2" class="orderLine message">
              <div>店铺信息：{{orderList_child.shopName}}</div>
            </i-col>-->
            <i-col span="8" class="orderLine orderNum" v-if="item.grouponOrderNo">
              <div>
                拼团订单号：{{item.grouponOrderNo}}
                <span
                  style="color:blue;cursor: pointer;"
                  @click="handleCopy(item.grouponOrderNo,$event)"
                >复制</span>
              </div>
            </i-col>
            <i-col span="5" class="orderLine ordertype" v-if="item.grouponOrderNo">
              <div class="type">
                子订单状态：
                <span :class="getClass1(item.orderStatus)">{{item.orderStatus }}</span>
              </div>
            </i-col>

            <i-col span="8">
              <i-button type="primary" v-if="'待发货'===item.orderStatus"  style="margin-right:15px" @click="order(item,item)" class="btn">普通发货</i-button>
              <i-button type="primary" v-if="'待发货'===item.orderStatus" style="margin-right:15px" @click="orderPart(orderList_child,item)" class="btn">分包裹发货</i-button>
              <i-button class="btn" type="primary" @click="JumpDetail(item)">查看详情</i-button>
            </i-col>
          </Row>

          <div class="orderDetail-item">
            <div class="orderDetail-orderItem">
              <div class="orderDetail-orderMess">
                <Row class="header">
                  <i-col span="6" class="orderLine message">
                    <div>商品信息</div>
                  </i-col>
                  <i-col span="6" class="orderLine orderNum">
                    <div>价格</div>
                  </i-col>
                  <i-col span="6" class="orderLine ordertime">
                    <div>数量</div>
                  </i-col>
                  <i-col span="6" class="orderLine ordertime">
                    <div>活动类型</div>
                  </i-col>
                  <!-- <i-col span="4" class="orderLine ordertime">
                    <div>操作</div>
                  </i-col>-->
                  <!-- <i-col
                    :span="getSpanNum(item.orderType)"
                    style="color:rgb(24, 144, 255)"
                    class="orderLine ordertime"
                  >
                    <div>操作</div>
                  </i-col>-->
                </Row>
                <Row class="ListDetail" v-for="(item1, index1) in item.goodsList" :key="index1">
                  <i-col
                    span="6"
                    class="orderLine ordertime"
                    style="border-bottom: 1px solid rgb(240, 240, 240);border-left: 1px solid rgb(240, 240, 240);"
                  >
                    <div class="orderGoodsMess">
                      <div class="imgLeft">
                        <img :src="item1.goodsImg" alt srcset />
                      </div>
                      <div class="rightMess">
                        <div class="goodsOrderNum">商品ID:{{item1.skuId}}</div>
                        <div class="goodsOrderName">{{item1.goodsName}}</div>
                        <div class="goodsOrderSpu">{{item1.goodsSpec}}</div>
                      </div>
                    </div>
                  </i-col>
                  <i-col span="6" class="orderLine ordertime">
                    <div>{{item1.goodsPrice}}</div>
                  </i-col>
                  <i-col span="6" class="orderLine ordertime">
                    <div>{{item1.goodsCount}}</div>
                  </i-col>
                  <i-col span="6" class="orderLine ordertime">
                    <div>{{item1.orderType}}</div>
                  </i-col>
                  <!-- <i-col span="4" class="orderLine ordertime">
                    <div @click="JumpDetail(orderList_child.orderNo)">查看详情</div> <div>发货</div>
                  </i-col>-->
                  <!-- <i-col
                    :span="getSpanNum(item.orderType)"
                    class="orderLine ordertime"
                    style="color:#1890FF"
                  >
                    <span
                      style="margin:0 15px;cursor: pointer;"
                      @click="JumpDetail(orderList_child.orderNo)"
                    >查看详情</span>

                    <span
                      v-if="('待发货'===orderList_child.orderStatus&& item.orderType==='拼团' && Number(orderList_child.grouponStatus )===1) ||　('待发货'===orderList_child.orderStatus&& item.orderType!=='拼团')"
                      style="margin:0 15px;cursor: pointer;"
                      @click="order(orderList_child)"
                    >发货</span>
                  </i-col>-->
                </Row>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 表格为空 -->
    <div style="text-align: center;" v-if="records.length===0">
      <img style="width:300px;" src="../../../../assets/imgs/1.png" alt />
    </div>

    <!-- 頁碼 -->
    <Page :total="total" class="pageClass" @on-change="onChangePage" />
    <Modal title="商品发货" v-model="modal10 " class-name="vertical-center-modal" @on-ok="ModalOK">
      <div class="item">
        <span>快递单号</span>
        <i-input size="large" v-model="orderNoInput" placeholder="请输入快递单号"></i-input>
      </div>
      <div class="item" v-if="CompanyInfo.trackingCompanyName ">
        <span>快递公司</span>
        <span>{{CompanyInfo.trackingCompanyName || '暂无'}}</span>
      </div>
    </Modal>

    <Modal
      title="商品分包裹发货"
      v-model="modal11 "
      class-name="vertical-center-modal"
      @on-ok="ModalOK2"
      @on-cancel="clearTrackingList"
    >
      <div class="item">
        <Button @click="addParcel">添加包裹</Button>
      </div>
      <div class="trackingList" v-for="(bao,guo) in trackingList" :key="guo">
        <div class="item">
          <span class="title">包裹 {{guo+1}}</span>
        </div>
        <div class="item">
          <span>商品（多选）</span>
          <Select v-model="bao.detailIdList" multiple style="width:250px">
            <Option
              v-for="(goods,goodsKey) in goodsList"
              :value="goods.orderDetailId"
              :key="goodsKey"
            >{{ goods.goodsName }}</Option>
          </Select>
        </div>
        <div class="item">
          <span>快递单号</span>
          <i-input
            size="large"
            v-model="bao.trackingNumber"
            placeholder="请输入快递单号"
            style="width:250px"
          ></i-input>
          <Button type="success" style="margin-left:15px" @click="pack(guo,bao.trackingNumber)">打包</Button>
          <Button type="error" style="margin-left:5px" v-if="guo>0" @click="deleteBao(guo)">取消</Button>
        </div>
        <div class="item">
          <span>快递公司</span>
          <span>{{bao.trackingCompanyName}}</span>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import clip from "@/utils/clipboard";
import myStorage from "utils/localstore";
export default {
  name: "order-list",
  data() {
    return {
      trackingList: [
        {
          trackingCompanyId: "",
          trackingNumber: "",
          detailIdList: [],
          trackingCompanyName: "",
        },
      ], // 分包发货数组
      trackingCompanyName: "", //快递公司名称
      goodsList: [], // 订单分包商品列表
      systemOrderNo: "", //发货订单号
      model12: [],
      orderList_child: {},
      CompanyInfo: {},
      orderNoInput: "",
      model1: "",
      modal10: false,
      modal11: false,
      total: 0,
      datepicker: "",
      value: "",
      orderInfo: {
        startDate: "",
        endDate: "",
        shopName: "",
        orderType: "",
        systemOrderNo: "",
        orderStatus: "",
        tel: "",
        name: "",
      },
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
      },
      records: [],
      // 订单状态（0待付款，1待收货，2已完成，3已取消，4待发货，5退款中，6退款完成）
      Status: [
        {
          value: 1,
          label: "普通订单",
        },
        {
          value: 2,
          label: "拼团",
        },
      ],
      statusList: [
        "待付款",
        "待收货",
        "已完成",
        "已取消",
        "待发货",
        "退款中",
        "退款完成",
      ],
      // 物流公司
      // url: "/order/groupon/autoCom?trackingSn=773040907408631"
    };
  },
  created() {
    let userInfo = JSON.parse(myStorage.get("userInfo"));
    if (userInfo) {
      this.orderInfo.shopId = userInfo.shop.shopId;
    }
    // alert(1)
    this.getOrderList();
  },
  watch: {
    orderNoInput() {
      console.log(1)
      this.getCompany(this.orderNoInput);
    },
    goodsList(){
      // alert(1)
    }
  },
  methods: {
    getSpanNum(val, orderList_child) {
      if (val === "拼团" && orderList_child.orderStatus !== "已取消") {
        return 4;
      } else {
        return 6;
      }
    },
    // 删除包裹
    deleteBao(e) {
      this.trackingList.splice(e, 1);
      // console.log(this.trackingList)
    },
    // 打包
    pack(e, k) {
      this.$get("/tracking/autoCom?trackingSn=" + k).then((res) => {
        // console.log(res)
        for (let j = 0; j < this.trackingList.length; j++) {
          if (e === j) {
            this.trackingList[j].trackingCompanyId = res.trackingId;
            this.trackingList[j].trackingCompanyName = res.trackingCompanyName;
          }
        }
      });
    },
    // 添加包裹
    addParcel() {
      let asda = {
        trackingCompanyId: "",
        trackingNumber: "",
        detailIdList: [],
        trackingCompanyName: "",
      };
      this.trackingList.push(asda);
    },
    // 分包裹发货弹窗
    orderPart(val, e) {
      console.log(e)
      this.modal11 = true;
      this.systemOrderNo = Number(e.orderNo);
      this.$get("/orderMaster/pull?orderNo=" + Number(e.orderNo)).then(
        (res) => {
          // console.log(res)
          this.goodsList = res;
        }
      );
    },
    // 确定分包发货
    ModalOK2() {
      this.$Modal.confirm({
        title: "请确认物流公司信息，执行此操作将无法返回？",
        onOk: () => {
          this.shipments();
        },
        onCancel: () => {
          this.$Message.info("取消发货");
        },
      });
    },
    // 发货
    shipments() {
      let subpackage = {
        orderNo: this.systemOrderNo,
        trackingList: this.trackingList,
      };
      this.$post("/tracking/subpackage", subpackage).then((data) => {
        this.$Message.success(data);
        // 清空弹窗内容
        this.clearTrackingList();
        this.getOrderList();
      });
    },
    // 清空输入框内容
    clearTrackingList() {
      this.trackingList = [
        {
          trackingCompanyId: "",
          trackingNumber: "",
          detailIdList: [],
          trackingCompanyName: "",
        },
      ];
      this.goodsList = [];
      this.trackingCompanyName = "";
      this.systemOrderNo = "";
    },
    // 普通发货查物流公司
    getCompany(val) {
      this.$get("/tracking/autoCom?trackingSn=" + val).then((data) => {
        this.CompanyInfo = data;
      });
    },
    JumpDetail(item) {
      console.log(item);
      // console.log('e',e)
      this.$router.push("/SupplierOrderDetail/" + item.orderNo);
    },
    // 普通发货弹窗
    order(val) {
      console.log(val);
      this.orderList_child = val;
      this.modal10 = true;
    },
    // 确定普通发货
    ModalOK() {
      if (this.orderNoInput) {
        if (this.CompanyInfo.trackingId) {
          this.$Modal.confirm({
            title: "请确认物流公司信息，执行此操作将无法回复？",
            onOk: () => {
              this.setSendGood(
                this.orderList_child.orderNo,
                this.orderNoInput,
                this.CompanyInfo.trackingId
              );
            },
            onCancel: () => {
              this.$Message.info("取消发货");
            },
          });
        } else {
          this.$tips.Message("error", `无法定位物流公司！≧◠◡◠≦✌'`, 3);
        }
      } else {
        this.$tips.Message("error", `请输入物流单号！≧◠◡◠≦✌'`, 3);
      }
    },
    // 普通发货接口
    setSendGood(orderSn, trackingSn, trackingCompanyId) {
      this.$get(
        `/tracking/deliver?orderSn=${orderSn}&trackingSn=${trackingSn}&trackingCompanyId=${trackingCompanyId}`
      ).then((data) => {
        console.log(data);
        this.$Message.info("已发货");
        this.orderNoInput = "";
        // this.pageInfo.pageNum=1
        this.getOrderList();
      });
    },
    exportExel() {
      let baseUrl = "http://restaurant-beta.cntracechain.com/admin/shopMaster/export";
      let url = this.StringParams(this.orderInfo);
      window.open(baseUrl + "?" + url);
    },
    StringParams(obj) {
      let params = [];
      for (const key in obj) {
        params.push(key + "=" + obj[key]);
      }
      return params.join("&");
    },
    sendGoods() {
      this.$Modal.confirm({
        title: "确认对话框标题",
        content: "<p>一些对话框内容</p><p>一些对话框内容</p>",
        onOk: () => {
          this.$Message.info("点击了确定");
        },
        onCancel: () => {
          this.$Message.info("点击了取消");
        },
      });
    },
    handleCopy(text, event) {
      clip(text, event);
      console.log("clicp");
    },
    DateChange(val) {
      this.orderInfo.startDate = val[0];
      this.orderInfo.endDate = val[1];
    },
    onChangeStaus(val) {
      this.orderInfo.orderType = val ? val : "";
    },
    onChangePage(val) {
      // console.log("val",val)
      this.pageInfo.pageNum = val;
      this.getOrderList();
    },
    onChangeorderStaus(val) {
      console.log(val);
      console.log(String(val) === "undefined");
      if (String(val) === "undefined") {
        this.orderInfo.orderStatus = "";
      } else {
        this.orderInfo.orderStatus = val;
      }
    },
    getClass1(status) {
      let index = (this.statusList || []).findIndex((item) => item === status);
      return "active" + index;
    },
    search() {
      this.pageInfo.pageNum = 1;
      this.getOrderList();
    },
    getOrderList() {
      // this.records=[]
      this.$post(
        "/shopMaster/list",
        Object.assign(this.pageInfo, this.orderInfo)
      ).then((data) => {
        this.records = data.records;
        this.total = data.total;
      });
    },
  },
};
</script>

<style scoped lang="less">
.orderList {
  padding: 15px;
  min-height: 750px;
  // 搜索條件
  .search {
    margin-top: 30px;
    .searchLine {
      margin-bottom: 15px;
      .orderLine {
        display: flex;
        align-items: center;
      }
    }
    .searchLine:last-child {
      margin-bottom: 30px;
    }
  }
  //列表
  .listTable {
    .orderItem {
      border: 1px solid #f0f0f0;
      box-shadow: 0 5px 5px #888888;
      margin-bottom: 50px;
      .orderItem_orderHeader {
        display: flex;
        background: rgba(250, 250, 250, 1);
        box-shadow: 0px 1px 0px 0px rgba(240, 240, 240, 1);
        align-items: center;
        padding: 15px 0;
        .orderNumber {
          margin-left: 25px;
        }
        .orderType {
          margin-left: 60px;
        }
      }
      .orderMess {
        border-bottom: 1px solid #f0f0f0;
        border-left: 1px solid #f0f0f0;
        border-right: 1px solid #f0f0f0;
        padding: 15px;

        font-size: 14px;
        .message {
          text-align: left;
        }
        .orderNum {
          text-align: left;
          // border: 1px solid #f0f0f0;
        }
        .ordertime {
          text-align: center;
          // border: 1px solid #f0f0f0;
        }
        .orderItem-type {
          text-align: center;
          padding-right: 20px;
          display: flex;
          flex-direction: row;
          align-items: center;
          .type {
            min-width: 70px;
            padding: 2px 0;
            background: rgba(255, 255, 255, 1);
            color: #ff6c6a;
            // border: 1px solid rgba(255, 108, 106, 1);
            border-radius: 1px;
            border-radius: 4px;
          }
        }
        .orderItem-type-reserve {
          padding-right: 20px;
          flex-direction: row-reverse;
          // align-items: center;
          display: flex;
          .type {
            min-width: 70px;
            padding: 2px 0;
            background: rgba(255, 255, 255, 1);
            color: #ff6c6a;
            // border: 1px solid rgba(255, 108, 106, 1);
            border-radius: 1px;
            border-radius: 4px;
          }
        }
      }
    }
    .orderDetail-item {
      .orderDetail-orderItem {
        .orderItem_orderHeader {
          display: flex;
          background: rgba(250, 250, 250, 1);
          box-shadow: 0px 1px 0px 0px rgba(240, 240, 240, 1);
          align-items: center;
          padding: 15px 0;
          .orderNumber {
            margin-left: 25px;
          }
          .orderType {
            margin-left: 60px;
          }
        }
        .title {
          font-size: 20px;
          font-weight: 800;
        }
        .orderDetail-orderMess {
          // margin-top: 15px;
          padding: 15px 0;
          font-size: 14px;
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
            }
          }
          .ListDetail {
            display: flex;
            align-items: center;
            .orderLine {
              border-bottom: 1px solid rgb(240, 240, 240);
              border-right: 1px solid rgb(240, 240, 240);
              height: 150px;
              align-items: center;
              justify-content: center;
              display: flex;

              .orderGoodsMess {
                margin: 20px 0;
                flex: 1;
                display: flex;
                align-items: center;
                padding: 0 10px;

                .imgLeft {
                  // flex: 0.;
                  margin: 0 15px;
                  width: 60px;
                  height: 60px;
                  // background: red;
                  img {
                    width: 100%;
                    height: 100%;
                  }
                }
                .rightMess {
                  flex: 1;
                  display: flex;
                  flex-direction: column;
                  text-align: left;

                  font-style: 14px;
                  .goodsOrderNum {
                    color: #c8c8c8;
                    margin-bottom: 8px;
                  }
                  .goodsOrderSpu {
                    margin-top: 8px;
                    color: #c8c8c8;
                  }
                }
              }
            }
            .ordertype {
              text-align: center;
              padding-right: 20px;
              display: flex;
              flex-direction: row-reverse;
              .type {
                min-width: 70px;
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
    }
  }
  // （0待付款，1待收货，2已完成，3已取消，4待发货，5退款中，6退款完成
  .active0 {
    color: turquoise;
  }
  .active1 {
    color: rgb(19, 228, 113);
  }
  .active2 {
    color: green;
  }
  .active3 {
    color: red;
  }
  .active4 {
    color: rgb(19, 228, 113);
  }
  .active5 {
    color: rgb(19, 228, 113);
  }
  .active6 {
    color: red;
  }
  .active7 {
    color: green;
  }
}
.pageClass {
  position: absolute;
  bottom: 10px;
  right: 50px;
}
.vertical-center-modal {
  .trackingList {
    border-bottom: 1px dotted #ccc;
    .item {
      display: flex;
      align-items: center;
      margin: 15px 0;
      .title {
        font-size: 18px;
        font-weight: 600;
      }
      span {
        display: inline-block;
        width: 100px;
      }
    }
  }
  ::first-child {
    border-bottom: 0px dotted #ccc;
  }
}
</style>