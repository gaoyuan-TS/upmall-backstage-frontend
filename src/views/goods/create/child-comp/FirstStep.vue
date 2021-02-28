<template>
  <div class="first-step" @click.stop.prevent="handleClick">
    <div class="title-wrap">
      <Form :model="form" inline>
        <FormItem label="店铺：" :label-width="80" style="margin-right: 138px;">
          <!-- <Input v-model="form.shop" type="text" placeholder="输入店铺名称后检索结果" style="width: 250px;"/> -->
          <Select v-model="form.shopId" style="width: 250px;" @on-change="handleChnageShop">
            <Option
              v-for="item in shopList"
              :value="item.shopId"
              :key="item.shopId"
            >{{ item.shopName }}</Option>
          </Select>
        </FormItem>
        <!-- <FormItem label="商品条形码：" :label-width="100">
          <Input v-model="form.code" type="text" placeholder="请输入" style="width: 250px;"/>
        </FormItem>-->
      </Form>
    </div>

    <!-- 主体 -->
    <div class="main">
      <Form :model="categoryForm" inline>
        <FormItem label="类别名：" :label-width="70" style="margin-bottom:32px" class="search-category">
          <Input
            type="text"
            v-model="categoryForm.name"
            placeholder="请输入  按enter键搜索"
            style="width: 550px;"
            @on-blur="handleBlur"
            @on-focus="handleFocus"
            @on-enter="searchCategory"
          />
          <div class="search-list" style="display:none;tra" ref="searchList">
            <div
              class="category-item"
              v-for="(item,index) in categoryList"
              :key="index"
              @click="handleClikItem(item)"
            >{{item.fullName}}</div>

            <div class="empty" v-show="categoryEmepy">暂无相关类名</div>
          </div>
        </FormItem>

        <!-- 搜索模块 -->
        <div class="search-wrap">
          <div class="first-level level">
            <div class="search-input" style="padding:0 36px">
              <Input
                v-model="categoryForm.first_search"
                type="text"
                @on-enter="searchFirst"
                placeholder="一级分类搜索 按enter键搜索"
                style="width: 100%;"
              />
            </div>
            <div class="level-list">
              <div
                class="list-item"
                v-for="(item,index) in firstLevelList"
                :key="index"
                @click="handleFirstLevel(item,index)"
                :class="{'item-active':firstIndex === index}"
              >
                <span>{{item.categoryName}}</span>
                <Icon type="md-arrow-dropright" size="18" />
              </div>
              <div class="empty" v-show="firstEmpty">暂无相关类名</div>
            </div>
          </div>

          <div class="second-level level">
            <div class="search-input" style="padding:0 36px">
              <Input
                v-model="categoryForm.second_search"
                type="text"
                :disabled="secondDisable"
                @on-enter="searchSecond"
                placeholder="二级分类搜索 按enter键搜索"
                style="width: 100%;"
              />
            </div>
            <div class="level-list">
              <div
                class="list-item"
                v-for="(item,index) in secondLevelList"
                :key="index"
                @click="handleSecondLevel(item,index)"
                :class="{'item-active':secondIndex === index}"
              >
                <span>{{item.categoryName || item.name}}</span>
                <!-- <span>{{item.name}}</span> -->
                <Icon type="md-arrow-dropright" size="12" />
              </div>
              <div class="empty" v-show="secondEmpty">暂无相关类名</div>
            </div>
          </div>

          <div class="third-level level">
            <div class="search-input" style="padding:0 36px">
              <Input
                v-model="categoryForm.thrid_search"
                type="text"
                :disabled="thirdDisable"
                @on-enter="searchThird"
                placeholder="三级分类搜索 按enter键搜索"
                style="width: 100%;"
              />
            </div>
            <div class="level-list">
              <div
                class="list-item"
                v-for="(item,index) in thirdLevelList"
                :key="index"
                @click="handleThirdLevel(item,index)"
                :class="{'item-active':thirdIndex === index}"
              >
                <span>{{item.categoryName || item.name}}</span>
                <!-- <span>{{item.name}}</span> -->
                <Icon type="md-arrow-dropright" size="12" />
              </div>
              <div class="empty" v-show="thirdEmpty">暂无相关类名</div>
            </div>
          </div>

          <div class="four-level level">
            <div class="search-input" style="padding:0 36px">
              <Input
                v-model="categoryForm.four_search"
                type="text"
                :disabled="fourDisable"
                @on-enter="searchFour"
                placeholder="四级分类搜索 按enter键搜索"
                style="width: 100%;"
              />
            </div>
            <div class="level-list">
              <div
                class="list-item"
                v-for="(item,index) in fourLevelList"
                :key="index"
                @click="handleFourLevel(item,index)"
                :class="{'item-active':fourIndex === index}"
              >
                <span>{{item.categoryName || item.name}}</span>
                <!-- <span>{{item.name}}</span> -->
                <Icon type="md-arrow-dropright" size="12" />
              </div>
              <div class="empty" v-show="fourEmpty">暂无相关类名</div>
            </div>
          </div>
        </div>

        <!-- 已选分类 -->
        <div class="choosed">已选分类：{{chooseCategory.category | formatCategory}}</div>
      </Form>
    </div>

    <!-- 下一步按钮 -->
    <div class="btn-wrap">
      <Button type="primary" class="btn" @click="handleNext">下一步</Button>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  inject: ["create"],
  name: "first-step",
  props: {
    shopList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      form: {
        shopId: "", // 商家id
        code: "", // 商品条形码
      },
      categoryForm: {
        name: "",
        first_search: "", //  一级分类名称搜索
        second_search: "", // 二级分类名称搜索
        thrid_search: "", // 三级分类名称搜索
        four_search: "", //  四级分类名称搜索
      },
      firstLevelList: [], // 一级分类搜索数据
      secondLevelList: [], // 二级分类搜索数据
      thirdLevelList: [], // 三级分类搜索数据
      fourLevelList: [], // 四级分类搜索数据
      firstIndex: null, // 一级索引
      secondIndex: null, // 二级索引
      thirdIndex: null, // 三级索引
      fourIndex: null, // 四级索引
      chooseCategory: {
        // 已选择分类
        ids: [],
        category: [],
      },
      firstId: null, // 一级分类id
      secondId: null, // 二级分类id
      thirdId: null, // 三级分类id
      secondDisable: true, // 控制二级分类禁止
      thirdDisable: true, // 控制三级分类禁止
      fourDisable: true, // 控制四级分类禁止
      firstEmpty: false, // 控制一级分类为空
      secondEmpty: false, // 控制一级分类为空
      thirdEmpty: false, // 控制一级分类为空
      fourEmpty: false, // 控制一级分类为空
      categoryEmepy: false, // 控制类名搜索为空
      categoryList: [], // 存放类名搜索的结果
    };
  },
  created() {
    console.log("created");
    this.getFirstLevel();
    // this.getShopList()
  },
  watch: {
    shopList: {
      handler() {
        console.log("$router",this.$route.params)
              let shopName = this.shopList.find(v =>Number(v.shopId)  === Number(this.$route.params.shopId)).shopName;
              this.form.shopName = shopName;
              this.form.shopId=Number(this.$route.params.shopId)
      },
    },
    deep: true,
  },
  mounted() {
    console.log(this.shopList);
    this.$bus.$on("edit", () => {
      this.firstIndex = null; // 一级索引
      this.secondIndex = null; // 二级索引
      this.thirdIndex = null; // 三级索引
      this.fourIndex = null; // 四级索引
      this.chooseCategory = {
        ids: [],
        category: [],
      };
      this.secondLevelList = [];
      this.thirdLevelList = [];
      this.fourLevelList = [];
      this.firstId = null; // 一级分类id
      this.secondI = null; // 二级分类id
      this.thirdId = null; // 三级分类id
      this.secondDisable = true; // 控制二级分类禁止
      this.thirdDisable = true; // 控制三级分类禁止
      this.fourDisable = true; // 控制四级分类禁止
    });
  },
  filters: {
    formatCategory(value) {
      if (value) {
        return value.join("/");
      }
    },
  },

  methods: {
    ...mapMutations(["setChooseCategory", "setBaseProperty", "setShop"]),
    handleClick() {
      this.$refs.searchList.style.display = "none";
    },

    // 获取店铺列表
    // getShopList() {
    //   this.$get('/shop/pull?shopName=').then(res => {
    //     this.shopList = res
    //   })
    // },

    // 搜索类别名
    searchCategory(event) {
      const { value } = event.target;
      if (this.categoryForm.first_search) {
        // 如果一级或e分类含有内容
        this.$get("/category/getLevel?level=1&status=1", false).then((res) => {
          this.firstLevelList = res;
          this.firstEmpty = this.firstLevelList.length === 0 ? true : false;
          // 并且初始化下面4个的搜索框
          this.$set(this.categoryForm, "first_search", "");
          this.$set(this.categoryForm, "second_search", "");
          this.$set(this.categoryForm, "thrid_search", "");
          this.$set(this.categoryForm, "four_search", "");
        });
      }

      this.$get(`/category/allQuery?name=${value}`).then((res) => {
        this.categoryEmepy = res.length === 0 ? true : false;
        this.categoryList = res;
        this.$refs.searchList.style.display = "block";
        this.secondDisable = true;
        this.thirdDisable = true;
        this.fourDisable = true;
        this.secondEmpty = false;
        this.thirdEmpty = false;
        this.fourEmpty = false;
      });
    },

    // 输入框聚焦
    handleFocus() {
      // this.$refs.searchList.style.display = 'block'
    },

    // 输入框失焦
    handleBlur() {
      // this.$refs.searchList.style.display = 'none'
    },

    // 点击类名选择的下拉框的item
    handleClikItem(item) {
      console.log(1);
      console.log(item);
      this.$refs.searchList.style.display = "none";
      // 请求数据
      this.$get(`/category/getTarget?idList=${item.linkIndex}`, false).then(
        (res) => {
          for (let item1 of res) {
            if (item1.status === true) {
              this.secondLevelList = item1.son;
              let index1 = this.firstLevelList.findIndex(
                (v) => v.id === item1.id
              );
              this.firstIndex = index1;
              let index2 = this.secondLevelList.findIndex(
                (v) => v.status === true
              );
              this.secondIndex = index2;
              this.firstId = item1.id;

              this.$set(this.chooseCategory.ids, 0, item1.id);
              this.$set(this.chooseCategory.category, 0, item1.name);
            }
            for (let item2 of item1.son) {
              if (item2.status === true) {
                this.thirdLevelList = item2.son;
                let index3 = this.thirdLevelList.findIndex(
                  (v) => v.status === true
                );
                this.thirdIndex = index3;
                this.secondId = item2.id;

                this.$set(this.chooseCategory.ids, 1, item2.id);
                this.$set(this.chooseCategory.category, 1, item2.name);
              }
              for (let item3 of item2.son) {
                if (item3.status === true) {
                  this.fourLevelList = item3.son;
                  let index4 = this.fourLevelList.findIndex(
                    (v) => v.status === true
                  );
                  this.fourIndex = index4;
                  this.thirdId = item3.id;

                  this.$set(this.chooseCategory.ids, 2, item3.id);
                  this.$set(this.chooseCategory.category, 2, item3.name);
                }

                for (let item4 of item3.son) {
                  console.log(item4);
                  if (item4.status === true) {
                    this.$set(this.chooseCategory.ids, 3, item4.id);
                    this.$set(this.chooseCategory.category, 3, item4.name);
                  }
                }
              }
            }
          }
        }
      );
    },

    // 获取一级分类
    getFirstLevel() {
      this.$get("/category/getLevel?level=1&status=1", false).then((res) => {
        this.firstLevelList = res;
        this.firstEmpty = this.firstLevelList.length === 0 ? true : false;
      });
    },
    // 获取二级分类
    getSecondtLevel(id) {
      this.$get(
        `/category/getJunior?id=${id}&pageSize=999&status=1`,
        false
      ).then((res) => {
        //  console.log(res)
        this.secondLevelList = res.records;
        this.secondEmpty = this.secondLevelList.length === 0 ? true : false;
      });
    },
    // 获取三级分类
    getThirdtLevel(id) {
      this.$get(
        `/category/getJunior?id=${id}&pageSize=999&status=1`,
        false
      ).then((res) => {
        //  console.log(res)
        this.thirdLevelList = res.records;
        this.thirdEmpty = this.thirdLevelList.length === 0 ? true : false;
      });
    },
    // 获取四级分类
    getFourtLevel(id) {
      this.$get(
        `/category/getJunior?id=${id}&pageSize=999&status=1`,
        false
      ).then((res) => {
        this.fourLevelList = res.records;
        // console.log(res)
        this.fourEmpty = this.fourLevelList.length === 0 ? true : false;
      });
    },

    // 搜素一级分类
    searchFirst(event) {
      // -------需要初始化 -----//
      const { value } = event.target;
      this.secondLevelList = [];
      this.thirdLevelList = [];
      this.fourLevelList = [];
      this.firstIndex = null;
      this.secondIndex = null; // 二级索引
      this.thirdIndex = null; // 三级索引
      this.fourIndex = null; // 四级索引
      this.secondDisable = true;
      this.thirdDisable = true;
      this.fourDisable = true;
      this.$set(this.categoryForm, "second_search", "");
      this.$set(this.categoryForm, "third_search", "");
      this.$set(this.categoryForm, "four_search", "");
      this.initChooseCategory(0);

      this.$get(
        `/category/getJunior?&name=${value}&pageSize=999&status=1`,
        false
      ).then((res) => {
        // console.log(res)
        this.firstLevelList = res.records;
        this.firstEmpty = this.firstLevelList.length === 0 ? true : false;
      });
    },

    // 搜索二级分类
    searchSecond(event) {
      const { value } = event.target;
      // -------需要初始化 -----//
      this.thirdLevelList = [];
      this.fourLevelList = [];
      this.secondIndex = [];
      this.thirdIndex = null; // 三级索引
      this.fourIndex = null; // 四级索引
      this.thirdDisable = true;
      this.fourDisable = true;
      this.$set(this.categoryForm, "third_search", "");
      this.$set(this.categoryForm, "four_search", "");
      this.initChooseCategory(1);

      this.$get(
        `/category/getJunior?&name=${value}&id=${this.firstId}&pageSize=999&status=1`,
        false
      ).then((res) => {
        this.secondLevelList = res.records;
        this.secondEmpty = this.secondLevelList.length === 0 ? true : false;
      });
    },

    // 搜索三级分类
    searchThird(event) {
      const { value } = event.target;
      // -------需要初始化 -----//
      this.fourLevelList = [];
      this.thirdIndex = null;
      (this.fourIndex = null), // 四级索引
        (this.fourDisable = true);
      this.$set(this.categoryForm, "four_search", "");
      this.initChooseCategory(2);

      this.$get(
        `/category/getJunior?&name=${value}&id=${this.secondId}&pageSize=999&status=1`
      ).then((res) => {
        this.thirdLevelList = res.records;
        this.thirdEmpty = this.thirdLevelList.length === 0 ? true : false;
      });
    },

    // 搜索四级分类
    searchFour(event) {
      // -------需要初始化 -----//
      this.fourIndex = null; // 四级索引
      const { value } = event.target;
      this.$get(
        `/category/getJunior?&name=${value}&id=${this.thirdId}&pageSize=999&status=1`
      ).then((res) => {
        this.fourLevelList = res.records;
        this.fourEmpty = this.fourLevelList.length === 0 ? true : false;
      });
    },

    // 初始化
    initChooseCategory(levelIndex) {
      let length = this.chooseCategory.category.length;
      for (let i = levelIndex; i < length; i++) {
        this.chooseCategory.category.splice(i, length - i);
      }
    },

    // 点击第一级分类
    handleFirstLevel(value, index) {
      // -------需要初始化 -----//
      this.secondLevelList = [];
      this.thirdLevelList = [];
      this.fourLevelList = [];
      (this.secondIndex = null), // 二级索引
        (this.thirdIndex = null), // 三级索引
        (this.fourIndex = null), // 四级索引
        (this.thirdDisable = true);
      this.fourDisable = true;
      this.initChooseCategory(0);

      this.getSecondtLevel(value.id);
      this.firstIndex = index;
      this.firstId = value.id;
      this.secondDisable = false;
      this.$set(this.chooseCategory.ids, 0, value.id);
      this.$set(this.chooseCategory.category, 0, value.categoryName);
    },

    // 点击第二级分类
    handleSecondLevel(value, index) {
      // -------需要初始化 -----//
      this.thirdLevelList = [];
      this.fourLevelList = [];
      (this.thirdIndex = null), // 三级索引
        (this.fourIndex = null), // 四级索引
        (this.fourDisable = true);
      this.initChooseCategory(1);

      this.getThirdtLevel(value.id);
      this.secondIndex = index;
      this.secondId = value.id;
      this.thirdDisable = false;
      this.secondDisable = false;
      this.$set(this.chooseCategory.ids, 1, value.id);
      this.$set(this.chooseCategory.category, 1, value.categoryName);
    },

    // 点击第三级分类
    handleThirdLevel(value, index) {
      // -------需要初始化 -----//
      this.fourLevelList = [];
      (this.fourIndex = null), // 四级索引
        this.initChooseCategory(2);

      this.getFourtLevel(value.id);
      this.thirdIndex = index;
      this.thirdId = value.id;
      this.fourDisable = false;
      this.thirdDisable = false;
      this.secondDisable = false;
      this.$set(this.chooseCategory.ids, 2, value.id);
      this.$set(this.chooseCategory.category, 2, value.categoryName);
    },

    // 点击第四级分类
    handleFourLevel(value, index) {
      this.fourIndex = index;
      this.$set(this.chooseCategory.ids, 3, value.id);
      this.$set(this.chooseCategory.category, 3, value.categoryName);
    },

    // 获取所有基础属性
    getBaseProperty(id) {
      this.$get(`/baseProperty/getByCategory/${id}`, false).then((res) => {
        this.setBaseProperty(res);
      });
    },

    // 选择店铺
    handleChnageShop(val) {
      let shopName = this.shopList.find(v =>Number (v.shopId) === val).shopName;
      this.form.shopName = shopName;
    },

    // 点击下一步 -- 还需要请求所有基础属性--传递给第二步
    handleNext() {
      if (!this.form.shopId && this.form.shopId != 0) {
        return this.$Message.warning("请选择商家");
      }
      if (this.chooseCategory.ids.length < 4) {
        return this.$Message.warning("请选择四级分类");
      }
      let categoryId = this.chooseCategory.ids.pop();
      this.getBaseProperty(categoryId); // 将基础属性缓存到vuex
      let chooseCategory = {
        id: categoryId, // 四级最后一级id
        category: this.chooseCategory.category.join("/"),
      };
      this.setChooseCategory(chooseCategory);
      console.log(this.form, "this.form");
      this.setShop(this.form);
      this.$emit("firstNext", "second");
      //-----初始化----------//
      this.firstIndex = null; // 一级索引
      this.secondIndex = null; // 二级索引
      this.thirdIndex = null; // 三级索引
      this.fourIndex = null; // 四级索引
      this.chooseCategory = {
        ids: [],
        category: [],
      };
      this.firstId = null; // 一级分类id
      this.secondI = null; // 二级分类id
      this.thirdId = null; // 三级分类id
      this.$set(this.categoryForm, "name", "");
      this.$set(this.categoryForm, "first_search", "");
      this.$set(this.categoryForm, "second_search", "");
      this.$set(this.categoryForm, "thrid_search", "");
      this.$set(this.categoryForm, "four_search", "");
    },
  },
};
</script>
<style lang="less" scoped>
.first-step {
  padding-top: 16px;
  .title-wrap {
    margin-bottom: 20px;
  }
  .main {
    padding: 25px 22px 24px;
    background: @box-bgColor;
    .empty {
      font-size: 13px;
      text-align: center;
      padding: 30px 0;
      color: @color-grey;
    }
    .search-category {
      position: relative;
      .search-list {
        position: absolute;
        top: 38px;
        width: 550px;
        height: 200px;
        overflow: auto;
        background: #fff;
        z-index: 10;
        box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
        padding: 5px 0 10px 0;
        .category-item {
          font-size: 13px;
          padding: 0 10px;
          line-height: 40px;
          &:hover {
            cursor: pointer;
            background: #e8f9ff;
          }
        }
      }
    }
    .search-wrap {
      display: flex;
      justify-content: space-between;
      color: @color-dark-ss;
      .level {
        width: 24%;
        height: 432px;
        overflow: auto;
        border: 1px solid #e3e9f0;
        background: @theme-color;
        box-sizing: border-box;
        padding-top: 24px;
        .level-list {
          margin-top: 25px;
          .list-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            line-height: 40px;
            font-size: @fontsize-small;
            padding: 0 36px;
            &:hover {
              cursor: pointer;
            }
          }
          .item-active {
            background: #f2f2f2;
          }
        }
      }
    }
    .choosed {
      color: @color-dark;
      margin-top: 20px;
      letter-spacing: 1px;
    }
  }

  .btn-wrap {
    text-align: center;
    margin-top: 34px;
    .btn {
      background: @theme-color-s;
    }
  }
}
</style>