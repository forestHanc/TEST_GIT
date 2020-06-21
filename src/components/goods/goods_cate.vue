<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-alert title="小提示:点击Tag标签即可更改分类名称" type="success"></el-alert>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加 -->
      <el-row>
        <el-col :span="4">
          <el-button type="primary" @click="showAddFunction">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table
        style="width: 100%"
        :data="catesList"
        border
        stripe
        :default-sort="{prop: 'cat_level', order: 'ordering'}"
      >
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1,i1) in scope.row.children"
              :key="item1.id"
              :class="['bdbottom', i1 === 0 ? 'bdtop':'','centerStyle']"
            >
              <!-- 二级权限区域 -->
              <el-col :span="5">
                <el-tag
                  type="success"
                  closable
                  @close="deleteCat(item1.catId)"
                  @click="editCatTagName(item1.cat_catIdid)"
                >{{item1.cat_name}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 三级权限区域 -->
              <el-col :span="19">
                <el-tag
                  type="info"
                  v-for="item2 in item1.children"
                  :key="item2.id"
                  closable
                  @close="deleteCat(item2.catId)"
                  @click="editCatTagName(item2.catId)"
                >{{item2.cat_name}}</el-tag>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column prop="cat_name" label="分类名称"></el-table-column>

        <el-table-column prop="cat_name" label="是否有效">
          <template slot-scope="scope">
            <el-tag type="info" v-if="scope.row.cat_deleted === false ">无效</el-tag>
            <el-tag v-if="scope.row.cat_deleted === true ">有效</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="cat_name" label="排序">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag type="success" v-if="scope.row.cat_level === 1">二级</el-tag>
            <el-tag type="info" v-if="scope.row.cat_level === 2">三级</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="cat_name" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="changeTheNameForm(scope.row.catId)">修改</el-button>
            <el-button type="danger" @click="deleteCat(scope.row.catId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCat" @close="clearForm">
      <el-form :model="addCatForm" label-width="80px" ref="addFormRef">
        <el-form-item label="分类名称">
          <el-input v-model="addCatForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="选择父级">
          <div class="block">
            <el-cascader
              expand-trigger="hover"
              v-model="cascaderValue"
              :options="parentCat"
              :props="cascaderEdit"
              clearable
              @change="addFormChange"
            ></el-cascader>
          </div>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="addCat = false">取 消</el-button>
        <el-button type="primary" @click="addForm">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑分类对话框 -->
    <el-dialog title="编辑分类" :visible.sync="editCat" @close="editCatFormClose">
      <el-form label-width="100px">
        <el-form-item label="原分类名称">
          <el-input v-model="editCatFormB.cat_name" readonly></el-input>
        </el-form-item>
        <el-form-item label="更改为">
          <el-input v-model="editCatFormCat_name"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="editCat = false">取 消</el-button>
        <el-button type="primary" @click="changeTheName">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 商品分类总数据
      catesList: [],
      addCat: false,
      editCat: false,
      addCatForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      editCatFormB: {},
      editCatFormCat_name: '',
      parentCat: [],
      cascaderEdit: {
        value: 'catId',
        label: 'cat_name',
        chiledren: 'children'
      },
      cascaderValue: [],
      cat_idW: ''
    }
  },
  created () {
    this.getCates()
  },
  methods: {
    // 获取商品分类
    async getCates () {
      const { data: res } = await this.$http.get('categories')
      console.log(res.data)
      this.catesList = res.data
    },
    async deleteCat (catId) {
      console.log(catId)
      const { data: res } = await this.$http.delete(`categories/${catId}`)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getCates()
    },
    async showAddFunction () {
      this.addCat = true
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) return this.$message.error('获取列表失败')
      this.parentCat = res.data
    },
    // 当级联选择器发生变化触发
    addFormChange () {
      if (this.cascaderValue.length > 0) {
        // 父级分类的Id
        this.addCatForm.cat_pid = this.cascaderValue[
          this.cascaderValue.length - 1
        ]
        this.addCatForm.cat_level = this.cascaderValue.length
        console.log(this.catesList)
      } else {
        // 父级分类的Id
        this.addCatForm.cat_pid = 0
        this.addCatForm.cat_level = 0
      }
    },
    // 关闭时清空
    clearForm () {
      this.$refs.addFormRef.resetFields()
      this.addCatForm.cat_name = ''
      this.addCatForm.cat_pid = 0
      this.addCatForm.cat_level = 0
      this.cascaderValue = []
    },
    addForm () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'categories',
          this.addCatForm
        )
        if (res.meta.status !== 201) return this.$message.error('添加失败')
        this.$message.success('添加成功')
        this.getCates()
        this.addCat = false
      })
    },
    // 打开修改指定分类
    async changeTheNameForm (catId) {
      this.editCat = true
      this.cat_idW = catId
      const { data: res } = await this.$http.get(`categories/${catId}`)
      this.$message.success('获取成功')
      this.editCatFormB = res.data
    },
    // 关闭修改指定分类
    editCatFormClose () {
      this.editCatFormB.cat_name = ''
      this.editCatFormCat_name = ''
    },
    // 修改指定分类
    async changeTheName () {
      const { data: res } = await this.$http.put(`categories/${this.cat_idW}`, {
        cat_name: this.editCatFormCat_name
      })
      if (res.meta.status !== 200) return this.$message.error('修改分类失败')
      this.$message.success('修改分类成功')
      this.editCat = false
      this.getCates()
    },
    // 修改标签名字
    async editCatTagName (catId) {
      this.editCat = true
      this.cat_idW = catId
      const { data: res } = await this.$http.get(`categories/${catId}`)
      this.$message.success('获取成功')
      this.editCatFormB = res.data
    }
  }
}
</script>
<style scoped>
.el-tag {
  margin: 10px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.centerStyle {
  display: flex;
  align-items: center;
}
.el-cascader {
  width: 100%;
}
i {
  height: 18px;
  line-height: 18px;
}
</style>
