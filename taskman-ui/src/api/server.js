import { req as request, baseURL } from './base'
import { pluginErrorMessage } from './base-plugin'
let req = request
// 插件模式
if (window.request) {
  req = {
    post: (url, ...params) => pluginErrorMessage(window.request.post(baseURL + url, ...params)),
    get: (url, ...params) => pluginErrorMessage(window.request.get(baseURL + url, ...params)),
    delete: (url, ...params) => pluginErrorMessage(window.request.delete(baseURL + url, ...params)),
    put: (url, ...params) => pluginErrorMessage(window.request.put(baseURL + url, ...params)),
    patch: (url, ...params) => pluginErrorMessage(window.request.patch(baseURL + url, ...params))
  }
}
export const login = data => req.post('/taskman/api/v1/login', data)
export const getEncryptKey = () => req.get(`/taskman/api/v1/login/seed`)
// 获取可申请角色列表
export const getApplyRoles = data => req.get(`/taskman/api/v2/auth/roles?all=${data.all}&roleAdmin=${data.roleAdmin}`)
export const startApply = data => req.post('/taskman/api/v2/auth/roles/apply', data)
export const registerUser = data => req.post('/taskman/api/v2/auth/users/register', data)

export const getTempGroupList = data => req.post('/taskman/api/v1/request-template-group/query', data)
export const createTempGroup = data => req.post('/taskman/api/v1/request-template-group', data)
export const updateTempGroup = data => req.put('/taskman/api/v1/request-template-group', data)
export const deleteTempGroup = data => req.delete('/taskman/api/v1/request-template-group', data)

export const getManagementRoles = () => req.get('/taskman/api/v1/user/roles')
export const getUserRoles = () => req.get('/taskman/api/v1/role/list')
export const getProcess = role => req.get(`/taskman/api/v1/process/list?role=${role}`)

export const createTemp = data => req.post('/taskman/api/v1/request-template', data)
export const updateTemp = data => req.put('/taskman/api/v1/request-template', data)
export const deleteTemp = data => req.delete('/taskman/api/v1/request-template', data)
export const copyTemplate = id => req.post(`/taskman/api/v1/request-template/copy/${id}`)

export const saveRequsetForm = (requestTemplateId, data) =>
  req.post(`/taskman/api/v1/request-form-template/${requestTemplateId}`, data)

export const getTemplateNodesForTemp = requestTemplateId =>
  req.get(`/taskman/api/v1/process-nodes/${requestTemplateId}/template`)
export const getTemplateNodesForRequest = requestTemplateId =>
  req.get(`/taskman/api/v1/process-nodes/${requestTemplateId}/bind`)

export const saveTaskForm = (requestTemplateId, data) =>
  req.post(`/taskman/api/v1/task-template/${requestTemplateId}`, data)

// 提交模版审核
export const submitTemplate = data => req.post(`/taskman/api/v1/request-template/status/update`, data)

export const getTemplateList = data => req.post('/taskman/api/v1/request-template/query', data)
export const getTemplateDetail = requestTemplateId => req.get(`/taskman/api/v1/request-template/${requestTemplateId}`)
export const deleteTemplate = data => req.delete('/taskman/api/v1/request-template', data)
export const forkTemplate = requestTemplateId => req.post(`/taskman/api/v1/request-template/fork/${requestTemplateId}`)
export const getRequestTemplateAttrs = requestTemplateId =>
  req.get(`/taskman/api/v1/request-template/${requestTemplateId}/attrs/get`)
// 模板转给我
export const templateGiveMe = data => req.post(`/taskman/api/v1/request-template/handler/update`, data)
// 模板确认发版or退回草稿
export const updateTemplateStatus = data => req.post(`/taskman/api/v1/request-template/status/update`, data)
// 获取模板待发布数量
export const templateConfirmCount = () => req.get(`/taskman/api/v1/request-template/confirm_count`)

export const getRequestFormTemplateData = requestTemplateId =>
  req.get(`/taskman/api/v1/request-form-template/${requestTemplateId}`)
export const getTaskFormDataByNodeId = (requestTemplateId, nodeId) =>
  req.get(`/taskman/api/v1/task-template/${requestTemplateId}/${nodeId}`)

export const getTemplateByUser = () => req.get('/taskman/api/v1/user/request-template')
export const getRootEntity = params => req.get('/taskman/api/v1/entity/data', params)
export const getEntityData = params => req.get('/taskman/api/v1/request-data/preview', params)
export const saveEntityData = (requestId, params) =>
  req.post(`/taskman/api/v1/request-data/save/${requestId}/data`, params)
export const getBindData = requestId => req.get(`/taskman/api/v1/request-data/get/${requestId}/data`)
export const getBindRelate = requestId => req.get(`/taskman/api/v1/request-data/get/${requestId}/bing`)
export const saveRequest = (requestId, data) => req.post(`/taskman/api/v1/request-data/save/${requestId}/bing`, data)
export const updateRequestStatus = (requestId, status, params) =>
  req.post(`/taskman/api/v1/request-status/${requestId}/${status}`, params)
export const requestListForDraftInitiated = params => req.post(`/taskman/api/v1/user/request/use`, params)
export const requestListForHandle = params => req.post(`/taskman/api/v1/user/request/mgmt`, params)
export const deleteRequest = id => req.delete(`/taskman/api/v1/request/${id}`)
export const getRequestInfo = requestId => req.get(`/taskman/api/v1/request/${requestId}`)

export const getRefOptions = (requestId, attr, params, attrName) =>
  req.post(`/taskman/api/v1/request-data/reference/query/${attr}/${requestId}/${attrName}`, params)

export const getWeCmdbOptions = (packageName, ciType, params) =>
  req.post(`/taskman/api/v2/platform/${packageName}/entities/${ciType}/query`, params)

export const taskList = params => req.post(`/taskman/api/v1/task/list`, params)
export const getTaskDetail = taskId => req.get(`/taskman/api/v1/task/detail/${taskId}`)
export const commitTaskData = (taskId, data) => req.post(`/taskman/api/v1/task/approve/${taskId}`, data)
export const getRequestDetail = requestId => req.get(`/taskman/api/v1/request/detail/${requestId}`)
export const getHandlerRoles = params => req.get(`/taskman/api/v1/role/user/list`, params)
export const getTemplateTags = requestTemplateGroup =>
  req.get(`/taskman/api/v1/request-template/tags/${requestTemplateGroup}`)
export const confirmUploadTemplate = confirmToken =>
  req.post(`/taskman/api/v1/request-template/import-confirm/${confirmToken}`)
export const deleteAttach = fileId => req.delete(`/taskman/api/v1/request/attach-file/remove/${fileId}`)
export const reRequest = fileId => req.post(`/taskman/api/v1/request/copy/${fileId}`)
export const requestParent = requestId => req.get(`/taskman/api/v1/request-parent/get?requestId=${requestId}`)
export const enableTemplate = templateId => req.post(`/taskman/api/v1/request-template/enable/${templateId}`)
export const disableTemplate = templateId => req.post(`/taskman/api/v1/request-template/disable/${templateId}`)
// taskman重构
// 选择模板列表
export const getTemplateTree = () => req.get('/taskman/api/v2/user/request-template')
// 模板收藏
export const collectTemplate = params => req.post(`/taskman/api/v1/user/template/collect`, params)
// 取消模板收藏
export const uncollectTemplate = templateId => req.delete(`/taskman/api/v1/user/template/collect/${templateId}`)
// 模板收藏列表
export const collectTemplateList = params => req.post(`/taskman/api/v1/user/template/collect/query`, params)
// 工作台看板数量
export const overviewData = params => req.post(`/taskman/api/v1/user/platform/count`, params)
// 工作台列表
export const getPlatformList = params => req.post(`/taskman/api/v1/user/platform/list`, params)
// 获取工作台筛选数据集合
export const getPlatformFilter = params => req.post(`/taskman/api/v1/user/platform/filter-item`, params)
// 获取模板收藏列表筛选数据集合
export const getTemplateFilter = params => req.post(`/taskman/api/v1/user/template/filter-item`, params)
// 工作台处理接口
export const pendingHandle = params => req.post(`/taskman/api/v1/task-handle/update`, params)
// 工作台撤回
export const recallRequest = id => req.post(`/taskman/api/v1/user/request/revoke/${id}`)
// 新建发布-发布信息获取
export const getCreateInfo = params => req.post(`/taskman/api/v2/request`, params)
// 新建发布-请求进度
export const getProgressInfo = params => req.get(`/taskman/api/v1/request/progress`, params)
// 新建发布-保存数据
export const savePublishData = (requestId, params) =>
  req.post(`/taskman/api/v2/request-data/save/${requestId}/data/save`, params)
// 新建发布详情数据
export const getPublishInfo = params => req.get(`/taskman/api/v2/request/detail`, params)
// 发布历史页面
export const getPublishList = params => req.post(`/taskman/api/v1/request/history/list`, params)
// 确认定版新接口
export const startRequestNew = (requestId, data) => req.post(`/taskman/api/v2/request-check/confirm/${requestId}`, data)
// 定版暂存新接口
export const saveRequestNew = (requestId, type, data) =>
  req.post(`/taskman/api/v2/request-data/save/${requestId}/bing/${type}`, data)
// 获取模板任务配置
export const getTaskConfig = (templateId, type) => req.get(`/taskman/api/v1/task-template/${templateId}?type=${type}`)
// 获取指定角色的管理员
export const getAdminUserByRole = role => req.get(`/taskman/api/v1/role/administrator/list?role=${role}`)
// 需关注任务节点列表
export const geTaskTagList = requestId => req.get(`/taskman/api/v1/request/${requestId}/task/list`)
// 提交请求确认
export const confirmRequest = params => req.post(`/taskman/api/v1/request/confirm`, params)
// 获取请求历史
export const getRequestHistory = requestId => req.get(`/taskman/api/v2/request/history/${requestId}`)
// 请求表单单独提交
export const saveFormData = (requestId, data) => req.post(`/taskman/api/v2/request-data/form/save/${requestId}`, data)
// 获取自定义分析数据
export const getExpressionData = (titleId, dataId) =>
  req.get(`/taskman/api/v1/request-data/entity/expression/query/${titleId}/${dataId}`)

// 查询流程图
export const getFlowByTemplateId = templateId => req.get(`/taskman/api/v1/request/process/definitions/${templateId}`)
export const getFlowByInstanceId = instanceId => req.get(`/taskman/api/v1/request/process/instances/${instanceId}`)
export const getNodeContextByNodeId = (instanceId, nodeId) =>
  req.post(`/taskman/api/v1/request/workflow/task_node/${instanceId}/${nodeId}`)

export const getAllDataModels = () => req.get(`/taskman/api/v2/platform/models`)
// 获取可添加表单组
export const getEntityByTemplateId = tmpId => req.get(`/taskman/api/v1/request-template/${tmpId}/entity`)

export const getRequestDataForm = tmpId => req.get(`/taskman/api/v1/request-form-template/${tmpId}/data-form`)
export const saveRequestGroupForm = data => req.post(`/taskman/api/v1/form-template/item-group-config`, data)
export const deleteRequestGroupForm = (itemGroupId, tmpId) =>
  req.delete(`/taskman/api/v1/form-template/item-group?item-group-id=${itemGroupId}&request-template-id=${tmpId}`)
export const saveRequestGroupCustomForm = data => req.post(`/taskman/api/v1/form-template/item-group`, data)
export const getRequestGroupForm = params =>
  req.get(
    `/taskman/api/v1/form-template/item-group-config?entity=${params.entity}&form-type=${params.formType}&request-template-id=${params.requestTemplateId}&task-template-id=${params.taskTemplateId}&item-group-id=${params.itemGroupId}&module=${params.module}`
  )
// 获取审批节点
export const getApprovalNode = (tmpId, type) => req.get(`/taskman/api/v1/task-template/${tmpId}/ids?type=${type}`)

// 清空节点下的组
export const deleteGroupsByNodeid = (tmpId, nodeId) =>
  req.delete(`/taskman/api/v1/task-template/form-template/${tmpId}/${nodeId}`)
// 保存审批节点
export const addApprovalNode = data => req.post(`/taskman/api/v1/task-template/${data.requestTemplate}`, data)
// 保存审批节点
export const updateApprovalNode = data =>
  req.put(`/taskman/api/v1/task-template/${data.requestTemplate}/${data.id}`, data)
// 删除审批节点
export const removeApprovalNode = (requestTemplate, id) =>
  req.delete(`/taskman/api/v1/task-template/${requestTemplate}/${id}`)
// 获取审批节点
export const getApprovalNodeById = (tmpId, nodeId, type) =>
  req.get(`/taskman/api/v1/task-template/${tmpId}/${nodeId}?type=${type}`)
// 查询审批中可添加的组
export const getApprovalGlobalForm = tmpId => req.get(`/taskman/api/v1/request-form-template/${tmpId}/global-form`)
// 在审批节点中赋值赋值添加数据表单
export const copyItemGroup = params =>
  req.post(
    `/taskman/api/v1/form-template/item-group/copy?request-template-id=${params.requestTemplateId}&item-group-id=${params.itemGroupId}&task-template-id=${params.taskTemplateId}`,
    {}
  )
// 获取审批节点下的组信息
export const getApprovalNodeGroups = (tmpId, taskTemplateId) =>
  req.get(`/taskman/api/v1/request-form-template/${tmpId}/form/${taskTemplateId}`)

// 获取审批节点
export const removeEmptyDataForm = tmpId => req.post(`/taskman/api/v1/request-template/${tmpId}/data-form-clean`)

export const getTargetOptions = (pkgName, entityName) =>
  req.post(`/taskman/api/v1/packages/${pkgName}/entities/${entityName}/query`, {
    additionalFilters: []
  })
export const getEntityRefsByPkgNameAndEntityName = (pkgName, entityName) =>
  req.get(`/taskman/api/v1/models/package/${pkgName}/entity/${entityName}`)

// 申请列表-管理员视角
export const getProcessableList = data => req.post(`/taskman/api/v2/auth/roles/apply/byhandler`, data)
// 获取所有用户
export const getAllUser = roleId => req.get(`/taskman/api/v2/auth/users`)
// 获取角色下用户
export const getUserByRole = roleId => req.get(`/taskman/api/v2/auth/roles/${roleId}/users`)
// 从角色中删除用户
export const removeUserFromRole = (roleId, data) => req.post(`/taskman/api/v2/auth/roles/${roleId}/users/revoke`, data)
// 为角色添加用户
export const addUserForRole = (roleId, data) => req.post(`/taskman/api/v2/auth/roles/${roleId}/users`, data)
export const handleApplication = data => req.put(`/taskman/api/v2/auth/roles/apply`, data)
// 申请列表-用户视角
export const getApplyList = data => req.post(`/taskman/api/v2/auth/roles/apply/byapplier`, data)
// 删除角色申请记录
export const deleteApplyData = params => req.delete(`/taskman/api/v2/auth/roles/apply`, params)
// 获取编排下的判断分支
export const getWorkflowForkNode = taskTemplateId =>
  req.get(`/taskman/api/v1/task-template/workflow/options?taskTemplateId=${taskTemplateId}`)
// 表单过滤数据清除(all清除所有，message清除信息表单，data清除数据表单)
export const cleanFilterData = (taskTemplateId, type) =>
  req.post(`/taskman/api/v1/request-template/${taskTemplateId}/filter-clean/${type}`)
// 新建组件库
export const saveTemplateLibrary = data => req.post(`/taskman/api/v1/form-template-library`, data)
// 组件库列表
export const getTemplateLibraryList = data => req.post(`/taskman/api/v1/form-template-library/query`, data)
// 删除组件库
export const deleteTemplateLibrary = params => req.delete(`/taskman/api/v1/form-template-library`, params)
// 组件库获取表单类型
export const getLibraryFormTypeList = () => req.get(`/taskman/api/v1/form-template-library/form-type`)
// 获取关联单列表
export const getAssociateList = data => req.post(`/taskman/api/v1/request/association`, data)
// 获取cmdb表单列权限
export const getCmdbFormPermission = data => req.post(`/taskman/api/v1/request-data/form/sensitive-attr/query`, data)
