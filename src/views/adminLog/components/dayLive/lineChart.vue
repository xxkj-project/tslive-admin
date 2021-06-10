<!--
  图表组件
-->
<template>
  <div class="chartWrap">
    <div :id="chartObj.chartId"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
import tools from '@/utils/tools'
export default {
  name: '',
  data() {
    return {
      myChart: null
    }
  },
  props: {
    chartObj: {
      type: Object,
      default() {
        return {
          // 图表id
          chartId: 'chartId',
          // 图表高度
          height: 600
        }
      }
    },
    options: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    baseOptions() {
      return {
        // 网格组件，坐标系中绘制网格
        grid: {
          top: 120, // 表格距离容器顶部的距离
          containLabel: true // 坐标系的刻度标签（true:防止标签溢出的场景，false:适用于多个gird进行对其的场景）
        },
        // 标题组件，包含主标题和副标题
        title: {
          left: '50%',
          textAlign: 'center',
          testStyle: {
            fontWeight: 'normal'
          }
        },
        // 提示框组件
        tooltip: {
          trigger: 'axis', // 触发类型(axis常用于柱状图、折线图，item常用于饼状图、散点图)
          axisPointer: {
            // 坐标轴指示器配置项
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        // 工具栏组件
        toolbox: {
          showTitle: false,
          feature: {
            // 各个工具配置项
            dataView: { show: false, readOnly: true }, // 数据视图工具
            // magicType: { show: true, type: ['line', 'bar'] },
            // 动态类型切换
            restore: { show: false } // 配置项还原
          },
          top: 50, // 组件离容器上侧的距离
          right: '7%' // 组件离容器右侧的距离
        }
      }
    },
    chartOptions() {
      return tools.objectMerge(this.options, this.baseOptions)
    }
  },
  components: {},
  watch: {
    options: {
      handler(val) {
        // console.log('-watch-', val)
        this.initCharts(this.chartObj.chartId, this.chartOptions)
      },
      deep: true
    }
  },
  created() {},
  mounted() {},
  methods: {
    initCharts(chartId, options) {
      this.myChart = echarts.init(document.querySelector(`#${chartId}`), 'light')
      this.myChart.showLoading('default', {
        text: '飞速加载中',
        color: '#409eff'
      })
      this.myChart.setOption(options)
      this.myChart.resize({ height: this.chartObj.height }) // 动态设置图表高度
      this.myChart.hideLoading()
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
</style>
