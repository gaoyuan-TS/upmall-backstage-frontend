<template>
  <div class="shopList">
    <Row class="search" type="flex" align="middle">
      <i-col span="7" class="orderLine">
        <span style="fontSize:14px">供应商名称：</span>
        <Input placeholder="请输入" v-model="filterParams.shopName" style="width:60%" />
      </i-col>
      <i-col span="7" class="orderLine">
        <span style="fontSize:14px">供应商状态：</span>
        <Select clearable style="width: 60%;margin-left: 15px;" v-model="filterParams.shopStatus">
          <Option v-for="(item,index) in levelList" :value="item.value" :key="index">{{item.lebal}}</Option>
        </Select>
      </i-col>
      <i-col span="7" class="orderLine">
        <span style="fontSize:14px">创建日期：</span>
        <Date-picker
          type="datetimerange"
          v-model="FinishTime"
          placeholder="选择日期和时间"
          style="width: 60%"
          @on-change="handleFinishTime"
        ></Date-picker>
      </i-col>
      <Button type="primary" class="btn" @click.native="$router.push('/createSupplier/0')">新建</Button>
    </Row>
    <div class="list">
      <Table :columns="columns" :data="tableData"></Table>
    </div>

    <!-- 分页 -->
    <div class="page">
      <Page :current="1" :page-size="10" :total="total" show-total @on-change="pageNumList" />
    </div>
  </div>
</template>

<script>
export default {
  name: "shop-list",
  data() {
    return {
      levelList: [
        //列表等级数组
        {
          value: "1",
          lebal: "正常",
        },
        {
          value: "0",
          lebal: "禁用",
        },
      ],
      columns: [
        {
          title: "供应商名称",
          key: "shopName",
        },
           {
          title: "管理员姓名",
          key: "shopContact",
        },
        {
          title: "归属运营中心",
          key: "operatingCenterName",
        },
        {
          title: "管理员手机号",
          key: "contactNumber",
        },

        {
          title: "供应商状态",
          key: "shopStatus",
             width:150,
          render: (h, params) => {
            return h("span", [
              h("span", params.row.shopStatus === 1 ? "正常" : "禁用"),
            ]);
          },
        },
        {
          title: "操作",
          key: "contactNumber",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small",
                  },
                  style: { color: "#005afe", fontSize: "13px" },
                  on: {
                    click: () => {
                      console.log(params);
                      this.$router.push("/createSupplier/" + params.row.shopId);
                    },
                  },
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small",
                  },
                  style: { color: "#005afe", fontSize: "13px" },
                  on: {
                    click: () => {
                      this.upDown(params);
                    },
                  },
                },
                params.row.shopStatus === 1 ? "禁止" : "开通"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small",
                  },
                  style: { color: "#005afe", fontSize: "13px" },
                  on: {
                    click: () => {
                      this.$router.push("/detailSupplier/" + params.row.shopId);
                    },
                  },
                },
                "查看详情"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small",
                  },
                  style: { color: "#005afe", fontSize: "13px" },
                  on: {
                    click: () => {
                      this.$router.push("/createGood/add/"+ params.row.shopId);
                    },
                  },
                },
                "新建商品"
              ),
            ]);
          },
        },
      ],
      FinishTime: "",
      filterParams: {
        startDate: "",
        endDate: "",
        shopName: "",
        shopStatus: "",
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
      tableData: [],
    };
  },

  created() {
    this.getShopList();

  },
  watch: {
    filterParams: {
      handler() {
        this.getShopList();
      },
      deep: true,
    },
  },
  methods: {
    upDown(params) {
       let shopStatus = Number(params.row.shopStatus) === 0 ? 1 : 0;
      this.$Modal.confirm({
        title: "提示", 
        content: `确定${Number(params.row.shopStatus) === 0 ? '禁用' : '开通'}此供应商？`,
        onOk: () => {
         
          this.$get(
            "/shop/updateSupplierStatus?shopId=" +
              params.row.shopId +
              "&status=" +
              shopStatus
          ).then((res) => {
            this.$Message.info(res);
            this.filterParams.pageNum = 1;
            this.getShopList();
          });
        },
      });
    },
    // 分页
    pageNumList(value) {
      this.filterParams.pageNum = Number(value);
    },
    // 初始参数
    initParams(obj) {
      let params = {};
      for (let key in obj) {
        if (obj[key]) {
          params[key] = obj[key];
        }
      }
      return params;
    },
    // 时间戳
    handleFinishTime(val) {
      console.log(val);
      if (val) {
        this.filterParams.startDate = val[0];
        this.filterParams.endDate = val[1];
      } else {
        this.filterParams.startDate = "";
        this.filterParams.endDate = "";
      }

      // 结单
      // if (this.FinishTime[0] === "") {
      //   this.goodsInfo.startTimestamp = 0;
      //   this.goodsInfo.endTimestamp = 0;
      // } else {
      //   for (let j = 0; j < this.FinishTime.length; j++) {
      //     let fmp = Date.parse(this.FinishTime[j]).toString();
      //     this.FinishTime[j] = fmp.substr(0, 10);
      //   }
      //   this.goodsInfo.startTimestamp = this.FinishTime[0];
      //   this.goodsInfo.endTimestamp = this.FinishTime[1];
      // }
    },
    // 获取店铺列表
    getShopList() {
      let params = this.initParams(this.filterParams);
      this.$post("/shop/list", this.filterParams).then((res) => {
        console.log(res);
        this.tableData = res.records;
        this.total = res.total;
      });
    },
  },
};
</script>

<style scoped lang="less">
.shopList {
  padding: 15px;
  .search {
    padding: 15px 10px 26px;
    border-bottom: 1px solid #efefef;
    margin-bottom: 27px;
    .orderLine {
      margin-right: 25px;
    }
  }
  .list {
    .slot-item {
      color: @theme-color-s;
      margin: 0 4px;
      &:hover {
        cursor: pointer;
        text-decoration: underline;
      }
    }
  }

  .page {
    text-align: right;
    margin-top: 50px;
    margin-bottom: 20px;
  }
}
</style>
<style lang="less" scoped>
</style>