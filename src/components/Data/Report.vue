<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>Home</el-breadcrumb-item>
      <el-breadcrumb-item>Data</el-breadcrumb-item>
      <el-breadcrumb-item>Data Report</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- prepare DOM for ECharts -->
      <div id="main" style="width: 700px; height: 400px;"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
import _ from 'lodash'

export default {
  data() {
    return {
      // config options
      options: {
        title: {
          text: 'User Source'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  created() {},
  async mounted() {
    // render DOM first, then initialize echarts
    // initialize echarts instance based on DOM
    var myChart = echarts.init(document.getElementById('main'))

    // request data
    var { data: res } = await this.$http.get('data/reports/1')
    console.log(res)
    if (res.meta.status !== 200) {
      return this.$message.error(res.meta.msg)
    }
    var newData = _.merge(res.data, this.options)

    // render charts
    myChart.setOption(newData)
  }
}
</script>

<style lang="less" scoped>
</style>
