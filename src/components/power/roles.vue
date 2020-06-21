<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-button type="primary" @click="addUser=true">添加角色</el-button>

      <!-- 表格 -->
      <el-table style="width: 100%" :data="rolesList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1,i1) in scope.row.children"
              :key="item1.id"
              :class="['bdbottom', i1 === 0 ? 'bdtop':'','centerStyle']"
            >
              <!-- 一级权限区域 -->
              <el-col :span="5">
                <el-tag closable @close="deleteRights(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二、三级权限区域 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                  :class="[i2 === 0 ? '':'bdtop','centerStyle']"
                >
                  <!-- 二级权限区域 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="deleteRights(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限区域 -->
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="info"
                      closable
                      @close="deleteRights(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>

        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色列表" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="400px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editUserInfo(scope.row.id)"
            >修改角色</el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteRole(scope.row.id)"
            >删除角色</el-button>
            <!-- 分配角色按钮 -->
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightsDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addUser" width="50%" @close="resetUserForm">
      <el-form :model="addForm" ref="addFormRef" label-width="70px">
        <el-form-item label="角色名称" prop="username">
          <el-input autocomplete v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="password">
          <el-input autocomplete="off" v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUser = false">取 消</el-button>
        <el-button type="primary" @click="addUserForm">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改用户信息 -->
    <el-dialog title="修改用户信息" :visible.sync="changeInfo" width="50%" @close="resetEdiotUser">
      <el-form label-width="70px" :model="serachUser" ref="ediotUserRef">
        <el-form-item label="角色ID">
          <el-input autocomplete="off" :disabled="true" v-model="serachUser.roleId"></el-input>
        </el-form-item>
        <el-form-item label="角色名">
          <el-input autocomplete="off" v-model="serachUser.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="mobile">
          <el-input autocomplete="off" v-model="serachUser.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="changeInfo = false">取 消</el-button>
        <el-button type="primary" @click="ediotUserInfo">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 删除用户 -->
    <el-dialog title="删除用户" :visible.sync="deleteRoleClear" width="30%">
      <span>警告！即将删除该用户---{{serachUser.roleName}}</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteRoleClear = false">取 消</el-button>
        <el-button type="primary" @click="deleteTheUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 删除权限 -->
    <el-dialog title="删除该权限" :visible.sync="deleteRightsClear" width="30%">
      <span>警告！即将删除该权限</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeRights">取 消</el-button>
        <el-button type="primary" @click="deleteTheRight">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="showSettig" width="50%" @close="clearBox">
      <!-- 树行控件 -->
      <el-tree
        :data="rightsTreeList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        accordion
        :default-checked-keys="checkOut"
        :default-expanded-keys="checkOut"
        ref="treeRef"
      ></el-tree>

      <div slot="footer" class="dialog-footer">
        <el-button>取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rolesList: [],
      addUser: false,
      changeInfo: false,
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      serachUser: {},
      idMark: 0,
      deleteRoleClear: false,
      deleteRightsClear: false,
      deleteDate: {},
      showSettig: false,
      rightsTreeList: [],
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      checkOut: [],
      roleId: ''
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    // 获取角色列表
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) { return this.$message.error('获取角色列表失败') }
      console.log(res)
      this.rolesList = res.data
    },
    // 监听添加角色对话框关闭事件
    resetUserForm () {
      this.$refs.addFormRef.resetFields()
      this.addForm = ''
    },
    // 监听修改角色对话框关闭事件
    resetEdiotUser () {
      this.$refs.ediotUserRef.resetFields()
    },
    // 传递表信息给服务器,添加新用户
    addUserForm () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        // 可以发起添加用户的网络请求
        const { data: res } = await this.$http.post('roles', this.addForm)
        console.log(this.addForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加用户失败！')
        }

        this.$message.success('添加用户成功！')
        // 隐藏添加用户的对话框
        this.addUser = false
        // 重新获取用户列表数据
        this.getRolesList()
      })
    },
    // 打开修改用户
    async editUserInfo (id) {
      this.changeInfo = true
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) { return this.$message.error('获取用户数据失败') }
      this.serachUser = res.data
      console.log(res)
      this.idMark = res.data.roleId
    },
    // 修改用户信息并上传服务器
    async ediotUserInfo () {
      console.log(this.serachUser)
      // 可以发起添加用户的网络请求
      const { data: res } = await this.$http.put('roles/' + this.idMark, {
        roleName: this.serachUser.roleName,
        roleDesc: this.serachUser.roleDesc
      })
      if (res.meta.status !== 200) { return this.$message.error('获取用户数据失败') }
      console.log(res)
      this.$message.success('用户修改成功')
      // 关闭修改对话框
      this.changeInfo = false
      // 重载用户列表
      this.getRolesList()
    },
    // 打开删除用户
    async deleteRole (id) {
      this.deleteRoleClear = true
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) { return this.$message.error('获取用户数据失败') }
      this.serachUser = res.data
      this.idMark = res.data.roleId
    },
    // 删除用户信息并上传服务器
    async deleteTheUser () {
      console.log('!!!!!!!!!!!!!!!')
      // // 可以发起添加用户的网络请求s
      const { data: res } = await this.$http.delete('roles/' + this.idMark)
      if (res.meta.status !== 200) { return this.$message.error('获取用户数据失败') }
      console.log(res)
      this.$message.success('用户删除成功')
      // // 关闭修改对话框
      this.deleteRoleClear = false
      // // 重载用户列表
      this.getRolesList()
    },
    deleteRights (role, rightId) {
      this.deleteRightsClear = true
      this.deleteDate.role = role
      this.deleteDate.roleId = role.id
      this.deleteDate.rightId = rightId
    },
    // 根据id删除权限
    async deleteTheRight () {
      const { data: res } = await this.$http.delete(
        'roles/' + this.deleteDate.roleId + '/rights/' + this.deleteDate.rightId
      )
      if (res.meta.status !== 200) return this.$message.error('删除权限失败')

      this.$message.success('删除权限成功')
      this.deleteRightsClear = false
      console.log(res.data)
      // this.rolesList.children = res.data
      this.deleteDate.role.children = res.data
    },
    closeRights () {
      this.$message.info('取消删除')
      this.deleteRightsClear = false
    },
    // 展示显示分配权限对话框
    async showSetRightsDialog (role) {
      this.showSettig = true
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) { return this.$message.error('获取权限列表失败') }
      this.rightsTreeList = res.data
      console.log(this.rightsTreeList)
      this.getLearfKeys(role, this.checkOut)
      this.roleId = role.id
    },
    // 获取已勾选权限的id
    getLearfKeys (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLearfKeys(item, arr))
    },
    // 清空查询到的数组
    clearBox () {
      this.checkOut = []
    },
    // 提交权限勾选结果
    async allotRights () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      console.log(keys)
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(
        'roles/' + this.roleId + '/rights',
        { rids: idStr }
      )
      if (res.meta.status !== 200) { return this.$message.error('更新权限列表失败') }
      this.$message.success('更新权限列表成功')
      this.getRolesList()
      this.showSettig = false
    }
  }
}
</script>

<style scoped>
.el-card {
  width: 80%;
  margin: 0 auto;
}
.el-tag {
  margin: 10px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.inlinebox {
  display: inline;
}
.centerStyle {
  display: flex;
  align-items: center;
}
</style>
