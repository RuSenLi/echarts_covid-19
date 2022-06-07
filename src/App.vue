<template>
  <div class="box">
    <div class="header" v-if="width < 992">
      <p class="header-title">国内疫情</p>
      <div class="header-center">
        <h3>新型冠状病毒肺炎</h3>
        <h2>疫情实时追踪</h2>
        <p>数据来源：国家及各地卫健委每日信息发布</p>
      </div>
    </div>
    <div class="box-left">
      <div class="box-left-crad">
        <section>
          <div>较上日+{{ store.chinaAdd.localConfirmH5 }}</div>
          <div>{{ store.chinaTotal.localConfirm }}</div>
          <div>本土现有确诊</div>
        </section>
        <section>
          <div>较上日+{{ store.chinaAdd.nowConfirm }}</div>
          <div>{{ store.chinaTotal.nowConfirm }}</div>
          <div>现有确诊</div>
        </section>
        <section>
          <div>较上日+{{ store.chinaAdd.confirm }}</div>
          <div>{{ store.chinaTotal.confirm }}</div>
          <div>累计确诊</div>
        </section>
        <section>
          <div>较上日+{{ store.chinaAdd.noInfect }}</div>
          <div>{{ store.chinaTotal.noInfect }}</div>
          <div>无症状感染者</div>
        </section>
        <section>
          <div>较上日+{{ store.chinaAdd.importedCase }}</div>
          <div>{{ store.chinaTotal.importedCase }}</div>
          <div>境外输入</div>
        </section>
        <section>
          <div>较上日+{{ store.chinaAdd.dead }}</div>
          <div>{{ store.chinaTotal.dead }}</div>
          <div>累计死亡</div>
        </section>
      </div>
      <div class="box-pie">
        <p class="title">新增确诊前十城市</p>
        <div class="chartPie-box" style="width: 100%">
          <div class="box-left-pie" style="height: 100%"></div>
        </div>
      </div>
      <div class="box-line" style="width: 100%">
        <div class="box-left-line" style="height: 100%"></div>
      </div>
    </div>
    <div
      id="china"
      class="box-center"
      style="width: 800px; height: 720px"
    ></div>
    <div class="box-right">
      <table class="table" cellspacing="0">
        <thead>
          <tr>
            <th>地区</th>
            <th>新增确诊</th>
            <th>累计确诊</th>
            <th>治愈</th>
            <th>死亡</th>
          </tr>
        </thead>
        <transition-group
          enter-active-class="animate__animated animate__flipInX"
          tag="tbody"
        >
          <tr :key="item.name" v-for="item in store.item">
            <td align="center">{{ item.name }}</td>
            <td align="center">{{ item.today.confirm }}</td>
            <td align="center">{{ item.total.confirm }}</td>
            <td align="center">{{ item.total.heal }}</td>
            <td align="center">{{ item.total.dead }}</td>
          </tr>
        </transition-group>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "./stores";
import { onMounted, ref, onUnmounted } from "vue";
import * as echarts from "echarts"; // 将所有API都导出到一个对象中
import "./assets/china.js"; // 地图
import { geoCoordMap } from "./assets/geoMap"; // 经纬度
import "animate.css";
import { useWindowSize } from "@vueuse/core";
import type { ECharts } from "echarts";

const store = useStore();
const { width } = useWindowSize();

const chartGeo = ref<ECharts>();
const chartPie = ref<ECharts>();
const chartLine = ref<ECharts>();

let timer = 0;
// 调用echart的时候添加防抖
const resize = () => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    chartGeo.value?.setOption(chartGeo.value.getOption());
    chartGeo.value?.resize();
    chartPie.value?.setOption(chartPie.value.getOption());
    chartPie.value?.resize();
    chartLine.value?.setOption(chartLine.value.getOption());
    chartLine.value?.resize();
  }, 100);
};

onMounted(async () => {
  window.addEventListener("resize", resize);
  await store.getList();
  initCharts();
  initPie();
  initLine();
});
// 监听视口，在发生变化的时候调用一下echart
onUnmounted(() => {
  window.removeEventListener("resize", resize);
});

// 地图配置项
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const GeoOptions = (data: any) => {
  return {
    geo: {
      map: "china",
      aspectScale: 0.8,
      layoutCenter: ["50%", "50%"],
      layoutSize: "100%",
      itemStyle: {
        areaColor: {
          type: "linear-gradient",
          x: 0,
          y: 1200,
          x2: 1000,
          y2: 0,
          colorStops: [
            {
              offset: 0,
              color: "#152E6E", // 0% 处的颜色
            },
            {
              offset: 1,
              color: "#0673AD", // 50% 处的颜色
            },
          ],
          global: true, // 缺省为 false
        },
        shadowColor: "#0f5d9d",
        shadowOffsetX: 0,
        shadowOffsetY: 15,
        opacity: 0.5,
      },
      emphasis: {
        areaColor: "#0f5d9d",
      },
      regions: [
        {
          name: "南海诸岛",
          itemStyle: {
            areaColor: "rgba(0, 10, 52, 1)",
            borderColor: "rgba(0, 10, 52, 1)",
            opacity: 0,
            label: {
              show: false,
              color: "#009cc9",
            },
          },
          label: {
            show: false,
            color: "#FFFFFF",
            fontSize: 12,
          },
        },
      ],
    },
    //悬浮提示信息
    tooltip: {
      trigger: "item",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formatter(value: any) {
        return "现有确诊: " + value.data.value[2].toString();
      },
      data: data,
    },
    //分布情况颜色
    visualMap: {
      min: 0,
      max: 1000,
      text: ["1000人以上", "0人"],
      realtime: false,
      calculable: true,
      inRange: {
        color: [
          "rgb(192, 213, 228)",
          "rgb(255,130,140)",
          "rgb(255,120,125)",
          "rgb(255,90,95)",
          "rgb(255,85,90)",
          "rgb(255,80,85)",
          "rgb(250,85,90)",
          "rgb(245,75,85)",
          "rgb(230,69,70)",
          "rgb(240,65,65)",
        ],
        symbolSize: [60, 100],
      },
    },
    series: [
      {
        type: "map",
        map: "china",
        aspectScale: 0.8,
        layoutCenter: ["50%", "50%"],
        layoutSize: "100%",
        // 省份标题
        label: {
          show: true,
          color: "#000",
          fontSize: width.value > 700 ? 16 : 9,
        },
        emphasis: {
          areaColor: "#56b1da",
          label: {
            show: true,
            color: "#fff",
          },
        },
        data: data,
      },
    ],
  };
};

// 地图
const initCharts = () => {
  // 拿到中国的城市数据
  const city = store.list.diseaseh5Shelf.areaTree[0].children;
  // 初始化数据 默认为广东
  store.item = city[9].children;
  const data = city.map((v) => {
    return {
      name: v.name,
      value: geoCoordMap[v.name].concat(v.total.nowConfirm), // concat 连接字符串
      children: v.children,
      selected: false,
    };
  });
  // 默认选中广东
  data[9].selected = true;
  chartGeo.value = echarts.init(
    document.querySelector("#china") as HTMLElement
  );
  // 配置项
  chartGeo.value.setOption(GeoOptions(data));

  // 获取城市统计
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chartGeo.value.on("click", (e: any) => {
    store.item = e.data.children;
  });
};

// 饼图
const initPie = () => {
  chartPie.value = echarts.init(
    document.querySelector(".box-left-pie") as HTMLElement
  );
  chartPie.value.setOption({
    backgroundColor: "#223651",
    tooltip: {
      trigger: "item",
    },
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        layoutSize: "100%",
        itemStyle: {
          borderRadius: 4,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: true,
          fontSize: width.value > 800 && width.value < 992 ? 23 : 12,
          layoutSize: "100%",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: width.value > 800 && width.value < 992 ? 35 : 20,
          },
        },
        data: store.cityDetaill.map((v) => {
          return {
            name: v.city,
            value: v.local_confirm_add,
          };
        }),
      },
    ],
  });
};
// 折线图
const initLine = () => {
  const chart = echarts.init(
    document.querySelector(".box-left-line") as HTMLElement
  );
  chart.setOption({
    backgroundColor: "#223651",
    title: {
      text: "新增确诊前十城市",
      left: "center",
      textStyle: {
        color: "#fff",
        lineHeight: 50,
        fontSize: width.value > 800 && width.value < 992 ? 35 : 18,
      },
    },
    grid: {
      y2: 35,
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: store.cityDetaill.map((v) => v.city),
      axisLine: {
        lineStyle: {
          color: "#fff",
        },
      },
      axisLabel: {
        fontSize: width.value > 800 && width.value < 992 ? 23 : 12,
      },
    },
    yAxis: {
      type: "value",
      axisLine: {
        lineStyle: {
          color: "#fff",
        },
      },
      axisLabel: {
        fontSize: width.value > 800 && width.value < 992 ? 23 : 12,
      },
    },
    lable: {
      show: true,
    },
    series: [
      {
        data: store.cityDetaill.map((v) => v.local_confirm_add),
        type: "line",
        smooth: true,
        itemStyle: {
          normal: { label: { show: true } },
        },
      },
    ],
  });
  chartLine.value = chart;
};
</script>

<style lang="less">
* {
  padding: 0;
  margin: 0;
}
@itemColor: #41b8db;
@itemBg: #223651;
@itemBorder: #212028;
@total-width: 1920px;
html,
body,
#app {
  width: 100vw;
  background-color: #ccc;
}
html {
  font-size: (100vw / @total-width);
}
.box-left-pie {
  height: 100%;
}
.box {
  display: flex;
  justify-content: space-between;
  &-left {
    width: 440rem;
    color: white;
    &-crad {
      display: grid;
      grid-template-columns: auto auto auto; //列 几列就写几个auto
      grid-template-rows: auto auto; //行
      section {
        background: @itemBg;
        border: 1px solid @itemBorder;
        padding: 10rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 17rem;
        div:nth-child(2) {
          color: @itemColor;
          padding: 10rem 0;
          font-size: 20rem;
        }
      }
    }
    .box-pie {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: @itemBg;
      height: 330rem;
      margin-top: 20rem;
      .title {
        font-size: 30rem;
        font-weight: 900;
        padding: 5rem 0;
      }
      .chartPie-box {
        height: 100%;
      }
    }
    .box-line {
      height: 300rem;
      margin-top: 20rem;
    }
  }
  &-center {
    padding: 0 25rem;
  }
  &-right {
    width: 420rem;
    margin-right: 20rem;
    .table {
      color: white;
      background-color: rgba(0, 0, 0, 0.7);
      tr {
        th {
          padding: 5rem;
          white-space: nowrap;
          border: 0.5px solid rgba(127, 125, 125, 0.468);
          font-size: 20rem;
        }
        td {
          padding: 3rem 5rem;
          width: 100%;
          white-space: nowrap;
          border: 0.5px solid rgba(127, 125, 125, 0.468);
          font-size: 20rem;
        }
      }
    }
  }
}

@media (max-width: 992px) {
  * {
    margin-right: 0 !important;
  }
  @width: 95vw;
  @total-minWidth: 992px;
  html {
    font-size: (100vw / @total-minWidth);
  }
  .header {
    background: url(./assets/title.png) 0/100% 100% no-repeat;
    width: @width;
    height: 400rem;
    color: #fff;
    position: relative;
    &-title {
      position: absolute;
      top: 40rem;
      left: 40rem;
      font-size: 35rem;
      font-weight: bold;
    }
    &-center {
      position: absolute;
      left: 40rem;
      bottom: 40rem;
      h3 {
        font-size: 45rem;
        color: rgb(255, 234, 166);
      }
      h2 {
        font-size: 60rem;
      }
      p {
        font-size: 25rem;
      }
    }
  }
  .box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    &-left {
      width: @width !important;
      &-crad {
        width: @width !important;
        section {
          padding: 20rem 0;
          font-size: 35rem;
          div:nth-child(2) {
            padding: 10rem 0;
            font-size: 38rem;
          }
        }
      }
      .box-pie {
        width: @width !important;
        height: 450rem !important;
        .title {
          font-size: 43rem;
          padding: 10rem;
        }
        .chartPie-box {
          width: @width !important;
          height: 400rem !important;
        }
      }
      .box-line {
        width: @width !important;
        height: 450rem !important;
        margin-top: 30rem;
      }
    }
    &-center {
      margin: 0 !important;
      padding: 0 !important;
      width: @width !important;
      height: 75vh !important;
    }
    &-right {
      margin-bottom: 40rem !important;
      width: @width !important;
      th {
        font-size: 37rem !important;
      }
      td {
        font-size: 37rem !important;
      }
    }
  }
}
</style>
