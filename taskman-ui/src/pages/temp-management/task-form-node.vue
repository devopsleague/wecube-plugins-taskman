<template>
  <div class="task-form-node">
    <div class="title">
      <div class="title-text">
        {{ $t('tw_node_configuration') }}
        <span class="underline"></span>
      </div>
    </div>
    <div class="form-area">
      <Form ref="formInline" :inline="false" :label-width="80" class="border-form">
        <FormItem :label="$t('name')">
          <Input
            type="text"
            :disabled="procDefId !== ''"
            v-model="activeApprovalNode.name"
            @on-change="paramsChanged"
            style="width: 200px;"
            maxlength="30"
            show-word-limit
          >
          </Input>
          <span style="color: red">*</span>
          <div v-if="activeApprovalNode.name === ''" style="color: red">
            {{ $t('name') }}{{ $t('can_not_be_empty') }}
          </div>
        </FormItem>
        <FormItem :label="$t('tw_validity_period')">
          <Select v-model="activeApprovalNode.expireDay" @on-change="paramsChanged" style="width: 200px;">
            <Option v-for="item in expireDayOptions" :value="item" :key="item">{{ item }}{{ $t('day') }}</Option>
          </Select>
          <span style="color: red">*</span>
        </FormItem>
        <FormItem :label="$t('tw_type')">
          <Input type="text" v-model="nodeType" disabled style="width: 160px;"> </Input>
        </FormItem>
        <FormItem :label="$t('description')">
          <Input
            v-model="activeApprovalNode.description"
            style="width: 200px"
            type="textarea"
            :rows="2"
            @on-change="paramsChanged"
          >
          </Input>
        </FormItem>
      </Form>
      <Form ref="formInline" :inline="false" :label-width="100" class="table-form">
        <FormItem :label="$t('tw_allocation')">
          <Select v-model="activeApprovalNode.handleMode" @on-change="changeRoleType" style="width: 260px;">
            <Option v-for="item in roleTypeOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <span style="color: red">*</span>
        </FormItem>
        <FormItem
          v-if="['custom', 'any', 'all', 'admin'].includes(activeApprovalNode.handleMode)"
          :label="activeApprovalNode.handleMode === 'admin' ? $t('tw_condition') : $t('handler')"
          style="width:100%"
        >
          <Table
            style="width:100%;"
            :border="true"
            size="small"
            :columns="getColumns"
            :data="activeApprovalNode.handleTemplates"
          />
          <Button
            v-if="['any', 'all'].includes(activeApprovalNode.handleMode)"
            @click.stop="addRoleObjItem"
            type="primary"
            size="small"
            ghost
            icon="md-add"
            style="margin-top:5px;"
          ></Button>
        </FormItem>
      </Form>
      <!-- <div style="text-align: center;">
        <Button v-if="isCheck !== 'Y'" type="primary" :disabled="isSaveNodeDisable" @click="saveNode(1)">{{
          $t('save')
        }}</Button>
      </div> -->
    </div>
  </div>
</template>

<script>
import LimitSelect from '@/pages/components/limit-select.vue'
import { deepClone, fixArrStrToJsonArray } from '@/pages/util'
import {
  getUserRoles,
  getHandlerRoles,
  updateApprovalNode,
  getApprovalNodeById,
  getRequestDataForm,
  getRequestFormTemplateData,
  getWeCmdbOptions
} from '@/api/server'
export default {
  props: ['isCheck', 'nodeType', 'forkOptions'],
  components: {
    LimitSelect
  },
  data () {
    return {
      isParmasChanged: false, // 参数变化标志位，控制右侧panel显示逻辑
      requestTemplateId: '',
      procDefId: '',
      activeApprovalNode: {
        id: '',
        sort: 1,
        requestTemplate: '',
        name: `${this.$t('task')}1`,
        expireDay: 1,
        description: '',
        handleMode: 'custom',
        handleTemplates: [
          {
            assign: 'template', // 角色设置方式：template.模板指定 custom.提交人指定
            handlerType: 'template_suggest', // 人员设置方式：template.模板指定 template_suggest.模板建议 custom.提交人指定 custom_suggest.提交人建议 system.组内系统分配 claim.组内主动认领。[template,template_suggest]只当role_type=template才有
            role: '',
            handler: '',
            handlerOptions: [], // 缓存角色下的用户，添加数据时添加，保存时清除
            assignRule: {}, // 信息表单过滤项数据
            filterRule: {} // 数据表单过滤项数据
          }
        ]
      },
      expireDayOptions: [1, 2, 3, 4, 5, 6, 7], // 时效
      roleTypeOptions: [
        // custom.单人自定义 any.协同 all.并行 admin.提交人角色管理员 auto.自动通过
        { label: this.$t('tw_single'), value: 'custom' },
        { label: this.$t('tw_collaborative_task'), value: 'any' },
        { label: this.$t('tw_parallel_task'), value: 'all' },
        { label: this.$t('tw_roleAdmin'), value: 'admin' }
        // { label: this.$t('tw_autoWith'), value: 'auto' }
      ],
      approvalSingle: {
        assign: 'template', // 角色设置方式：template.模板指定 custom.提交人指定
        handlerType: 'template_suggest', // 人员设置方式：template.模板指定 template_suggest.模板建议 custom.提交人指定 custom_suggest.提交人建议 system.组内系统分配 claim.组内主动认领。[template,template_suggest]只当role_type=template才有
        role: '',
        handler: '',
        handlerOptions: [], // 缓存角色下的用户，添加数据时添加，保存时清除
        assignRule: {},
        filterRule: {}
      },
      approvalRoleTypeOptions: [
        { label: this.$t('tw_template_assign'), value: 'template' },
        { label: this.$t('tw_reporter_assign'), value: 'custom' }
      ],
      handlerTypeOptions: [
        { label: this.$t('tw_template_assign'), value: 'template', used: ['template'] },
        { label: this.$t('tw_template_suggest'), value: 'template_suggest', used: ['template'] },
        { label: this.$t('tw_reporter_assign'), value: 'custom', used: ['template', 'custom'] },
        { label: this.$t('tw_reporter_suggest'), value: 'custom_suggest', used: ['template', 'custom'] },
        { label: this.$t('tw_group_assign'), value: 'system', used: ['template', 'custom'] },
        { label: this.$t('tw_group_claim'), value: 'claim', used: ['template', 'custom'] }
      ],
      useRolesOptions: [], // 使用角色
      isSaveNodeDisable: true,
      needChangeStatus: false,
      filterFormList: [], // 信息表单和数据表单过滤项配置
      tableColumns: [], // 单人自定义、并行表格列(展示处理人和分配条件)
      filterColumns: [], // 管理员表格列(只展示过滤条件)
      initColumns: [
        {
          title: this.$t('index'),
          key: 'index',
          align: 'center',
          fixed: 'left',
          width: 70,
          render: (h, params) => {
            return <span>{params.index + 1}</span>
          }
        },
        // 角色设置方式
        {
          title: this.$t('tw_role_based_config'),
          key: 'assign',
          align: 'left',
          minWidth: 250,
          render: (h, params) => {
            return (
              <Select
                value={params.row.assign}
                on-on-change={v => {
                  this.activeApprovalNode.handleTemplates[params.index].assign = v
                  this.paramsChanged()
                }}
                filterable
                clearable
              >
                {this.approvalRoleTypeOptions &&
                  this.approvalRoleTypeOptions.map(i => (
                    <Option value={i.value} key={i.value}>
                      {i.label}
                    </Option>
                  ))}
              </Select>
            )
          }
        },
        // 人员设置方式
        {
          title: this.$t('tw_user_based_config'),
          key: 'handlerType',
          align: 'left',
          minWidth: 250,
          render: (h, params) => {
            const options = this.handlerTypeOptions.filter(i => i.used.includes(params.row.assign)) || []
            return (
              <Select
                value={params.row.handlerType}
                on-on-change={v => {
                  this.activeApprovalNode.handleTemplates[params.index].handlerType = v
                  this.paramsChanged()
                }}
                filterable
                clearable
              >
                {options.map(i => (
                  <Option value={i.value} key={i.value}>
                    {i.label}
                  </Option>
                ))}
              </Select>
            )
          }
        },
        // 角色
        {
          title: this.$t('manageRole'),
          key: 'role',
          align: 'left',
          minWidth: 250,
          render: (h, params) => {
            return (
              <Select
                value={params.row.role}
                on-on-change={v => {
                  this.activeApprovalNode.handleTemplates[params.index].role = v
                  this.changeUser(v, params.index, true)
                }}
                on-on-open-change={() => {
                  this.getUserRoles()
                }}
                disabled={this.isRoleDisable(params.row, params.index)}
                filterable
              >
                {this.useRolesOptions.map(i => (
                  <Option value={i.id} key={i.id}>
                    {i.displayName}
                  </Option>
                ))}
              </Select>
            )
          }
        },
        // 人员
        {
          title: this.$t('tw_users'),
          key: 'handler',
          align: 'left',
          minWidth: 250,
          render: (h, params) => {
            return (
              <Select
                value={params.row.handler}
                on-on-change={v => {
                  this.activeApprovalNode.handleTemplates[params.index].handler = v
                  this.paramsChanged()
                }}
                on-on-open-change={() => {
                  this.changeUser(params.row.role, params.index, false)
                }}
                disabled={this.isHandlerDisable(params.row, params.index)}
                filterable
              >
                {params.row.handlerOptions &&
                  params.row.handlerOptions.map(i => (
                    <Option value={i.id} key={i.id}>
                      {i.displayName}
                    </Option>
                  ))}
              </Select>
            )
          }
        },
        {
          title: this.$t('t_action'),
          key: 'action',
          align: 'center',
          fixed: 'right',
          width: 70,
          render: (h, params) => {
            return (
              <Button
                disabled={this.activeApprovalNode.handleTemplates.length < 2}
                on-click={() => {
                  this.removeRoleObjItem(params.index)
                }}
                type="error"
                size="small"
                ghost
                icon="md-trash"
              ></Button>
            )
          }
        }
      ],
      filterOptions: {}
    }
  },
  computed: {
    getColumns () {
      if (this.activeApprovalNode.handleMode === 'any') {
        return this.initColumns
      } else if (this.activeApprovalNode.handleMode === 'admin') {
        return this.filterColumns
      } else {
        return this.tableColumns
      }
    }
  },
  watch: {
    activeApprovalNode: {
      handler (val) {
        if (this.needChangeStatus) {
          this.isSaveNodeDisable = this.isSaveBtnActive()
          this.$emit('nodeStatus', this.isSaveNodeDisable)
        }
        // 将后台下发的null转换成{},避免报错
        val.handleTemplates.forEach(item => {
          if (!item.assignRule) {
            item.assignRule = {}
          }
          if (!item.filterRule) {
            item.filterRule = {}
          }
        })
        if (val.handleTemplates && val.handleTemplates.length === 0) {
          val.handleTemplates = [
            {
              assign: 'template',
              handlerType: 'template_suggest',
              role: '',
              handler: '',
              handlerOptions: [],
              assignRule: {},
              filterRule: {}
            }
          ]
        }
      },
      immediate: true,
      deep: true
    },
    requestTemplateId (val) {
      if (val) {
        this.getFilterFormData()
      }
    },
    forkOptions: {
      handler (val) {
        if (val && val.length > 0) {
          this.roleTypeOptions = [
            { label: this.$t('tw_single'), value: 'custom' },
            { label: this.$t('tw_collaborative_task'), value: 'any' },
            { label: this.$t('tw_roleAdmin'), value: 'admin' }
          ]
        } else {
          this.roleTypeOptions = [
            { label: this.$t('tw_single'), value: 'custom' },
            { label: this.$t('tw_collaborative_task'), value: 'any' },
            { label: this.$t('tw_parallel_task'), value: 'all' },
            { label: this.$t('tw_roleAdmin'), value: 'admin' }
          ]
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    loadPage (params) {
      this.needChangeStatus = true
      this.procDefId = params.procDefId
      this.isParmasChanged = false
      this.requestTemplateId = params.requestTemplateId
      this.getNodeById(params)
      this.getUserRoles()
    },
    // 获取数据表单
    getRequestFormData () {
      return new Promise(async resolve => {
        const { statusCode, data } = await getRequestDataForm(this.requestTemplateId)
        if (statusCode === 'OK') {
          resolve(data.groups || [])
        } else {
          resolve([])
        }
      })
    },
    // 获取信息表单
    getInfoFormData () {
      return new Promise(async resolve => {
        const { statusCode, data } = await getRequestFormTemplateData(this.requestTemplateId)
        if (statusCode === 'OK') {
          resolve(data.items || [])
        } else {
          resolve([])
        }
      })
    },
    getFilterFormData () {
      this.filterColumns = []
      this.filterFormList = []
      this.tableColumns = deepClone(this.initColumns)
      Promise.all([this.getRequestFormData(), this.getInfoFormData()]).then(([formData, infoData]) => {
        // 信息表单
        this.filterFormList.push({
          type: 1,
          items: infoData
        })
        // 数据表单
        formData &&
          formData.forEach(item => {
            const obj = Object.assign({}, item, { type: 2 })
            this.filterFormList.push(obj)
          })
        // 信息表单列
        let infoFormColumn = {
          title: this.$t('tw_msgForm_assign'),
          align: 'center',
          children: []
        }
        // 数据表单列
        let dataFormColumn = {
          title: this.$t('tw_dataForm_filter'),
          align: 'center',
          children: []
        }
        this.filterFormList.forEach(i => {
          i.items.forEach(j => {
            if (['wecmdbEntity', 'select'].includes(j.elementType) && j.controlSwitch === 'yes') {
              // 初始化下拉选项
              this.getRefOptions(j)
              // 初始化表格列
              if (i.type === 1) {
                infoFormColumn.children.push({
                  title: j.title,
                  align: 'left',
                  minWidth: 250,
                  render: (h, params) => {
                    return (
                      <LimitSelect
                        value={params.row.assignRule[j.name]}
                        on-on-change={v => {
                          this.activeApprovalNode.handleTemplates[params.index].assignRule[j.name] = v
                        }}
                        displayName={j.elementType === 'wecmdbEntity' ? 'displayName' : j.entity ? 'key_name' : 'label'}
                        displayValue={j.elementType === 'wecmdbEntity' ? 'id' : j.entity ? 'guid' : 'value'}
                        options={this.filterOptions[j.name]}
                        multiple={true}
                        style="width:100%"
                      ></LimitSelect>
                    )
                  }
                })
              } else if (i.type === 2) {
                dataFormColumn.children.push({
                  title: `${i.itemGroupName}-${j.title}`,
                  align: 'left',
                  minWidth: 280,
                  render: (h, params) => {
                    const key = `${i.itemGroup}-${j.name}`
                    return (
                      <LimitSelect
                        value={params.row.filterRule[key]}
                        on-on-change={v => {
                          this.activeApprovalNode.handleTemplates[params.index].filterRule[key] = v
                          // 数据表单过滤项有值，则审批表单对应表单控件属性为不可编辑，需要传值过去判断
                          this.$emit('dataFormFilterChange')
                        }}
                        displayName={j.elementType === 'wecmdbEntity' ? 'displayName' : j.entity ? 'key_name' : 'label'}
                        displayValue={j.elementType === 'wecmdbEntity' ? 'id' : j.entity ? 'guid' : 'value'}
                        options={this.filterOptions[j.name]}
                        multiple={true}
                        style="width:100%"
                      ></LimitSelect>
                    )
                  }
                })
              }
            }
          })
        })
        const index = this.tableColumns.findIndex(column => column.key === 'action')
        if (dataFormColumn.children.length > 0) {
          this.tableColumns.splice(index, 0, dataFormColumn)
          this.filterColumns.unshift(dataFormColumn)
        }
        if (infoFormColumn.children.length > 0) {
          this.tableColumns.splice(index, 0, infoFormColumn)
          this.filterColumns.unshift(infoFormColumn)
        }
        this.$emit('dataFormFilterChange')
      })
    },
    async getRefOptions (item) {
      // 模板自定义下拉类型
      if (item.elementType === 'select' && item.entity === '') {
        this.$set(this.filterOptions, item.name, fixArrStrToJsonArray(item.dataOptions))
        return
      }
      // cmdb下发
      if (item.elementType === 'select' && item.entity) {
        if (!item.refPackageName || !item.refEntity) return
        const { status, data } = await getWeCmdbOptions(item.refPackageName, item.refEntity, {})
        if (status === 'OK') {
          this.$set(this.filterOptions, item.name, data || [])
        }
        return
      }
      // 模型数据项
      if (item.elementType === 'wecmdbEntity') {
        const [packageName, ciType] = (item.dataOptions && item.dataOptions.split(':')) || []
        if (!packageName || !ciType) return
        const { status, data } = await getWeCmdbOptions(packageName, ciType, {})
        if (status === 'OK') {
          this.$set(this.filterOptions, item.name, data || [])
        }
      }
    },
    async getNodeById (params) {
      const { statusCode, data } = await getApprovalNodeById(this.requestTemplateId, params.id, 'implement')
      if (statusCode === 'OK') {
        this.activeApprovalNode = data
        this.$emit('setFormConfigStatus', true)
        this.$set(this.activeApprovalNode, 'handleTemplates', data.handleTemplates)
        this.mgmtData()
      }
    },
    // 控制保存按钮
    isSaveBtnActive () {
      if (this.activeApprovalNode.name === '') {
        return true
      }
      // 前三种分配类型需要设置角色
      if (
        ['custom', 'any', 'all'].includes(this.activeApprovalNode.handleMode) &&
        this.activeApprovalNode.handleTemplates
      ) {
        if (this.activeApprovalNode.handleTemplates.length === 0) {
          return true
        } else {
          let res = false
          for (let i = 0; i < this.activeApprovalNode.handleTemplates.length; i++) {
            const item = this.activeApprovalNode.handleTemplates[i]
            // 人员设置方式 没选
            if (!item.handlerType) {
              res = true
              break
            }
            // 模版建议和模版指定需要选择角色和人员
            if (
              item.assign === 'template' &&
              ['template', 'template_suggest'].includes(item.handlerType) &&
              (!item.role || !item.handler)
            ) {
              res = true
              break
            }
            // 提交人指定/提交人建议/组内系统分配/组内主动认领 需要选择角色
            if (
              item.assign === 'template' &&
              ['custom', 'custom_suggest', 'system', 'claim'].includes(item.handlerType) &&
              !item.role
            ) {
              res = true
              break
            }
          }
          return res
        }
      }
    },
    async saveNode (type, nextNodeId) {
      // type 1自我更新 2转到目标节点 3父级页面调用保存
      this.activeApprovalNode.requestTemplate = this.requestTemplateId
      let tmpData = JSON.parse(JSON.stringify(this.activeApprovalNode))
      if (['auto'].includes(tmpData.handleMode)) {
        delete tmpData.handleTemplates
      }
      const { statusCode } = await updateApprovalNode(tmpData)
      if (statusCode === 'OK') {
        this.isParmasChanged = false
        if (![2, 3, 4].includes(type)) {
          this.$Notice.success({
            title: this.$t('successful'),
            desc: this.$t('successful')
          })
        }
        if ([1, 4].includes(type)) {
          this.$emit('reloadParentPage', this.activeApprovalNode.id)
        } else if (type === 2) {
          this.$emit('reloadParentPage', nextNodeId)
        }
      }
    },
    // 为父页面提供状态查询
    panalStatus () {
      const nodeStatus = this.isSaveNodeDisable
      if (nodeStatus) {
        this.$Message.warning(this.$t('tw_node_data_incomplete'))
      }
      return nodeStatus ? 'unableToSave' : 'canSave'
    },
    mgmtData () {
      this.activeApprovalNode.handleTemplates &&
        this.activeApprovalNode.handleTemplates.forEach((roleObj, roleObjIndex) => {
          if (roleObj.role !== '') {
            this.getUserByRole(roleObj.role, roleObjIndex)
          }
        })
    },
    // 新增一组审批人
    addRoleObjItem () {
      this.activeApprovalNode.handleTemplates.push(JSON.parse(JSON.stringify(this.approvalSingle)))
    },
    removeRoleObjItem (index) {
      this.activeApprovalNode.handleTemplates.splice(index, 1)
      this.$emit('dataFormFilterChange')
    },
    changeUser (role, roleObjIndex, isClearHandler) {
      if (isClearHandler) {
        this.activeApprovalNode.handleTemplates[roleObjIndex].handler = ''
      }
      this.isParmasChanged = true
      this.getUserByRole(role, roleObjIndex)
    },
    // 使用角色
    async getUserRoles () {
      const { statusCode, data } = await getUserRoles()
      if (statusCode === 'OK') {
        this.useRolesOptions = data
      }
    },
    changeRoleType () {
      this.activeApprovalNode.handleTemplates = [
        {
          assign: 'template', // 角色设置方式：template.模板指定 custom.提交人指定
          handlerType: 'template_suggest', // 人员设置方式：template.模板指定 template_suggest.模板建议 custom.提交人指定 custom_suggest.提交人建议 system.组内系统分配 claim.组内主动认领。[template,template_suggest]只当role_type=template才有
          role: '',
          handler: '',
          handlerOptions: [], // 缓存角色下的用户，添加数据时添加，保存时清除
          assignRule: {},
          filterRule: {}
        }
      ]
      this.$emit('setFormConfigStatus', true)
      this.$emit('dataFormFilterChange')
      this.paramsChanged()
    },
    async getUserByRole (role, roleObjIndex) {
      // 猥琐，下方赋值会使该变量丢失
      const handler = this.activeApprovalNode.handleTemplates[roleObjIndex].handler
      const params = {
        params: {
          roles: role
        }
      }
      const { statusCode, data } = await getHandlerRoles(params)
      if (statusCode === 'OK') {
        this.$set(
          this.activeApprovalNode.handleTemplates[roleObjIndex],
          'handlerOptions',
          data.map(d => {
            return {
              displayName: d,
              id: d
            }
          })
        )
        this.activeApprovalNode.handleTemplates[roleObjIndex].handler = handler
      }
    },
    paramsChanged () {
      this.isParmasChanged = true
    },
    isRoleDisable (roleObj, roleObjIndex) {
      const res = !(roleObj.assign === 'template')
      if (res) {
        this.activeApprovalNode.handleTemplates[roleObjIndex].role = ''
      }
      return res
    },
    isHandlerDisable (roleObj, roleObjIndex) {
      const res = !(roleObj.assign === 'template' && ['template_suggest', 'template'].includes(roleObj.handlerType))
      if (res) {
        this.activeApprovalNode.handleTemplates[roleObjIndex].handler = ''
      }
      return res
    }
  }
}
</script>
<style lang="scss">
.ivu-input[disabled],
fieldset[disabled] .ivu-input {
  color: #757575 !important;
}
.ivu-select-input[disabled] {
  color: #757575;
  -webkit-text-fill-color: #757575;
}
.task-form-node {
  .ivu-table-small {
    font-size: 14px;
  }
  .ivu-form-item-content {
    line-height: 22px;
  }
}
</style>
<style lang="scss" scoped>
.basci-info-right {
  height: calc(100vh - 260px);
}

.basci-info-left {
  @extend .basci-info-right;
  border-right: 1px solid #dcdee2;
}

.title {
  font-size: 16px;
  font-weight: bold;
  margin: 12px 0;
  display: inline-block;
  .title-text {
    display: inline-block;
    margin-left: 6px;
  }
  .underline {
    display: block;
    margin-top: -10px;
    margin-left: -6px;
    width: 100%;
    padding: 0 6px;
    height: 12px;
    border-radius: 12px;
    background-color: #c6eafe;
    box-sizing: content-box;
  }
}

.form-area {
  display: flex;
  width: 100%;
  .border-form {
    border-right: 1px solid #e8eaec;
    padding-right: 30px;
    width: 330px;
  }
  .table-form {
    width: calc(100% - 330px);
  }
}

.basci-info-content {
  margin: 16px 64px;
}

.cutom-table-border {
  border: 1px solid #dcdee2;
  padding: 4px;
  text-align: center;
}
.margin-left--1 {
  margin-left: -1px;
}
.margin-top--1 {
  margin-top: -1px;
}
</style>
