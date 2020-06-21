<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 搜索与添加 -->
      <el-row :gutter="20">
        <el-col :span="5">
          <el-input placeholder="请输入内容" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- table表格区域 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number" width="800px"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status === '0'" type="danger">未付款</el-tag>
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">{{scope.row.create_time | dataFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template>
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="editAdressForm"></el-button>
            <el-button size="mini" type="success" icon="el-icon-location" @click="checkLogForm"></el-button>
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

    <!-- 修改地址对话框 -->
    <el-dialog title="修改地址" :visible.sync="editAdress">
      <el-form label-width="100px">
        <el-form-item label="省/市/区/县">
          <el-input placeholder="请选择"></el-input>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editAdress = false">取 消</el-button>
        <el-button type="primary" @click="editAdress = false">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 查看位置对话框 -->
    <el-dialog title="查看物流" :visible.sync="checkLog"></el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderList: [],
      // 控制修改地址对话框
      editAdress: false,
      // 控制显示物流对话框
      checkLog: false
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    async getOrderList () {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) { return this.$message.error('获取订单数据失败') }
      this.$message.success('获取订单数据成功')
      this.total = res.data.total
      this.orderList = res.data.goods
      console.log(this.orderList)
    },
    // 当页面尺寸发生改变时触发
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    // 页码发生改变时触发
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    // 点击显示修改地址
    editAdressForm () {
      this.editAdress = true
    },
    // 点击显示物流对话框
    checkLogForm () {
      this.checkLog = true
    }
  }
}
</script>

<style scoped>
</style>>
