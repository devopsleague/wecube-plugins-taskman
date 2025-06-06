<template>
  <Modal
    class="component-library-dialog"
    v-model="value"
    :mask-closable="false"
    :closable="false"
    :footer-hide="true"
    width="80%"
  >
    <div class="content">
      <!--新建组件-->
      <div v-if="isAdd" class="left">
        <div class="w-header" slot="title">
          <div class="title">
            {{ $t('tw_add_component') }}
            <span class="underline"></span>
          </div>
        </div>
        <Form :label-width="80">
          <!--组件名-->
          <FormItem :label="$t('tw_component_name')" required>
            <Input v-model.trim="form.name" :maxlength="20" />
          </FormItem>
          <!--表单类型-->
          <FormItem :label="$t('tw_form_type')">
            <Tag :color="form.formType === 'requestInfo' ? 'default' : 'primary'">{{ getFormTypeDisplay }}</Tag>
          </FormItem>
          <!--表单项-->
          <FormItem :label="$t('form_item')">
            <Tag v-for="(i, index) in checkedList" :key="index">{{ i.title }}</Tag>
          </FormItem>
        </Form>
        <Button type="primary" @click="handleSave" style="float: right;" :disabled="!form.name">{{
          $t('save')
        }}</Button>
      </div>
      <!--组件列表-->
      <div class="right">
        <div class="w-header" slot="title">
          <div class="title">
            {{ $t('tw_component_list') }}
            <span class="underline"></span>
          </div>
        </div>
        <div class="query">
          <Select
            v-model="query.formType"
            filterable
            clearable
            :placeholder="$t('tw_form_type')"
            style="width: 150px;"
            @on-change="handleSearch"
          >
            <Option v-for="(i, index) in formTypeList" :value="i.value" :key="index">{{ i.label }}</Option>
          </Select>
          <Select
            v-model="query.createdBy"
            filterable
            clearable
            :placeholder="$t('createdBy')"
            style="width: 150px;"
            @on-change="handleSearch"
          >
            <Option v-for="(i, index) in userList" :value="i.username" :key="index">{{ i.username }}</Option>
          </Select>
          <Input
            v-model.trim="query.name"
            clearable
            :placeholder="$t('tw_component_name')"
            style="width: 300px;"
            @on-change="handleSearch"
          />
        </div>
        <Table
          style="width:100%;margin-top:20px;"
          :border="false"
          size="small"
          :columns="tableColumns"
          :data="tableData"
          :loading="loading"
        />
        <Page
          style="float:right;margin-top:10px;"
          :total="pagination.total"
          @on-change="handlePage"
          show-sizer
          :current="pagination.currentPage"
          :page-size="pagination.pageSize"
          @on-page-size-change="handlePageSize"
          show-total
        />
      </div>
      <div class="close">
        <Icon type="md-close" :size="24" @click="handleClose" />
      </div>
    </div>
  </Modal>
</template>
<script>
import {
  saveTemplateLibrary,
  getTemplateLibraryList,
  deleteTemplateLibrary,
  getLibraryFormTypeList,
  getAllUser
} from '@/api/server'
import { debounce } from '@/pages/util'
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    // 选中的表单项
    checkedList: {
      type: Array,
      default: () => []
    },
    isAdd: {
      type: Boolean,
      default: true
    },
    // 表单组类型
    groupType: {
      type: String,
      default: ''
    },
    // 表单类型
    formType: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      form: {
        name: '',
        formType: '',
        items: []
      },
      query: {
        name: '',
        formType: '',
        createdBy: ''
      },
      pagination: {
        total: 0,
        currentPage: 1,
        pageSize: 10
      },
      formTypeList: [],
      userList: [],
      tableData: [],
      loading: false,
      tableColumns: [
        {
          title: this.$t('tw_component_name'),
          key: 'name',
          align: 'left',
          minWidth: 200
        },
        {
          title: this.$t('tw_form_type'),
          key: 'formType',
          align: 'left',
          minWidth: 140,
          render: (h, params) => {
            const { formType } = params.row
            return (
              <Tag color={formType === 'requestInfo' ? 'default' : 'primary'}>
                {formType === 'requestInfo' ? this.$t('tw_information_form') : formType}
              </Tag>
            )
          }
        },
        {
          title: this.$t('form_item'),
          key: 'formItems',
          align: 'left',
          minWidth: 250,
          render: (h, params) => {
            const list = (params.row.formItems && params.row.formItems.split('、')) || []
            return <BaseScrollTag list={list} />
          }
        },
        {
          title: this.$t('createdBy'),
          key: 'createdBy',
          align: 'left',
          minWidth: 100
        },
        {
          title: this.$t('t_action'),
          key: 'action',
          align: 'center',
          width: 80,
          render: (h, params) => {
            return (
              <Button
                on-click={() => {
                  this.handleDelete(params.row)
                }}
                disabled={window.localStorage.getItem('username') !== params.row.createdBy}
                type="error"
                size="small"
                ghost
                icon="md-trash"
              ></Button>
            )
          }
        }
      ]
    }
  },
  computed: {
    getFormTypeDisplay () {
      if (this.form.formType === 'requestInfo') {
        // 信息表单
        return this.$t('tw_information_form')
      } else {
        return this.form.formType
      }
    }
  },
  watch: {
    formType: {
      handler (val) {
        if (val) {
          if (this.groupType === 'custom') {
            this.form.formType = 'custom'
          } else {
            this.form.formType = val
          }
        }
      },
      immediate: true
    },
    checkedList: {
      handler (val) {
        if (val && val.length > 0) {
          if (val.length === 1) {
            this.form.name = `${val[0].title}`
          } else {
            this.form.name = `${val[0].title}等${val.length}项`
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    init () {
      this.query = {
        name: '',
        formType: '',
        createdBy: ''
      }
      this.tableData = []
      this.handleSearch()
      this.getFormTypeList()
      this.getCreatedByList()
    },
    // 获取表单类型下拉列表
    async getFormTypeList () {
      const { statusCode, data } = await getLibraryFormTypeList()
      if (statusCode === 'OK') {
        const arr = data || []
        if (Array.isArray(arr) && arr.length > 0) {
          this.formTypeList = arr.map(i => {
            return {
              label: i === 'requestInfo' ? this.$t('tw_information_form') : i,
              value: i
            }
          })
          // 将信息表单置于数组第一个
          const index = this.formTypeList.findIndex(i => i.value === 'requestInfo')
          const item = this.formTypeList.splice(index, 1)[0]
          this.formTypeList.unshift(item)
        }
      }
    },
    // 获取创建人下拉列表
    async getCreatedByList () {
      const { status, data } = await getAllUser()
      if (status === 'OK') {
        this.userList = data || []
      }
    },
    async getList () {
      this.loading = true
      const params = {
        name: this.query.name,
        formType: this.query.formType,
        createdBy: this.query.createdBy,
        startIndex: (this.pagination.currentPage - 1) * this.pagination.pageSize,
        pageSize: this.pagination.pageSize
      }
      const { statusCode, data } = await getTemplateLibraryList(params)
      if (statusCode === 'OK') {
        this.tableData = data.contents || []
        this.pagination.total = data.pageInfo.totalRows
      }
      this.loading = false
    },
    handleSearch: debounce(function () {
      this.pagination.currentPage = 1
      this.getList()
    }, 300),
    handlePage (val) {
      this.pagination.currentPage = val
      this.getList()
    },
    handlePageSize (val) {
      this.pagination.currentPage = 1
      this.pagination.pageSize = val
      this.getList()
    },
    async handleSave () {
      const params = {
        name: this.form.name,
        formType: this.form.formType,
        items: this.checkedList
      }
      const { statusCode } = await saveTemplateLibrary(params)
      if (statusCode === 'OK') {
        this.$Notice.success({
          title: this.$t('successful'),
          desc: this.$t('successful')
        })
        this.$emit('fetchList')
        this.handleSearch()
      }
    },
    async handleDelete (row) {
      this.$Modal.confirm({
        title: this.$t('confirm') + this.$t('delete'),
        'z-index': 1000000,
        loading: true,
        onOk: async () => {
          this.$Modal.remove()
          const params = {
            params: {
              id: row.id
            }
          }
          const { statusCode } = await deleteTemplateLibrary(params)
          if (statusCode === 'OK') {
            this.$Notice.success({
              title: this.$t('successful'),
              desc: this.$t('successful')
            })
            this.$emit('fetchList')
            this.getList()
          }
        },
        onCancel: () => {}
      })
    },
    handleClose () {
      this.$emit('input', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.component-library-dialog {
  .content {
    display: flex;
    position: relative;
    min-height: 600px;
    .left {
      width: 360px;
      padding-right: 20px;
      border-right: 1px solid #e8eaec;
      .form-text {
        display: block;
        font-size: 14px;
        color: #515a6e;
        overflow: hidden;
        word-wrap: break-word;
      }
    }
    .right {
      flex: 1;
      padding-left: 20px;
    }
    .close {
      position: absolute;
      right: 0px;
      top: 0px;
      cursor: pointer;
    }
  }
  .title {
    display: block;
    font-size: 16px;
    color: #17233d;
    font-weight: 500;
    margin-bottom: 10px;
  }
  .w-header {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .title {
      font-size: 16px;
      font-weight: bold;
      margin: 0 10px;
      .underline {
        display: block;
        margin-top: -13px;
        margin-left: -6px;
        width: 100%;
        padding: 0 6px;
        height: 12px;
        border-radius: 12px;
        background-color: #c6eafe;
        box-sizing: content-box;
      }
    }
  }
}
</style>
