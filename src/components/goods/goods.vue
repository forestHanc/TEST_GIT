<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加 -->
      <el-row :gutter="20">
        <el-col :span="5">
          <el-input
            placeholder="请输入内容"
            clearable
            v-model="queryInfo.query"
            @keyup.enter.native="getGoodsList"
            @clear="getGoodsList"
            @change="getGoodsList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddGood">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- table表格区域 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="95px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="140px">
          <template slot-scope="scope">{{scope.row.add_time | dataFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button size="mini" @click="editTheGood(scope.row)">修改</el-button>
            <el-button size="mini" @click="deleteTheGood(scope.row.goodsId)">删除</el-button>
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
        :total="total"
      ></el-pagination>
    </el-card>

    <!--编辑提交修改的数据对话框 -->
    <el-dialog title="修改商品" :visible.sync="editGood">
      <el-form label-width="100px">
        <el-form-item label="商品名称">
          <el-input v-model="rowInfo.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="rowInfo.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="数量">
          <el-input v-model="rowInfo.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="重量">
          <el-input v-model="rowInfo.goods_weight"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editGood = false">取 消</el-button>
        <el-button type="primary" @click="sureEdit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 查询参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 商品列表
      goodsList: [],
      // 总数据条数
      total: 0,
      // 显示修改商品的对话框
      editGood: false,
      // 当前行的信息
      rowInfo: {}
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    // 获取商品列表
    async getGoodsList () {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error('获取失败')
      this.$message.success('获取成功')
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    // 页面尺寸发生改变时触发
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    // 页码发生改变时触发
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    // 点击添加商品按钮跳转到指定页面
    goAddGood () {
      this.$router.push('/goods/add')
    },
    // 删除id对应商品
    async deleteTheGood (goodsId) {
      const { data: res } = await this.$http.delete(`goods/${goodsId}`)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getGoodsList()
    },
    // 显示修改商品对话框
    editTheGood (row) {
      this.editGood = true
      this.rowInfo = row
      console.log(row)
    },
    // 提交修改信息
    async sureEdit () {
      const { data: res } = await this.$http.put(
        `goods/${this.rowInfo.goodsId}`,
        this.rowInfo
      )
      if (res.meta.status !== 201) return this.$message.error('修改商品失败')
      this.$message.succes('修改商品成功')
      this.getGoodsList()
    }
  }
}
</script>
