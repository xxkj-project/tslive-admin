<!--
   日活数据
-->
<template>
  <div class="dayLive">
    <searchForm :formOptions="formOptions" @onSearch="onSearch" />
    <div class="main">
      <lineChart :chartObj="chartObj" :options="chartOptions" />
    </div>
  </div>
</template>

<script>
import searchForm from '@/components/searchForm'
import lineChart from '@/views/adminLog/components/dayLive/lineChart'
import { getDayLive } from '@/api/adminLog'
import tools from '@/utils/tools'
export default {
  name: '',
  data() {
    return {
      searchData: {
        startTime: '',
        endTime: ''
      },
      barWidth: '20%', // 柱状图柱子的宽度
      initTimes: tools.getRecentlyDays(7),
      chartData: {
        chartTitle: '日活统计',
        chartTypeNames: ['活跃人数'],
        xAxisData: []
      },
      seriesData: [],
      yAxisConfig: {
        max: 100,
        interval: 20
      },
      chartObj: {
        chartId: 'dayLiveChart',
        height: 600
      }
    }
  },
  computed: {
    formOptions() {
      let options = [
        {
          label: '时间',
          prop: 'times',
          element: 'el-date-picker',
          initValue: this.initTimes,
          placeholder: '',
          'value-format': 'yyyy-MM-dd'
        }
      ]
      return options
    },

    chartOptions() {
      const { chartTitle, chartTypeNames, xAxisData } = this.chartData
      const options = {
        title: {
          text: chartTitle
        },
        legend: {
          data: chartTypeNames,
          top: 40
        },
        xAxis: [
          // x 坐标系
          {
            type: 'category',
            data: xAxisData,
            axisPointer: {
              // 坐标轴指示器
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          // y 坐标系
          {
            type: 'value',
            name: '人数(个)',
            min: 0,
            nameTextStyle: {
              color: '#5094d5',
              fontSize: 16
            },
            axisLabel: {
              formatter: '{value}'
            },
            ...this.yAxisConfig
          }
        ],
        series: this.seriesData.map((val, index) => {
          return {
            name: chartTypeNames[index],
            type: 'bar',
            data: val
          }
        })
      }
      return options
    }
  },
  components: { searchForm, lineChart },
  created() {
    this.searchData.startTime = this.initTimes[0]
    this.searchData.endTime = this.initTimes[1]
    this.getData()
  },
  mounted() {},
  methods: {
    onSearch(data) {
      // console.log('-search-', data)
      const { times } = data
      if (!times) {
        this.$message({
          message: '请选择时间！',
          type: 'warning'
        })
        return
      }
      this.searchData.startTime = times[0]
      this.searchData.endTime = times[1]
      this.getData()
    },
    getData() {
      const params = { ...this.searchData }
      // console.log('-params-', params)
      getDayLive(params).then(res => {
        // console.log('-res-', res)
        const list = res.data
        if (!list || list.length === 0) {
          // console.log('-no-data-')
          return
        }
        // console.log('-list-', list)
        let xAxisData = []
        let seriesData = []
        list.map(val => {
          xAxisData.push(val.time)
          seriesData.push(val.num)
        })
        this.chartData.xAxisData = xAxisData
        this.seriesData = [seriesData]
        // console.log('-info-data-', this.chartData)
        this.barWidth = this.setBarWidth(list.length)
        let interval = Math.ceil(Math.max(...this.seriesData) / 5)
        this.yAxisConfig.max = interval * 5 // 设置echart图标y轴最大值
        this.yAxisConfig.interval = interval
      })
    },
    // 设置 barWidth
    setBarWidth(len) {
      let barWid = ''
      switch (len) {
        case 1:
          barWid = '20%'
          break
        case 2:
          barWid = '30%'
          break
        case 3:
          barWid = '40%'
          break
        case 4:
          barWid = '50%'
          break
        case 5:
        case 6:
          barWid = '50%'
          break
        default:
          barWid = '70%'
          break
      }
      return barWid
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
.lineChart {
  & > div {
    width: 100%;
    height: 400px;
  }
}
</style>
