<template>
  <div class="modelOverview">
    <div class="DesignBox">模型概览</div>
    <div style="height: 1px; width: 100%; background-color: #ddd"></div>
    <div class="headerfx">
      <div class="headerBox">
        <div>
          <div class="mTitle">明细表数</div>
          <div class="bigNum">{{ num.scheduleNumber || 0 }}</div>
        </div>
        <img class="mhImg" src="/static/imgs/factTable.png" alt="" />
      </div>
      <div class="headerBox">
        <div>
          <div class="mTitle">汇总表数</div>
          <div class="bigNum">{{ num.summaryNumber || 0 }}</div>
        </div>
        <img class="mhImg" src="/static/imgs/SummarizeTbale.png" alt="" />
      </div>
      <div class="headerBox">
        <div>
          <div class="mTitle">维度表数</div>
          <div class="bigNum">{{ num.dimensionNumber || 0 }}</div>
        </div>
        <img class="mhImg" src="/static/imgs/dimensionTable.png" alt="" />
      </div>

      <div class="headerBox">
        <div>
          <div class="mTitle">指标数</div>
          <div class="bigNum">{{ num.definitionIndexNumber || 0 }}</div>
        </div>
        <img class="mhImg" src="/static/imgs/indicatorsNumber.png" alt="" />
      </div>
    </div>
    <div id="modelView">
      <div class="leftM dashed">
        <div class="mvTitle dashed abs">业务划分</div>
        <div class="mvModel abs" style="top: 50%">
          <img src="/static/icons/businessModule.svg" alt="" />
          <div>业务模块{{ num.planningClassificationNumber }}</div>
          <div>主题域{{ num.planningThemeNumber }}</div>
        </div>
      </div>
      <div class="midM dashed">
        <div class="mvTitle dashed abs">模型设计</div>
        <div class="mvModel abs" style="top: 28%; left: 28%">
          <img src="/static/icons/dimensionTable.svg" alt="" />
          <div>维度表</div>
        </div>
        <div class="mvModel abs" style="top: 72%; left: 28%">
          <img src="/static/icons/factTable.svg" alt="" />
          <div>明细表</div>
        </div>
        <div class="mvModel abs" style="top: 50%; left: 80%">
          <img src="/static/icons/summaryTable.svg" alt="" />
          <div>汇总表</div>
        </div>
      </div>
      <div class="rightM dashed">
        <div class="mvTitle dashed abs">模型设计</div>
        <div class="mvModel mvModelC abs" style="top: 50%; left: 26%">
          <img src="/static/icons/IndicatorsDedinition.svg" alt="" />
          <div>指标定义{{ num.definitionIndexNumber }}</div>
        </div>
        <div class="mvModel mvModelC abs" style="top: 50%; left: 74%">
          <img src="/static/icons/IndicatorThemeTable.svg" alt="" />
          <div>标准{{ num.standardMainNumber }}</div>
        </div>
      </div>
      <div class="Circle abs" style="top: 50%; left: 16%"></div>
      <div class="HorizontalLine" style="top: 50%; left: 16%; width: 7%"></div>
      <div class="VerticalLine abs" style="top: 50%; left: 23%; height: 50%"></div>
      <div class="HorizontalLine" style="top: 25%; left: 23%; width: 3%"></div>
      <div class="triangle" style="top: 25%; left: 26%"></div>
      <div class="HorizontalLine" style="top: 75%; left: 23%; width: 3%"></div>
      <div class="triangle" style="top: 75%; left: 26%"></div>

      <div class="Circle abs" style="top: 75%; left: 39%"></div>
      <div class="HorizontalLine" style="top: 75%; left: 39%; width: 3%"></div>
      <div class="VerticalLine abs" style="top: 50%; left: 42%; height: 50%"></div>
      <div class="Circle abs" style="top: 25%; left: 39%"></div>
      <div class="HorizontalLine" style="top: 25%; left: 39%; width: 3%"></div>
      <div class="HorizontalLine" style="top: 50%; left: 42%; width: 6%"></div>
      <div class="triangle" style="top: 50%; left: 48%"></div>

      <div class="Circle abs" style="top: 50%; left: 61%"></div>
      <div class="HorizontalLine" style="top: 50%; left: 61%; width: 6%"></div>
      <div class="triangle" style="top: 50%; left: 67%"></div>

      <div class="Circle abs" style="top: 50%; left: 80%"></div>
      <div class="HorizontalLine" style="top: 50%; left: 80%; width: 4%"></div>
      <div class="triangle" style="top: 50%; left: 84%"></div>
    </div>
  </div>
</template>

<script setup>
import { ModelLogicalMainController } from '@/api'
import http from '@/core/http'
import useUserStore from '@/store/modules/user'

const userStore = useUserStore()

const num = ref({})
ModelLogicalMainController.statisticsTableTypeNumber(http, {
  projectId: userStore.getProjectId(),
}).then((res) => {
  console.log('res = ', res)
  num.value = res.data
})
</script>

<style lang="scss" scoped>
.modelOverview {
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  padding: 32px;

  .DesignBox {
    font-size: 20px;
    font-weight: bold;
    color: #222222;
    line-height: 24px;
    padding: 16px 0;
  }

  .headerfx {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 24px 0;

    .headerBox {
      // max-width: 318px;
      width: 23.5%;
      height: 140px;
      background: #f4f7fa;
      border-radius: 8px 8px 8px 8px;
      display: flex;
      justify-content: space-around;
      align-items: center;

      .mTitle {
        font-size: 14px;
        font-weight: 400;
        color: #222222;
      }

      .bigNum {
        margin-top: 16px;
        font-size: 40px;
        font-family: Arial-Bold, Arial;
        font-weight: bold;
        color: #222222;
        line-height: 33px;
      }

      .mhImg {
        width: 86px;
        height: 86px;
      }
    }
  }
}

#modelView {
  height: 475px;
  width: 100%;
  margin-top: 30px;
  position: relative;

  .abs {
    position: absolute;
    transform: translate(-50%, -50%);
    top: 0;
    left: 50%;
  }

  .leftM {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 19.6%;
  }

  .midM {
    position: absolute;
    top: 0;
    left: 21%;
    height: 100%;
    width: 41.9%;
  }

  .rightM {
    position: absolute;
    top: 0;
    left: 63.9%;
    height: 100%;
    width: 36.1%;
  }

  .mvModel {
    width: 150px;
    height: 168px;
    background: rgba(50, 70, 210, 0.05);
    border-radius: 8px 8px 8px 8px;
    opacity: 0.7;
    border: 1px solid #3246d2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    font-weight: 400;
    color: #222222;

    img {
      height: 36px;
      width: 36px;
      margin-bottom: 16px;
    }
  }

  .mvModelC {
    background: rgba(21, 172, 79, 0.05);
    border: 1px solid #15ac4f;
  }

  .dashed {
    border: 1px dashed #999999;
  }

  .mvTitle {
    height: 40px;
    width: 118px;
    line-height: 40px;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    color: #222222;
    background-color: #fff;
  }

  .Circle {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    border: 1px solid #999;
    transform: translate(-100%, -50%);
    position: absolute;
  }

  .HorizontalLine {
    position: absolute;
    height: 1px;
    background-color: #999;
  }

  .VerticalLine {
    position: absolute;
    width: 1px;
    background-color: #999;
  }

  .triangle {
    width: 0;
    height: 0;
    position: absolute;
  }

  .triangle::before {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    width: 0;
    height: 0;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-bottom: 7px solid #999;
    transform: rotate(90deg);
  }
}
</style>
