<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 表格 -->
      <el-table
        style="width: 100%"
        :data="rightList"
        border
        stripe
        :default-sort="{prop: 'level', order: 'ordering'}"
      >
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="权限路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级权限</el-tag>
            <el-tag type="success" v-if="scope.row.level === '1'">二级权限</el-tag>
            <el-tag type="info" v-if="scope.row.level === '2'">三级权限</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rightList: []
    }
  },
  created () {
    this.getRightsList()
  },
  methods: {
    async getRightsList () {
      const { data: res } = await this.$http.get('rights/' + 'list')
      if (res.meta.status !== 200) { return this.$message.error('获取角色列表失败') }
      this.rightList = res.data
    },
    sortArr () {
      this.list = this.rightList.level
    }
  }
}
</script>

<style lang="less" scoped>
</style>
