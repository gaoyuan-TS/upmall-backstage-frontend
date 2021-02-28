<template>
  <div class="category">
    <div class="search">
      <Row class="searchLine">
        <i-col span="6" class="orderLine">
          <div>分类名称：</div>
          <input type="text" v-model="treechildInfo.name" clearable />
        </i-col>
        <i-button type="primary" @click="search" class="btn">搜索</i-button>
      </Row>
    </div>
    <Row>
      <i-col span="7">
        <!-- <Col span="7"> -->
        <i-button type="primary" @click="append(true,insertInfo)" class="btn">新增一级分类</i-button>
        <div class="TreeBox">
          <Tree :data="baseData" :render="renderContent" ref="SyncTree"></Tree>
        </div>
      </i-col>
      <i-col span="17">
        <div class="list" style="    flex-direction: column;">
          <div class="list_header">类别：{{tabName || '一级分类'}}</div>
          <i-table :columns="columns" :data="TableData" :content="self" style="width:100%" border></i-table>
        </div>
      </i-col>
    </Row>
    <Page :total="total" class="pageClass" @on-change="onChangePage" />

    <!-- 模態框 -->
    <Modal
      v-model="module3"
      draggable
      scrollable
      title="添加图片"
      :loading="loading"
      @on-ok="onOkModal"
    >
      分类名称：
      <Input type="text" v-model="insertInfo.categoryName" disabled style="width: 323px;margin-left: 15px;"/>
      <div class="item-img" style="margin-top: 10px;">
        上传图片：
        <div class="share2">
          <el-upload
            class="avatar-uploader"
            action="https://zs.cntracechain.com/imageService/image/add"
            :data="upData"
            :show-file-list="false"
            :on-success="activityGoods"
            :before-upload="beforeIMGUpload"
          >
            <img v-if="insertInfo.img" :src="insertInfo.img" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div class="tip">支持扩展名：.jpeg .png .jpg; 尺寸：375*240</div>
        </div>
      </div>
    </Modal>
    <Modal
      class="ModalEditor"
      v-model="categoryEditor"
      scrollable
      title="编辑分类"
      :loading="loading"
      @on-ok="onOkModalEditor"
      @on-cancel="()=>{
        resetData()
      }"
    >
      <div class="item">
        分类名称：
        <Input type="text" v-model="insertInfo.categoryName" style="width: 323px;margin-left: 15px;"/>
      </div>
      <div class="item">
        分类级别：
        <Select style="width: 323px;margin-left: 15px;" v-model="levelvalue" @on-change="changelevel">
          <Option v-for="(item,index) in levelList" :value="item.value" :key="index">{{item.lebal}}</Option>
        </Select>
      </div>
      <div class="item">
        选择上级：
        <Select
          v-model="editorValue"
          :disabled="levelvalue ? false : true"
          style="width: 323px;margin-left: 15px;"
          @on-change="changeEditor"
        >
          <Option v-for="item in editorList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div class="item-img" style="margin-top: 10px;">
        上传图片：
        <div class="share2">
          <el-upload
            class="avatar-uploader"
            action="https://zs.cntracechain.com/imageService/image/add"
            :data="upData"
            :show-file-list="false"
            :on-success="activityGoods"
            :before-upload="beforeIMGUpload"
          >
            <img v-if="insertInfo.img" :src="insertInfo.img" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div class="tip">支持扩展名：.jpeg .png .jpg; 尺寸：375*240</div>
        </div>
      </div>
    </Modal>
    <!-- 属性模态框 -->
    <Modal v-model="module1" :mask="false">
      <div class="propertyBox">
        <div class="header">
          <div class="titleS">属性</div>
          <div class="push" @click="module2 = true;is_insert=true;resetpropertyDdata()">
            <i class="jia">+</i>属性新增
          </div>
        </div>
        <div class="content">
          <Scroll>
            <i-table :columns="propertyData" :data="propertyList" style="width:100%;"></i-table>
          </Scroll>
        </div>
      </div>
    </Modal>
    <Modal title="新增属性" :mask="false" v-model="module2" @on-ok="addPropertyName">
      <div class="propertiesBox">
        <div class="propertiesBox-item">
          <div class="name">属性名称：</div>
          <div class="value">
            <Input
              placeholder="请输入属性名称"
              v-model="propertyInfo.propertyName"
              clearable
              style="width:200px"
            />
          </div>
        </div>
        <div class="propertiesBox-item">
          <div class="name">录入方式：</div>
          <div class="value">
            <RadioGroup v-model="propertyMode">
              <Radio
                :label="item.label"
                v-for="(item,index) in propertyType"
                :key="index"
              >{{item.label}}</Radio>
            </RadioGroup>
          </div>
        </div>
        <div class="box" v-if="propertyMode==='列表选择'">
          <div class="Checkbox-item-box" :key="index" v-for="(item,index) in  propertModeList">
            <div class="value">
              <Input v-model="item.value" placeholder="请输入属性名称" style="width:200px" />
            </div>
            <div class="add" v-if="index === 0" @click.stop.prevent="CheckboxPush()">
              <i class="jia">+</i>
              新增
            </div>
            <div class="add" v-if="index != 0" @click.stop="Checkboxremote(index)">
              <i class="jia">-</i>
              删除
            </div>
          </div>
        </div>
      </div>
    </Modal>
    <!-- 模態框 -->
  </div>
</template>

<script>
export default {
  name: "category-set",
  data () {
    return {
      dataObj: {},
      isParent: false,
      module3: false,
      upData: {
        imgSystemId: 'ryy',
        imgSpecificUniqueValue: 'fddd'
      }, // 上传图片时要带的参数
      total: 0,
      loading: true,
      categoryEditor: false,
      categoryModal: false,
      self: this, //映射本身
      selectedList: [], //中间保持点击的节点数组
      tabName: "", //面包屑名称
      grade: 1, //等级
      listArr: [], //选择的数组
      columns: [
        {
          title: "ID",
          key: "id"
        },
        {
          title: "分类名称",
          key: "categoryName"
        },
        {
          title: "创建时间",
          key: "createTime"
        },
        {
          title: "商品数",
          key: "count"
        },
        {
          title: "状态",
          key: "isShow",
          render: (h, params) => {
            let marketType = params.row.isShow;
            if (marketType == "1") {
              marketType = h(
                "span",
                {
                  style: {
                    color: "green"
                  }
                },
                "启动"
              );
            } else {
              marketType = h(
                "span",
                {
                  style: {
                    color: "red"
                  }
                },
                "禁止"
              );
            }
            return marketType;
          }
        },
        {
          title: "操作",
          key: "action",
          width: 200,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.switchs(params);
                    }
                  }
                },
                params.row.isShow === 1 ? "禁止" : "启动"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.editClass(params);
                    }
                  }
                },
                "编辑"
              ),
              h(
                params.row.categoryLevel == 4 ? "Button" : "",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.getbaseProperty(params.row.id);
                    }
                  }
                },
                "属性"
              )
            ]);
          }
        }
      ],
      levelvalue: "",
      editorValue: "",
      TableData: [], //表格数据
      baseData: [], //树的数据
      level: ["一", "二", "三", "四"], //等级名称
      treechildInfo: {
        id: "",
        name: "",
        pageNum: 1,
        pageSize: 10
      },
      editorList: [],
      insertInfo: {
        parentId: 0,
        categoryName: "",
        description: "",
        sortRank: 0,
        img: '',
        isShow: 1
      },
      categoryId: "",
      module2: false, //新增属性弹窗
      module1: false, //属性列表弹窗
      propertyMode: "手工录入", //单选
      social: [],
      propertyType: [
        {
          value: 0,
          label: "手工录入"
        },
        {
          value: 1,
          label: "列表选择"
        },
        {
          value: 2,
          label: "多行文本"
        }
      ],
      propertModeList: [
        {
          value: ""
        }
      ],
      //属性表格头部
      propertyData: [
        {
          title: "属性名称",
          key: "propertyName"
        },
        {
          title: "录入方式",
          key: "enterType",
          render: (h, params) => {
            return h(
              "div",
              params.row.enterType === 0
                ? "手工录入"
                : params.row.enterType === 1
                  ? "列表选择"
                  : "多行文本"
            );
          }
        },
        {
          title: "操作",
          key: "action",
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
                  style: { color: "#005afe" },
                  on: {
                    click: () => {
                      console.log(params);
                      this.is_insert = false;
                      this.propertyInfo = {
                        categoryId: params.row.categoryId,
                        enterType: params.row.enterType,
                        id: params.row.id,
                        propertyName: params.row.propertyName
                      };
                      this.propertyMode =
                        params.row.enterType === 0
                          ? "手工录入"
                          : params.row.enterType === 1
                            ? "列表选择"
                            : "多行文本";
                      if (params.row.enterType === 1) {
                        let arr = params.row.selectValue.map(item => {
                          return { value: item };
                        });
                        this.propertModeList = arr;
                      } else {
                        this.propertModeList = params.row.selectValue;
                        this.propertModeList = [
                          {
                            value: ""
                          }
                        ];
                      }

                      this.module2 = true;
                    }
                  }
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  style: { color: "#005afe" },
                  on: {
                    click: () => {
                      this.deleteproperty(params);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ], //属性列表头部
      propertyList: [], //属性列表
      //属性对象
      propertyInfo: {
        categoryId: "",
        enterType: "",
        propertyName: "",
        selectValue: ""
      },
      is_insert: false,
      // 输入框要修改的内容
      inputContent: "",
      // 修改前的TreeNode名称
      oldName: "",
      levelList: [
        //列表等级数组
        {
          value: "1",
          lebal: "一级"
        },
        {
          value: "2",
          lebal: "二级"
        },
        {
          value: "3",
          lebal: "三级"
        }
      ]
    };
  },
  watc: {
    propertyMode () {
      this.propertModeList = [];
    }
  },
  created () {
    //获取左边树的全部数据
    this.getCategoryData();
  },
  methods: {
    // 分享文件上传
    activityGoods (res, file) {
      // console.log(response)
      if (res.code === 200) {
        this.$Message.success(res.message)
        this.insertInfo.img = res.data.imgUrl
        console.log('this.insertInfo', this.insertInfo.img)
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
    //删除属性的功能
    deleteproperty (params) {
      this.$post("/baseProperty/deleteById?id=" + params.row.id).then(res => {
        this.$tips.Message("success", `刪除成功！≧◠◡◠≦✌'`, 3);
        let indexOf4 = (this.propertyList || []).findIndex(
          item => item.id === params.row.id
        );
        console.log("indexOf4", indexOf4);
        this.propertyList.splice(indexOf4, 1);
      });
    },
    //添加属性
    addPropertyName () {
      //区分是否是编辑与新增 赋值分类id
      this.propertyInfo.categoryId = this.is_insert
        ? this.categoryId
        : this.propertyInfo.categoryId;
      //判断属性名是否存在
      if (this.propertyInfo.propertyName) {
        this.propertyInfo.enterType = this.propertyType.find(item => {
          return item.label == this.propertyMode;
        }).value;
        //判断是否是列表选择 如果是列表选择  selectValue不能为空
        if (this.propertyInfo.enterType !== 1) {
          this.propertyInfo.selectValue = "";
        } else {
          this.propertyInfo.selectValue = this.propertModeList
            .map(val => {
              return val.value;
            })
            .join("&");
        }
        this.$post(
          this.is_insert ? "/baseProperty/insert" : "/baseProperty/update",
          this.propertyInfo
        ).then(res => {
          this.$tips.Message(
            "success",
            `${this.is_insert ? "新增" : "修改"}'成功！≧◠◡◠≦✌'`,
            3
          );
          this.module2 = false;
          this.resetpropertyDdata();
          this.getbaseProperty(this.categoryId);
        });
      } else {
        this.$tips.Message("error", "属性名称不能为空！≧◔◡◔≦", 3);
      }
    },
    //获取属性列表
    getbaseProperty (id) {
      this.categoryId = id;
      this.$get("/baseProperty/getByCategory/" + id).then(data => {
        this.propertyList = data;
        this.module1 = true;
      });
    },
    // 新增属性
    CheckboxPush () {
      this.propertModeList.push(
        JSON.parse(
          JSON.stringify({
            value: ""
          })
        )
      );
    },
    // 删除属性
    Checkboxremote (e) {
      this.propertModeList.splice(e, 1);
    },

    // 编辑
    onOkModalEditor () {
      if (!this.insertInfo.categoryName) {
        this.$tips.Message("error", "分类名称不能为空！", 3);
        return false;
      }
      this.$post("/category/update", this.insertInfo).then(res => {
        this.$Message.info("修改成功");
        this.resetData();
        this.loading = false;
        this.getCategoryData();
      });
      this.categoryEditor = false;
    },
    //切换等级
    changeEditor (val) {
      this.insertInfo.parentId = val;
    },
    //切换分类
    changelevel (val) {
      if (this.levelvalue) {
        this.getTreeClass(val);
      } else {
        this.editorValue = "";
      }
    },
    //获取上一级
    getTreeClass (val) {
      this.$get("/category/getLevel", { level: val, name: "" }).then(data => {
        this.editorList = data.map(item => {
          let obj = {};
          obj.label = item.categoryName;
          obj.value = item.id;
          return obj;
        });
      });
    },
    //编辑分类
    editClass (params) {
      this.categoryEditor = true;
      this.insertInfo.categoryName = params.row.categoryName;
      this.editorValue = params.row.parentId;
      this.insertInfo.parentId = params.row.parentId;
      this.insertInfo.id = params.row.id;
      this.insertInfo.isShow = params.row.isShow;
      this.insertInfo.img = params.row.img;
    },
    // 树渲染逻辑
    renderContent (h, { root, node, data }) {
      return h(
        "span",
        {
          style: {
            display: "inline-block",
            lineHeight: "1.6rem",
            width: "100%",
            fontSize: "12px",
            cursor: "pointer"
          },
          on: {
            click: () => {
              // 点击Tree节点触发
              this.handleClickTreeNode([data]);
            },
            mouseover: () => {
              data.is_show = true;
            },
            //鼠标离开
            mouseout: () => {
              data.is_show = false;
            }
          }
        },
        [
          h("span", [
            h(`${data.editState ? "" : "span"}`, data.title),
            h(`${data.editState ? "input" : ""}`, {
              attrs: {
                value: `${data.editState ? data.title : ""}`,
                autofocus: "true"
              },
              style: {
                width: "12rem",
                cursor: "auto"
              },
              on: {
                change: event => {
                  this.inputContent = event.target.value;
                }
              }
            })
          ]),
          // 增删改按钮部分
          h(
            `${data.is_show ? "span" : ""}`,
            {
              class: "btnNone",
              style: { marginLeft: "0.2rem" }
            },
            [
              //操作按钮部分
              // 编辑按钮
              h("Button", {
                props: Object.assign({}, this.buttonProps, {
                  icon: "ios-brush-outline"
                }),
                style: {
                  marginRight: "2px",
                  borderRadius: "50%",
                  width: "1.5rem",
                  lineHeight: "0",
                  padding: "0",
                  height: "1.5rem"
                },
                on: {
                  click: event => {
                    event.stopPropagation();
                    this.editTree(data);
                    this.insertInfo.categoryName = data.title;
                  }
                }
              }),
              // 添加按钮
              h("Button", {
                props: Object.assign({}, this.buttonProps, {
                  icon: "ios-add"
                }),
                style: {
                  marginRight: "2px",
                  borderRadius: "50%",
                  width: "1.5rem",
                  lineHeight: "0",
                  padding: "0",
                  height: "1.5rem"
                },
                on: {
                  click: event => {
                    event.stopPropagation();

                    this.append(false, data);
                  }
                }
              }),
              // 删除按钮
              h("Button", {
                props: Object.assign({}, this.buttonProps, {
                  icon: "ios-remove"
                }),
                style: {
                  marginRight: "2px",
                  borderRadius: "50%",
                  width: "1.5rem",
                  lineHeight: "0",
                  padding: "0",
                  height: "1.5rem"
                },
                on: {
                  click: () => {
                    this.removeroot(root, node, data);
                  }
                }
              })
            ]
          ),
          // 确认/取消修改部分
          h(`${data.editState ? "div" : ""}`, [
            // 确认按钮
            h("Button", {
              props: Object.assign({}, this.buttonProps, {
                icon: "md-checkmark"
              }),
              style: {
                // marginRight: '8px',
                border: 0,
                background: "rgba(0,0,0,0)",
                fontSize: "1.3rem",
                outline: "none"
              },
              on: {
                click: event => {
                  this.confirmTheChange(data);
                }
              }
            }),
            // 取消按钮
            h("Button", {
              props: Object.assign({}, this.buttonProps, {
                icon: "md-close"
              }),
              style: {
                border: "0",
                background: "rgba(0,0,0,0)",
                fontSize: "1.3rem",
                outline: "none"
              },
              on: {
                click: () => {
                  this.CancelChange(data);
                }
              }
            })
          ])
        ]
      );
    },

    //追加分类
    append (is_parent, data) {
      this.insertInfo.categoryName = ''
      this.isParent = is_parent
      this.dataObj = data
      this.$Modal.confirm({
        title: "新增分类",
        onOk: () => {
          if (!this.insertInfo.categoryName) {
            this.$tips.Message("error", "分类名称不能为空！", 3);
            return false;
          }
          this.insertInfo.parentId = is_parent ? 0 : data.id;
          this.module3 = true
        },
        render: h => {
          return h("Input", {
            props: {
              value: this.insertInfo.categoryName,
              autofocus: true,
              placeholder: "请输入分类名称"
            },
            on: {
              input: val => {
                this.insertInfo.categoryName = val;
              }
            }
          });
        }
      });
    },

    //删除分类
    removeroot (root, node, data) {
      event.stopPropagation();
      this.$Modal.confirm({
        title: "提示",
        content: `您确定删除 “${data.title}” 吗？`,
        onOk: () => {
          this.$get("/category/deleteById", { id: data.id }).then(mess => {
            this.$tips.Message("success", "删除成功," + mess, 3);
            // if()
            if (data.grade === 1) {
              const parentKey = this.baseData.findIndex(
                el => el.id === data.id
              );
              this.baseData.splice(parentKey, 1);
            } else {
              const parentKey = root.find(el => el === node).parent;
              const parent = root.find(el => el.nodeKey === parentKey).node;
              const index = parent.children.indexOf(data);
              parent.children.splice(index, 1);
            }
          });
        }
      });
    },
    // 控制Tree当前状态函数
    setStates (data) {
      let editState = data.editState;
      if (editState) {
        this.$set(data, "editState", false);
      } else {
        this.$set(data, "editState", true);
      }
    },
    // Tree修改按钮
    editTree (data) {
      event.stopPropagation();
      this.inputContent = data.title;
      this.oldName = data.title;
      this.setStates(data);
    },

    // 确认修改树节点
    confirmTheChange (data) {
      if (!this.inputContent) {
        this.$Notice.warning({
          title: "当前输入有误"
        });
      } else {
        if (this.oldName !== this.inputContent) {
          this.$Modal.confirm({
            title: "提示",
            content: `您确定将  “${this.oldName}”  重命名为 “ ${this.inputContent} ” 吗？`,
            onOk: () => {
              this.insertInfo.id = data.id;
              this.insertInfo.categoryName = this.inputContent;
              this.insertInfo.parentId = data.parentId;
              this.$post("/category/update", this.insertInfo).then(res => {
                data.title = this.inputContent;
                this.$Message.info("修改成功");
                this.resetData();
              });
            },
            onCancel: () => {
              this.$Message.info("取消");
            }
          });

          this.setStates(data);
        } else {
          this.setStates(data);
        }
      }
    },
    // 取消修改树节点
    CancelChange (data) {
      this.$Notice.info({
        title: "取消修改"
      });
      this.setStates(data);
    },
    resetpropertyDdata () {
      this.propertyMode = "手工录入";
      this.propertModeList = [
        {
          value: ""
        }
      ];
      this.propertyInfo = {
        categoryId: "",
        enterType: "",
        propertyName: "",
        selectValue: ""
      };
    },
    // 重置数据
    resetData () {
      // 重置数据
      this.insertInfo = {
        parentId: 0,
        categoryName: "",
        description: "",
        sortRank: 0,
        isShow: 1,
        img:''
      };
    },
    //切换分类状态
    switchs (params) {
      this.$get("/category/switchs", { id: params.row.id })
        .then(mess => {
          this.$tips.Message(
            "success",
            params.row.isShow ? "禁止成功!" : "启动成功" + mess,
            3
          );
          this.getCategoryChildrenData();
        })
        .catch(err => {
          this.$tips.Message("error", err.data.data, 3);
        });
    },
    //获取分类数据
    getCategoryData () {
      this.$get("/category/getTree", this.treechildInfo).then(res => {
        this.baseData = res.map((item, index) => {
          return this.generateRoutes(item);
        });
        this.getCategoryChildrenData();
      });
    },
    //获取分类列表的数据
    getCategoryChildrenData () {
      this.$get("/category/getJunior", this.treechildInfo).then(data => {
        this.total = data.total;
        this.TableData = data.records.map(item => {
          item["count"] = item.junior.count;
          return item;
        });
      });
    },

    //搜索
    search () {
      (this.treechildInfo.id = ""), (this.treechildInfo.pageNum = 1);
      this.getCategoryData();
    },
    //分页切换
    onChangePage (val) {
      this.treechildInfo.pageNum = val;
      this.getCategoryChildrenData();
    },
    //
    onOkModal () {
      this.categoryModal = false;
      this.$post("/category/insert", this.insertInfo).then(res => {
        let info = {
          title: res.data.categoryName,
          grade: res.data.categoryLevel,
          id: res.data.id,
          expand: false,
          children: []
        };
        if (!this.isParent) {
          const children = this.dataObj.children || [];
          children.push(info);
          this.$set(this.dataObj, "children", children);
        } else {
          this.baseData.push(info);
        }
        this.$tips.Message("success", "分类新增成功", 3);
        this.module3 = false
        // 重置数据
        this.resetData();
      });
    },
    // 添加分类
    addCategory () {
      this.categoryModal = true;
    },
    //深度便树结构
    generateRoutes (item) {
      let obj = {};
      obj.title = item.name;
      obj.id = item.id;
      obj.expand = false;
      obj.parentId = item.parentId;
      (obj.grade = item.grade),
        (obj.children = item.son.map(item => {
          return this.generateRoutes(item);
        }));
      return obj;
    },
    // 切换表格等级名称
    setLevelName () {
      if (this.grade !== 4) {
        this.columns.splice(1, 1, {
          title: this.level[this.grade] + "级分类",
          key: "categoryName"
        });
      }
    },
    //点击叶子节点
    handleClickTreeNode (selectedList) {
      //Array扩展remove方法
      Array.prototype.remove = function (val) {
        const index = this.indexOf(val);
        if (index > -1) {
          this.splice(index, 1);
        }
      };

      if (selectedList[selectedList.length - 1]) {
        selectedList[selectedList.length - 1].expand = !selectedList[
          selectedList.length - 1
        ].expand;
        this.selectedList = selectedList; //缓存数据
      } else {
        this.selectedList[this.selectedList.length - 1].expand = !this
          .selectedList[this.selectedList.length - 1].expand;
      }
      //等级
      this.grade = this.selectedList[this.selectedList.length - 1].grade;
      //获取节点id
      this.treechildInfo.id = this.selectedList[
        this.selectedList.length - 1
      ].id;
      //重置名称为空
      this.treechildInfo.name = "";
      this.treechildInfo.pageNum = 1;
      // 获取分类数据
      this.getCategoryChildrenData();

      //循环执行所有选中的节点链
      this.checkedNodeAndParents = this.getCheckedNodeAndParents(
        this.baseData,
        [],
        this.selectedList[0].id
      );
      let tab = [];
      this.checkedNodeAndParents.map(item => {
        tab.push(item.title);
      });
      this.tabName = tab.join(">");
    },

    //获取级数节点
    getCheckedNodeAndParents (array, checkedNodeAndParents, curNodeId) {
      for (let i = 0; i < array.length; i++) {
        const item = array[i];
        if (item.id === curNodeId) {
          checkedNodeAndParents.push(item);
          return checkedNodeAndParents;
        }
        if (item.children && item.children.length > 0) {
          checkedNodeAndParents.push(item);
          const rs = this.getCheckedNodeAndParents(
            item.children,
            checkedNodeAndParents,
            curNodeId
          );
          if (rs) {
            return rs;
          } else {
            checkedNodeAndParents.remove(item);
          }
        }
      }
      return false;
    }
  }
};
</script>

<style scoped lang="less">
.category {
  min-height: 650px !important;
  padding-bottom: 50px;
  padding: 15px;
  position: relative;
  .list_header {
    margin: 15px 0;
  }

  .ivu-tree-children {
    color: red;
  }
  .search {
    margin-top: 20px;

    .searchLine {
      margin-bottom: 15px;
      .orderLine {
        display: flex;
      }
    }
    .searchLine:last-child {
      margin-bottom: 20px;
    }
  }
  .pageClass {
    position: absolute;
    bottom: 10px;
    right: 50px;
  }
  .TreeBox {
    min-height: 100%;
    border-right: 1px solid #ccc;
    height: 650px !important;
    overflow-y: auto;
    margin-right: 15px;
  }
}

//属性样式
.propertyBox {
  .header {
    display: flex;
    padding: 10px;
    border-bottom: 1px solid #f0f0f0;
    align-items: center;
    .titleS {
      font-size: 16px;
    }
    .push {
      
      margin-left: 15px;
      font-size: 15px;
      color: #1890ff;
      cursor: pointer;
      .jia {
        font-style: normal;
        font-size: 20px;
      }
    }
  }
}

.box {
  .Checkbox-item {
    display: flex;
    align-items: center;
  }
  padding-left: 65px;
  display: flex;
  flex-direction: column;
  .Checkbox-item-box {
    margin: 8px 0;
    display: flex;
    align-items: center;
    .value {
      margin-left: 15px;
      display: flex;
      align-items: center;
    }
    .add {
      cursor: pointer;
      margin-left: 10px;
      color: #1890ff;
    }
  }
}
.propertiesBox {
  .propertiesBox-item {
    margin-top: 15px;
    display: flex;
    align-items: center;
    .name {
      width: 80px;
    }
    .value {
      display: flex;
      align-items: center;
    }
    .add {
      cursor: pointer;
      margin-left: 10px;
      color: #1890ff;
    }
  }
}
</style>
<style lang="less">
.item-img {
  display: flex;
  .share2 {
    margin-left: 5px;
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
.view-c {
  min-height: 650px !important;
  padding-bottom: 50px;
}
.category {
  /deep/ .ivu-tree-title {
    width: 80%;
  }
}

//设置模态框item的上下间距
.ModalEditor {
  .item {
    margin: 15px 0;
  }
}
</style>