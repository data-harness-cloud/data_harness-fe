import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/layout/index.vue'

export const constantRoutes = [
  {
    path: '/',
    redirect: {
      name: 'dashboard-index',
    },
    hidden: true,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    meta: {
      title: '控制台',
    },
    hidden: true,
    redirect: {
      name: 'dashboard-index',
    },
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'dashboard-index',
        component: () => import('@/views/dashboard/index.vue'),
      },
    ],
  },
  {
    path: '/datasource',
    name: 'datasource',
    redirect: {
      name: 'project-manage',
    },
    meta: {
      title: '数据资源',
      svgIcon: 'dataResources',
    },
    component: Layout,
    children: [
      {
        path: 'project-engine-manage',
        name: 'project-engine-manage',
        component: () => import('@/views/datasource/project-engine-manage/index.vue'),
        meta: {
          title: '存算引擎配置',
          split: '数据资源',
          svgIcon: 'm1_4',
        },
      },
      {
        path: 'project-manage',
        name: 'project-manage',
        component: () => import('@/views/datasource/project-manage/index.vue'),
        meta: {
          title: '项目管理',
          svgIcon: 'm1_1',
        },
      },
      {
        path: 'member-manage',
        name: 'member-manage',
        component: () => import('@/views/datasource/member-manage/index.vue'),
        meta: {
          title: '成员管理',
          svgIcon: 'm1_2',
        },
      },
      {
        path: 'project-data-resource',
        name: 'project-data-resource',
        component: () => import('@/views/datasource/project-data-resource/index.vue'),
        meta: {
          title: '数据源管理',
          svgIcon: 'm1_3',
        },
      },
      {
        path: 'remote-host',
        name: 'remote-host',
        component: () => import('@/views/datasource/remote-host/index.vue'),
        meta: {
          title: '远程主机管理',
          svgIcon: 'm1_11',
        },
      },
    ],
  },
  {
    path: '/data-integration',
    name: 'data-integration',
    redirect: { name: 'data-plan' },
    meta: {
      title: '数据蓝图',
      svgIcon: 'dataIntegration',
    },
    component: Layout,
    children: [
      {
        path: 'data-plan',
        name: 'data-plan',
        component: () => import('@/views/data-integration/data-plan/warehousePainting.vue'),
        meta: {
          title: '数据规划',
          split: '数据蓝图',
          svgIcon: 'm1_5',
        },
      },
      {
        path: 'data-layer',
        name: 'data-layer',
        component: () => import('@/views/data-integration/data-layering/index.vue'),
        meta: {
          title: '数据分层',
          svgIcon: 'm1_6',
        },
      },

      {
        path: 'data-model',
        name: 'data-model',
        component: () => import('@/views/other/router-view/index.vue'),
        meta: {
          title: '数据模型',
          svgIcon: 'm2_4',
        },
        children: [
          {
            path: 'model-overview',
            name: 'model-overview',
            component: () => import('@/views/data-integration/data-model/model-overview/index.vue'),
            meta: {
              title: '模型概览',
            },
          },
          {
            path: 'model-design',
            name: 'model-design',
            component: () => import('@/views/data-integration/data-model/model-design/index.vue'),
            meta: {
              title: '模型设计',
            },
          },
        ],
      },

      {
        path: 'standard-plan',
        name: 'standard-plan',
        component: () => import('@/views/other/router-view/index.vue'),
        meta: {
          title: '标准规划',
          svgIcon: 'm2_3',
        },
        children: [
          {
            path: 'standard-overview',
            name: 'standard-overview',
            component: () => import('@/views/data-integration/standard-plan/standard-overview/index.vue'),
            meta: {
              title: '标准概览',

              hidden: true,
            },
          },
          {
            path: 'standard-manage',
            name: 'standard-manage',
            component: () => import('@/views/data-integration/standard-plan/standard-manage/index.vue'),
            meta: {
              title: '标准管理',
            },
          },
        ],
      },

      {
        path: 'index-manage',
        name: 'index-manage',
        component: () => import('@/views/data-integration/index-manage/index.vue'),
        meta: {
          title: '指标管理',
          svgIcon: 'm2_2',
          hidden: true,
        },
      },
      {
        path: 'dimension-manage',
        name: 'dimension-manage',
        component: () => import('@/views/data-integration/dimension-manage/index.vue'),
        meta: {
          title: '维度管理',
          svgIcon: 'm2_1',
          hidden: true,
        },
      },
    ],
  },
  {
    path: '/dataDevelopment',
    name: 'dataDevelopment',
    redirect: { name: 'selfDevelopment' },
    meta: {
      title: '数据开发',
      svgIcon: 'console',
    },
    component: Layout,
    children: [
      {
        path: 'selfDevelopment',
        name: 'selfDevelopment',
        component: () => import('@/views/dataDevelopment/selfDevelopment/index.vue'),
        meta: {
          title: '自助开发',
          split: '数据蓝图',
          svgIcon: 'm3_1',
        },
      },
      {
        path: 'OfflineDevelopment',
        name: 'OfflineDevelopment',
        component: () => import('@/views/dataDevelopment/OfflineDevelopment/index.vue'),
        meta: {
          title: '离线开发',
          svgIcon: 'm3_2',
        },
      },
      {
        path: 'taskList',
        name: 'taskList',
        component: () => import('@/views/dataDevelopment/taskList/index.vue'),
        meta: {
          title: '任务列表',
          svgIcon: 'm3_3',
        },
      },
    ],
  },
  {
    path: '/system-setting',
    redirect: {
      name: 'sys-user',
    },
    meta: { title: '系统管理', svgIcon: 'systemManagement' },
    component: Layout,
    name: 'system-setting',
    children: [
      {
        path: 'sys-user',
        component: () => import('@/views/system-setting/sys-user/index.vue'),
        name: 'sys-user',
        meta: { title: '用户管理', split: '系统管理', svgIcon: 'm4_1' },
      },
      {
        path: 'sys-dept',
        component: () => import('@/views/system-setting/sys-dept/index.vue'),
        name: 'sys-dept',
        meta: { title: '部门管理', svgIcon: 'm4_2' },
      },
      {
        path: 'sys-dept-post',
        component: () => import('@/views/system-setting/sys-dept-post/index.vue'),
        name: 'sys-dept-post',
        meta: { title: '部门岗位管理' },
        hidden: true,
      },
      {
        path: 'sys-post',
        component: () => import('@/views/system-setting/sys-post/index.vue'),
        name: 'sys-post',
        meta: { title: '岗位管理', svgIcon: 'm4_6' },
      },
      {
        path: 'sys-role',
        component: () => import('@/views/system-setting/sys-role/index.vue'),
        name: 'sys-role',
        meta: { title: '角色管理', svgIcon: 'm4_3' },
      },
      {
        path: 'sys-menu',
        component: () => import('@/views/system-setting/sys-menu/index.vue'),
        name: 'sys-menu',
        meta: { title: '菜单管理', svgIcon: 'm4_5' },
      },
      {
        path: 'business-dict',
        component: () => import('@/views/system-setting/business-dict/index.vue'),
        name: 'business-dict',
        meta: { title: '字典管理', svgIcon: 'm4_4' },
      },
    ],
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('@/views/other/test/index.vue'),
    hidden: true,
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/other/login/index.vue'),
    hidden: true,
  },
]

export const routeObj = {}
function redirect(routes) {
  routes.forEach((route) => {
    routeObj[route.name] = route
    if (route.children) {
      redirect(route.children)
    }
  })
}
redirect(constantRoutes)

const router = createRouter({
  history: createWebHashHistory(), // hash模式：createWebHashHistory，history模式：createWebHistory
  routes: constantRoutes,
})

export default router
