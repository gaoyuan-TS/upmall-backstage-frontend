<template>
  <div class="bannerSet">
    <div class="banner">
      <div class="title">
        首页Banner配置
        <span class="add" @click="addBanner">
          <i class="jia">+</i>
          新增banner位置
        </span>
      </div>
      <div class="banner-list" v-for="(item,index) in bannerList" :key="index">
        <div class="banner-item">
          <Row class="selectLine">
            <i-col span="8" class="bannerLine">
              <div>跳转类型：</div>
              <Select style="width:290px" v-model="item.jumpType" @on-open-change="getIndex(index)">
                <Option
                  v-for="(tpye,jump) in jumpList"
                  :value="tpye.value"
                  :key="jump"
                >{{tpye.lebal}}</Option>
              </Select>
            </i-col>
            <i-col span="8" class="bannerLine">
              <div>跳转商品：</div>
              <Select
                style="width:290px"
                v-model="item.spuId"
                filterable
                remote
                clearable
                :remote-method="remoteMethod1"
                :loading="loading1"
                class="txt"
                @on-open-change="getIndex(index)"
              >
                <Option
                  v-for="(optio1, index1) in item.options1"
                  :value="optio1.value"
                  :key="index1"
                >{{optio1.label}}</Option>
              </Select>
            </i-col>
            <i-col span="8" class="bannerLine">
              <div>排序：</div>
              <Input
                v-model="item.sort"
                clearable
                placeholder="请输入商品排序（数字越小排名越前）"
                style="width: 290px"
              />
            </i-col>
          </Row>
          <Row class="selectLine">
            <i-col span="12" class="bannerLine">
              <div>展示图：</div>
              <div class="share" @click="getIndex(index)">
                <el-upload
                  class="avatar-uploader"
                  action="https://zs.cntracechain.com/imageService/image/add"
                  :data="upData"
                  :show-file-list="false"
                  :on-success="activityIconhandleImg"
                  :before-upload="beforeIMGUpload"
                >
                  <img v-if="item.image" :src="item.image" class="avatar" />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <div class="tip">支持扩展名：.jpeg .png .jpg; 尺寸：375*240</div>
              </div>
            </i-col>
          </Row>
          <Row class="btn">
            <Button type="info" @click="submitBanner(item)" v-if="item.id">确定</Button>
            <Button type="success" @click="handleAdd(item)" v-else>新建</Button>
            <Button
              type="error"
              @click="deleteBanner(item.id)"
              v-if="item.id"
              style=" margin-left: 20px;"
            >删除</Button>
            <Button
              type="error"
              @click="deleteBannerList(index)"
              v-else
              style=" margin-left: 20px;"
            >删除</Button>
          </Row>
        </div>
      </div>
    </div>
    <div class="banner">
      <div class="title">首页热推产品配置</div>
      <div class="banner-list" v-for="(goods,hot) in hotgoodsList" :key="hot">
        <div class="banner-item">
          <Row class="selectLine">
            <i-col span="8" class="bannerLine">
              <div>指向单品：</div>
              <Select
                style="width:290px"
                v-model="goods.spuId"
                filterable
                remote
                clearable
                :remote-method="remoteMethod2"
                :loading="loading2"
                @on-open-change="getGoodsIndex(hot)"
              >
                <Option
                  v-for="(optio2, index2) in goods.options2"
                  :value="optio2.value"
                  :key="index2"
                >{{optio2.label}}</Option>
              </Select>
            </i-col>
            <i-col span="8" class="bannerLine">
              <div>推荐词：</div>
              <Input v-model="goods.recommend" clearable placeholder="请输入推荐词" style="width: 290px" />
            </i-col>
            <i-col span="8" class="bannerLine">
              <div>排序：</div>
              <Input
                v-model="goods.sort"
                clearable
                placeholder="请输入商品排序（数字越小排名越前）"
                style="width: 290px"
              />
            </i-col>
          </Row>
          <Row class="selectLine">
            <i-col span="12" class="bannerLine">
              <div>展示图：</div>
              <div class="share2" @click="getGoodsIndex(hot)">
                <el-upload
                  class="avatar-uploader"
                  action="https://zs.cntracechain.com/imageService/image/add"
                  :data="upData"
                  :show-file-list="false"
                  :on-success="activityGoods"
                  :before-upload="beforeIMGUpload"
                >
                  <img v-if="goods.image" :src="goods.image" class="avatar" />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <div class="tip">支持扩展名：.jpeg .png .jpg; 尺寸：355*355</div>
              </div>
            </i-col>
          </Row>
        </div>
      </div>
      <Row style="margin: 20px 0;display: flex;justify-content: center;">
        <Button type="info" @click="submitHotGoods()">提交</Button>
      </Row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'banner-set',
  data () {
    return {
      value: '',
      jumpList: [
        { "lebal": '商品详情', "value": 0 },
        { "lebal": '拼团详情', "value": 1 }
      ],
      upData: {
        imgSystemId: 'ryy',
        imgSpecificUniqueValue: 'fddd'
      }, // 上传图片时要带的参数
      options1: [],
      options2: [],
      index: 0,//商品选择的索引
      goodsIndex: '',//商品选择的索引
      list: [],
      list2: [],
      loading1: false,
      loading2: false,
      bannerList: [],//轮播图列表
      hotgoodsList: [],// 热推列表
    }
  },
  created () {
    this.getBannerList()
    this.getHotgoodsList()
  },
  methods: {
    // 删除没添加成功的banner图
    deleteBannerList (e) {
      this.bannerList.splice(e, 1)
      this.$tips.Message("success", '删除成功', 3);
    },
    // 新建banner图
    handleAdd (e) {
      this.$post('/spuCarousel/insert', e).then((data) => {
        this.$tips.Message("success", '添加成功', 3);
        this.getBannerList()
      })
    },
    // 添加banner图
    addBanner () {
      let add = {
        "spuId": '',
        "image": "",
        "sort": 0,
        "show_type": 0,
        "jump_type": 0,
        "is_show": 1,
        "options1": []
      }
      this.bannerList.push(add)
    },
    // 提交热推
    submitHotGoods () {
      this.$post('/spuHot/config', this.hotgoodsList).then((data) => {
        this.$tips.Message("success", '修改成功', 3);
        this.getHotgoodsList()
      })
    },
    // 分享文件上传
    activityGoods (res, file) {
      // console.log(response)
      if (res.code === 200) {
        this.$Message.success(res.message)
        this.hotgoodsList[this.goodsIndex].image = res.data.imgUrl
      } else {
        this.$Message.error("上传失败")
      }
    },
    // 远程搜索商品
    remoteMethod2 (query) {
      // console.log(this.hotgoodsList[this.goodsIndex])
      if (query !== '') {
        this.loading2 = true
        let goodsName = query.replace(/(^\s*)|(\s*$)/g, '')
        this.$get('/spu/keywords?name=' + goodsName).then((data) => {
          console.log('data', data)
          if (data.length > 0) {
            this.list2 = data
            // console.log(this.list)
            this.loading2 = false
            const list2 = this.list2.map(item => {
              return {
                value: item.id,
                label: item.spuName
              }
            })
            this.hotgoodsList[this.goodsIndex].options2 = list2

          } else {
            this.list2 = []
            this.hotgoodsList[this.goodsIndex].options2 = []
          }
        })
      } else {
        this.hotgoodsList[this.goodsIndex].options2 = []
      }
    },
    // 获取热推商品索引
    getGoodsIndex (e) {
      this.goodsIndex = e
    },
    // 获取热推列表
    getHotgoodsList () {
      this.$get('/spuHot/pageView').then((data) => {
        this.hotgoodsList = data
        for (let j = 0; j < this.hotgoodsList.length; j++) {
          let arr2 = [
            {
              "label": this.hotgoodsList[j].spuName,
              "value": this.hotgoodsList[j].spuId
            }
          ]
          this.hotgoodsList[j].options2 = arr2
        }
        console.log('hotgoodsList', this.hotgoodsList)

      })
    },
    // 提交轮播图修改
    submitBanner (item) {
      let obj = item
      obj.is_show = 1
      this.$post('/spuCarousel/update', obj).then((data) => {
        // console.log('提交轮播图修改', data)
        this.$tips.Message("success", '修改成功', 3);
        this.getBannerList()
      })
    },
    // 删除轮播图
    deleteBanner (e) {
      this.$post('/spuCarousel/deleteById?id=' + e).then((data) => {
        this.$tips.Message("success", '删除成功', 3);
        this.getBannerList()
        this.index = ''
        // console.log('删除轮播图', data)
      })
    },
    // 获取轮播图列表
    getBannerList () {
      this.$post("/spuCarousel/pageView", { showType: 0, pageNum: 1, pageSize: 10 }).then(data => {
        this.bannerList = data.records
        for (let i = 0; i < this.bannerList.length; i++) {
          let arr = [
            {
              "label": this.bannerList[i].spuName,
              "value": this.bannerList[i].spuId
            }
          ]
          this.bannerList[i].options1 = arr
        }
        // console.log(this.bannerList)
      })
    },
    // 获取索引
    getIndex (e) {
      // console.log(e)
      this.index = Number(e)
    },
    // 远程搜索商品
    remoteMethod1 (query) {
      console.log(query)
      if (Number(this.bannerList[this.index].jumpType) === 0) {
        console.log('this.bannerList[this.index].jumpType',this.bannerList[this.index].jumpType)
        if (query !== '') {
          this.loading1 = true
          let quer1 = query.replace(/(^\s*)|(\s*$)/g, '')
          this.$get('/spu/keywords?name=' + quer1).then((data) => {
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
              this.bannerList[this.index].options1 = list

            } else {
              this.list = []
              this.bannerList[this.index].options1 = []
            }
          })
        } else {
          this.bannerList[this.index].options1 = []
        }
      } else {
        if (query !== '') {
          this.loading1 = true
          let quer = query.replace(/(^\s*)|(\s*$)/g, '')
          this.$get('/grouponActivities/keywords?name=' + quer).then((data) => {
            // console.log(data)
            if (data.length > 0) {
              this.list = data
              // console.log(this.list)
              this.loading1 = false
              const list = this.list.map(item => {
                return {
                  value: item.spuId,
                  label: item.activityTitle
                }
              })
              this.bannerList[this.index].options1 = list

            } else {
              this.list = []
              this.bannerList[this.index].options1 = []
            }
          })
        } else {
          this.bannerList[this.index].options1 = []
        }
      }
    },
    // 分享文件上传
    activityIconhandleImg (res, file) {
      // console.log(response)
      if (res.code === 200) {
        this.$Message.success(res.message)
        this.bannerList[this.index].image = res.data.imgUrl
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
  }
}
</script>

<style scoped lang="less">
.bannerSet {
  margin: 30px;
  box-sizing: border-box;
  .title {
    height: 40px;
    line-height: 40px;
    background-color: #e9e9e9;
    padding-left: 22px;
    font-weight: 600;
    .add {
      font-weight: 400;
      color: #1890ff;
      font-size: 14px;
      margin-left: 26px;
      cursor: pointer;
      .jia {
        font-size: 20px;
        margin-right: 2px;
      }
    }
  }
  .banner {
    width: 100%;
    border: 1px solid #bfbfbf;
    box-sizing: border-box;
    margin-top: 20px;
    .banner-list {
      margin: 20px;
      border: 1px solid #bfbfbf;
      .banner-item {
        margin: 10px 0;
        padding: 30px;
        .selectLine {
          .bannerLine {
            display: flex;
            align-items: center;
            margin: 10px 0;
            .share {
              display: flex;
              justify-content: center;
              flex-direction: column;
              margin-left: 15px;
              // overflow: hidden;
              /deep/ .avatar-uploader {
                width: 375px;
                height: 240px;
                .el-upload {
                  width: 375px;
                  height: 240px;
                  overflow: hidden;
                  border: 1px solid #dcdee2;
                  img {
                    width: 100%;
                  }
                  .el-icon-plus {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  }
                  .el-icon-plus:before {
                    font-size: 40px;
                    color: #bfbfbf;
                  }
                }
              }
              .tip {
                margin-top: 10px;
                font-size: 14px;
                color: #ff0000;
              }
            }
            .share2 {
              display: flex;
              justify-content: center;
              flex-direction: column;
              margin-left: 15px;
              // overflow: hidden;
              /deep/ .avatar-uploader {
                width: 325px;
                height: 325px;
                .el-upload {
                  width: 325px;
                  height: 325px;
                  overflow: hidden;
                  border: 1px solid #dcdee2;
                  img {
                    width: 100%;
                  }
                  .el-icon-plus {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  }
                  .el-icon-plus:before {
                    font-size: 40px;
                    color: #bfbfbf;
                  }
                }
              }
              .tip {
                margin-top: 10px;
                font-size: 14px;
                color: #ff0000;
              }
            }
          }
        }
        .btn {
          margin-top: 20px;
          display: flex;
          justify-content: center;
        }
      }
    }
  }
  .hot-goods {
    margin-top: 20px;
    width: 100%;
    border: 1px solid #bfbfbf;
    box-sizing: border-box;
  }
}
</style>
