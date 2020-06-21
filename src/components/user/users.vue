<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class='el-icon-arrow-right'>
            <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 搜索与添加 -->
            <el-row :gutter='20'>
                <el-col :span='5'>
                    <el-input placeholder="请输入内容" v-model='queryInfo.query' clearable @clear='getUserList' @change="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click='getUserList'></el-button>
                    </el-input></el-col>
                <el-col :span='4'>
                    <el-button type='primary' @click="addUser=true">添加用户</el-button>
                </el-col>
            </el-row>
        </el-card>

        <!-- 表格 -->
        <el-table style="width: 100%" :data='userList' border stripe>
            <el-table-column label="序号" type="index"></el-table-column>
            <el-table-column label='姓名' prop='username'></el-table-column>
            <el-table-column label='邮箱' prop='email'></el-table-column>
            <el-table-column label='电话' prop='mobile'></el-table-column>
            <el-table-column label='角色' prop='role_name'></el-table-column>
            <el-table-column label='状态'>
                <!-- 作用域插槽 -->
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.mg_state" @change='userStateChange(scope.row)'></el-switch>
                </template>
            </el-table-column>

            <el-table-column label='操作' width="200px">
                <template slot-scope="scope">
                    <!-- 修改按钮 -->
                    <el-tooltip effect="dark" content="修改" placement="top" :enterable=false>
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click='editUserInfo(scope.row.id)'></el-button>
                    </el-tooltip>
                    <!-- 删除按钮 -->
                    <el-tooltip effect="dark" content="删除" placement="top" :enterable=false>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click='deleteAUser(scope.row.id)'></el-button>
                    </el-tooltip>
                    <!-- 分配角色按钮 -->
                    <el-tooltip effect="dark" content="分配角色" placement="top" :enterable=false>
                        <el-button type="warning" icon="el-icon-setting" size="mini" @click="settingRole(scope.row)"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"></el-pagination>

        <!-- 添加用户对话框 -->
        <el-dialog title="添加用户" :visible.sync="addUser" width="50%" @close='resetUserForm'>
            <el-form :model='addForm' :rules='addFormRules' ref="addFormRef" label-width="70px">
                <el-form-item label="用户名" prop='username'>
                    <el-input autocomplete="" v-model='addForm.username'></el-input>
                </el-form-item>
                <el-form-item label="密码" prop='password'>
                    <el-input autocomplete="off" v-model='addForm.password'></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop='email'>
                    <el-input autocomplete="off" v-model='addForm.email'>
                        <template slot="append">
                            @qq.com
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="电话" prop='mobile'>
                    <el-input autocomplete="off" v-model='addForm.mobile'></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addUser = false">取 消</el-button>
                <el-button type="primary" @click="addUserForm">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 修改用户信息 -->
        <el-dialog title="修改用户信息" :visible.sync="changeInfo" width="50%" @close='resetEdiotUser'>
            <el-form label-width="70px" :model='serachUser' ref="ediotUserRef">
                <el-form-item label="用户名">
                    <el-input autocomplete="off" :disabled="true" v-model='serachUser.username'></el-input>
                </el-form-item>
                <el-form-item label="电话" prop='mobile'>
                    <el-input autocomplete="off" v-model='serachUser.mobile'></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input autocomplete="off" v-model='serachUser.email'></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="changeInfo = false">取 消</el-button>
                <el-button type="primary" @click="ediotUserInfo">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 删除用户 -->
        <el-dialog title="删除用户" :visible.sync="deleteUser" width="30%">
            <span>警告！即将删除该用户---{{serachUser.username}}</span>
            <div slot="footer" class="dialog-footer">
                <el-button @click="deleteUser = false">取 消</el-button>
                <el-button type="primary" @click="deleteTheUser">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 分配角色 -->
        <el-dialog title="分配角色" :visible.sync="roleSet" width="50%" @close='settingRolesClear'>
            <div>
                <p>当前用户：{{rowInfo.username}}</p>
                <p>当前角色：{{rowInfo.role_name}}</p>
                <p>
                    <el-select v-model="selectRoleId" placeholder="请选择">
                        <el-option
                        v-for="item in roleInfo"
                        :key="item.id"
                        :label="item.roleName"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="roleSet = false">取 消</el-button>
                <el-button type="primary" @click="setTheRole">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
export default {
  data () {
    // // 验证邮箱规则
    // var chackEmail = (rule,value,callbavk) =>{
    //     // 邮箱验证正则表达式
    //     const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
    //     if(regEmail.test(value)) {
    //         //合法邮箱
    //         return callback()
    //     }
    //     callback(new Error('请输入正确的邮箱'))
    // }
    // // 验证手机号规则
    // var checkMobil = (rule,value,callbavk) =>{
    //     const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
    //     if(regMobile.test(value)) {
    //         //合法手机号
    //         return callback()
    //     }
    //     callback(new Error('请输入正确的电话'))
    // }
    return {
      // 获取用户列表对象参数
      queryInfo: {
        query: '',
        // 当前页数
        pagenum: 1,
        pagesize: 10
      },
      userList: [],
      total: 0,
      addUser: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 1, max: 1, message: '请输入3到10个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 1, max: 1, message: '请输入3到10个字符之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { min: 1, max: 1, message: '请输入邮箱号码', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { min: 1, max: 1, message: '请输入正确的电话号码', trigger: 'blur' }
        ]
      },
      changeInfo: false,
      deleteUser: false,
      serachUser: {},
      roleSet: false,
      rowInfo: {},
      roleInfo: [],
      // 已选中的角色Id值
      selectRoleId: ''
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取用户列表失败')
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 监听pagesize改变的事件
    handleSizeChange (newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听页码值改变的时间
    handleCurrentChange (newPage) {
      // console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听switch
    async userStateChange (userinfo) {
      // console.log(userinfo)
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('保存状态成功')
    },
    // 传递表信息给服务器,添加新用户
    addUserForm () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        // 可以发起添加用户的网络请求
        const { data: res } = await this.$http.post('users', this.addForm)

        if (res.meta.status !== 201) {
          return this.$message.error('添加用户失败！')
        }

        this.$message.success('添加用户成功！')
        // 隐藏添加用户的对话框
        this.addUser = false
        // 重新获取用户列表数据
        this.getUserList()
      })
    },
    // 监听对话框关闭事件
    resetUserForm () {
      this.$refs.addFormRef.resetFields()
    },
    resetEdiotUser () {
      this.$refs.ediotUserRef.resetFields()
    },
    // 打开修改用户
    async editUserInfo (id) {
      this.changeInfo = true
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('获取用户数据失败')
      this.serachUser = res.data
    },
    // 修改用户信息并上传服务器
    async ediotUserInfo () {
      console.log(this.serachUser)
      // 可以发起添加用户的网络请求
      const { data: res } = await this.$http.put('users/' + this.serachUser.id, { mobile: this.serachUser.mobile, email: this.serachUser.email })
      if (res.meta.status !== 200) return this.$message.error('获取用户数据失败')
      console.log(res)
      // 关闭修改对话框
      this.changeInfo = false
      // 重载用户列表
      this.getUserList()
    },
    // 打开删除用户
    async deleteAUser (id) {
      this.deleteUser = true
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('获取用户数据失败')
      this.serachUser = res.data
    },
    // 删除用户信息并上传服务器
    async deleteTheUser () {
      console.log('!!!!!!!!!!!!!!!')
      // // 可以发起添加用户的网络请求s
      const { data: res } = await this.$http.delete('users/' + this.serachUser.id)
      if (res.meta.status !== 200) return this.$message.error('获取用户数据失败')
      console.log(res)
      // // 关闭修改对话框
      this.deleteUser = false
      // // 重载用户列表
      this.getUserList()
    },
    // 分配角色对话框
    async settingRole (info) {
      this.roleSet = true

      // 获取所有角色列表
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
      this.roleInfo = res.data

      this.rowInfo = info
    },
    // 提交分配角色结果
    async setTheRole () {
      if (!this.selectRoleId) {
        return this.$message.error('请选择一个角色')
      }

      const { data: res } = await this.$http.put(`users/${this.rowInfo.id}/role`, { rid: this.selectRoleId })
      if (res.meta.status !== 200) return this.$message.error('更新角色失败')

      this.$message.success('更新角色成功')
      this.roleSet = false
      this.getUserList()
    },
    // 清空分配角色对话框
    settingRolesClear () {
      this.selectRoleId = ''
      this.rowInfo = ''
    }
  }
}
</script>

<style scoped>

</style>
