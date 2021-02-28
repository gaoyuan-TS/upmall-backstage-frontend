<template>
  <div class="detailShop">
    <div class="header-wrap">
      店铺编号：<span class="shop-code">786868799</span>
    </div>

    <!-- 主体 -->
    <div class="main">
      <Form :model="form" :label-width="100">
        <!-- 中间  center -->
        <Row class="center-wrap"> 
          <i-col span="9">
            <FormItem style="margin-bottom:40px;width:85%" label="店铺名称：">十月芬芳旗舰店</FormItem>
            <FormItem style="margin-bottom:20px;width:85%" label=" 联系地址：">
             广东省广州市天河区广州市天河区天源路401号之三2栋303房
            </FormItem>
          </i-col>
          <i-col span="9">
            <FormItem style="margin-bottom:40px;width:85%" label="管理员名字：">
             陈*军
            </FormItem>
            <FormItem label="店铺详情：" style="width:85%">
              <Input v-model="form.shopDescription" :autosize="{minRows: 4,maxRows: 4}" 
              type="textarea" placeholder="店铺详情" />
            </FormItem>
          </i-col>
          <i-col span="6">
            <FormItem style="margin-bottom:40px;width:85%" label="管理人手机：">
              13964582136
            </FormItem>
          </i-col>
        </Row>


        <!-- 下面  down -->
        <Row class="down-wrap">
          <!-- 上传店铺logo -->
          <i-col span="8">
            <FormItem label="店铺LOGO：">
              <img :src="form.shopLogo" class="avatar">
              <p class="preview-wrap" @click="handlePreview(form.shopLogo)">点击预览<Icon type="ios-eye-outline" class="preview-icon" /></p>
            </FormItem>
          </i-col>

          <!-- 上传营业执照 -->
          <i-col span="8">
            <FormItem label="营业执照：">
              <img :src="form.businessLicenseUrl" class="avatar">
              <p class="preview-wrap" @click="handlePreview(form.businessLicenseUrl)">点击预览<Icon type="ios-eye-outline" class="preview-icon" /></p>
            </FormItem>
            <div class="business-info">
              <div class="title">营业执照信息：</div>
              <el-input type="textarea" resize="none"
               readonly v-model="form.businessLicenseInfo">
              </el-input>
            </div>
          </i-col>
          <i-col span="8">
            <FormItem label="管理员证件：">
              <!-- 正面照 -->
              <div class="front-wrap" style="margin-bottom:20px">
                <img :src="form.papersUrl" class="avatar">
                <p class="preview-wrap" @click="handlePreview(form.papersUrl)">点击预览<Icon type="ios-eye-outline" class="preview-icon" /></p>
              </div>
              
              <!-- 反面照 -->
              <div class="back-wrap">
                <img :src="form.papersBackUrl" class="avatar">
                <p class="preview-wrap" @click="handlePreview(form.papersBackUrl)">点击预览<Icon type="ios-eye-outline" class="preview-icon" /></p>
              </div>
            </FormItem>
            <div class="contact-info">
              <div class="title">管理员身份信息：</div>
              <el-input type="textarea" resize="none"
               readonly v-model="form.contactInfo">
              </el-input>
            </div>
          </i-col>
        </Row>
      </Form>
    </div>


    <!-- 预览图片对话窗 -->
    <Modal v-model="previewModal" footer-hide class="preview-modal">
      <img width="100%" :src="previewUrl" alt="">
    </Modal>
  </div>
</template>

<script>
export default {
  name: "detail-shop",
  data() {
    return {
      form: {
        shopName: "",  // 店铺名称
        shopContact: "",  // 管理员名字
        contactNumber: "",  // 管理人手机
        areaCode: "",  // 区域编码
        shopSiteDetail: "",  // 店铺详细地址
        shopDescription: "",  // 店铺详情
        code: "",  // 手机验证码
        shopLogo: "https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1828075921,2799096089&fm=26&gp=0.jpg",  // 店铺logo
        businessLicenseUrl: "https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1828075921,2799096089&fm=26&gp=0.jpg",  // 营业执照
        papersUrl: "https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1828075921,2799096089&fm=26&gp=0.jpg",  // 身份证/护照 图片地址
        papersBackUrl: "https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1828075921,2799096089&fm=26&gp=0.jpg",  // 身份证/护照 反面图片地址
        businessLicenseInfo: "",  // 营业执照信息
        contactInfo: ""  // 管理员身份信息
      },
      
      previewModal: false,   // 控制预览弹窗的显现
      previewUrl: "",
    }
  },

  methods: {
    // 预览图片
    handlePreview(url) {
      this.previewModal = true
      this.previewUrl = url
    }
  }
};
</script>

<style lang="less" scoped>
.detailShop {
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
      margin-top: 10px;
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

/deep/.ivu-form-item-content {
  font-size: 13px;
  width: 80%;
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