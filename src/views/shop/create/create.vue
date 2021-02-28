<template>
  <div class="createShop">
    <div class="header-wrap">
      店铺编号：<span class="shop-code">786868799</span>
    </div>

    <!-- 主体 -->
    <div class="main">
      <Form :model="form" :label-width="100">
        <!-- 中间  center -->
        <Row class="center-wrap"> 
          <i-col span="8">
            <FormItem style="margin-bottom:40px" label="店铺名称：">
              <Input v-model="form.shopName"  placeholder="请输入" style="width:80%" />
            </FormItem>
            <FormItem style="margin-bottom:20px" label=" 联系地址：">
              <el-cascader style="width:80%" :options="areaData" v-model="form.areaCode" size="small">
              </el-cascader>
            </FormItem>
            <FormItem>
              <Input v-model="form.shopSiteDetail"  placeholder="详细地址" style="width:80%" />
            </FormItem>
          </i-col>
          <i-col span="8">
            <FormItem style="margin-bottom:40px" label="管理员名字：">
              <Input v-model="form.shopContact"  placeholder="请输入" style="width:80%" />
            </FormItem>
            <FormItem label="店铺详情：">
              <Input v-model="form.shopDescription" maxlength="200" show-word-limit :autosize="{minRows: 4,maxRows: 4}" 
              type="textarea" placeholder="店铺详情" style="width:80%" />
            </FormItem>
          </i-col>
          <i-col span="8">
            <FormItem style="margin-bottom:40px" label="管理人手机：">
              <Input v-model="form.contactNumber"  placeholder="请输入" style="width:70%" />
              <span class="getCode">获取验证码</span>
            </FormItem>
            <FormItem label="手机验证码：">
              <Input v-model="form.code"  placeholder="请输入" style="width:80%" />
            </FormItem>
          </i-col>
        </Row>


        <!-- 下面  down -->
        <Row class="down-wrap">
          <!-- 上传店铺logo -->
          <i-col span="8">
            <FormItem label="店铺LOGO：">
              <el-upload class="avatar-uploader" :action="actionUrl"
                :show-file-list="false" :before-upload="shopLogoBefore"
                :on-progress="shopLogoProgress" :on-success="shopLogoSuccess" >
                <img v-if="form.shopLogo" :src="form.shopLogo" class="avatar">
                <i v-if="progressType !== 'shopLOGO'" class="el-icon-plus avatar-uploader-icon"></i>
                <el-progress v-if="progressType === 'shopLOGO'" :percentage="uploadPercent" type="circle"></el-progress>
              </el-upload>
              <p class="preview-wrap" v-if="form.shopLogo" @click="handlePreview(form.shopLogo)">点击预览<Icon type="ios-eye-outline" class="preview-icon" /></p>
            </FormItem>
          </i-col>

          <!-- 上传营业执照 -->
          <i-col span="8">
            <FormItem label="营业执照：">
              <el-upload class="avatar-uploader" :action="actionUrl"
                :show-file-list="false" :before-upload="businessUrlBefore"
                :on-progress="businessUrlProgress" :on-success="businessUrlSuccess" >
                <img v-if="form.businessLicenseUrl" :src="form.businessLicenseUrl" class="avatar">
                <i v-if="progressType !== 'businessUrl'" class="el-icon-plus avatar-uploader-icon"></i>
                <el-progress v-if="progressType === 'businessUrl'" :percentage="uploadPercent" type="circle"></el-progress>
              </el-upload>
              <p class="preview-wrap" v-if="form.businessLicenseUrl" @click="handlePreview(form.businessLicenseUrl)">点击预览<Icon type="ios-eye-outline" class="preview-icon" /></p>
            </FormItem>
            <div class="business-info">
              <div class="title">营业执照信息：</div>
              <el-input type="textarea" resize="none"
                placeholder="请输入内容"
                v-model="form.businessLicenseInfo">
              </el-input>
            </div>
          </i-col>
          <i-col span="8">
            <FormItem label="管理员证件：">
              <!-- 正面照 -->
              <div class="front-wrap" style="margin-bottom:20px">
                <div style="display:flex;align-items: flex-end;">
                  <el-upload class="avatar-uploader" :action="actionUrl"
                    :show-file-list="false" :before-upload="papersUrlBefore"
                    :on-progress="papersUrlProgress" :on-success="papersUrlSuccess" >
                    <img v-if="form.papersUrl" :src="form.papersUrl" class="avatar">
                    <i v-if="progressType !== 'papersUrl'" class="el-icon-plus avatar-uploader-icon"></i>
                    <el-progress v-if="progressType === 'papersUrl'" :percentage="uploadPercent" type="circle"></el-progress>
                  </el-upload>
                  <span style="font-size:12px;color:#595959;position:relative;top:-5px;margin-left:10px">(上传正面)</span>
                </div>
                <p class="preview-wrap" v-if="form.papersUrl" @click="handlePreview(form.papersUrl)">点击预览<Icon type="ios-eye-outline" class="preview-icon" /></p>
              </div>
              
              <!-- 反面照 -->
              <div class="back-wrap">
                <div style="display:flex;align-items: flex-end;">
                  <el-upload class="avatar-uploader" :action="actionUrl"
                    :show-file-list="false" :before-upload="papersBackUrlBefore"
                    :on-progress="papersBackUrlProgress" :on-success="papersBackUrlSuccess" >
                    <img v-if="form.papersBackUrl" :src="form.papersBackUrl" class="avatar">
                    <i v-if="progressType !== 'papersBackUrl'" class="el-icon-plus avatar-uploader-icon"></i>
                    <el-progress v-if="progressType === 'papersBackUrl'" :percentage="uploadPercent" type="circle"></el-progress>
                  </el-upload>
                  <span style="font-size:12px;color:#595959;position:relative;top:-5px;margin-left:10px">(上传反面)</span>
                </div>
                <p class="preview-wrap" v-if="form.papersBackUrl" @click="handlePreview(form.papersBackUrl)">点击预览<Icon type="ios-eye-outline" class="preview-icon" /></p>
              </div>
            </FormItem>
            <div class="contact-info">
              <div class="title">管理员身份信息：</div>
              <el-input type="textarea" resize="none"
                placeholder="请输入内容"
                v-model="form.contactInfo">
              </el-input>
            </div>
          </i-col>
        </Row>
      </Form>
    </div>


    <!-- 底部按钮 -->
    <div class="btn-wrap">
      <Button type="primary" class="btn" style="margin-right:40px">保存</Button>
      <Button class="btn">取消</Button>
    </div>

    <!-- 预览图片对话窗 -->
    <Modal v-model="previewModal" footer-hide class="preview-modal">
      <img width="100%" :src="previewUrl" alt="">
    </Modal>
  </div>
</template>

<script>
export default {
  name: "create-shop",
  data() {
    return {
      actionUrl: "https://zs.cntracechain.com/imageService/file/upload",  // 上传图片地址
      form: {
        shopName: "",  // 店铺名称
        shopContact: "",  // 管理员名字
        contactNumber: "",  // 管理人手机
        areaCode: "",  // 区域编码
        shopSiteDetail: "",  // 店铺详细地址
        shopDescription: "",  // 店铺详情
        code: "",  // 手机验证码
        shopLogo: "",  // 店铺logo
        businessLicenseUrl: "",  // 营业执照
        papersUrl: "",  // 身份证/护照 图片地址
        papersBackUrl: "",  // 身份证/护照 反面图片地址
        businessLicenseInfo: "",  // 营业执照信息
        contactInfo: ""  // 管理员身份信息
      },
      previewModal: false,   // 控制预览弹窗的显现
      previewUrl: "",
      uploadPercent: "",  // 上传进度
      progressType: "",  // 进度类型
      fileList2: [],
      areaData: [{
          value: 'zhinan',
          label: '指南',
          children: [{
            value: 'shejiyuanze',
            label: '设计原则',
            children: [{
              value: 'yizhi',
              label: '一致'
            }, {
              value: 'fankui',
              label: '反馈'
            }, {
              value: 'xiaolv',
              label: '效率'
            }, {
              value: 'kekong',
              label: '可控'
            }]
          }, {
            value: 'daohang',
            label: '导航',
            children: [{
              value: 'cexiangdaohang',
              label: '侧向导航'
            }, {
              value: 'dingbudaohang',
              label: '顶部导航'
            }]
          }]
        }]
    }
  },

  methods: {
    // 上传照片之前的验证
    beforVerify(file) {
      const fileType = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!fileType) {
        this.$Message.error({background:true,content:'上传图片只能是 JPG 或 PNG 格式'});
      }
      if(!isLt2M) {
        this.$Message.error({background:true,content:'上传图片大小不能超过 2MB'});
      }
      return fileType && isLt2M;
    },

    // 成功上传照片
    successUpload(res) {
      const { code, data } = res
      if(code === 200) {
        // this.form.shopLogo = data.url
        this.progressType = ""
        return data.url
      }else {
        this.$Message.error({background:true,content:'上传图片失败,请重试'});
        return ""
      }
    },

    // 上传店铺LOGO  上传之前
    shopLogoBefore(file) {
      return this.beforVerify(file)
    },

     // 上传店铺LOGO进度
    shopLogoProgress(file) {
      this.progressType = "shopLOGO"
      this.form.shopLogo = ""
      this.uploadPercent = file.percent.toFixed(0) * 1;
    },

    // 上传店铺LOGO成功
    shopLogoSuccess(res) {
      this.form.shopLogo = this.successUpload(res)
    },

    // 上传营业执照  上传之前
    businessUrlBefore(file) {
      return this.beforVerify(file)
    },

    // 上传营业执照进度
    businessUrlProgress(file) {
      this.progressType = "businessUrl"
      this.form.businessLicenseUrl = ""
      this.uploadPercent = file.percent.toFixed(0) * 1;
    },

    // 上传营业执照成功
    businessUrlSuccess(res) {
      this.form.businessLicenseUrl = this.successUpload(res)
    },

    // 上传管理员证件 正面照
    papersUrlBefore(file) {
      return this.beforVerify(file)
    },

    // 上传管理员证件 正面照进度
    papersUrlProgress(file) {
      this.progressType = "papersUrl"
      this.form.papersUrl = ""
      this.uploadPercent = file.percent.toFixed(0) * 1;
    },

    // 上传管理员证件 正面照成功
    papersUrlSuccess(res) {
      this.form.papersUrl = this.successUpload(res)
    },

    // 上传管理员证件  反面照
    papersBackUrlBefore(file) {
      return this.beforVerify(file)
    },

    // 上传管理员证件 反面照进度
    papersBackUrlProgress(file) {
      this.progressType = "papersBackUrl"
      this.form.papersBackUrl = ""
      this.uploadPercent = file.percent.toFixed(0) * 1;
    },

    // 上传管理员证件 反面照成功
    papersBackUrlSuccess(res) {
      this.form.papersBackUrl = this.successUpload(res)
    },

    // 预览图片
    handlePreview(url) {
      this.previewModal = true
      this.previewUrl = url
    }
  }
};
</script>

<style lang="less" scoped>
.createShop {
  padding: 15px;
  .header-wrap {
    padding: 15px 10px 20px;
    border-bottom: 1px solid #EFEFEF;
    margin-bottom: 27px;
    .shop-code {
      font-size: 13px;
      margin-left: 20px;
      font-weight: bold;
    }
  }

  .main {
    .center-wrap {
      padding: 20px 0 50px 0;
      border-bottom: 1px solid #EFEFEF;
      .getCode {
        font-size: @fontsize-small;
        color: @theme-color-s;
        text-decoration: underline;
        margin-left: 10px;
        &:hover {
          cursor: pointer;
        }
      }
    }

    .down-wrap {
      padding: 50px 0;
      
      .business-info,.contact-info {
        width: 80%;
        height: 304px;
        background: #F8F8F8;
        margin-top: 30px;
        padding: 20px 20px 0;
        .title {
          font-size: 13px;
          color: @color-dark-ss;
        }
      }

      .contact-info {
        height: 190px;
        margin-top: 15px;
      }
    }


    // 上传图片的样式
    .avatar-uploader /deep/.el-upload {
      border: 1px solid #d9d9d9;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      width: 100px;
      height: 100px;
    }
    .avatar-uploader /deep/.el-upload:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 20px;
      color: #8c939d;
      width: 100px;
      height: 100px;
      line-height: 100px;
      text-align: center;
    }
    .avatar {
      width: 100px;
      height: 100px;
      display: block;
    }

    .preview-wrap {
      font-size: @fontsize-small;
      color: @theme-color-s;
      line-height: 12px;
      .preview-icon {
        position: relative;
        top: 1px;
        font-size: 18px;
        margin-left: 5px;
      }
      &:hover {
        cursor: pointer;
      }
    }
  }

  .btn-wrap {
    text-align: center;
    margin: 80px 0 20px 0;
  }
}
</style>

<style lang="less" scoped>
/deep/.ivu-form-item-label {
  font-size: 13.5px;
}
/deep/.el-cascader,/deep/.el-input,/deep/.el-input__inner {
  border-radius: 2px;
  padding-left: 12px;
  font-size: 13px!important;
}
/deep/.el-cascader,/deep/.el-input {
  padding-left: 0;
}

/deep/.el-cascader__dropdown {
  /deep/.el-cascader-panel{
    font-size: 13px!important;
  }
  /deep/.el-cascader-node__label {
    font-size: 13px!important;
  }
}
.preview-modal {
  /deep/.ivu-modal-content {
    background: transparent;
  }
  /deep/.ivu-modal-body {
    padding: 0;
  }
}

/deep/.el-progress {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}

/deep/.el-progress-circle {
  width: 80px!important;
  height: 80px!important;
}

/deep/.el-textarea {
  height: 88%;
  width: 80%;
}

/deep/.el-textarea__inner {
  resize: none;
  height: 100%;
  font-size: 13px;
  border: none;
  border-radius: 0;
  background: transparent;
  padding-top: 20px;
}
</style>