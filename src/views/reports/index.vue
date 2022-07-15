<template>
  <div class="data-report">
    <!-- 面包屑 -->
    <Breadcrumb :breadList="breadList"></Breadcrumb>

    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 准备具有宽高的容器 -->
      <div id="main" v-if="echartsShow"></div>

      <el-empty description="暂无数据" v-else></el-empty>
    </el-card>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import { getLineGraph } from '@/api/reports'
const echarts = require('echarts/lib/echarts')
require('echarts/lib/component/title')
require('echarts/lib/component/toolbox')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/grid')
require('echarts/lib/component/legend')
require('echarts/lib/chart/line')
export default {
  name: 'DataReport',
  created () {
    this.getLineGraph()
  },
  mounted () {
  },
  data () {
    return {
      breadList: ['数据统计', '数据报表'], // 面包屑
      lineGraph: {},
      echartsShow: true
    }
  },
  methods: {
    async getLineGraph () {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const { data } = await getLineGraph()
        console.log(data)
        this.lineGraph = data.data
        loading.close()
        this.echartsShow = true
        this.init()
      } catch (err) {
        console.log(err)
        loading.close()
        this.echartsShow = false
      }
    },
    // echarts配置项
    init () {
      const chartDom = document.getElementById('main')
      const myChart = echarts.init(chartDom)

      // 3.配置数据
      const option = {
        title: {
          text: '用户来源'
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
          left: '0',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        legend: {
          data: this.lineGraph.legend.data
        },
        xAxis: [
          {
            boundaryGap: false,
            data: this.lineGraph.xAxis[0].data
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: this.lineGraph.series
      }
      // 4.传入数据
      option && myChart.setOption(option)
    }
  },
  computed: {},
  watch: {},
  filters: {},
  components: {
    Breadcrumb
  }
}
</script>

<style scoped lang='less'>
.data-report {
  .el-card {
    margin-top: 15px;
  }
  #main {
    width: 100vw;
    height: 500px;
  }
}
</style>
