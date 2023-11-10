<template>
  <div class="dashboard">
    <div style="width: 76%; margin: auto">
      <div style="height: 50px"></div>
      <div>
        <div class="dataTitle">驭数轻云数据平台</div>
        <div class="dataTitle">掌控数据、轻盈如云，助力企业数字化转型！</div>
        <div class="dataLitleTitle">欢迎登录，请选择您要进入的模块～</div>
      </div>

      <div id="dataModuleBox">
        <div class="dataModule" @click.stop="router.push({ name: 'datasource' })">
          <div class="dataModuleImgBox">
            <img src="/static/imgs/dataResources.svg" alt="" />
          </div>
          <div class="dataModuleTitle">数据资源</div>
          <div class="dataModuleDescription max-line2">存算引擎配置、项目管理、成员管理、 数据源管理</div>
        </div>
        <div class="dataModule" @click.stop="router.push({ name: 'data-integration' })">
          <div class="dataModuleImgBox">
            <img src="/static/imgs/dataIntegration.svg" alt="" />
          </div>
          <div class="dataModuleTitle">数据蓝图</div>
          <div class="dataModuleDescription max-line2">数据规划、数据分层、数据模型、标准规划、指标管理、维度管理</div>
        </div>
        <div class="dataModule" @click.stop="router.push({ name: 'dataDevelopment' })">
          <div class="dataModuleImgBox">
            <img src="/static/imgs/console.svg" alt="" />
          </div>
          <div class="dataModuleTitle">数据开发</div>
          <div class="dataModuleDescription max-line2">自助开发、离线开发、调度任务</div>
        </div>
        <div class="dataModule" @click.stop="router.push({ name: 'system-setting' })">
          <div class="dataModuleImgBox">
            <img src="/static/imgs/systemManagement.svg" alt="" />
          </div>
          <div class="dataModuleTitle">系统管理</div>
          <div class="dataModuleDescription max-line2">引擎管理、角色权限配置、系统参数配置等</div>
        </div>
        <div class="dataModule NotOpened">
          <div class="tips">未开通</div>
          <div class="dataModuleImgBox">
            <img src="/static/imgs/dataDiscovery.svg" alt="" />
          </div>
          <div class="dataModuleTitle">数据发现</div>
          <div class="dataModuleDescription max-line2">发现公共和共享数据集</div>
        </div>
        <div class="dataModule NotOpened">
          <div class="tips">未开通</div>
          <div class="dataModuleImgBox">
            <img src="/static/imgs/dataServices.svg" alt="" />
          </div>
          <div class="dataModuleTitle">数据服务</div>
          <div class="dataModuleDescription max-line2">API设计和发布，事件通知、SDK 和文档</div>
        </div>
        <div class="dataModule NotOpened">
          <div class="tips">未开通</div>
          <div class="dataModuleImgBox">
            <img src="/static/imgs/dataFactory.svg" alt="" />
          </div>
          <div class="dataModuleTitle">数据工厂</div>
          <div class="dataModuleDescription max-line2">集成开发环境、pipeline、离线引擎，流式引擎</div>
        </div>
        <div class="dataModule NotOpened">
          <div class="tips">未开通</div>
          <div class="dataModuleImgBox">
            <img src="/static/imgs/dataVisualization.svg" alt="" />
          </div>
          <div class="dataModuleTitle">数据可视化</div>
          <div class="dataModuleDescription max-line2">融合设计器、BI引擎集成、可视化组件模版</div>
        </div>
        <div class="dataModule NotOpened">
          <div class="tips">未开通</div>
          <div class="dataModuleImgBox">
            <img src="/static/imgs/dataOperation.svg" alt="" />
          </div>
          <div class="dataModuleTitle">数据运营</div>
          <div class="dataModuleDescription max-line2">运营大屏、任务调度和监控，数据安全、数据质量</div>
        </div>
        <div class="dataModule NotOpened">
          <div class="tips">未开通</div>

          <div class="dataModuleImgBox">
            <img src="/static/imgs/aiExploration.svg" alt="" />
          </div>
          <div class="dataModuleTitle">AI探索</div>
          <div class="dataModuleDescription max-line2">AI探索，点亮智慧未来，开启无限可能之旅！</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<style lang="scss" scoped>
.dashboard {
  position: relative;
  height: calc(100vh - 64px);
  width: 100%;
  overflow: auto;
  background-color: #f5f6f9;
  background-image: url('/static/imgs/dashboard-bg.jpg');
  background-size: 100% auto;
  background-repeat: no-repeat;
}

#dataModuleBox {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 16px;

  .dataModule {
    padding: 24px;
    min-width: 240px;
    height: 200px;
    background: #ffffff;
    border-radius: 4px 4px 4px 4px;
    opacity: 1;
    position: relative;

    .tips {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 56px;
      height: 21px;
      border-radius: 11px 11px 11px 11px;
      opacity: 1;
      border: 1px solid #3246d2;
      font-size: 12px;
      font-weight: 400;
      color: #3246d2;
      line-height: 21px;
      text-align: center;
    }
  }

  .NotOpened {
    opacity: 0.5;
  }

  .dataModule:hover {
    box-shadow: 0px 2px 16px 1px rgba(50, 70, 210, 0.2);
  }

  .NotOpened:hover {
    box-shadow: 0px 0px 0px 0px;
  }

  .dataModuleImgBox {
    width: 64px;
    height: 64px;
  }

  .dataModuleTitle {
    margin-top: 16px;
    margin-bottom: 8px;
    font-size: 20px;
    font-weight: 600;
    color: #000000;
  }

  .dataModuleDescription {
    font-size: 16px;
    font-weight: 400;
    color: #999999;
    line-height: 20px;
  }
}

.dataTitle {
  font-size: 32px;
  font-weight: 600;
  color: #000000;
  line-height: 54px;
}

.dataLitleTitle {
  font-size: 16px;
  font-weight: 400;
  color: #666666;
  line-height: 0px;
  margin: 16px 0 32px 0;
}
</style>
