<template>
  <div class="crumbs">
     <Breadcrumb class="box-card" separator="/">
      <BreadcrumbItem v-for="(level,index) in levelList" :key="index" :to="level.path">
        {{level.name}}
      </BreadcrumbItem>     
    </Breadcrumb>
  </div>
</template>

<script>
export default {
  name : "crumbs",
  props:{
    isShow:{
        type:Boolean,
        default:true //默认值为true 显示
    }
  },
  data() {
    return {
        levelList: []
    }
  },
  watch: {
    $route(to,from) {
      console.log("to",this.levelList)
      // console.log(to,from)
      // 思路：判断meta中breadNumber为几，就把它放在第几个
      // 注意：存放到localStorage中的数据格式最好统一，我在这里把它统一成了数组的格式
      // levelList最终的格式要为：[{name:"xx",path:"xx",breadNum:"xx"}]
      this.getBreadcrumb()
    }
  }, 
  methods:{
    getBreadcrumb() { 
      // 1.获取当前的name,path,breadNumber
      var newName = this.$route.meta.title;
      var newPath = this.$route.fullPath;
      var newBreadNum = this.$route.meta.breadNumber;   
      console.log(this.$route)
      // 2.获取前一页存下的name,path,breadNumber
      var routerInfo =  JSON.parse(window.localStorage.getItem("routerInfo")) || [];     
      this.levelList = routerInfo;     
      // 3.判断是否是第一层，即初始位置，如果是第一层，分两种情况
      if(this.$route.meta.breadNumber === 1){
      // 3.1 localStorage有值，那么this.levelList不是空值，说明是由上一个主路由进来的，需要清空之前localStorage的值，并且重新赋值给levelList
        if(this.levelList.length != 0 ){
          localStorage.removeItem("routerInfo");
          this.levelList = [];            
        }
      // 3.2 localStorage没有值，说明就是第一次进主路由，直接赋值
        this.levelList.push({"name":newName,"path":newPath,"breadNumber":newBreadNum});
        // 按照数组格式的方式存放
        window.localStorage.setItem("routerInfo",JSON.stringify(this.levelList));
                
      }
      else{  
        var isBreadNumber = false;   
        // 4.breadNumber除了等于1，其他值时，this.levalList一定不是空值，判断点击的这个breadNumber数组中是否存在
        // 4.1 如果存在，就要删掉这个后面的所有值，并且将点击所获得的的这个值存进this.levalList数组中
        // 4.2 如果不存在，说明是按照顺序进行的，把它存到localStorage中，并把值给this.leavalList数组
          //在这里不用return，否则会终止循环
          for(var i = 0 ;i< this.levelList.length; i++){
            if(this.levelList[i].breadNumber == newBreadNum){
              if (newBreadNum === 2) {
                this.levelList.splice(1 ,1, {"name":newName,"path":newPath,"breadNumber":newBreadNum});
              }
              // return true; // 为true时表示数组内已存在 false表示不存在
              isBreadNumber = true;
              break;
            }
          }
          
          if( isBreadNumber ){
            //删除点击的后面所有信息，localStorage中的数据也要删除（这里的删除是截取，而不是完全删除），然后将该信息添加进去        
            //要注意的是，这里的变化还有可能是点击面包屑时产生的，其他地方通常是通过路由跳转得到的           
            // 注意这里splice的用法，如果直接写在localStorage.setItem 中，得到的值是被截取的值，而不是截取后的值
            routerInfo.splice( newBreadNum,routerInfo.length-newBreadNum);
            window.localStorage.setItem("routerInfo",JSON.stringify( routerInfo ))
          }
          else{ this.levelList.push({"name":newName,"path":newPath,"breadNumber":newBreadNum});
            window.localStorage.setItem("routerInfo",JSON.stringify(this.levelList));     
          }
        }
       
      }
      
      
  },
  
  created(){
    this.getBreadcrumb();   
  }
}
</script>

<style scoped lang="less">
/deep/.ivu-breadcrumb {
  // a:hover {
  //   color: @theme-color!important;
  // }

  span {
    &:first-child {
      font-size: @fontsize-large-xx!important;
      color: @color-dark!important;
    }
    &:last-child {
      font-size: @fontsize-large;
      color: @color-grey;
    }
  }
}
</style>
