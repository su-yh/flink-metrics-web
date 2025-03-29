<template>
  <div class="parent">
    <div id="ts"></div>
  </div>
</template>

<script setup>
import * as echarts from "echarts";
import {onMounted, ref, onUnmounted} from "vue";
import {taskManagerListAll} from "@/api/cpuloadApi"

//保存所有初始化的图表
const chartDom = ref({});
let timer;

onMounted(() => {
  //页面加载出来，有div dom元素才可以
  // drawCpuLoad();
  //初始化图表只需要进行一次
  initChart();
  // 定时任务
  obtainData()
  timer = setInterval(obtainData, 3_000);
});

onUnmounted(() => {
  // 组件卸载时清除定时器，避免内存泄漏
  clearInterval(timer);
});

const initChart = () => {
  let dom = document.getElementById("ts");
  //得到一个chart对象
  chartDom.value = echarts.init(dom);
}

const obtainData = async () => {

  //1、拿到服务器真正的响应； 给服务器发送请求获取
  let metrics = await taskManagerListAll();
  // console.log("metrics: ", metrics)
  if (!Array.isArray(metrics)) {
    console.error('data 不是一个数组');
    return;
  }

  // 1 小时前的时间戳
  const oneHourAgoTimestamp = Date.now() - 30 * 60 * 1000;

  let heapUsedList = [];
  let flinkMemoryManagerUsedList = [];
  let jvmMemoryMetaspaceUsedLib = [];
  let tsMin = Number.MAX_VALUE;
  let tsMax = 0;
  for (let i = 0; i < metrics.length; i++) {
    const metric = metrics[i];
    // 检查每个元素是否为对象且包含 heapUsed 属性
    if (metric !== null) {
      let heapUsedMb = metric.heapUsed / 1024 / 1024;
      let flinkMemoryManagerUsedMb = metric.flinkMemoryManagerUsed / 1024 / 1024;
      let jvmMemoryMetaspaceUsedMb = metric.jvmMemoryMetaspaceUsed / 1024 / 1024;
      if (metric.ts < tsMin) {
        tsMin = metric.ts;
      }
      if (metric.ts > tsMax) {
        tsMax = metric.ts;
      }

      if (metric.ts >= oneHourAgoTimestamp) {
        heapUsedList.push([metric.ts, heapUsedMb])
        // heapUsedList.push([metric.ts, 0])
        flinkMemoryManagerUsedList.push([metric.ts, flinkMemoryManagerUsedMb])
        // flinkMemoryManagerUsedList.push([metric.ts, 0])
        jvmMemoryMetaspaceUsedLib.push([metric.ts, jvmMemoryMetaspaceUsedMb])
        // jvmMemoryMetaspaceUsedLib.push([metric.ts, 0])
      }
    }
  }

  if (tsMin < oneHourAgoTimestamp) {
    tsMin = oneHourAgoTimestamp;
  }

  drawCpuLoad(tsMin, tsMax, heapUsedList, flinkMemoryManagerUsedList, jvmMemoryMetaspaceUsedLib)
}

const drawCpuLoad = (tsMin, tsMax, heapUsedList, flinkMemoryManagerUsedList, jvmMemoryMetaspaceUsedLib) => {
  //得到一个chart对象
  let myChart = chartDom.value
  let option;

//   textStyle. fontSize

  option = {
    title: {text: 'TaskManagerMetrics', textStyle: {fontSize: 14}},
    grid: {left: "70", right: "70", bottom: "30", top: "50"},
    xAxis: {
      show: true,
      type: "time",
      min: tsMin,
      max: tsMax,
      axisLabel: {
        formatter: function (value) {
          // 这里可以根据需求自定义时间格式
          const date = new Date(value);
          return date.getHours() + ":" + date.getMinutes();
        }
      },
      axisTick: {

      }
    },
    yAxis: [{
      show: true,
      type: "value",
      min: 0,
      max: 2000,
      axisTick: {
        length: 10,
        lineStyle: {
          type: 'dashed'
          // ...
        }
      },
      axisLabel: {
        show: true,
        inside: false,
        // margin: 32, // 这里可以让 MB 的显示与轴线有一定的间隔，否则很可能就显示在轴线上了。
        formatter: '{value} MB',
        align: 'right'
        // ...
      }
    },{
      show: true,
      type: "value",
      min: 0,
      max: 2000,
      axisTick: {
        length: 10,
        lineStyle: {
          type: 'dashed'
          // ...
        }
      },
      axisLabel: {
        show: true,
        inside: false,
        margin: 32, // 这里可以让 MB 的显示与轴线有一定的间隔，否则很可能就显示在轴线上了。
        formatter: '{value} MB',
        align: 'center'
        // ...
      }
    },{
      show: true,
      type: "value",
      min: 0,
      max: 2000,
      axisTick: {
        length: 10,
        lineStyle: {
          type: 'dashed'
          // ...
        }
      },
      axisLabel: {
        show: true,
        inside: false,
        margin: 32, // 这里可以让 MB 的显示与轴线有一定的间隔，否则很可能就显示在轴线上了。
        formatter: '{value} MB',
        align: 'center'
        // ...
      }
    }
    ],
    series: [
      {
        data: heapUsedList,
        yAxisIndex: 0,
        type: "line",
        symbol: "none",
        smooth: true
      },
      {
        data: flinkMemoryManagerUsedList,
        yAxisIndex: 1,
        type: "line",
        symbol: "none",
        smooth: true
      },{
        data: jvmMemoryMetaspaceUsedLib,
        yAxisIndex: 1,
        type: "line",
        symbol: "none",
        smooth: true
      }
    ],
  };

  myChart.setOption(option);
};
</script>

<style scoped lang="less">
.parent {

  #ts {
    width: 800px;
    height: 400px;
    border: 1px solid red;
    margin: 0 auto;
  }
}
</style>
