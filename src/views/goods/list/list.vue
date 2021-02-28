<template>
  <div class="goodsList">
    <div class="search">
      <Row class="searchLine">
        <i-col span="6" class="orderLine">
          <div>商品名称：</div>
          <Input v-model="goodsInfo.goodsName" placeholder="请输入商品名称" clearable style="width:200px" />
        </i-col>
        <i-col span="6" class="orderLine">
          <div>创建日期：</div>
          <Date-picker
            type="datetimerange"
            v-model="FinishTime"
            placeholder="选择日期和时间"
            style="width: 200px"
            @on-change="handleFinishTime()"
          ></Date-picker>
        </i-col>
        <i-col span="6" class="orderLine">
          <div>商品分类：</div>
          <Cascader
            :data="Categorylist"
            change-on-select
            v-model="categoryId"
            @on-change="onChange"
          ></Cascader>
        </i-col>
        <i-col span="6" class="orderLine">
          <Button type="primary" style="margin:0 10px" class="btn" @click="handleAddGood">新建</Button>
          <Button type="primary" @click="SearchGoodsList" class="btn">搜索</Button>
          <Button type="error" @click="CancelList" style="margin-left: 15px;" class="btn">取消</Button>
        </i-col>
      </Row>
    </div>
    <div class="list">
      <i-table :columns="columns1" :data="data1" style="width:100%" border></i-table>
    </div>
    <div class="page">
      <Page
        :current="this.goodsInfo.pageNum"
        :page-size="this.goodsInfo.pageSize"
        :total="total"
        show-sizer
        show-total
        @on-change="pageNumList"
        @on-page-size-change="pagSiezeList"
      />
    </div>
  </div>
</template>

<script>
// import { data,data2, tabData, list} from "./data.js";
export default {
  name: "shop-list",
  data() {
    return {
      data1211: [],
      FinishTime: [], // 创建日期
      columns1: [
        {
          title: "商品名称",
          key: "spuName",
          render: (h, params) => {
            return h("span",{
              style:{
                fontSize:'12px'
              }
            }, [
              h("span", params.row.spuName )
            ]);
          }
        },
        {
          title: "商品分类",
          key: "category",
          render: (h, params) => {
            return h("span",{
              style:{
                fontSize:'12px'
              }
            }, [
              h("span", params.row.category )
            ]);
          }
        },
        {
          title: "所属店铺",
          key: "shop"
        },
      
        {
          title: "创建日期",
          key: "createTime",
          width:180
        },
          {
          title: "商品状态",
          key: "status",
          width:100,
          render: (h, params) => {
            return h("span", [
              h("span", params.row.status === 1 ? "已上架" : "已下架")
            ]);
          }
        },
        {
          title: "操作",
          key: "action",
          width:200,
          // width: 120,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  style: { color: "#005afe",fontSize:"13px" },
                  on: {
                    click: () => {
                      this.$router.push({name: 'create-good',params: { type: 'edit',shopId: 0,spuid: params.row.id}})
                    }
                  }
                },
                '编辑商品'
              ),
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  style: { color: "#005afe",fontSize:"13px" },
                  on: {
                    click: () => {
                      this.upDown(params);
                    }
                  }
                },
                params.row.status === 0 ? "上架" : "下架"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  style: { color: "#005afe",fontSize:"13px" },
                  on: {
                    click: () => {
                      this.$router.push("/contentGood/" + params.row.id);
                    }
                  }
                },
                "商品推文"
              )
            ]);
          }
        }
      ],
      data1: [],
      total: 0,
      goodsInfo: {
        goodsName: "",
        startTimestamp: 0,
        endTimestamp: 0,
        categoryId: 0,
        pageNum: 1,
        pageSize: 10
      },
      Categorylist: [], //分类列表
      categoryId: [], //选择分类id数组
      list: []
    };
  },
  async created() {     
    await this.getCategorylist();
    await this.getOneGoodsList();
  },
  methods: {


    upDown(params) {
      this.$get("/spu/switchGoods/" + params.row.id).then(res => {
        console.log(res);
        this.getGoodsList();
      });
    },
    // 第一次获取列表
    getOneGoodsList() {
      console.log("one");
      let param = {
        goodsName: "",
        startTimestamp: 0,
        categoryId: 0,
        pageNum: 1,
        pageSize: 10
      };
      this.$post("/spu/view", param).then(data => {
        this.data1 = data.records;
        this.total = data.total;
        this.goodsInfo.pageSize = data.size;
        this.goodsInfo.pageNum = data.current;
      });
    },
    // 获取分类列表
    getCategorylist() {
      // console.log(1111111)
      // alert('asssss')
      this.$get("/category/getTree").then(data => {
        this.Categorylist = data.map((item, index) => {
          return this.generateRoutes1(item);
        });
      });
    },
    // 处理分类树
    generateRoutes1(item) {
      let obj = {};
      obj.label = item.name;
      obj.value = item.id;
      obj.children = item.son.map(item => {
        return this.generateRoutes1(item);
      });
      return obj;
    },
    // 搜索列表
    getGoodsList() {
      if (this.goodsInfo.endTimestamp === 0) {
        let param2 = {
          goodsName: this.goodsInfo.goodsName,
          startTimestamp: 0,
          categoryId: this.goodsInfo.categoryId,
          pageNum: this.goodsInfo.pageNum,
          pageSize: this.goodsInfo.pageSize
        };
        this.$post("/spu/view", param2).then(data => {
          this.data1 = data.records;
          this.total = data.total;
          this.goodsInfo.pageSize = data.size;
          this.goodsInfo.pageNum = data.current;
        });
      } else {
        let param3 = {
          goodsName: this.goodsInfo.goodsName,
          startTimestamp: this.goodsInfo.startTimestamp,
          endTimestamp: this.goodsInfo.endTimestamp,
          categoryId: this.goodsInfo.categoryId,
          pageNum: this.goodsInfo.pageNum,
          pageSize: this.goodsInfo.pageSize
        };
        this.$post("/spu/view", param3).then(data => {
          this.data1 = data.records;
          this.total = data.total;
          this.goodsInfo.pageSize = data.size;
          this.goodsInfo.pageNum = data.current;
        });
      }
    },
    // 时间戳
    handleFinishTime() {
      // 结单
      if (this.FinishTime[0] === "") {
        this.goodsInfo.startTimestamp = 0;
        this.goodsInfo.endTimestamp = 0;
      } else {
        for (let j = 0; j < this.FinishTime.length; j++) {
          let fmp = Date.parse(this.FinishTime[j]).toString();
          this.FinishTime[j] = fmp.substr(0, 10);
        }
        this.goodsInfo.startTimestamp = this.FinishTime[0];
        this.goodsInfo.endTimestamp = this.FinishTime[1];
      }
    },
    onChange(value) {
      console.log(value);
      if (value.length === 0) {
        this.goodsInfo.categoryId = 0;
      } else {
        this.goodsInfo.categoryId = value.slice(-1)[0];
      }
    },
    // 搜索列表
    SearchGoodsList() {
      this.goodsInfo.pageNum=1
      this.getGoodsList();
    },
    // 分页
    pageNumList(value) {
      this.goodsInfo.pageNum = Number(value);
      this.getGoodsList();
    },
    // 页数大小
    pagSiezeList(value) {
      this.goodsInfo.pageSize = Number(value);
      this.goodsInfo.pageNum = 1;
      this.getGoodsList();
    },
    // 取消搜索
    CancelList() {
      this.categoryId=[]
      this.goodsInfo.goodsName = "";
      this.goodsInfo.startTimestamp = 0;
      this.goodsInfo.endTimestamp = 0;
      this.goodsInfo.categoryId = 0;
      this.goodsInfo.pageNum = 1;
      this.goodsInfo.pageSize = 10;
      this.getOneGoodsList();
    },

    // 新建商品
    handleAddGood() {
      this.$router.push({name: 'create-good',params: { type: 'add',shopId:"0" }})
    }
  }
};
</script>

<style scoped lang="less">
.goodsList {
  padding: 15px;
  .ivu-col-span-6 {
    align-items: center;
  }
  .search {
    margin-top: 30px;
    .searchLine {
      margin-bottom: 15px;
      .orderLine {
        display: flex;
      }
    }
    .searchLine:last-child {
      margin-bottom: 30px;
    }
  }
  .page {
    margin: 20px;
    // float: right;
    display: flex;
    justify-content: flex-end;
  }
}
</style>