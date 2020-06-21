<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/下载.svg" />
        <span>后台管理系统</span>
      </div>
      <el-button @click="logout">退出</el-button>
    </el-header>

    <!-- main区域 -->
    <el-container>
      <!--导航区域  -->
      <el-aside :width="base ? '64px' : '200px' ">
        <div class="toggle-button" @click="toggleOpen">|||</div>
        <!-- 侧边栏区域 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          :unique-opened="true"
          :collapse="base"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <i :class="iconList[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/'+subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/'+subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- 主要区域 -->
      <el-main>
        <!--路由占位符  -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menuList: [],
      iconList: {
        125: 'iconfont icon-yonghu',
        103: 'iconfont icon-quanxian',
        101: 'iconfont icon-yunliankeji-',
        102: 'iconfont icon-single',
        145: 'iconfont icon-shujutongji'
      },
      base: false,
      // 被激活得连接地址
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout: function () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有菜单
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
      console.log(res.data)
    },
    // 菜单折叠展开
    toggleOpen: function () {
      this.base = !this.base
    },
    // 保存用户状态
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style scoped>
.home_container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
}
.el-header div {
  display: flex;
  align-items: center;
}
.el-header span {
  margin-left: 15px;
}

.el-aside {
  background-color: #333744;
  color: #fff;
}
.el-aside .el-menu {
  border-right: none;
}

.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 15px;
}
.toggle-button {
  background-color: #333744;
  font-size: 10px;
  line-height: 10px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
