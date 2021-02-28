<template>
  <div class="shopList">
    <Row class="search" type="flex" align="middle">
      <i-col span="8" class="orderLine">
        <span style="fontSize:14px">店铺名称：</span>
        <Input placeholder="请输入" style="width:80%" />
      </i-col>
      <i-col span="8" class="orderLine">
        <span style="fontSize:14px">创建日期：</span>
        <DatePicker type="daterange" split-panels placeholder="请选择" style="width:80%"></DatePicker>
      </i-col>
      <Button type="primary" class="btn" @click.native="$router.push({name: 'create-shop'})">新建</Button>
    </Row>
    <div class="list">
      <Table :columns="columns" :data="tableData">
        <template slot="operation">
            <span class="slot-item">新建商品</span>
            <span class="slot-item" @click="$router.push({name:'detail-shop'})">查看详情</span>
        </template>
      </Table>
    </div>

    <!-- 分页 -->
    <div class="page">
      <Page
        :current="1"
        :page-size="10"
        :total="1"
        show-sizer
        show-total
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "shop-list",
  data() {
    return {
      columns: [
        {
          title: "店铺名称",
          key: "shopName"
        },
        {
          title: "管理员名字",
          key: "shopContact"
        },
        {
          title: "管理员手机号",
          key: "contactNumber"
        },
        {
          title: "创建日期",
          key: "createTime"
        },
        {
          title: "操作",
          slot: "operation"
        }
      ],
      filterParams: {
        shopName: "",	// 店铺名称
        startDate: "",  // 开始时间
        endDate: "",  // 结束时间
        pageNum: 1,  // 当前页
        pageSize: 10   // 页容量
      },
      tableData: [
         {
          "shopId": 1,
          "shopName": "十月芬芳店铺1",
          "shopContact": "李东升1",
          "contactNumber": "13456776545",
          "shopStatus": 1,
          "createTime": "2020-05-27 11:18:25"
        },
        {
          "shopId": 2,
          "shopName": "十月芬芳店铺2",
          "shopContact": "李东升2",
          "contactNumber": "13456776545",
          "shopStatus": 1,
          "createTime": "2020-05-28 11:18:25"
        },
        {
          "shopId": 3,
          "shopName": "十月芬芳店铺3",
          "shopContact": "李东升3",
          "contactNumber": "13456776545",
          "shopStatus": 1,
          "createTime": "2020-05-29 11:18:25"
        }
      ]
    };
  },

  created() {
    this.getShopList()
  },

  methods: {
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
    // 获取店铺列表
    getShopList() {
      let params = this.initParams(this.filterParams)
      this.$post('/shop/list',this.filterParams).then(res => {
        console.log(res)
      })
    }
  }
};
</script>

<style scoped lang="less">
.shopList {
  padding: 15px;
  .search {
    padding: 15px 10px 26px;
    border-bottom: 1px solid #EFEFEF;
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