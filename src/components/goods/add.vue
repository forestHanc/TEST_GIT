<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <el-alert title="添加商品信息" type="info" show-icon center :closable="false"></el-alert>
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" simple>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- 表单区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <!-- 左侧步骤条 -->
        <el-tabs
          :tab-position="tabPosition"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <div class="block">
                <el-cascader
                  expand-trigger="hover"
                  v-model="addForm.goods_cat"
                  :options="cateList"
                  :props="cascaderEdit"
                  clearable
                  @change="handleChange"
                ></el-cascader>
              </div>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单数据 -->
            <el-form-item v-for="item in manyTableData" :key="item.attr_id" :label="item.attr_name">
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <!-- 渲染表单数据 -->
            <el-form-item v-for="item in onlyTableData" :key="item.attr_id" :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              action="http://localhost:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="btnStyle" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 显示预览图片对话框 -->
    <el-dialog title="图片预览" :visible.sync="imgVisible" width="50%">
      <img :src="imgUrl" class="imgStyle" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data () {
    return {
      // 控制steps进度
      activeIndex: '0',
      // 控制tabs方向
      tabPosition: 'left',
      // 添加表单
      addForm: {
        goods_name: '',
        // 商品分类
        goods_cat: [],
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        pics: [],
        // 商品详情描述
        goods_introduce: '',
        // 动态、静态数据绑定
        attrs: []
      },
      // 表单添加规则
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      // 商品分类信息
      cateList: [],
      // 级联选择器的配置
      cascaderEdit: {
        value: 'cat_id',
        label: 'cat_name',
        chiledren: 'children'
      },
      // 动态数据列表
      manyTableData: [],
      // 静态属性列表
      onlyTableData: [],
      // 上传图片附加请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 预览图片的URL地址
      imgUrl: '',
      // 预览图片对话框
      imgVisible: false
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取分类信息
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) { return this.$message.error('获取分类信息失败') }
      this.$message.success('获取分类信息成功')
      this.cateList = res.data
    },
    // 级联选择器发生变化时触发
    handleChange () {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
        this.$message.info('请选择三级分类')
      }
    },
    // tabs切换时触发
    beforeTabLeave (activeName, oldActiveName) {
      if (this.addForm.goods_name === '') {
        this.$message.error('请填写商品名称')
        return false
      }
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择分类')
        return false
      }
    },
    // tab被选中
    async tabClicked () {
      // 访问基本信息
      if (this.activeIndex === '0') {
      }
      // 访问商品参数
      if (this.activeIndex === '1') {
        const {
          data: res
        } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: { sel: 'many' }
        })
        if (res.meta.status !== 200) { return this.$message.error('获取商品参数失败') }
        this.$message.success('获取商品参数成功')

        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
        })
        console.log(res.data)
        this.manyTableData = res.data
      }
      // 访问商品属性
      if (this.activeIndex === '2') {
        const {
          data: res
        } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: { sel: 'only' }
        })
        if (res.meta.status !== 200) { return this.$message.error('获取商品属性失败') }
        this.$message.success('获取商品属性成功')
        this.onlyTableData = res.data
        console.log(this.onlyTableData)
      }
      // 访问商品图片
      if (this.activeIndex === '3') {
      }
      // 访问商品内容
      if (this.activeIndex === '4') {
      }
    },
    // 点击图片显示预览
    handlePreview (file) {
      console.log(file)
      this.imgUrl = file.response.data.url
      this.imgVisible = true
    },
    // 移除图片
    handleRemove (file) {
      const filePath = file.response.data.tmp_path
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      this.addForm.pics.splice(i, 1)
    },
    // 监听图片存储完成返回的数据
    handleSuccess (response) {
      console.log(response)
      const picsInfo = { pics: response.data.tmp_path }
      this.addForm.pics.push(picsInfo)
      console.log(this.addForm)
    },
    // 添加商品
    add () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项')
        }
        // 执行添加按钮
        // 防止与级联选择器冲突 进行深拷贝
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态、静态属性
        // 处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(',')
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        console.log(form)
        // 发起请求添加商品
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败')
        }
        this.$message.success('添加商品成功')
        this.$router.push('/goods')
        console.log(form)
      })
    }
  },
  computed: {
    cateId () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.imgStyle {
  width: 100%;
}
.btnStyle {
  margin-top: 15px;
}
</style>
