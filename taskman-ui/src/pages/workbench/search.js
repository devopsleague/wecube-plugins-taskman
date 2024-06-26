import dayjs from 'dayjs'
export default {
  data () {
    return {
      baseSearch: {
        id: {
          key: 'id',
          placeholder: this.$t('tw_request_id'),
          component: 'input'
        },
        name: {
          key: 'name',
          placeholder: this.$t('request_name'),
          component: 'input'
        },
        status: {
          key: 'status',
          placeholder: this.$t('tw_request_status'),
          component: 'select',
          multiple: true,
          list: [
            { label: this.$t('status_pending'), value: 'Pending' },
            { label: this.$t('status_inProgress'), value: 'InProgress' },
            { label: this.$t('tw_inApproval'), value: 'InApproval' },
            { label: this.$t('tw_request_confirm'), value: 'Confirm' },
            { label: this.$t('status_inProgress_faulted'), value: 'InProgress(Faulted)' },
            { label: this.$t('status_termination'), value: 'Termination' },
            { label: this.$t('status_complete'), value: 'Completed' },
            { label: this.$t('status_inProgress_timeouted'), value: 'InProgress(Timeouted)' },
            { label: this.$t('status_faulted'), value: 'Faulted' },
            { label: this.$t('status_draft'), value: 'Draft' }
          ]
        },
        createdBy: {
          key: 'createdBy',
          placeholder: this.$t('tw_reporter'),
          component: 'select',
          multiple: true,
          list: []
        },
        templateId: {
          key: 'templateId',
          placeholder: this.$t('tw_use_template'),
          multiple: true,
          component: 'select',
          list: []
        },
        procDefName: {
          key: 'procDefName',
          placeholder: this.$t('tw_template_flow'),
          multiple: true,
          component: 'select',
          list: []
        },
        operatorObjType: {
          key: 'operatorObjType',
          placeholder: this.$t('tw_operator_type'),
          multiple: true,
          component: 'select',
          list: []
        }
      },
      // 任务工作台
      pendingTaskSearch: [],
      pendingSearch: [],
      hasProcessedTaskSearch: [],
      hasProcessedSearch: [],
      submitSearch: [],
      draftSearch: [],
      initDate: []
    }
  },
  mounted () {
    const cur = dayjs().format('YYYY-MM-DD')
    const pre = dayjs()
      .subtract(3, 'month')
      .format('YYYY-MM-DD')
    this.initDate = [pre, cur]
    this.getFilterOptions()
    // 待处理-任务和审批
    this.pendingTaskSearch = [
      this.baseSearch.id,
      this.baseSearch.name,
      {
        key: 'taskName',
        placeholder: this.$t('task_name'),
        component: 'input'
      },
      {
        key: 'taskHandleUpdatedTime',
        label: this.$t('tw_taskUpdated'),
        dateType: 1,
        initValue: this.initDate,
        labelWidth: 110,
        component: 'custom-time'
      },
      this.baseSearch.status,
      {
        key: 'taskExpectTime',
        label: this.$t('tw_taskEnd'),
        dateType: 4,
        labelWidth: 140,
        component: 'custom-time'
      },
      this.baseSearch.createdBy,
      this.baseSearch.templateId,
      this.baseSearch.procDefName,
      this.baseSearch.operatorObjType
    ]

    // 待处理-定版和请求确认
    this.pendingSearch = [
      this.baseSearch.id,
      this.baseSearch.name,
      this.baseSearch.status,
      {
        key: 'taskHandleUpdatedTime',
        label: this.$t('tw_taskUpdated'), // 任务更新
        dateType: 1,
        initValue: this.initDate,
        labelWidth: 110,
        component: 'custom-time'
      },
      {
        key: 'taskExpectTime',
        label: this.$t('tw_taskEnd'), // 任务截止
        dateType: 4,
        labelWidth: 140,
        component: 'custom-time'
      },
      this.baseSearch.createdBy,
      this.baseSearch.templateId,
      this.baseSearch.procDefName,
      this.baseSearch.operatorObjType
    ]

    // 已处理-任务和审批
    this.hasProcessedTaskSearch = [
      this.baseSearch.id,
      this.baseSearch.name,
      {
        key: 'taskName',
        placeholder: this.$t('task_name'),
        component: 'input'
      },
      {
        key: 'taskApprovalTime',
        label: this.$t('handle_time'),
        dateType: 1,
        initValue: this.initDate,
        labelWidth: 85,
        component: 'custom-time'
      },
      this.baseSearch.status,
      this.baseSearch.createdBy,
      this.baseSearch.templateId,
      this.baseSearch.procDefName,
      this.baseSearch.operatorObjType,
      {
        key: 'taskCreatedTime',
        label: this.$t('tw_taskCreated'), // 任务创建
        dateType: 4,
        labelWidth: 110,
        component: 'custom-time'
      },
      {
        key: 'taskExpectTime',
        label: this.$t('tw_taskEnd'), // 任务截止
        dateType: 4,
        labelWidth: 140,
        component: 'custom-time'
      }
    ]

    // 已处理-定版和请求确认
    this.hasProcessedSearch = [
      this.baseSearch.id,
      this.baseSearch.name,
      this.baseSearch.status,
      {
        key: 'taskApprovalTime',
        label: this.$t('handle_time'),
        dateType: 1,
        initValue: this.initDate,
        labelWidth: 85,
        component: 'custom-time'
      },
      this.baseSearch.createdBy,
      this.baseSearch.templateId,
      this.baseSearch.procDefName,
      this.baseSearch.operatorObjType,
      {
        key: 'taskCreatedTime',
        label: this.$t('tw_taskCreated'), // 任务创建
        dateType: 4,
        labelWidth: 110,
        component: 'custom-time'
      },
      {
        key: 'taskExpectTime',
        label: this.$t('tw_taskEnd'), // 任务截止
        dateType: 4,
        labelWidth: 140,
        component: 'custom-time'
      }
    ]

    // 我提交的
    this.submitSearch = [
      this.baseSearch.id,
      this.baseSearch.name,
      this.baseSearch.status,
      {
        key: 'reportTime',
        label: this.$t('tw_request_commit_time'),
        dateType: 1,
        initValue: this.initDate,
        labelWidth: 110,
        component: 'custom-time'
      },
      this.baseSearch.createdBy,
      this.baseSearch.templateId,
      this.baseSearch.procDefName,
      this.baseSearch.operatorObjType,
      {
        key: 'expectTime',
        label: this.$t('tw_expect_time'),
        dateType: 4,
        labelWidth: 110,
        component: 'custom-time'
      }
    ]

    // 我暂存的
    this.draftSearch = [
      this.baseSearch.id,
      this.baseSearch.name,
      // this.baseSearch.status,
      {
        key: 'updatedTime',
        label: this.$t('tw_update_time'),
        dateType: 1,
        initValue: this.initDate,
        labelWidth: 85,
        component: 'custom-time'
      },
      this.baseSearch.createdBy,
      this.baseSearch.templateId,
      this.baseSearch.procDefName,
      this.baseSearch.operatorObjType,
      {
        key: 'createdTime',
        label: this.$t('tw_created_time'),
        dateType: 4,
        labelWidth: 85,
        component: 'custom-time'
      },
      {
        key: 'expectTime',
        label: this.$t('tw_expect_time'),
        dateType: 4,
        labelWidth: 110,
        component: 'custom-time'
      }
    ]
  },
  methods: {
    // 获取搜索条件的下拉值
    async getFilterOptions () {
      const pre = dayjs()
        .subtract(12, 'month')
        .format('YYYY-MM-DD')
      import('@/api/server').then(async ({ getPlatformFilter }) => {
        const { statusCode, data } = await getPlatformFilter({ startTime: pre })
        if (statusCode === 'OK') {
          const keys = Object.keys(this.baseSearch)
          for (let key of keys) {
            if (key === 'operatorObjType') {
              this.baseSearch[key].list =
                data.operatorObjTypeList &&
                data.operatorObjTypeList.map(item => {
                  return {
                    label: item,
                    value: item
                  }
                })
            } else if (key === 'templateId') {
              // 获取发布模板
              if (this.actionName === '1') {
                this.baseSearch[key].list =
                  data.releaseTemplateList &&
                  data.releaseTemplateList.map(item => {
                    return {
                      label: `${item.templateName}【${item.version}】`,
                      value: item.templateId
                    }
                  })
                // 获取请求模板
              } else if (this.actionName === '2') {
                this.baseSearch[key].list =
                  data.requestTemplateList &&
                  data.requestTemplateList.map(item => {
                    return {
                      label: `${item.templateName}【${item.version}】`,
                      value: item.templateId
                    }
                  })
                // 获取全部模板
              } else {
                this.baseSearch[key].list =
                  data.templateList &&
                  data.templateList.map(item => {
                    return {
                      label: `${item.templateName}【${item.version}】`,
                      value: item.templateId
                    }
                  })
              }
            } else if (key === 'procDefName') {
              this.baseSearch[key].list =
                data.procDefNameList &&
                data.procDefNameList.map(item => {
                  return {
                    label: item,
                    value: item
                  }
                })
            } else if (key === 'createdBy') {
              this.baseSearch[key].list =
                data.createdByList &&
                data.createdByList.map(item => {
                  return {
                    label: item,
                    value: item
                  }
                })
            }
          }
        }
      })
    }
  }
}
