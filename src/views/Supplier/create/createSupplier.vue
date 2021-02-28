<template>
  <div class="shopList">
    <Form ref="objParam" :model="objParam" :label-width="100" :rules="ruleInline">
      <Row class="search" type="flex" align="middle">
        <i-col span="7" class="orderLine">
          <FormItem label="归属运营中心：" style="width:100%" prop="operatingCenterId">
            <Select v-model="objParam.operatingCenterId" @on-change="onChangeOperatingCenterData">
              <Option
                v-for="item in getOperatingCenterData"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
        </i-col>
        <i-col span="7" class="orderLine">
          <span style="fontSize:14px"></span>

          <FormItem label="供应商名称：" style="width:100%" prop="shopName">
            <Input placeholder="请输入" v-model="objParam.shopName" />
          </FormItem>
        </i-col>
        <i-col span="7" class="orderLine">
          <!-- <span style="fontSize:14px">供应商账号：</span>
          <Input
            @input="InpputaccountName"
            placeholder="请输入"
            :disabled="!!Number($route.params.id)"
            v-model="objParam.accountName"
            style="width:60%;"
          />-->
          <FormItem label="供应商账号：" style="width:100%" prop="accountName">
            <Input
              :disabled="!!Number($route.params.id)"
              v-model="objParam.accountName"
              placeholder="请输入"
            />
          </FormItem>
        </i-col>
      </Row>
      <Row class="search" type="flex" align="middle">
        <i-col span="7" class="orderLine">
          <FormItem label="管理员姓名：" style="width:100%" prop="shopContact">
            <Input placeholder="请输入" v-model="objParam.shopContact" />
          </FormItem>
        </i-col>

        <i-col span="7" class="orderLine">
          <FormItem label="管理员手机：" style="width:100%" prop="contactNumber">
            <Input placeholder="请输入" v-model="objParam.contactNumber" type="number" />
          </FormItem>
        </i-col>
      </Row>

      <div class="main">
        <div class="message">
          <div class="message_header">
            <FormItem label=" 供应商类型:" style="width:100%" prop="shopType">
              <Select v-model="objParam.shopType" style="width:15%">
                <Option
                  v-for="item in shopType"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
          </div>
          <div class="body" v-if="objParam.shopType==='1'">
            <div class="body_line">身份信息</div>
            <div class="box">
              <div class="item">
                上传企业营业执照：
                <Upload
                  :data="dataAction"
                  action="http://zs-beta.cntracechain.com/imageService/image/add"
                  :on-success="handleSuccess"
                  :show-upload-list="false"
                >
                  <Button icon="ios-cloud-upload-outline">Upload files</Button>
                </Upload>
              </div>
            </div>
            <div class="box" style="margin-left:6%;width:250px">
              <img style="width:100%;height:100%" :src="imgUrl" alt srcset />
            </div>
          </div>

          <div class="body" v-if="objParam.shopType==='2'">
            <div class="body_line">身份信息</div>
            <div class="box">
              <div class="item">
                上传身份证：
                <Upload
                  style="margin-right:15px"
                  :data="dataAction"
                  action="http://zs-beta.cntracechain.com/imageService/image/add"
                  :on-success="handleSuccesspapersUrl"
                  :show-upload-list="false"
                >
                  <Button icon="ios-cloud-upload-outline">证件照正面</Button>
                </Upload>
                <Upload
                  :data="dataAction"
                  action="http://zs-beta.cntracechain.com/imageService/image/add"
                  :on-success="handleSuccesspapersBackUrl"
                  :show-upload-list="false"
                >
                  <Button icon="ios-cloud-upload-outline">证件照反面</Button>
                </Upload>
              </div>
            </div>
            <div class="box" style="margin-left:6%;width:250px">
              <img style="width:100%;height:100%;margin-right:15px" :src="spapersUrl" alt srcset />
              <img style="width:100%;height:100%" :src="spapersBackUrl" alt srcset />
            </div>
          </div>

          <div class="body" v-if="objParam.licenseInfo.companyName&&objParam.shopType==='1'">
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
          </div>

          <div class="body" v-if="cardInfo.name&&objParam.shopType==='2'">
            <div class="body_line">个人身份</div>
            <div class="box">
              <div class="item">姓名：{{cardInfo.name || '暂无数据'}}</div>
              <div class="item">身份号码：{{cardInfo.idNum || '暂无数据'}}</div>
              <div class="item">联系地址：{{cardInfo.address || '暂无数据'}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="btnbbox">
        <FormItem>
          <Button
            class="btn"
            type="primary"
            @click="confirm('objParam')"
          >{{Number($route.params.id )===0?'新建': '保存'}}</Button>
          <Button class="btn" @click.native="$router.go(-1)">取消</Button>
        </FormItem>
      </div>
    </Form>
  </div>
</template>

<script>
export default {
  name: "shop-list",
  data() {
    return {
      dataAction: {
        imgSystemId: new Date().getTime(),
        imgSpecificUniqueValue: new Date().getTime(),
      },
      shopType: [
        {
          value: "1",
          label: "企业",
        },
        {
          value: "2",
          label: "个人 ",
        },
      ],
      ruleInline: {
        accountName: [
          {
            pattern:/^[a-zA-Z0-9_]{0,}$/, //正则表达式验证 
            required: true, 
            message: "供应商账号不能存在中文",
            trigger: "blur",
          },
        ],
        shopName: [
          {
            required: true,
            message: "供应商名称不能为空",
            trigger: "blur",
          },
        ],
        shopContact: [
          {
            required: true,
            message: "管理员姓名不能为空",
            trigger: "blur",
          },
        ],
        contactNumber: [
          {
            required: true,
            message: "管理员手机不能为空",
            trigger: "blur",
          },
        ],
        operatingCenterId: [
          {
            required: true,
            message: "请选择归属运营中心",
          },
        ],
        shopType: [
          {
            required: true,
            message: "供应商类型不能为空",
          },
        ],
      },
      spapersBackUrl: "",
      spapersUrl: "",
      objParam: {
        shopName: "",
        shopContact: "",
        contactNumber: "",
        operatingCenterId: "",
        operatingCenterName: "",
        shopType: "",
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

      cardInfo: {
        name: "",
        idNum: "",
        address: "",
      },

      columns: [
        {
          title: "供应商名称",
          key: "shopName",
        },
        {
          title: "归属运营中心",
          key: "shopContact",
        },
        {
          title: "管理员手机号",
          key: "contactNumber",
        },
        {
          title: "供应商状态",
          key: "createTime",
        },
        {
          title: "操作",
          slot: "operation",
        },
      ],
      imgUrl: "",
      filterParams: {
        shopName: "", // 店铺名称
        startDate: "", // 开始时间
        endDate: "", // 结束时间
        pageNum: 1, // 当前页
        pageSize: 10, // 页容量
      },
      getOperatingCenterData: [],
      isUpload: true,
      tableData: [
        {
          shopId: 1,
          shopName: "十月芬芳店铺1",
          shopContact: "李东升1",
          contactNumber: "13456776545",
          shopStatus: 1,
          createTime: "2020-05-27 11:18:25",
        },
        {
          shopId: 2,
          shopName: "十月芬芳店铺2",
          shopContact: "李东升2",
          contactNumber: "13456776545",
          shopStatus: 1,
          createTime: "2020-05-28 11:18:25",
        },
        {
          shopId: 3,
          shopName: "十月芬芳店铺3",
          shopContact: "李东升3",
          contactNumber: "13456776545",
          shopStatus: 1,
          createTime: "2020-05-29 11:18:25",
        },
      ],
    };
  },

  created() {
    if (!!Number(this.$route.params.id)) {
      this.getReturn();
    }
    this.getgetOperatingCenter();
  },
  watch: {
    "$route.params.id"() {
      if (!!Number(this.$route.params.id)) {

        this.getReturn();
      }
    },
  },

  methods: {
    InpputaccountName(val) {
      console.log(val.replace(/[\u4E00-\u9FA5]/g, ""));
      if (val.replace(/[\u4E00-\u9FA5]/g, "")) {
        this.objParam.accountName = val.replace(/[\u4E00-\u9FA5]/g, "");
      }
    },
    handleSuccesspapersBackUrl(val) {
      this.spapersBackUrl = val.data.imgUrl;
      if (this.spapersUrl) {
        this.getUSerMessage();
      }
    },
    handleSuccesspapersUrl(val) {
      this.spapersUrl = val.data.imgUrl;
      if (this.spapersBackUrl) {
        this.getUSerMessage();
      }
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
    getUSerMessage() {
      this.$post("/baseService/ocr/idCardOCRCombine", {
        front: this.spapersUrl,
        back: this.spapersBackUrl,
      })
        .then((res) => {
          this.cardInfo.name = res.name;
          this.cardInfo.idNum = res.idNum;
          this.cardInfo.address = res.address;
          this.isUpload = true;
        })
        .catch((err) => {
          if (err.code === 500) {
            this.isUpload = false;
            this.$tips.Message("error", `请输入上传正确并且清晰身份证`, 3);
          }
        });
    },
    getReturn() {
      this.$get("/shop/getSupplier?shopId=" + this.$route.params.id).then(
        (res) => {
          if (res.shopType === 1) {
            this.objParam.licenseInfo.companyName = res.companyName;
            this.objParam.licenseInfo.companyStatus = res.companyStatus;
            this.objParam.licenseInfo.companyType = res.companyType;
            this.objParam.licenseInfo.companyCode = res.companyCode;
            this.objParam.licenseInfo.companyBusiness = res.companyBusiness;
            this.objParam.licenseInfo.companyAddress = res.companyAddress;
            this.imgUrl = res.businessLicenseUrl;
            this.objParam.licenseInfo.id=res.licenseId
          } else {
            this.cardInfo.id = res.cardId;
            this.cardInfo.name = res.name;
            this.cardInfo.idNum = res.idNum;
            this.cardInfo.address = res.address;
            this.spapersUrl = res.papersUrl;
            this.spapersBackUrl = res.papersBackUrl;
          }

          this.objParam.businessLicenseUrl = res.businessLicenseUrl;

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
    //成功添加
    confirm(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.isUpload) {
            if (Number(this.objParam.shopType) === 1) {
              if (this.objParam.businessLicenseUrl) {
                this.objParam.id = this.$route.params.id;
                if (!!Number(this.$route.params.id)) {
                  this.$post("/shop/updateSupplier", this.objParam).then(
                    (data) => {
                      this.$tips.Message("success", `编辑成功`, 3);
                      this.$router.push("/SupplierList");
                    }
                  );
                } else {
                  this.$post("/shop/addShop", this.objParam)
                    .then((data) => {
                      // console.log(data)
                      this.$tips.Message("success", `添加成功`, 3);
                      this.$router.push("/SupplierList");
                    })
                    .catch((data) => {
                      console.log(" console.log(data)", data);
                      if (data.code === 500) {
                        this.$tips.Message("error", data.message, 3);
                      }
                    });
                }
              } else {
                this.$tips.Message(
                  "error",
                  `请输入上传正确并且清晰营业执照'`,
                  3
                );
              }
            } else {
              this.objParam.id = this.$route.params.id;
              if (this.spapersUrl) {
                if (this.spapersBackUrl) {
                  delete this.objParam.licenseInfo;
                  this.objParam.cardInfo = this.cardInfo;
                  this.objParam.papersBackUrl = this.spapersBackUrl;
                  this.objParam.papersUrl = this.spapersUrl;
                  console.log("this.$route.params.id", this.$route.params.id);
                  if (!!Number(this.$route.params.id)) {
                    this.$post("/shop/updateSupplier", this.objParam)
                      .then((data) => {
                        this.$tips.Message("success", `编辑成功`, 3);
                        this.$router.push("/SupplierList");
                        this.imgUrl = "";
                      })
                      .catch((data) => {
                        if (data.code === 500) {
                          this.$tips.Message("error", data.message, 3);
                        }
                      });
                  } else {
                    this.$post("/shop/addShop", this.objParam).then((data) => {
                      this.$tips.Message("success", `添加成功`, 3);
                      this.$router.push("/SupplierList");
                    });
                  }
                } else {
                  this.$tips.Message("error", `请上传个反面人证件`, 3);
                }
              } else {
                this.$tips.Message("error", `请上传个人正面证件`, 3);
              }
            }
          } else {
              this.$tips.Message("error", `请重新上传相关证件 `, 3);
          }
        }
      });
      // return;
      // console.log("this.objParam.accountName", this.objParam);
      // if (this.objParam.operatingCenterId) {
      //   console.log(
      //     "this.objParam.operatingCenterName",
      //     this.objParam.operatingCenterName
      //   );
      //   if (this.objParam.operatingCenterName) {
      //     if (this.objParam.shopName) {
      //       if (this.objParam.accountName) {
      //         if (this.objParam.shopContact) {
      //           if (this.objParam.contactNumber) {
      //             if (this.objParam.shopType) {
      //             } else {
      //               this.$tips.Message("error", `请输入供应商类型`, 3);
      //             }
      //           } else {
      //             this.$tips.Message("error", `请输入管理员手机`, 3);
      //           }
      //         } else {
      //           this.$tips.Message("error", `请输入管理员姓名`, 3);
      //         }
      //       } else {
      //         this.$tips.Message("error", `请输入供应商账号`, 3);
      //       }
      //     } else {
      //       this.$tips.Message("error", `请输入供应商名称`, 3);
      //     }
      //   } else {
      //     this.$tips.Message("error", `请输入归属运营中心`, 3);
      //   }
      // } else {
      //   this.$tips.Message("error", `请输入归属运营中心`, 3);
      // }
    },
    onChangeOperatingCenterData(val) {
      for (const iterator of this.getOperatingCenterData) {
        //  console.log('iterator',iterator)
        if (iterator.value === val) {
          this.objParam.operatingCenterName = iterator.label;
        }
      }
    },
    handleSuccess(val) {
      console.log("val", val);
      this.imgUrl = val.data.imgUrl;
      this.getMessage(this.imgUrl);
    },
    getgetOperatingCenter() {
      this.$get("/shop/getOperatingCenter").then((res) => {
        for (const iterator of res) {
          this.getOperatingCenterData.push({
            value: iterator.id,
            label: iterator.name,
          });
        }
      });
    },
    getMessage(imgUrl) {
      this.$post("/baseService/ocr/BizLicenseOCR", { ImageUrl: imgUrl })
        .then((res) => {
          this.isUpload = true;
          this.objParam.businessLicenseUrl = imgUrl;
          this.userMessage = res;
          this.objParam.licenseInfo.companyName = res.name;
          this.objParam.licenseInfo.companyStatus = res.period;
          this.objParam.licenseInfo.companyType = res.type;
          this.objParam.licenseInfo.companyCode = res.regNum;
          this.objParam.licenseInfo.companyBusiness = res.business;
          this.objParam.licenseInfo.companyAddress = res.address;
          console.log("this.userMessage", this.userMessage);
        })
        .catch((err) => {
          console.log(err);
          if (err.code === 500) {
            this.isUpload = false;
            this.$tips.Message("error", `请输入上传正确并且清晰营业执照`, 3);
            this.objParam.licenseInfo.companyName = "";
            this.objParam.licenseInfo.companyStatus = "";
            this.objParam.licenseInfo.companyType = "";
            this.objParam.licenseInfo.companyCode = "";
            this.objParam.licenseInfo.companyBusiness = "";
            this.objParam.licenseInfo.companyAddress = "";
          }
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
    // border-bottom: 1px solid #EFEFEF;
    // margin-bottom: 27px;
    .orderLine {
      margin-right: 25px;
    }
  }
  .main {
    .message {
      border: 1px solid #ccc;
      .message_header {
        height: 44px;
        background: #fafafa;
        line-height: 44px;

        font-size: 14px;
        display: flex;
        align-items: center;
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 500;
        text-align: left;
        color: rgba(0, 0, 0, 0.85);
      }
      .body {
        padding: 20px;
      }
      .body_line {
        font-size: 18px;
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
          display: flex;
        }
      }
    }
  }
  .btnbbox {
    // text-align: text;
    // display: flex;
    // justify-content: center;
    margin-top: 50px;
    margin-bottom: 20px;
    text-align: center;
    .btn {
      margin: 0 15px;
    }
  }
}
</style>
<style lang="less" scoped>
/deep/.ivu-form-item {
  display: flex;
}
/deep/.ivu-form-item-label {
  width: 140px !important;
  text-align: center !important;
}
/deep/.ivu-form-item-content {
  margin: 0 !important;
  flex: 1;
}
</style>