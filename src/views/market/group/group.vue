<template>
  <div class="Rectangle">
    <div class="search">
      <Row class="searchLine">
        <i-col span="6" class="orderLine">
          <div>主题名称：</div>
          <Input v-model="groupInfo.title" placeholder="请输入商品名称" clearable style="width:250px" />
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
          <div>拼团类型：</div>
          <i-select style="width:250px" clearable v-model="groupInfo.status">
            <i-option
              v-for="(item,index) in status"
              :value="item.value"
              :key="index"
            >{{ item.label }}</i-option>
          </i-select>
        </i-col>
        <i-col span="6" class="orderLine">
          <div>活动状态：</div>
          <i-select style="width:250px" clearable v-model="groupInfo.type">
            <i-option v-for="(item,index) in type" :value="item.value" :key="index">{{ item.label }}</i-option>
          </i-select>
        </i-col>
      </Row>
      <Row class="searchLine">
        <i-col span="6" class="orderLine">
          <Button type="primary" @click="SearchGoodsList" class="btn">搜索</Button>
          <Button type="error" @click="CancelList" style="margin-left: 15px;" class="btn">取消</Button>
          <Button type="success" @click="handleAddGood" style="margin-left: 15px;" class="btn">新建活动</Button>
        </i-col>
      </Row>
    </div>
    <!-- 表格 -->
    <div class="list">
      <Table :columns="columns1" :data="data1" border></Table>
    </div>

    <div class="page">
      <Page
        :current="groupInfo.pageNum"
        :page-size="groupInfo.pageSize"
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
export default {
  name: "market-group",
  data () {
    return {
      groupInfo: {
        "title": "",
        "createStartTimestamp": 0,
        "createEndTimestamp": 0,
        "type": -1,
        "status": -1,
        "pageNum": 1,
        "pageSize": 10
      },
      total: 0,
      FinishTime: [], // 创建日期
      columns1: [
        {
          title: '活动主题',
          key: 'activityTitle',
        },
        {
          title: '拼团类型',
          key: 'mode',
          width: 150,
          render: (h, params) => {
            return h("div", [
              h("span", params.row.mode === 0 ? "普通团" : params.row.mode === 1 ? '抽奖团' : '阶梯团')
            ]);
          }
        },
        {
          title: '成团人数',
          key: 'groupCount',
          width: 150
        },
        {
          title: '开始时间',
          key: 'startTime',
          width: 200
        },
        {
          title: '结束时间',
          key: 'endTime',
          width: 200
        },
        {
          title: '创建日期',
          key: 'createTime'
        },
        {
          title: '活动状态',
          key: 'status',
          render: (h, params) => {
            return h("div", [
              h("span", params.row.status === 0 ? "未开始" : params.row.status === 1 ? '进行中' : '已过期')
            ]);
          }
        },
        {
          title: '操作',
          key: 'action',
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  style: { color: "#005afe", fontSize: "13px" },
                  on: {                    click: () => {
                      console.log(params)
                      this.$router.push("/marketDetails/" + params.row.id)
                      // this.$router.push({ name: 'market-details', params: { type: 'edit', spuid: params.row.id } })
                    }
                  }


                },
                '活动详情'),

              h(
                "Button",
                {
                  props: {

                    type: "text",
                    size: "small"
                  },
                  style: { color: "#005afe", fontSize: "13px" },
                  on: {                    click: () => {
                      console.log(params)
                      if (params.row.status === 2) {
                        this.$Message.error("活动已过期")
                      } else {
                        this.$router.push("/marketModification/" + params.row.id)
                        this.$router.push({ path: 'marketModification', query: { status: params.row.status, activitiesId: params.row.id } })
                      }                      // this.$router.push({ name: 'market-details', params: { type: 'edit', spuid: params.row.id } })
                    }
                  }
                },
                '编辑'),
            ])
          }
        }
      ],
      data1: [

      ],
      type: [
        {
          value: -1,
          label: "所有类型"
        },
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
      status: [
        {
          value: -1,
          label: "全部"
        },
        {
          value: 0,
          label: "未开始"
        },
        {
          value: 1,
          label: "进行中"
        },
        {
          value: 2,
          label: "已过期"
        }
      ]
    }
  },
  created () {
    this.getGrouplist()
  },
  // 新建活动
  methods: {
    //   获取列表
    getGrouplist () {
      this.$post("/grouponActivities/views", this.groupInfo).then(data => {
        console.log(data)
        this.data1 = data.records;
        this.total = data.total;
        this.groupInfo.pageSize = data.size;
        this.groupInfo.pageNum = data.current;
      });
    },
    // 搜索列表
    SearchGoodsList () {
      this.groupInfo.pageNum = 1
      this.getGrouplist();
    },
    // 分页
    pageNumList (value) {
      this.groupInfo.pageNum = Number(value);
      this.getGrouplist();
    },
    // 页数大小
    pagSiezeList (value) {
      this.groupInfo.pageSize = Number(value);
      this.groupInfo.pageNum = 1;
      this.getGrouplist();
    },
    // 清空搜索条件
    CancelList () {
      this.groupInfo = {
        "title": "",
        "createStartTimestamp": 0,
        "createEndTimestamp": 0,
        "type": -1,
        "status": -1,
        "pageNum": 1,
        "pageSize": 10
      }
      this.getGrouplist()
    },
    // 时间戳
    handleFinishTime () {
      // 结单
      if (this.FinishTime[0] === "") {
        this.groupInfo.createStartTimestamp = 0;
        this.groupInfo.createEndTimestamp = 0;
      } else {
        for (let j = 0; j < this.FinishTime.length; j++) {
          let fmp = Date.parse(this.FinishTime[j]).toString();
          this.FinishTime[j] = fmp.substr(0, 10);
        }
        this.groupInfo.createStartTimestamp = this.FinishTime[0];
        this.groupInfo.createEndTimestamp = this.FinishTime[1];
      }
    },
    handleAddGood () {
      this.$router.push({ name: 'market-create', params: { type: 'add' } })
    }
  }
}
</script>

<style scoped lang="less">
.Rectangle {
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