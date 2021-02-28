<template>
  <div class="detailShop">
    <div class="header">
      <div class="header-wrap">
        归属运营中心：
        <span class="shop-code">{{objParam.operatingCenterName|| '暂无数据'}}</span>
      </div>
      <div class="header-wrap">
        供应商名称：
        <span class="shop-code">{{objParam.shopName|| '暂无数据'}}</span>
      </div>
      <div class="header-wrap">
        供应商账号：
        <span class="shop-code">{{objParam.accountName|| '暂无数据'}}</span>
      </div>
    </div>
    <!-- 主体 -->
    <div class="main">
      <div class="message">
        <div class="message_header">供应商类型：{{Number(objParam.shopType)===2? '个人' : '企业'|| '暂无数据'}}</div>
        <div class="body" v-if="objParam.shopType==='1'">
          <div class="body_line">营业执照信息</div>
          <div class="box">
            <div class="item">公司名称：{{objParam.licenseInfo.companyName || '暂无数据'}}</div>
            <div class="item">统一社会信用代码：{{objParam.licenseInfo.companyCode || '暂无数据'}}</div>
            <div class="item">公司类型：{{objParam.licenseInfo.companyType || '暂无数据'}}</div>
          </div>
          <div class="box">
            <div class="item">公司登记状态：{{objParam.licenseInfo.companyStatus || '暂无数据'}}</div>

            <div class="item">经营范围：{{objParam.licenseInfo.companyBusiness || '暂无数据'}}</div>
            <div class="item">公司注册地址：{{objParam.licenseInfo.companyAddress || '暂无数据'}}</div>
          </div>
          <div class="box">
            <div class="item">公司经营地址：{{objParam.licenseInfo.companyAddress || '暂无数据'}}</div>
          </div>
           <div class="body_line">管理员信息</div>
          <div class="box">
            <div class="item">管理员姓名：{{objParam.shopContact || '暂无数据'}}</div>
            <div class="item">联系号码：{{objParam.contactNumber || '暂无数据'}}</div>
          </div>
        </div>

        <!-- v-if="cardInfo.name&&objParam.shopType==='2'" -->
        <div class="body" v-if="objParam.shopType==='2'">
          <div class="body_line">个人身份</div>
          <div class="box">
            <div class="item">姓名：{{cardInfo.name || '暂无数据'}}</div>
            <div class="item">身份号码：{{cardInfo.idNum || '暂无数据'}}</div>
            <div class="item">联系地址：{{cardInfo.address || '暂无数据'}}</div>
          </div>
          <div class="body_line">管理员信息</div>
          <div class="box">
            <div class="item">管理员姓名：{{objParam.shopContact || '暂无数据'}}</div>
            <div class="item">联系号码：{{objParam.contactNumber || '暂无数据'}}</div>
                  <div class="item"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 预览图片对话窗 -->
    <Modal v-model="previewModal" footer-hide class="preview-modal">
      <img width="100%" :src="previewUrl" alt />
    </Modal>
  </div>
</template>

<script>
export default {
  name: "detail-shop",
  data() {
    return {
      cardInfo: {
        name: "",
        idNum: "",
        address: "",
      },

      objParam: {
        shopName: "",
        shopContact: "",
        contactNumber: "",
        operatingCenterId: 0,
        operatingCenterName: "",
        shopType: 0,
        accountName: "",
        businessLicenseUrl: "",
        licenseInfo: {
          companyName: "",
          companyStatus: "",
          companyType: "",
          companyCode: "",
          companyBusiness: "",
          companyAddress: "",
        },
      },
      previewModal: false, // 控制预览弹窗的显现
      previewUrl: "",
    };
  },
  created() {
    if (this.$route.params.id) {
      this.detailSupplier();
    }
  },
  watch: {
    "$route.params.id"() {
      this.detailSupplier();
    },
  },
  methods: {
    detailSupplier() {
      this.$get("/shop/getSupplier?shopId=" + this.$route.params.id).then(
        (res) => {
          if (res.shopType === 1) {
            this.objParam.licenseInfo.companyName = res.companyName;
            this.objParam.licenseInfo.companyStatus = res.companyStatus;
            this.objParam.licenseInfo.companyType = res.companyType;
            this.objParam.licenseInfo.companyCode = res.companyCode;
            this.objParam.licenseInfo.companyBusiness = res.companyBusiness;
            this.objParam.licenseInfo.companyAddress = res.companyAddress;
          } else {
            this.cardInfo.id = res.cardId;
            this.cardInfo.name = res.name;
            this.cardInfo.idNum = res.idNum;
            this.cardInfo.address = res.address;
            this.spapersUrl = res.papersUrl;
            this.spapersBackUrl = res.papersBackUrl;
          }
          this.objParam.businessLicenseUrl = res.businessLicenseUrl;
          this.imgUrl = res.businessLicenseUrl;
          this.objParam.operatingCenterId = res.operatingCenterId;
          this.objParam.operatingCenterName = res.operatingCenterName;
          this.objParam.shopContact = res.shopContact;
          this.objParam.contactNumber = res.contactNumber;
          this.objParam.accountName = res.accountName;
          this.objParam.shopType = String(res.shopType);
          this.objParam.shopName = res.shopName;
        }
      );
    },
    // 预览图片
    handlePreview(url) {
      this.previewModal = true;
      this.previewUrl = url;
    },
  },
};
</script>

<style lang="less" scoped>
.detailShop {
  padding: 15px;
  .header-wrap {
    padding: 15px 10px 20px;
    border-bottom: 1px solid #efefef;
    margin-bottom: 27px;
    flex: 1;
    .shop-code {
      font-size: 13px;
      margin-left: 20px;
      font-weight: bold;
    }
  }

  .main {
    .message {
      border: 1px solid #ccc;
      .message_header {
        height: 44px;
        background: #fafafa;
        line-height: 44px;
        padding-left: 20px;
        font-size: 14px;
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 500;
        text-align: left;
        color: rgba(0, 0, 0, 0.85);
      }
      .body {
        padding: 20px;
      }
      .body_line {
        font-size:18px;
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 700;
        text-align: left;
        color: rgba(0, 0, 0, 0.65);
      }
      .box {
        display: flex;
        margin: 15px 0;
        .item {
          flex: 1;
        }
      }
    }
  }
}
</style>

<style lang="less" scoped>
.header {
  display: flex;
}
/deep/.ivu-form-item-label {
  font-size: 13.5px;
}

/deep/.ivu-form-item-content {
  font-size: 13px;
  width: 80%;
}
/deep/.el-cascader,
/deep/.el-input,
/deep/.el-input__inner {
  border-radius: 2px;
  padding-left: 12px;
  font-size: 13px !important;
}
/deep/.el-cascader,
/deep/.el-input {
  padding-left: 0;
}

/deep/.el-cascader__dropdown {
  /deep/.el-cascader-panel {
    font-size: 13px !important;
  }
  /deep/.el-cascader-node__label {
    font-size: 13px !important;
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
  transform: translate(-50%, -50%);
}

/deep/.el-progress-circle {
  width: 80px !important;
  height: 80px !important;
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