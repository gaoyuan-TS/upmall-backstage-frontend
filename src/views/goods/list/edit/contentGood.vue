<template>
  <div class="contentGood">
    <div class="top">
      <div class="list">
        <div class="title">推荐理由：</div>
        <div class="item">
          <Input
            v-model="extra.recommendReason"
            maxlength="250"
            show-word-limit
            type="textarea"
            placeholder="Enter something..."
            style="width: 500px"
          />
        </div>
      </div>
    </div>
    <Row style="margin-top:20px">
      <i-col span="12">
        <div class="list">
          <div class="title">故事主题：</div>
          <div class="item">
            <Input
              v-model="extra.storyTheme"
              maxlength="40"
              show-word-limit
              type="textarea"
              placeholder="Enter something..."
              style="width: 500px"
            />
          </div>
        </div>
      </i-col>
      <i-col span="12">
        <div class="list">
          <div class="title">商品开发者：</div>
          <div class="item">
            <Input
              v-model="extra.goodsDeveloper"
              maxlength="20"
              show-word-limit
              type="textarea"
              placeholder="Enter something..."
              style="width: 500px"
            />
          </div>
        </div>
      </i-col>
    </Row>
    <Row>
      <i-col span="12">
        <div class="list">
          <div class="title">故事作者：</div>
          <div class="item">
            <Input
              v-model="extra.storyAuthor"
              maxlength="20"
              show-word-limit
              type="textarea"
              placeholder="Enter something..."
              style="width: 500px"
            />
          </div>
        </div>
      </i-col>

      <i-col span="12">
        <div class="list">
          <div class="title">作者个性 签名：</div>
          <div class="item">
            <Input
              v-model="extra.authorSignature"
              maxlength="100"
              show-word-limit
              type="textarea"
              placeholder="Enter something..."
              style="width: 500px"
            />
          </div>
        </div>
      </i-col>
    </Row>
    <Row>
      <div class="list context">
        <div class="title">故事内容：</div>
        <div class="item">
          <Input
            v-model="extra.storyContent"
            maxlength="5000"
            show-word-limit
            type="textarea"
            placeholder="Enter something..."
            style="width: 1000px; "
          />
        </div>
      </div>
    </Row>

    <Row style="display:flex;justify-content: center;">
      <Button type="primary" @click="save" style="margin:30px 25px">保存</Button>
    </Row>
  </div>
</template>

<script>
export default {
  name: "content-good",
  data() {
    return {
      spuId: "",
      extra: {
        recommendReason: "",
        storyTheme: "",
        goodsDeveloper: "",
        storyAuthor: "",
        authorSignature: "",
        storyContent: ""
      }
    };
  },
  created() {
    this.getDetail(this.$route.params.id);
  },
  watch: {
    "$route.params.id"() {
      if (this.$route.params.id) {
        this.getDetail(this.$route.params.id);
      }
    }
  },
  methods: {
    getDetail(id) {
      this.$get("/spuExtraInformation/getBySpuId/" + id).then(res => {
        this.extra = res;
      });
    },
    save() {
      this.$post("/spuExtraInformation/update", this.extra).then(data => {
        // console.log(data)
        this.$tips.Message("success", data, 3);
        this.$router.push("/goodList");
      });
    }
  }
};
</script>
<style lang="less">
.contentGood {
  padding: 30px !important;
  box-sizing: border-box;
  .top {
    padding: 10px 0;
    border-bottom: 1px solid #f0f0f0;
  }
  .list {
    display: flex;
    margin: 15px 15px;
    .title {
      width: 150px;
      text-align: center;
    }
    /deep/ textarea {
      height: 150px !important;
    }
  }
  .context {
    /deep/ textarea {
      height: 300px !important;
    }
  }
}
</style>