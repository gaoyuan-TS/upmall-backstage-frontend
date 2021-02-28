<template>
  <div class="login-vue" :style="bg">
    <div class="login-icon">
        <img src="" alt="" srcset="">
    </div>
    <div class="container">
      <p class="title">WELCOME</p>
      <div class="input-c">
        <Input
          prefix="ios-contact"
          v-model="account"
          placeholder="用户名"
          clearable
        @on-blur="verifyAccount" 
        />
              <!-- @on-blur="verifyAccount" -->
        <p class="error">{{accountError}}</p>
      </div>
      <div class="input-c">
        <Input
          type="password"
          v-model="pwd"
          prefix="md-lock"
          placeholder="密码"
          clearable
        @on-blur="verifyPwd"
        />
             <!-- @on-blur="verifyPwd" -->
        <p class="error">{{pwdError}}</p>
      </div>
      <Button :loading="isShowLoading" class="submit" type="primary" @click="submit">登陆</Button>
      <p class="account">
        <span @click="register">注册账号</span> |
        <span @click="forgetPwd">忘记密码</span>
      </p>
    </div>
  </div>
</template>

<script>
import myStorage from "utils/localstore";
export default {
  name: "login",
  data() {
    return {
      account: "",
      pwd: "",
      accountError: "",
      pwdError: "",
      isShowLoading: false,
      bg: {}
    };
  },
  created() {
    this.bg.backgroundImage =
    //   "url(" + require("assets/imgs/bg" + new Date().getDay() + ".jpg") + ")";
        "url(" + require("assets/imgs/bg.png") + ")";
  },
  watch: {
    $route: {                          
      handler: function(route) {
                                                                   
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  methods: {
    verifyAccount(e) {
        console.log(!this.account)
      if (!this.account) {
        this.accountError = "请输入账号";
      } else {
        this.accountError = "";
      }
    },
    verifyPwd(e) {
      if (!this.pwd ) {
        this.pwdError = "请输入密码";
      } else {
        this.pwdError = "";
      }
    },
    register() {
      console.log("注册账号");
    },
    forgetPwd() {
      console.log("忘记密码");
    },
    submit() {
      if (this.account  && this.pwd) {
        let info = {
          accountName: this.account,
          password: this.pwd
        };
        this.$post("/account/login", info).then(data => {
          console.log("this.$myStorage", this.$myStorage);
          console.log("data111111",data)
          myStorage.set("userInfo",JSON.stringify(data))
          // 登陆成功 设置用户信息
          myStorage.set(
            "userImg",
            "https://avatars3.githubusercontent.com/u/22117876?s=460&v=4"
          );
          myStorage.set("userName", data.accountName);
          // // 登陆成功 假设这里是后台返回的 token
          myStorage.set("token", data.token);
          this.isShowLoading = true;
          setTimeout(() => {
            this.$router.push({ path: this.redirect || "/" });
          }, 1500);
        });
      } else {
        if (!this.account ) {
          this.accountError = "请输入账号";
        }

        if (!this.pwd ) {
          this.pwdError = "请输入账号";
        }
      }
    }
  }
};
</script>

<style>
.login-vue {
  background-size: cover;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
}
.login-vue .container {
  background: rgba(0, 0, 0, 0.27);
  width: 300px;
  text-align: center;
  border-radius: 10px;
  padding: 30px;
}
.login-vue .ivu-input {
  background-color: transparent;
  color: #fff;
  outline: #fff;
  border-color: #fff;
}
.login-vue ::-webkit-input-placeholder {
  /* WebKit, Blink, Edge */
  color: rgba(255, 255, 255, 0.8);
}
.login-vue :-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: rgba(255, 255, 255, 0.8);
}
.login-vue ::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: rgba(255, 255, 255, 0.8);
}
.login-vue :-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: rgba(255, 255, 255, 0.8);
}
.login-vue .title {
  font-size: 16px;
  margin-bottom: 20px;
}
.login-vue .input-c {
  margin: auto;
  width: 200px;
}
.login-vue .error {
  color: red;
  text-align: left;
  margin: 5px auto;
  font-size: 12px;
  padding-left: 30px;
  height: 20px;
}
.login-vue .submit {
  width: 200px;
}
.login-vue .account {
  margin-top: 30px;
}
.login-vue .account span {
  cursor: pointer;
}
.login-vue .ivu-icon {
  color: #eee;
}
.login-vue .ivu-icon-ios-close-circle {
  color: #777;
}
.login-icon{
    position: absolute;
    top: 50px;
    left: 120px;
}
</style>


