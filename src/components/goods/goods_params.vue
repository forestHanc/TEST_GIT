<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 头部提示文本 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning" show-icon :closable="false"></el-alert>

      <!-- 表单区域 -->
      <el-form>
        <el-form-item label="选择商品分类">
          <div class="block">
            <el-cascader
              v-model="cateChose"
              expand-trigger="hover"
              :options="catsList"
              :props="cateProps"
              @change="handleChange"
            ></el-cascader>
          </div>
        </el-form-item>
      </el-form>

      <!-- Tabs标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态属性" name="many">
          <!-- 添加参数的按钮 -->
          <el-button type="primary" size="mini" :disabled="isBtnDisable" @click="showAddDIalog">添加参数</el-button>
          <!-- 动态数据 -->
          <el-table :data="manyTabData" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染Tag标签 -->
                <el-tag
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="deleteTheTag(i,scope.row)"
                >{{item}}</el-tag>
                <!-- 添加按钮 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attrName"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="showEditData(scope.row.attrName,scope.row.catIds,scope.row.attrId)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="deleteData(scope.row.catId,scope.row.attrId)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加属性的按钮 -->
          <el-button type="primary" size="mini" :disabled="isBtnDisable" @click="showAddDIalog">添加属性</el-button>
          <!-- 静态数据 -->
          <el-table :data="onlyTabData" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染Tag标签 -->
                <el-tag
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="deleteTheTag(i,scope.row)"
                >{{item}}</el-tag>
                <!-- 添加按钮 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attrName"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="showEditData(scope.row.attrName,scope.row.catId,scope.row.attrId)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="deleteData(scope.row.catId,scope.row.attrId)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加动态/静态数据 -->
    <el-dialog :title="'添加'+titleText" :visible.sync="addData" @close="addFormClose">
      <el-form :model="addForm" label-width="100px" ref="addFormRef">
        <el-form-item :label="titleText">
          <el-input v-model="addForm.attrName"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="addData = false">取 消</el-button>
        <el-button type="primary" @click="addTheData">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改动态/静态数据 -->
    <el-dialog :title="'修改'+titleText" :visible.sync="editData">
      <el-form :model="editForm" label-width="100px" ref="editFormRef">
        <el-form-item :label="titleText">
          <el-input v-model="editForm.attrName"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="editData = false">取 消</el-button>
        <el-button type="primary" @click="editTheData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 商品分类列表
      catsList: [],
      // 级联选择框属性
      cateProps: {
        value: 'catId',
        label: 'cat_name',
        children: 'children'
      },
      // 级联选择框选中
      cateChose: [],
      // Tabs标签页默认激活的页码
      activeName: 'many',
      // 存放动态数据
      manyTabData: [],
      // 存放静态属性
      onlyTabData: [],
      // 添加数据对话框
      addData: false,
      // 添加参数的表单数据
      addForm: {
        attrName: ''
      },
      // 修改数据对话框
      editData: false,
      // 添加参数的表单数据
      editForm: {
        attrName: '',
        catId: '',
        attrId: ''
      },
      // 需要编辑的参数
      theAttr_name: ''
    }
  },
  created () {
    this.getCatsList()
  },
  methods: {
    // 获取所有商品分类列表
    async getCatsList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) { return this.$message.error('获取商品分类失败') }
      this.$message.success('获取商品分类成功')
      this.catsList = res.data
    },

    // 级联选择框发生变化时触发
    async handleChange () {
      console.log('hello')
      // 当选择的不是三级分类提示
      if (this.cateChose.length !== 3) {
        this.cateChose = []
        this.manyTabData = []
        this.onlyTabData = []
        return
      }
      // 没有return 成功选中了三级分类
      // console.log('ok')
      // 根据所选择分类的Id和当前所处的面板，获取对应的参数
      const {
        data: res
      } = await this.$http.get(`categories/${this.cateId}/attributes`, {
        params: { sel: this.activeName }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('无法获取参数')
      }
      this.$message.success('成功获取参数')
      // 遍历字符串内用!!逗号!!隔开的字符 并将其转换为数组
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        // 给每一个item一个单独的值
        item.inputVisible = false
        item.inputValue = ''
      })
      console.log(res.data)
      // 当获取的是动态表格的数据
      if (this.activeName === 'many') {
        console.log('动态表格的数据')
        this.manyTabData = res.data
      } else {
        // 获取的是静态数据
        console.log('静态属性的数据')
        this.onlyTabData = res.data
      }
    },
    // 点击表头切换Tabs
    handleTabClick () {
      this.handleChange()
    },
    // 点击添加数据
    showAddDIalog () {
      this.addData = true
    },
    // 监听添加对话框关闭事件
    addFormClose () {
      this.addForm = {}
    },
    // 提交添加的数据到服务器
    addTheData () {
      // 表单预校验
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const {
          data: res
        } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attrName: this.addForm.attrName,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) return this.$message.error('添加失败')
        this.$message.success('添加成功')
        this.addData = false
        this.handleChange()
      })
    },
    // 删除对应参数
    async deleteData (catId, attrId) {
      const { data: res } = await this.$http.delete(
        `categories/${catId}/attributes/${attrId}`
      )
      if (res.meta.status !== 200) return this.$message.error('无法删除')
      this.$message.success('删除成功')
      this.handleChange()
    },
    // 点击打开修改数据
    showEditData (attrName, catId, attrId) {
      this.editData = true
      this.editForm.attrName = attrName
      this.editForm.catId = catId
      this.editForm.attrId = attrId
    },
    // 提交需要修改的数据
    async editTheData () {
      // 表单预校验
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const {
          data: res
        } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attrId}`,
          { attrName: this.editForm.attrName, attr_sel: this.activeName }
        )
        if (res.meta.status !== 200) return this.$message.error('修改失败')
        this.$message.success('修改成功')
        this.editData = false
        this.handleChange()
      })
    },
    // 切换Tag显示状态
    showInput (row) {
      row.inputVisible = true
      // 文本框自动获得焦点
      // $nextTick 当页面重新渲染时触发
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 保存标签的值到服务器
    async saveAttrVals (row) {
      // 发起请求 保存到服务器
      const {
        data: res
      } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attrId}`,
        {
          attrName: row.attrName,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(',')
        }
      )
      if (res.meta.status !== 200) return this.$message.error('添加标签失败')
      this.$message.success('添加标签成功')
    },
    // 添加标签点击回车 触发
    handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        // 输入的字符串为空
        row.inputVisible = false
        row.inputValue = ''
        return
      }
      // 用户输入了真实的内容
      // 将输入的值push到attrName
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttrVals(row)
    },
    // 监听关闭标签
    deleteTheTag (i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    }
  },
  computed: {
    // 按钮是否被禁用 是返回true 否则返回false
    isBtnDisable () {
      if (this.cateChose.length !== 3) {
        return true
      }
      return false
    },
    cateId () {
      if (this.cateChose.length === 3) {
        return this.cateChose[2]
      }
      return null
    },
    titleText () {
      if (this.activeName === 'many') {
        return '动态数据'
      }
      return '静态属性'
    }
  }
}
</script>

<style scoped>
.el-form {
  margin: 20px 0;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>
