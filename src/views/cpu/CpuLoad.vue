<template>
  <a-space wrap>
    <!-- 16个 叫 cpu-[1~16] -->
    <div
        :id="`ts-${i}`"
        style="width: 800px; height: 800px; border: 1px solid black"
        v-for="i in 1"
    ></div>
  </a-space>
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
  timer = setInterval(getCpuData, 3000);
});

onUnmounted(() => {
  // 组件卸载时清除定时器，避免内存泄漏
  clearInterval(timer);
});

const initChart = () => {
  let dom = document.getElementById("ts-1");
  //得到一个chart对象
  chartDom.value = echarts.init(dom);
}

const cpuAllData = ref([])

const getCpuData = async () => {

  //1、拿到服务器真正的响应； 给服务器发送请求获取
  let data = await taskManagerListAll();
  console.log("resp: ", data)

  if (cpuAllData.value.length > 60) {
    //把最老的一个数据删除，放入最新获取的这个数据
    let arr = cpuAllData.value.slice(-60); //移除了最前一个元素的数组
    arr.push(data)
    cpuAllData.value = arr;
  } else {
    //每次给里面放之前最数组的长度进行一个判断
    cpuAllData.value.push(data[i])
  }

  //这里会 OOM；这个数组最多放 60个？ 超过 60个删除最老的

  drawCpuLoad(cpuAllData.value)

  // await getCpuData();
}

//1、每个图显示CPU名
//2、每个图xy轴不显示
//3、显示为面积图
const drawCpuLoad = (cpuData) => {
  //得到一个chart对象
  let myChart = chartDom.value
  let option;

//   textStyle. fontSize

  option = {
    title: {text: 'TaskManagerMetrics', textStyle: {fontSize: 14}},
    grid: {left: "0", right: "0", bottom: "5", top: "0"},
    xAxis: {
      show: false,
      type: "category"
    },
    yAxis: {
      show: false,
      type: "value",
      min: 0,
      max: 1
    },
    series: [
      {
        data: cpuData,
        type: "line",
        symbol: "none",
        smooth: true,
        areaStyle: {}
      },
    ],
  };

  myChart.setOption(option);
};
</script>

<style scoped></style>
