<!--请求进度-->
<template>
  <div class="workbench-base-progress">
    <!--请求进度-->
    <div class="steps">
      <span class="title">{{ $t('tw_request_progress') }}：</span>
      <Steps :current="0" :style="{ width: progress.requestProgress.length * 120 + 'px' }">
        <Step v-for="(i, index) in progress.requestProgress" :key="index" :content="i.name">
          <template #icon>
            <Icon style="font-weight:bold" size="22" :type="i.icon" :color="i.color" />
            <span v-if="['task'].includes(i.node)" @click="handleExpand(i.node)" class="expand-btn">
              {{ taskExpand ? '收起' : '展开' }}
            </span>
            <span v-if="['approval'].includes(i.node)" @click="handleExpand(i.node)" class="expand-btn">
              {{ approvalExpand ? '收起' : '展开' }}
            </span>
          </template>
          <div class="role" slot="content">
            <Tooltip :content="i.name">
              <div class="word-eclipse">{{ i.name }}</div>
            </Tooltip>
            <span style="margin-top:-5px;">{{ i.handler }}</span>
          </div>
        </Step>
      </Steps>
      <div v-if="errorNode" style="margin:0 0 10px 20px;max-width:400px;">
        <Alert v-if="errorNode === 'autoExit'" show-icon type="error">
          {{ $t('tw_auto_exit_tips') }}
        </Alert>
        <Alert v-else-if="errorNode === 'internallyTerminated'" show-icon type="error">
          {{ $t('tw_terminate_tips') }}
        </Alert>
        <Alert v-else show-icon type="error"> {{ errorNode }}{{ $t('tw_tag_error_tips') }} </Alert>
      </div>
    </div>
    <!--审批进度-->
    <div v-if="approvalExpand" class="steps" style="margin-top:5px;">
      <span class="title">审批进度：</span>
      <Steps :current="0" :style="{ width: progress.approvalProgress.length * 120 + 'px' }">
        <Step v-for="(i, index) in progress.approvalProgress" :key="index" :content="i.name">
          <template #icon>
            <Icon style="font-weight:bold" size="22" :type="i.icon" :color="i.color" />
          </template>
          <div class="role" slot="content">
            <Tooltip :content="i.name">
              <div class="word-eclipse">{{ i.name }}</div>
            </Tooltip>
            <span style="margin-top:-5px;">{{ i.handler }}</span>
          </div>
        </Step>
      </Steps>
    </div>
    <!--任务进度-->
    <div v-if="taskExpand" class="steps" style="margin-top:5px;">
      <span class="title">任务进度：</span>
      <Steps :current="0" :style="{ width: progress.taskProgress.length * 120 + 'px' }">
        <Step v-for="(i, index) in progress.taskProgress" :key="index" :content="i.name">
          <template #icon>
            <Icon style="font-weight:bold" size="22" :type="i.icon" :color="i.color" />
          </template>
          <div class="role" slot="content">
            <Tooltip :content="i.name">
              <div class="word-eclipse">{{ i.name }}</div>
            </Tooltip>
            <span style="margin-top:-5px;">{{ i.handler }}</span>
          </div>
        </Step>
      </Steps>
    </div>
  </div>
</template>

<script>
import { getProgressInfo } from '@/api/server'
const statusIcon = {
  1: 'md-pin', // 进行中
  2: 'md-radio-button-on', // 未开始
  3: 'ios-checkmark-circle-outline', // 已完成
  4: 'md-close-circle', // 节点失败(包含超时)
  5: 'md-exit', // 自动退出
  6: 'md-exit' // 手动终止
}
const statusColor = {
  1: '#ffa500',
  2: '#8189a5',
  3: '#19be6b',
  4: '#ed4014',
  5: '#ed4014',
  6: '#ed4014'
}
export default {
  data () {
    return {
      progress: {
        approvalProgress: [],
        requestProgress: [],
        taskProgress: []
      },
      approvalExpand: false,
      taskExpand: false,
      errorNode: ''
    }
  },
  methods: {
    // 获取请求进度
    async initData (requestTemplate, requestId) {
      const params = {
        templateId: requestTemplate,
        requestId
      }
      const { statusCode, data } = await getProgressInfo(params)
      if (statusCode === 'OK') {
        const { approvalProgress, requestProgress, taskProgress } = data
        // const approvalProgress = [
        //   {
        //     handler: 'admin',
        //     node: '审批1',
        //     status: 1
        //   },
        //   {
        //     handler: 'admin',
        //     node: '审批2',
        //     status: 2
        //   },
        //   {
        //     handler: 'admin',
        //     node: '审批3',
        //     status: 2
        //   }
        // ]
        // const requestProgress = [
        //   {
        //     handler: 'admin',
        //     node: 'sendRequest',
        //     status: 3
        //   },
        //   {
        //     handler: 'admin',
        //     node: 'requestPending',
        //     status: 3
        //   },
        //   {
        //     handler: 'admin',
        //     node: 'approval',
        //     status: 1
        //   },
        //   {
        //     handler: 'admin',
        //     node: 'task',
        //     status: 2
        //   },
        //   {
        //     handler: 'admin',
        //     node: 'confirm',
        //     status: 2
        //   }
        // ]
        // const taskProgress = [
        //   {
        //     handler: 'admin',
        //     node: '任务1',
        //     status: 1
        //   },
        //   {
        //     handler: 'admin',
        //     node: '任务2',
        //     status: 2
        //   }
        // ]
        this.progress.approvalProgress = approvalProgress || [] // 审批进度
        this.progress.requestProgress = requestProgress || [] // 请求进度
        this.progress.taskProgress = taskProgress || [] // 任务进度
        this.progress.requestProgress.forEach(item => {
          item.icon = statusIcon[item.status]
          item.color = statusColor[item.status]
          switch (item.node) {
            case 'sendRequest':
              item.name = this.$t('tw_commit_request') // 提交请求
              break
            case 'requestPending':
              item.name = this.$t('tw_request_pending') // 请求定版
              break
            case 'approval':
              item.name = '审批' // 审批
              item.handler = `${this.progress.approvalProgress.length}个节点`
              break
            case 'task':
              item.name = '任务' // 任务
              item.handler = `${this.progress.taskProgress.length}个节点`
              break
            case 'confirm':
              item.name = '请求确认' // 请求确认
              break
            case 'requestComplete':
              item.name = this.$t('tw_request_complete') // 请求完成
              break
            case 'autoExit':
              item.name = this.$t('status_faulted') // 自动退出
              this.errorNode = item.node
              break
            case 'internallyTerminated':
              item.name = this.$t('status_termination') // 手动终止
              this.errorNode = item.node
              break
            default:
              item.name = item.node
              break
          }
          if (item.handler === 'autoNode') {
            item.handler = this.$t('tw_auto_tag') // 自动节点
            this.errorNode = item.name
          }
        })
        this.progress.approvalProgress.forEach(item => {
          item.icon = statusIcon[item.status]
          item.color = statusColor[item.status]
          item.name = item.node
        })
        this.progress.taskProgress.forEach(item => {
          item.icon = statusIcon[item.status]
          item.color = statusColor[item.status]
          item.name = item.node
        })
      }
    },
    handleExpand (node) {
      if (node === 'approval') {
        this.approvalExpand = !this.approvalExpand
      } else {
        this.taskExpand = !this.taskExpand
      }
    }
  }
}
</script>
<style lang="scss">
.workbench-base-progress {
  .ivu-steps-content {
    padding-left: 0px !important;
    padding-top: 5px;
    font-size: 12px;
    color: #3d3c38 !important;
  }
  .ivu-steps-item {
    display: inline-block;
    position: relative;
    vertical-align: top;
    flex: 1;
    overflow: hidden;
    width: 120px !important;
  }
  .steps .ivu-steps .ivu-steps-tail > i {
    height: 3px;
    background: #8189a5;
  }
  .steps {
    display: flex;
    align-items: center;
    .title {
      font-size: 14px;
      font-weight: 500;
      margin-right: 20px;
    }
    .role {
      display: flex;
      flex-direction: column;
    }
    .word-eclipse {
      max-width: 180px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .expand-btn {
      font-size: 12px;
      color: #2b85e4 !important;
      cursor: pointer;
    }
  }
}
</style>