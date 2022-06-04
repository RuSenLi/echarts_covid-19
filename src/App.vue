<template>
  <div class="box">
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
        <div class="box-left-pie"></div>
      </div>
      <div class="box-left-line"></div>
    </div>
    <div id="china" class="box-center"></div>
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
import type { Children } from "./stores/type";
import { useStore } from "./stores";
import { onMounted } from "vue";
import * as echarts from "echarts"; // 将所有API都导出到一个对象中
import "./assets/china.js"; // 地图
import { geoCoordMap } from "./assets/geoMap"; // 经纬度
import "animate.css";
interface data {
  name: string;
  value: string;
  children: object;
  selected?: boolean;
}
const store = useStore();
onMounted(async () => {
  await store.getList();
  // ecahrts 要在 onMunted 里调用，但是不应该在里面写逻辑，可以直接调用方法
  initCharts();
  initPie();
  initLine();
});

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
  data[9].selected = true;

  const charts = echarts.init(document.querySelector("#china") as HTMLElement);
  charts.resize({
    width: 800,
    height: 720,
  });
  // 配置项
  charts.setOption({
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
    series: [
      {
        type: "map",
        map: "china",
        aspectScale: 0.8,
        layoutCenter: ["50%", "50%"],
        layoutSize: "100%",
        zoom: 1,
        scaleLimit: {
          min: 1,
          max: 2,
        },
        label: {
          show: true,
          color: "#FFFFFF",
          fontSize: 16,
        },
        itemStyle: {
          areaColor: "#0c3653",
          borderColor: "#1cccff",
          borderWidth: 1.8,
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
  });

  // 获取城市统计
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  charts.on("click", (e: any) => {
    store.item = e.data.children;
  });
};
// 饼图
const initPie = () => {
  const charts = echarts.init(
    document.querySelector(".box-left-pie") as HTMLElement
  );
  charts.resize({
    width: 350,
    height: 230,
  });
  charts.setOption({
    backgroundColor: "#223651",
    tooltip: {
      trigger: "item",
    },
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        itemStyle: {
          borderRadius: 4,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: true,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: "15",
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
  const charts = echarts.init(
    document.querySelector(".box-left-line") as HTMLElement
  );
  charts.resize({
    width: 350,
    height: 185,
  });
  charts.setOption({
    title: {
      text: "新增确诊前十城市",
      left: "center",
      textStyle: {
        color: "#fff",
        lineHeight: 50,
      },
    },
    grid: {
      y2: 35,
    },
    backgroundColor: "#223651",
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
    },
    yAxis: {
      type: "value",
    },
    lable: {
      show: true,
    },
    series: [
      {
        data: store.cityDetaill.map((v) => v.local_confirm_add),
        type: "line",
        smooth: true,
      },
    ],
  });
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
html,
body,
#app {
  background-color: #ccc;
  background-size: cover;
}
.box {
  display: flex;
  height: 100%;
  &-left {
    width: 350px;
    color: white;
    .box-pie {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: @itemBg;
      width: 350px;
      height: 280px;
      margin-top: 15px;
      .title {
        font-size: 18px;
        font-weight: 900;
        padding: 3px 0;
      }
    }
    &-line {
      margin-top: 15px;
    }

    &-crad {
      display: grid;
      grid-template-columns: auto auto auto; //列 几列就写几个auto
      grid-template-rows: auto auto; //行
      section {
        background: @itemBg;
        border: 1px solid @itemBorder;
        padding: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 14px;
        div:nth-child(2) {
          color: @itemColor;
          padding: 10px 0;
          font-size: 20px;
        }
      }
    }
  }
  &-right {
    width: 380px;
    .table {
      width: 100%;
      color: white;
      background-color: rgba(0, 0, 0, 0.7);
      tr {
        th {
          padding: 5px;
          white-space: nowrap;
          border: 0.5px solid rgba(127, 125, 125, 0.468);
        }
        td {
          padding: 3px 5px;
          width: 100%;
          white-space: nowrap;
          border: 0.5px solid rgba(127, 125, 125, 0.468);
        }
      }
    }
  }
}
</style>
