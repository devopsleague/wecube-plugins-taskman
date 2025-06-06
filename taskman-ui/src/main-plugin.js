import 'regenerator-runtime/runtime'
import router from './router-plugin'
import routerP from './router-plugin-p'
import './styles/index.less'
// import './locale/i18n'
import zhCN from '@/locale/i18n/zh-CN.json'
import enUS from '@/locale/i18n/en-US.json'
import { ValidationProvider } from 'vee-validate'
import './vee-validate-local-config'
import Dashboard from '@/pages/workbench/index.vue'

window.component('ValidationProvider', ValidationProvider)
window.addHomepageComponent &&
  window.addHomepageComponent({
    code: 'TASK_WORKBENCH',
    name: () => {
      return window.vm.$t('tw_workbench')
    },
    component: Dashboard
  })

window.locale('zh-CN', zhCN)
window.locale('en-US', enUS)
const implicitRoute = {
  '/taskman/template-mgmt': {
    parentBreadcrumb: { 'zh-CN': '任务', 'en-US': 'Tasks' },
    childBreadcrumb: { 'zh-CN': '模板', 'en-US': 'Template' }
  },
  '/taskman/template-group': {
    parentBreadcrumb: { 'zh-CN': '任务', 'en-US': 'Tasks' },
    childBreadcrumb: { 'zh-CN': '模板组', 'en-US': 'Template Group' }
  },
  templateManagementIndex: {
    parentBreadcrumb: { 'zh-CN': '任务', 'en-US': 'Tasks' },
    childBreadcrumb: { 'zh-CN': '模板管理', 'en-US': 'Template Management' }
  },
  '/taskman/request-mgmt': {
    parentBreadcrumb: { 'zh-CN': '任务', 'en-US': 'Tasks' },
    childBreadcrumb: { 'zh-CN': '请求', 'en-US': 'Request' }
  },
  '/taskman/task-mgmt': {
    parentBreadcrumb: { 'zh-CN': '任务', 'en-US': 'Tasks' },
    childBreadcrumb: { 'zh-CN': '任务', 'en-US': 'Task' }
  },
  taskMgmtIndex: {
    parentBreadcrumb: { 'zh-CN': '任务', 'en-US': 'Tasks' },
    childBreadcrumb: { 'zh-CN': '任务管理', 'en-US': 'Task Management' }
  },
  requestManagementIndex: {
    parentBreadcrumb: { 'zh-CN': '任务', 'en-US': 'Tasks' },
    childBreadcrumb: { 'zh-CN': '请求管理', 'en-US': 'Request Management' }
  },
  requestCheck: {
    parentBreadcrumb: { 'zh-CN': '任务', 'en-US': 'Tasks' },
    childBreadcrumb: { 'zh-CN': '请求管理', 'en-US': 'Request Management' }
  },
  'taskman/workbench/dashboard': {
    parentBreadcrumb: { 'zh-CN': '任务', 'en-US': 'Tasks' },
    childBreadcrumb: { 'zh-CN': '工作台', 'en-US': 'Dashboard' }
  },
  'taskman/workbench/template': {
    parentBreadcrumb: { 'zh-CN': '任务', 'en-US': 'Tasks' },
    childBreadcrumb: { 'zh-CN': '模板选择', 'en-US': 'Template selection' }
  },
  'taskman/workbench/createPublish': {
    parentBreadcrumb: { 'zh-CN': '任务', 'en-US': 'Tasks' },
    childBreadcrumb: { 'zh-CN': '新建发布', 'en-US': 'New Publish' }
  },
  'taskman/workbench/detailPublish': {
    parentBreadcrumb: { 'zh-CN': '任务', 'en-US': 'Tasks' },
    childBreadcrumb: { 'zh-CN': '发布详情', 'en-US': 'Publish Detail' }
  },
  'taskman/workbench/publishHistory': {
    parentBreadcrumb: { 'zh-CN': '任务', 'en-US': 'Tasks' },
    childBreadcrumb: { 'zh-CN': '历史(本组)', 'en-US': 'History(Group)' }
  },
  'taskman/workbench/createRequest': {
    parentBreadcrumb: { 'zh-CN': '任务', 'en-US': 'Tasks' },
    childBreadcrumb: { 'zh-CN': '新建请求', 'en-US': 'New Request' }
  },
  'taskman/workbench/detailRequest': {
    parentBreadcrumb: { 'zh-CN': '任务', 'en-US': 'Tasks' },
    childBreadcrumb: { 'zh-CN': '请求详情', 'en-US': 'Request Detail' }
  },
  'taskman/workbench/requestHistory': {
    parentBreadcrumb: { 'zh-CN': '任务', 'en-US': 'Tasks' },
    childBreadcrumb: { 'zh-CN': '历史(本组)', 'en-US': 'History(Group)' }
  },
  'taskman/workbench/createProblem': {
    parentBreadcrumb: { 'zh-CN': '任务', 'en-US': 'Tasks' },
    childBreadcrumb: { 'zh-CN': '新建问题', 'en-US': 'New Problem' }
  },
  'taskman/workbench/detailProblem': {
    parentBreadcrumb: { 'zh-CN': '任务', 'en-US': 'Tasks' },
    childBreadcrumb: { 'zh-CN': '问题详情', 'en-US': 'Problem Detail' }
  },
  'taskman/workbench/problemHistory': {
    parentBreadcrumb: { 'zh-CN': '任务', 'en-US': 'Tasks' },
    childBreadcrumb: { 'zh-CN': '历史(本组)', 'en-US': 'History(Group)' }
  },
  'taskman/workbench/createEvent': {
    parentBreadcrumb: { 'zh-CN': '任务', 'en-US': 'Tasks' },
    childBreadcrumb: { 'zh-CN': '新建事件', 'en-US': 'New Event' }
  },
  'taskman/workbench/detailEvent': {
    parentBreadcrumb: { 'zh-CN': '任务', 'en-US': 'Tasks' },
    childBreadcrumb: { 'zh-CN': '事件详情', 'en-US': 'Event Detail' }
  },
  'taskman/workbench/eventHistory': {
    parentBreadcrumb: { 'zh-CN': '任务', 'en-US': 'Tasks' },
    childBreadcrumb: { 'zh-CN': '历史(本组)', 'en-US': 'History(Group)' }
  },
  'taskman/workbench/createChange': {
    parentBreadcrumb: { 'zh-CN': '任务', 'en-US': 'Tasks' },
    childBreadcrumb: { 'zh-CN': '新建变更', 'en-US': 'New Change' }
  },
  'taskman/workbench/detailChange': {
    parentBreadcrumb: { 'zh-CN': '任务', 'en-US': 'Tasks' },
    childBreadcrumb: { 'zh-CN': '变更详情', 'en-US': 'Change Detail' }
  },
  'taskman/workbench/changeHistory': {
    parentBreadcrumb: { 'zh-CN': '任务', 'en-US': 'Tasks' },
    childBreadcrumb: { 'zh-CN': '历史(本组)', 'en-US': 'History(Group)' }
  },
  'taskman/requestHistory': {
    parentBreadcrumb: { 'zh-CN': '系统', 'en-US': 'System' },
    childBreadcrumb: { 'zh-CN': '请求报表', 'en-US': 'Request Report' }
  }
}
window.addImplicitRoute(implicitRoute)
window.addRoutersWithoutPermission(routerP, 'taskman')
window.addRoutes && window.addRoutes(router, 'taskman')
