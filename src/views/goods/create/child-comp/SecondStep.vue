<template>
  <div class="second-step" ref="secondComp">
    <Form :model="form" :label-width="120">
      <div style="display:flex;padding:20px 0;border-bottom: 1px solid #EFEFEF;">
        <FormItem label="店铺：" style="margin-right:138px">
          <span>{{shopName}}</span>
        </FormItem>
        <!-- <FormItem label="商品条形码：">
          <Input v-model="form.uniqueCode" placeholder="请输入" style="width:250px" />
        </FormItem> -->
      </div>


      <FormItem label="已选分类：" style="margin-top:30px;">
        <span style="font-size:13px;letter-spacing:1px">{{categoryName}}</span>
        <Button type="primary" class="btn" @click="editCategory">修改分类</Button>
      </FormItem>
      <FormItem label="商品名称：" style="margin:23px 0 38px 0">
        <Input v-model="form.spuName" placeholder="商品描述+规格" style="width:45%" />
      </FormItem>

      <!-- 商品属性 -->
      <div class="attribute-wrap">
        <FormItem label="商品属性：" style="margin-bottom:40px">
          <span style="font-size:13px">推荐完善的商品属性，不完善的商品属性不会在商品信息展示</span>
        </FormItem>
        <div class="attri-tool">
          <FormItem :label="`${item.propertyName}：`" class="form-item" v-for="(item,index) in baseProperty" :key="index">
            <Input v-model="item.propertyValue" placeholder="请输入" v-if="item.enterType===0"  />
            <Select v-model="item.propertyValue" v-if="item.enterType===1" @click.native="handleSelect(item,index)">
              <Option v-for="(select,selectIndex) in item.selectValue" :value="select" :key="selectIndex">{{select}}</Option>
            </Select>
            <Input type="textarea" :autosize="{maxRows: 3,minRows: 3}" v-model="item.propertyValue" placeholder="请输入" v-if="item.enterType===2" />
          </FormItem>
        </div>

        <!-- 新增属性 -->
        <div class="addAttri-wrap">
          <div class="premise" style="padding-left:15px">
            <span style="font-size:13px;color:#595959">推荐完善的商品属性不够用 ？</span>
            <Button type="primary" class="btn" @click="addAttribute">新增</Button>
          </div>
          <div class="addAttri-list" v-if="addAttri.length > 0">
            <div class="add-item" v-for="(item,index) in addAttri" :key="index">
              <Input v-model="item.propertyName" placeholder="字段1" style="width:160px" />
              <Select v-model="item.enterType" style="width:140px;margin:0 20px">
                <Option v-for="(type,tpyeIndex) in enterType" :value="type.type" :key="tpyeIndex">{{type.value}}</Option>
              </Select>
              <Input type="textarea" style="width:300px" :autosize="{maxRows: 3,minRows: 3}" 
              v-model="item.selectValue" placeholder="一行为一个属性值,多个属性值用换行输入" v-if="item.enterType===1" />
              <Button style="background:#1aa135;color:#fff" class="btn" @click="commitProperty(item,index)">完成</Button>
              <Button type="primary" class="btn delete" @click="deleteAttri(index)">删除</Button>
            </div>
          </div>
        </div>
      </div>

      <FormItem label="轮播图：">
        <el-upload
          class="upload-demo"
          style="width:40%"
          :action="actionUrl"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :file-list="defaultBannerList"
          list-type="picture">
          <div class="upload-btn ">
              <Icon type="ios-cloud-upload-outline" size="16" />
              <span>上传</span>
          </div>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <!-- 预览对话窗 -->
        <Modal v-model="previewModal" footer-hide class="preview-modal">
           <img width="100%" :src="previewBannerUrl" alt="">
        </Modal>
      </FormItem>


       <FormItem label="商品视频：" style="margin:60px 0">
         <el-upload class="avatar-uploader el-upload--text"
            :action="actionUrl" 
            :show-file-list="false"
            :on-success="handleVideoSuccess" 
            :before-upload="beforeUploadVideo"
            :on-progress="uploadVideoProcess"> 
          <div class="upload-btn ">
            <Icon type="ios-cloud-upload-outline" size="16" />
            <span>上传</span>
          </div>
        </el-upload>
        <div class="video-wrap">
          <video v-if="videoUrl !='' && !videoFlag" :src="videoUrl" class="avatar video-avatar"
            controls="controls">您的浏览器不支持视频播放
          </video>
          <Icon class="close-icon" @click="deleteVedio" v-if="videoUrl !='' && !videoFlag" type="ios-close-circle" size="20" />
        </div> 
        <el-progress v-if="videoFlag == true" type="circle" 
        :percentage="videoUploadPercent" style="margin-top:30px;"></el-progress>
          <P v-if="isShowUploadVideo"  class="text">请保证视频格式正确，且不超过20M</P>
      </FormItem> 

       <!-- <FormItem label="商品描述" style="margin-bottom:50px">
        <Input v-model="form.desc" placeholder="请输入" type="textarea" :autosize="{maxRows: 5,minRows: 5}" style="width:45%" />
      </FormItem> -->

      <!-- 服务与运费 -->
       <FormItem label="发货时间承诺：">
        <div style="display:flex;align-items:center">
          <div class="time-item" :class="{'time-item-active' : index === currentTimeIndex}"
          v-for="(value,index) in deliveryTime" :key="index" @click="changeTime(value,index)">{{value}}</div>

          <div class="other-wrap">
            <div class="radio" :class="{'radio-active':isOther}" @click="handleRadio"></div>
            <span style="margin: 0 12px 0 8px">其他</span>
            <Input style="width: 200px" v-model="otherInput" :readonly="!isOther" @on-blur="handleOther" />
          </div>
        </div>
      </FormItem>
      <FormItem label="服务说明：" style="margin:35px 0 55px 0">
        <Input v-model="form.extra.serviceNote" style="width: 60%" />
      </FormItem>
      <FormItem label="限制购买个数：" style="margin:35px 0 55px 0">
        <Input v-model="form.buyLimitCount" placeholder="0则为无限购" style="width:250px" />（0则为无限购）
      </FormItem>
      
      <FormItem label="商品详情：">
        <quill-editor ref="myQuillEditor" v-model="form.extra.introduction" :options="editorOption" />
      </FormItem>

    </Form>


     <!-- 下一步按钮 -->
    <div class="btn-wrap">
      <Button type="primary" class="btn" @click="handleNext(true)">
        {{routeParams.type === 'edit' ? '保存' : '下一步'}}
      </Button>
      <Button type="primary" class="btn" @click="handleNext(false)" v-if="routeParams.type === 'edit'">下一步</Button>
    </div>
  </div>
</template>

<script>
/**
 * 一开始要根据四级分类的id获取所有基础属性
 */
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
import {quillRedefine} from 'vue-quill-editor-upload'
import {toolbarOptions,addQuillTitle} from 'utils/editor-config.js'
import { mapState, mapMutations,mapGetters } from 'vuex'
import myStorage from "utils/localstore";

export default {
  inject: ['create'],
  name: 'second-step',
  components: {
    quillEditor,
    quillRedefine
  },
  data() {
    return {
      quillUpdateImg: false, // 根据图片上传状态来确定是否显示loading动画，刚开始是false,不显示
      actionUrl: "https://zs.cntracechain.com/imageService/file/upload",  // 上传图片地址
      form: {
        id: "",  // spuid（编辑时必填）
        shopId: 0,  // 商家id  -- 自营
        status: 0,  // 控制上下架
        categoryId: "",  // 第四级分类id
        uniqueCode: "",  // 条形码序列号
        spuName: "",  // 商品名
        buyLimitCount: 0,//	限购数量
        extra: { // 商品信息
          introduction: "",  // 详情
          serviceNote: "",  // 服务说明
          deliveryCommitment: "当日发货",  // 发货承诺-默认当日发货
        },
        property: [],  // 商品应用基础属性
        carousel: [], // 商品视频/图片
      },
      // baseProperty: [],  // 基础属性
      enterType: [  // 录入类型
        {type: 0, value: "输入框"},
        {type: 1, value: "选择框"},
        {type: 2, value: "文本域"},
      ],
      addAttri: [], // 新增属性list
      defaultBannerList: [],  // 默认显示的图片
      previewBannerUrl: "",  // 预览的banner图
      previewModal: false,   // 控制预览弹窗的显现
      videoUrl: "",  // 视频url
		  videoFlag:false , //是否显示进度条
      videoUploadPercent:"", //进度条的进度
      isShowUploadVideo:false, //显示上传按钮
      deliveryTime: ["当日发货","24小时","48小时"],
      currentTimeIndex: 0,  // 当前发货时间承诺的索引
      isOther: false,  // 是否有勾选其他
      otherInput: "",  // 其他说明
      content: "" ,
      editorOption: {},
      routeParams: {},  // 路由信息
      goodInfo: {},  // 商品详情信息
      basePropertyList: [],   // 存储编辑时返回的基础属性
      categoryName: "",   // 分类名
      shopName: ""  // 商家名称
    }
  },
  computed: {
    baseProperty() {
      if(this.$route.params.type === 'edit') {
        return this.basePropertyList
      }else {
        let baseList = this.$store.state.goods.baseProperty
        console.log(baseList,"baseList")
        baseList = baseList.map(v => {
          return {
            ...v,
            propertyValue: ""  // 属性值
          }
        })
        return baseList
      }
    },
    categoryId() {
      return this.$store.state.goods.choose_category.id    
    },
  },
  created() {
    let that = this
    this.editorOption = quillRedefine({
      uploadConfig: { // 图片上传的设置
        action: "https://zs.cntracechain.com/imageService/file/upload",
         res: (res) => {
          //  console.log(res)
          return res.data.url
        },
        name: 'file'  // 图片上传参数名
      },
      placeholder: '请输入编辑内容',
      toolOptions: toolbarOptions
    })
  },

  mounted() {

    addQuillTitle()
    this.routeParams = this.$route.params  // 保存路由信息
    if(this.routeParams.type === 'edit') {
      // 监听页面的刷新事件
      window.onbeforeunload = e => {
        myStorage.set("routerParam", this.routeParams); // 将当前的路由信息保存到本地
        e.returnValue = "您是否确认离开此页面-您输入的数据可能不会被保存";
      };
      if(!this.routeParams.spuid) {
        this.routeParams.spuid = myStorage.get('routerParam').spuid
      }
      this.$get(`/spu/getById/${this.routeParams.spuid}`,false,true).then(res => {
        console.log(res)
        this.setGoodInfo(res)   ///  将商品详情存放到vux里
        this.setGoodSku(res.sku)   ///  将商品详情存放到vux里
        this.goodInfo = res
        this.form = res
        this.categoryName = res.categoryName
        this.basePropertyList = res.baseProperty
        for(let item of this.basePropertyList) {
          if(item.enterType === 1) {
            item.selectValue = [item.propertyValue]
          }
        }
        let carouselImgs = res.image.filter(v => v.showType === 0)
        this.defaultBannerList = carouselImgs.map(v => {
          return {
            name : v.imageName,
            url: v.pictureUrl
          }
        })
        let videoUrl = res.image.find(v => v.showType === 1)
        if(videoUrl) this.videoUrl = videoUrl.pictureUrl
        // 获取商家名称



        console.log("this.create.shopList",this.create.shopList)
        console.log("this.create.shopList",this.create.shopList)
        

        this.shopName = this.create.shopList.find(v =>(Number(v
        .shopId))=== this.form.shopId).shopName
 

        if(res.extra.deliveryCommitment) {
          let index = this.deliveryTime.findIndex(v => v === res.extra.deliveryCommitment)
          console.log(index)
          if(index > -1) {
            this.currentTimeIndex = index
          }else {
            this.otherInput = res.extra.deliveryCommitment
            this.isOther = true
            this.currentTimeIndex = null
          }
        }else {
          this.form.extra.deliveryCommitment = "当日发货"
        }

        this.$get(`/spuSpec/getBySpu/${res.id}`,false).then(res => {
            this.setSpuSpec(res)
        })
      })
    }
  },
  watch: {
    '$store.state.goods.choose_category'(newValue,oldValue) {
      if(!this.categoryName) {
        this.categoryName = this.$store.state.goods.choose_category.category
        this.form.categoryId = this.$store.state.goods.choose_category.id
      }
    },
    '$store.state.goods.baseProperty'() {
      this.basePropertyList = this.$store.state.goods.baseProperty
      this.basePropertyList = this.basePropertyList.map(v => {
        return {
          ...v,
          propertyValue: ""    // 属性值
        }
      })
    },
    '$store.state.goods.shop'(newValue) {
      console.log("this.$store.state.goods.shop",this.$store.state.goods.shop)
      this.shopName = this.$store.state.goods.shop.shopName
      this.form.shopId = Number(this.$store.state.goods.shop.shopId)
    }

  },
  methods: {
    ...mapMutations(['setSpu','setGoodInfo','setSpuSpec','setGoodSku','setShop']),
    // 生成随机code
    createRandomId() {
      return (new Date()).getTime() +  Math.random().toString().substr(2, 5);
    },
    // 修改分类
    editCategory() {
      // 将当前的类名清空
      this.categoryName = ""
      this.$emit('edit',"first")
      this.$bus.$emit('edit')
      this.shopName = ''
      this.setShop('')
    },

    // 点击下拉框 ,获取属性详情
    handleSelect(item,index) {
      console.log(item)
      if(this.$route.params.type === 'add') return
      console.log('handleSelect')
      this.$get(`/baseProperty/getById/${item.id}`,false).then(res => {
        delete item.selectValue
        this.$set(this.basePropertyList[index],"selectValue",res.selectValue)
      })
    },

    // 新增属性
    addAttribute() {
      let params = {
        categoryId: null,  // 四级分类id
        enterType: "",   // 录入类型（0：input；1：select；2：textarea）
        propertyName: "",  // 属性名
        selectValue: ""  // 选择属性值（以&分割）enterType=1时必填
      }
      if(this.routeParams.type === 'edit') {
        params.categoryId = this.form.categoryId
      }else {
        params.categoryId = this.categoryId
      }
      this.addAttri.push(params)
    },

    // 完成新增的属性
    commitProperty(item,index) {
      if(!item.propertyName.toString().trim()) {
        this.$Message.warning({ background: true, content: '请输入要新增的属性名' });
        return
      }
      if(!item.enterType && item.enterType !== 0) {
        this.$Message.warning({ background: true, content: '请选择要新增的属性类型' });
        return
      }
      // 判断是否是选择框
      if(item.enterType === 1) {
        if(!item.selectValue) {
          this.$Message.warning({ background: true, content: '请输入属性值' });
          return
        }else {
          item.selectValue = item.selectValue.replace(/\n/g,'&')
        }
      }
      console.log(item)
      this.$post('/baseProperty/insert',item).then(res => {
        // console.log(res)
         this.$Message.success({  background: true, content: '添加成功'});
         if(item.selectValue) {
           item.selectValue = item.selectValue.split('&')
         }
         item.id = res  // res就是新增的属性id
         item.propertyValue = ""  // 属性值
         if(this.routeParams.type === 'edit') {
           this.basePropertyList.push(item)
         }else {
           this.baseProperty.push(item)
         }
         
         this.addAttri.splice(index,1)  // 移除
         console.log(this.baseProperty,"新增的base")
      })
    },

    // 删除新增的属性
    deleteAttri(index) {
      this.addAttri.splice(index,1)
    },

    handleSuccess(res) {
      const {code,data} = res
      let params = {
        imageName: "",  // 文件名称
        pictureUrl: "",  // 文件路径
        imageType: 0,  // 图片类型（0：商品轮播图，1：商品详情图）
        showType: 0   // 显示类型（0：图片，1：视频）
      }
      if(code === 200) {
        params.imageName = data.originalFilename
        params.pictureUrl = data.url
        if(this.routeParams.type === 'edit') {
          params.index = this.form.image.length
          this.form.image.push(params)
        }else {
          params.index = this.form.carousel.length
          this.form.carousel.push(params)
        }  
      }else {
        this.$Message.warning('图片上传失败，请重新上传！');
      }
    },

    handleRemove(file) {
      console.log(file)
      if(this.routeParams.type === 'edit') {
        let index = this.form.image.findIndex(e => e.pictureUrl ===  file.url);
        console.log(index)
        this.form.image.splice(index,1)
      }else {
        let index = this.form.carousel.findIndex(e => e.pictureUrl ===  file.response.data.url);
        this.form.carousel.splice(index,1)
      }
      
    },
    handlePreview(file) {
      this.previewModal = true
      this.previewBannerUrl = file.url
    },

    //视频上传前回调
	  beforeUploadVideo (file) {
      const isLt20M = file.size / 1024 / 1024 < 20;
      if (['video/mp4', 'video/ogg', 'video/flv','video/avi','video/wmv','video/rmvb'].indexOf(file.type) == -1) { //'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb'
          this.$Message.warning('请上传正确的视频格式');
          return false;
      }
      if (!isLt20M) {
          this.$Message.error('上传视频大小不能超过20MB哦!');
          return false;
      }
      this.isShowUploadVideo = false;
    },

    //视频上传进度条
    uploadVideoProcess (event, file, fileList) {
      this.videoFlag = true;
      this.videoUploadPercent = file.percentage.toFixed(0) * 1;
    },

    //视频上传成功回调
	  handleVideoSuccess (res, file) {
      const {code,data} = res
      this.isShowUploadVideo = true;
      this.videoFlag = false;
      this.videoUploadPercent = 0;
      let params = {
        imageName: "",  // 文件名称
        pictureUrl: "",  // 文件路径
        imageType: 0,  // 图片类型（0：商品轮播图，1：商品详情图）
        showType: 1   // 显示类型（0：图片，1：视频）
      }
      if (code == 200) {
        params.imageName = data.originalFilename
        params.pictureUrl = data.url
        this.videoUrl = data.url
        if(this.routeParams.type === 'edit') {
          let index = this.form.image.findIndex(v => v.showType === 1)
          if(index > -1) {
            this.form.image.splice(index,1)
          }
          params.index = this.form.image.length
          this.form.image.push(params)
        }else {
          let index = this.form.carousel.findIndex(v => v.showType === 1)
          if(index > -1) {
            this.form.carousel.splice(index,1)
          }
          params.index = this.form.carousel.length
          this.form.carousel.push(params)
        } 
      } else {
        this.$Message.warning('视频上传失败，请重新上传！');
      }
    },

    // 删除视频
    deleteVedio() {
      this.videoUrl = ""
      if(this.routeParams.type === 'edit') {
        let index = this.form.image.findIndex(v => v.showType === 1)
        if(index > -1) {
          this.form.image.splice(index,1)
        }
      }else {
        let index = this.form.carousel.findIndex(v => v.showType === 1)
        if(index > -1) {
          this.form.carousel.splice(index,1)
        }
      }
    },

    // 选择发货时间承诺
    changeTime(value,index) {
      this.currentTimeIndex = index
      this.isOther = false
      this.form.extra.deliveryCommitment = value
    },

    // 是否有点击其他
    handleRadio() {
      this.currentTimeIndex = null
      this.isOther = !this.isOther
      this.form.extra.deliveryCommitment = ""
    },

    // 
    handleOther() {
      this.form.extra.deliveryCommitment = this.otherInput
    },

    // 做校验
    validate(form) {
      // 解构form的内容
      const {spuName,extra:{introduction,serviceNote,deliveryCommitment},carousel} = form
      let flag = true
      if(!spuName.toString().trim()) {
        this.$Message.warning({ background: true, content: '请填写商品名称'});
        return flag = false
      }
      if(carousel.length === 0) {
        this.$Message.warning({ background: true, content: '请至少上传一张图片或视频'});
        return flag = false
      }
      if(!deliveryCommitment.toString().trim()) {
        this.$Message.warning({ background: true, content: '请填写发货承诺'});
        return flag = false
      }
      if(!serviceNote.toString().trim()) {
        this.$Message.warning({ background: true, content: '请填写服务说明'});
        return flag = false
      }
      if(!introduction.toString().trim()) {
        this.$Message.warning({ background: true, content: '请输入商品详情'});
        return flag = false
      }
      // if(property.length === 0) {
      //   this.$Message.warning({ background: true, content: '请填写至少一种商品属性'});
      //   return flag = false
      // }
      return flag
    },

     // 点击下一步
    handleNext(result) {
      let newForm = {};  // 新增一个变量
      if(!this.form.uniqueCode) {
        this.form.uniqueCode = this.createRandomId()
      }
      // 构造数据 -- ***要过滤掉属性值为空的属性 ****
      console.log(this.baseProperty,"this.baseProperty")
      let list;
      let property;
      if(this.baseProperty.length > 0) {
         list = this.baseProperty.filter(v => {
         return v.propertyValue.toString().trim() !== ""
         console.log(list,"list")
      })
       property = list.map(v => {
          return {
            propertyId: v.id,  // 属性id
            propertyName: v.propertyName,  //属性名
            propertyValue: v.propertyValue, //属性值
            enterType: v.enterType,
          }
        })

        this.form.property = property
      }else {
        this.form.property = this.baseProperty
      } 
      if(this.routeParams.type === 'add') {
        this.form.categoryId = this.categoryId  // 第四级分类id
      }
      
      if(this.routeParams.type === 'add') {
        newForm = this.form
        console.log(newForm,'add')
      }else if(this.routeParams.type === 'edit') {
        const {extra:{introduction},extra:{serviceNote},extra:{deliveryCommitment},image} = this.form
        let extra = {
          introduction,
          serviceNote,
          deliveryCommitment
        }
        for(let item of image) {
          if(item.id) {
            delete item.id
          }
          if(item.spuId) {
            delete item.spuId
          }
        }
        newForm.id = this.routeParams.spuid
        newForm.shopId = this.form.shopId,  // 目前是自营 传0
        newForm.status = this.form.status
        newForm.categoryId = this.form.categoryId
        newForm.uniqueCode = this.form.uniqueCode
        newForm.spuName = this.form.spuName
        newForm.buyLimitCount = this.form.buyLimitCount
        newForm.extra = extra
        newForm.property = this.form.property
        newForm.carousel = image
      }

      if(!this.validate(newForm))  return
      let requestUrl = this.routeParams.type === 'add' ? '/spu/create' : '/spu/modify'
      console.log(newForm)
      this.$post(requestUrl,newForm,true).then(res => {
        console.log(res)
        let playload = {
          uniqueCode: newForm.uniqueCode,
          spuName: newForm.spuName,  // 商家名
          spuid: res,  // 商品spuid
          status: newForm.status
        }

        this.setSpu(playload)  // res 返回的是商品的spuid
        if(this.routeParams.type === 'add') {
          this.$emit('secondNext','third')
        }else {
          this.$Message.success({ background: true, content: '成功更新spu'});
          if(result) {
            this.$router.push({name: 'good-list'})
          }else {
            this.$emit('secondNext','third')
          }
        }

        myStorage.remove('routerParam')   // 移除本地的路由
      })
    }
  }
}
</script>

<style lang="less" scoped>
.second-step {
  .btn {
    background: @theme-color-s;
    margin-left: 36px;
  }
  .attribute-wrap {
    margin-bottom: 60px;
    .attri-tool {
      display: flex;
      flex-wrap: wrap;
      .form-item {
        width: 30%;
        margin-right: 30px;
        margin-bottom: 30px;
      }
    }

    .addAttri-list {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      margin-top: 30px;
      .add-item {
        margin-bottom: 30px;
        .delete {
          background: @btn-red-bgColor;
          border-color: @btn-red-bgColor;
          margin-left: 18px;
        }
      }
    }
  }

  .upload-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 32px;
    border: 1px solid #D9D9D9;
    border-radius: 2px;
    font-size: @fontsize-small;
    >span {
      margin-left: 15px;
    }
    &:hover {
      cursor: pointer;
    }
  }

  // 富文本框
  /deep/.ql-editor{
    height:400px;
  }

  .btn-wrap {
    text-align: center;
    margin-top: 50px;
  }

  .video-wrap {
    position: relative;
    width: 400px;
    .close-icon {
      position: absolute;
      top: -40px;
      right: -30px;
      &:hover {
        cursor: pointer;
      }
    }
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .video-avatar {
    margin-top: 20px;
    width: 400px;
    height: 200px;
  }

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
</style>

<style lang="less" scoped>
.preview-modal {
  /deep/.ivu-modal-content {
    background: transparent;
  }
  /deep/.ivu-modal-body {
    padding: 0;
  }
}
</style>
