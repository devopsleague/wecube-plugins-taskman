<template>
  <div class=" ">
    <Row>
      <Form :label-width="100">
        <Col :span="4">
          <FormItem :label="$t('name')">
            <Input v-model="formData.name" :disabled="isCheck === 'Y'" style="width: 85%" type="text"> </Input>
            <Icon size="10" style="color: #ed4014" type="ios-medical" />
          </FormItem>
        </Col>
        <Col :span="4">
          <FormItem :label="$t('processing_role')">
            <Select v-model="formData.useRoles" :disabled="isCheck === 'Y'" style="width: 85%" filterable>
              <Option v-for="item in useRolesOptions" :value="item.id" :key="item.id">{{ item.displayName }}</Option>
            </Select>
            <Icon size="10" style="color: #ed4014" type="ios-medical" />
          </FormItem>
        </Col>
        <Col :span="4">
          <FormItem :label="$t('handler')">
            <Select
              v-model="formData.handler"
              @on-open-change="getHandlerRoles"
              :disabled="isCheck === 'Y'"
              style="width: 85%"
              filterable
              clearable
            >
              <Option v-for="item in handlerRolesOptions" :value="item.id" :key="item.id">{{
                item.displayName
              }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col :span="3">
          <FormItem :label="$t('task_time_limit')">
            <Select v-model="formData.expireDay" :disabled="isCheck === 'Y'" style="width: 80%" filterable>
              <Option v-for="item in expireDayOptions" :value="item" :key="item">{{ item }}{{ $t('day') }}</Option>
            </Select>
            <Icon size="10" style="color: #ed4014" type="ios-medical" />
          </FormItem>
        </Col>
        <Col :span="5">
          <FormItem :label="$t('Entity')">
            <Select v-model="selectedEntities" :disabled="isCheck === 'Y'" multiple filterable>
              <Option v-for="item in entityOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col :span="4">
          <FormItem :label="$t('description')">
            <Input v-model="formData.description" :disabled="isCheck === 'Y'" style="width: 90%" type="text"> </Input>
          </FormItem>
        </Col>
      </Form>
    </Row>
    <Divider plain>{{ $t('form_settings') }}</Divider>
    <Row>
      <Col span="6" style="border: 1px solid #dcdee2; padding: 0 16px">
        <div :style="{ height: MODALHEIGHT + 32 + 'px', overflow: 'auto' }">
          <Divider plain>{{ $t('preset') }}{{ $t('input_items') }}</Divider>
          <Select
            v-model="selectedInputFormItem"
            :disabled="isCheck === 'Y'"
            @on-change="changeInputSelectedForm"
            multiple
            filterable
          >
            <Button type="success" @click="selectAll('input')" size="small" long>{{ $t('select_all') }}</Button>
            <OptionGroup v-for="item in formItemOptions" :label="item.description" :key="item.id">
              <Option
                v-for="attr in item.attributes"
                :value="attr.id"
                :disabled="selectedOutputFormItem.includes(attr.id)"
                :key="attr.id"
                >{{ attr.description }}</Option
              >
            </OptionGroup>
          </Select>
          <Divider plain>{{ $t('preset') }}{{ $t('output_items') }}</Divider>
          <Select
            v-model="selectedOutputFormItem"
            :disabled="isCheck === 'Y'"
            @on-change="changeOutputSelectedForm"
            multiple
            filterable
          >
            <Button type="success" @click="selectAll('output')" size="small" long>{{ $t('select_all') }}</Button>
            <OptionGroup v-for="item in formItemOptions" :label="item.description" :key="item.id">
              <Option
                v-for="attr in item.attributes"
                :value="attr.id"
                :disabled="selectedInputFormItem.includes(attr.id)"
                :key="attr.id"
                >{{ attr.description }}</Option
              >
            </OptionGroup>
          </Select>
          <Divider plain>{{ $t('custom_form') }}</Divider>
          <draggable
            class="dragArea"
            :list="customElement"
            :sort="isCheck !== 'Y'"
            :group="{ name: 'people', pull: 'clone', put: false }"
            :clone="cloneDog"
          >
            <div class="list-group-item-" style="width: 100%" v-for="element in customElement" :key="element.id">
              <Input v-if="element.elementType === 'input'" :placeholder="$t('t_input')" />
              <Input v-if="element.elementType === 'textarea'" type="textarea" :placeholder="$t('textare')" />
              <Select v-if="element.elementType === 'select'" :placeholder="$t('select')"></Select>
              <Select v-if="element.elementType === 'wecmdbEntity'" :placeholder="$t('tw_entity_data_items')"></Select>
              <DatePicker
                v-if="element.elementType === 'datePicker'"
                :type="element.type"
                :placeholder="$t('tw_date_picker')"
                style="width:100%"
              ></DatePicker>
              <div v-if="element.elementType === 'group'" style="width: 100%; height: 80px; border: 1px solid #5ea7f4">
                <span style="margin: 8px; color: #bbbbbb"> Item Group </span>
              </div>
            </div>
          </draggable>
        </div>
      </Col>
      <Col span="12" style="border: 1px solid #dcdee2; padding: 16px; width: 48%; margin: 0 4px">
        <div :style="{ height: MODALHEIGHT + 'px', overflow: 'auto', border: '1px solid #dcdee2;' }">
          <template v-for="(item, itemIndex) in finalElement">
            <div :key="itemIndex" style="border: 1px solid #dcdee2; margin-bottom: 8px; padding: 8px">
              <span v-if="itemIndex !== editItemGroupNameIndex">
                {{ item.itemGroupName }}
                <Button
                  @click.stop="editItemGroupName(itemIndex)"
                  type="primary"
                  size="small"
                  :disabled="isCheck === 'Y'"
                  ghost
                  icon="md-create"
                ></Button>
              </span>
              <span v-else>
                <p>GroupName &nbsp;<Input v-model="item.itemGroupName" style="width: 300px"></Input></p>
                <p style="display: inline-block">
                  GroupId &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <Input
                    :disabled="!(item.attrs.length === 0 || item.attrs[0].entity === '')"
                    v-model="item.itemGroup"
                    style="width: 300px"
                  ></Input>
                </p>
                <Button
                  @click.stop="confirmItemGroupName(itemIndex)"
                  type="primary"
                  size="small"
                  :disabled="isCheck === 'Y'"
                  ghost
                  icon="md-checkmark"
                ></Button>
              </span>
              <draggable class="dragArea" :list="item.attrs" :sort="isCheck !== 'Y'" group="people" @change="log(item)">
                <div
                  @click="selectElement(itemIndex, eleIndex)"
                  :class="['list-group-item-', element.isActive ? 'active-zone' : '']"
                  :style="{ width: (element.width / 24) * 100 + '%' }"
                  v-for="(element, eleIndex) in item.attrs"
                  :key="element.id"
                >
                  <div>
                    <Icon v-if="element.required === 'yes'" size="8" style="color: #ed4014" type="ios-medical" />
                    {{ element.title }}:
                  </div>
                  <Input
                    v-if="element.elementType === 'input'"
                    :disabled="element.isEdit === 'no'"
                    v-model="element.defaultValue"
                    placeholder=""
                    style="width: calc(100% - 30px)"
                  />
                  <Input
                    v-if="element.elementType === 'textarea'"
                    :disabled="element.isEdit === 'no'"
                    v-model="element.defaultValue"
                    type="textarea"
                    style="width: calc(100% - 30px)"
                  />
                  <Select
                    v-if="element.elementType === 'select'"
                    :disabled="element.isEdit === 'no'"
                    v-model="element.defaultValue"
                    style="width: calc(100% - 30px)"
                  ></Select>
                  <Select
                    v-if="element.elementType === 'wecmdbEntity'"
                    :disabled="element.isEdit === 'no'"
                    v-model="element.defaultValue"
                    style="width: calc(100% - 30px)"
                  ></Select>
                  <DatePicker
                    v-if="element.elementType === 'datePicker'"
                    style="width: calc(100% - 30px)"
                    :type="element.type"
                  ></DatePicker>
                  <Button
                    @click.stop="removeForm(itemIndex, eleIndex, element)"
                    type="error"
                    :disabled="isCheck === 'Y'"
                    size="small"
                    ghost
                    icon="ios-close"
                  ></Button>
                </div>
              </draggable>
            </div>
          </template>
        </div>
      </Col>
      <Col span="6" style="border: 1px solid #dcdee2">
        <div :style="{ height: MODALHEIGHT + 32 + 'px', overflow: 'auto' }">
          <Collapse v-model="openPanel">
            <Panel name="1">
              {{ $t('general_attributes') }}
              <div slot="content">
                <Form :label-width="80">
                  <FormItem :label="$t('field_name')">
                    <Input v-model="editElement.name" :disabled="isCheck === 'Y'" placeholder=""></Input>
                  </FormItem>
                  <FormItem :label="$t('display_name')">
                    <Input v-model="editElement.title" :disabled="isCheck === 'Y'" placeholder=""></Input>
                  </FormItem>
                  <FormItem :label="$t('data_type')">
                    <Select
                      v-model="editElement.elementType"
                      :disabled="true"
                      @on-change="editElement.defaultValue = ''"
                    >
                      <Option value="input">Input</Option>
                      <Option value="select">Select</Option>
                      <Option value="textarea">Textarea</Option>
                      <Option value="wecmdbEntity">{{ $t('tw_entity_data_items') }}</Option>
                    </Select>
                  </FormItem>
                  <FormItem
                    v-if="editElement.elementType === 'select' && editElement.entity === ''"
                    :label="$t('data_set')"
                  >
                    <Input v-model="editElement.dataOptions" :disabled="isCheck === 'Y'" placeholder="eg:a,b"></Input>
                  </FormItem>
                  <!--添加wecmdbEntity类型，根据选择配置生成url(用于获取下拉配置)-->
                  <FormItem v-if="editElement.elementType === 'wecmdbEntity'" :label="$t('data_source')">
                    <Select v-model="editElement.dataOptions" filterable :disabled="isCheck === 'Y'">
                      <Option v-for="i in allEntityList" :value="i" :key="i">{{ i }}</Option>
                    </Select>
                  </FormItem>
                  <!-- <FormItem label="标签">
                    <Input v-model="editElement.tag" placeholder=""></Input>
                  </FormItem> -->
                  <FormItem :label="$t('display')">
                    <RadioGroup v-model="editElement.inDisplayName">
                      <Radio label="yes" :disabled="isCheck === 'Y'">{{ $t('tw_yes') }}</Radio>
                      <Radio label="no" :disabled="isCheck === 'Y'">{{ $t('tw_no') }}</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem :label="$t('editable')">
                    <RadioGroup v-model="editElement.isEdit">
                      <Radio label="yes" :disabled="isCheck === 'Y'">{{ $t('tw_yes') }}</Radio>
                      <Radio label="no" :disabled="isCheck === 'Y'">{{ $t('tw_no') }}</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem :label="$t('required')">
                    <RadioGroup v-model="editElement.required">
                      <Radio label="yes" :disabled="isCheck === 'Y'">{{ $t('tw_yes') }}</Radio>
                      <Radio label="no" :disabled="isCheck === 'Y'">{{ $t('tw_no') }}</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem :label="$t('tw_default_empty')">
                    <RadioGroup v-model="editElement.defaultClear">
                      <Radio label="yes" :disabled="isCheck === 'Y'">{{ $t('tw_yes') }}</Radio>
                      <Radio label="no" :disabled="isCheck === 'Y'">{{ $t('tw_no') }}</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem :label="$t('defaults')">
                    <Input
                      v-model="editElement.defaultValue"
                      :disabled="isCheck === 'Y' || editElement.defaultClear === 'yes'"
                      placeholder=""
                    ></Input>
                  </FormItem>
                  <FormItem :label="$t('width')">
                    <Select v-model="editElement.width" :disabled="isCheck === 'Y'">
                      <Option :value="6">6</Option>
                      <Option :value="12">12</Option>
                      <Option :value="18">18</Option>
                      <Option :value="24">24</Option>
                    </Select>
                  </FormItem>
                </Form>
              </div>
            </Panel>
            <Panel name="2">
              {{ $t('extended_attributes') }}
              <div slot="content">
                <Form :label-width="80">
                  <FormItem :label="$t('validation_rules')">
                    <Input
                      v-model="editElement.regular"
                      :disabled="isCheck === 'Y'"
                      :placeholder="$t('only_supports_regular')"
                    ></Input>
                  </FormItem>
                </Form>
              </div>
            </Panel>
            <Panel name="3">
              {{ $t('data_item') }}
              <div slot="content">
                <Form :label-width="80">
                  <FormItem :label="$t('constraints')">
                    <Select v-model="editElement.isRefInside" :disabled="isCheck === 'Y'">
                      <Option value="yes">yes</Option>
                      <Option value="no">no</Option>
                    </Select>
                  </FormItem>
                </Form>
              </div>
            </Panel>
          </Collapse>
        </div>
      </Col>
    </Row>
    <div style="text-align: center; margin-top: 8px">
      <Button type="primary" @click="saveForm" :disabled="isCheck === 'Y'">{{ $t('save') }}</Button>
    </div>
  </div>
</template>

<script>
import {
  getSelectedForm,
  getUserRoles,
  saveTaskForm,
  getTaskFormDataByNodeId,
  getHandlerRoles,
  getAllDataModels
} from '@/api/server.js'
import draggable from 'vuedraggable'
export default {
  name: '',
  data () {
    return {
      MODALHEIGHT: 500,
      isCheck: 'N',
      nodeId: '',
      nodeData: null,
      openPanel: '',
      formData: {
        id: '',
        nodeDefId: '',
        nodeId: '',
        nodeDefName: '',
        name: '',
        description: '',
        useRoles: '',
        handler: '',
        items: [],
        expireDay: 1,
        updatedTime: ''
      },
      selectedEntities: [],
      entityOptions: [],
      expireDayOptions: [1, 2, 3, 4, 5, 6, 7],
      selectedInputFormItem: [],
      selectedOutputFormItem: [],
      cacheFormItemOptions: [], // 原始数据缓存
      formItemOptions: [], // 树形数据
      selectedFormItemOptions: [],
      useRolesOptions: [],
      handlerRolesOptions: [],

      customElement: [
        {
          id: 4,
          elementType: 'group',
          itemGroup: '',
          itemGroupName: ''
        },
        {
          id: 1,
          name: 'input',
          title: 'Input',
          elementType: 'input',
          defaultValue: '',
          defaultClear: 'no',
          // tag: '',
          itemGroup: '',
          itemGroupName: '',
          packageName: '',
          entity: '',
          width: 24,
          dataOptions: '',
          regular: '',
          inDisplayName: 'yes',
          isEdit: 'yes',
          multiple: 'N',
          selectList: [],
          isRefInside: 'no',
          required: 'no',
          isView: 'yes',
          isOutput: 'no',
          sort: 0,
          attrDefId: '',
          attrDefName: '',
          attrDefDataType: '',
          refEntity: '',
          refPackageName: ''
        },
        {
          id: 2,
          name: 'select',
          title: 'Select',
          elementType: 'select',
          defaultValue: '',
          defaultClear: 'no',
          // tag: '',
          itemGroup: '',
          itemGroupName: '',
          packageName: '',
          entity: '',
          width: 24,
          dataOptions: '',
          regular: '',
          inDisplayName: 'yes',
          isEdit: 'yes',
          multiple: 'N',
          selectList: [],
          isRefInside: 'no',
          required: 'no',
          isView: 'yes',
          isOutput: 'no',
          sort: 0,
          attrDefId: '',
          attrDefName: '',
          attrDefDataType: '',
          refEntity: '',
          refPackageName: ''
        },
        {
          id: 3,
          name: 'textarea',
          title: 'Textarea',
          elementType: 'textarea',
          defaultValue: '',
          defaultClear: 'no',
          // tag: '',
          itemGroup: '',
          itemGroupName: '',
          packageName: '',
          entity: '',
          width: 24,
          dataOptions: '',
          regular: '',
          inDisplayName: 'yes',
          isEdit: 'yes',
          multiple: 'N',
          selectList: [],
          isRefInside: 'no',
          required: 'no',
          isView: 'yes',
          isOutput: 'no',
          sort: 0,
          attrDefId: '',
          attrDefName: '',
          attrDefDataType: '',
          refEntity: '',
          refPackageName: ''
        },
        {
          id: 5,
          name: 'wecmdbEntity',
          title: 'WecmdbEntity',
          elementType: 'wecmdbEntity',
          defaultValue: '',
          defaultClear: 'no',
          // tag: '',
          itemGroup: '',
          itemGroupName: '',
          packageName: '',
          entity: '',
          width: 24,
          dataOptions: '',
          regular: '',
          inDisplayName: 'yes',
          isEdit: 'yes',
          multiple: 'N',
          selectList: [],
          isRefInside: 'no',
          required: 'no',
          isView: 'yes',
          isOutput: 'no',
          sort: 0,
          attrDefId: '',
          attrDefName: '',
          attrDefDataType: '',
          refEntity: '',
          refPackageName: ''
        }
      ],
      editItemGroupNameIndex: null,
      finalElement: [],
      editElement: {
        attrDefDataType: '',
        attrDefId: '',
        attrDefName: '',
        defaultValue: '',
        defaultClear: 'no',
        // tag: '',
        itemGroup: '',
        itemGroupName: '',
        packageName: '',
        entity: '',
        elementType: 'input',
        id: 0,
        inDisplayName: 'yes',
        isEdit: 'yes',
        multiple: 'N',
        selectList: [],
        isRefInside: 'no',
        required: 'no',
        isOutput: 'no',
        isView: 'yes',
        name: '',
        regular: '',
        sort: 0,
        title: '',
        width: 24,
        dataOptions: '',
        refEntity: '',
        refPackageName: ''
      },
      activeTag: {
        itemGroupIndex: -1,
        attrIndex: -1
      },
      specialId: '',
      allEntityList: []
    }
  },
  props: ['currentNode', 'node', 'requestTemplateId'],
  mounted () {
    this.MODALHEIGHT = document.body.scrollHeight - 480
    this.nodeId = this.currentNode
    this.nodeData = this.node
    this.initPage()
    this.getAllDataModels()
  },
  watch: {
    selectedEntities: function (val) {
      this.formItemOptions = this.cacheFormItemOptions.filter(c => val.includes(c.name))
      let canSelect = []
      this.formItemOptions.forEach(f => {
        f.attributes.forEach(attr => {
          canSelect.push(attr.id)
        })
      })
    }
  },
  methods: {
    // 获取wecmdb下拉类型entity值
    async getAllDataModels () {
      const { data, status } = await getAllDataModels()
      if (status === 'OK') {
        this.allEntityList = []
        const sortData = data.map(_ => {
          return {
            ..._,
            entities: _.entities.sort(function (a, b) {
              var s = a.name.toLowerCase()
              var t = b.name.toLowerCase()
              if (s < t) return -1
              if (s > t) return 1
            })
          }
        })
        sortData.forEach(i => {
          i.entities.forEach(j => {
            this.allEntityList.push(`${j.packageName}:${j.name}`)
          })
        })
      }
    },
    selectAll (type) {
      if (type === 'input') {
        this.formItemOptions.forEach(itemOptions => {
          itemOptions.attributes.forEach(attr => {
            if (!this.selectedInputFormItem.includes(attr.id) && !this.selectedOutputFormItem.includes(attr.id)) {
              this.selectedInputFormItem.push(attr.id)
            }
          })
        })
        this.changeInputSelectedForm()
      } else {
        this.formItemOptions.forEach(itemOptions => {
          itemOptions.attributes.forEach(attr => {
            if (!this.selectedInputFormItem.includes(attr.id) && !this.selectedOutputFormItem.includes(attr.id)) {
              this.selectedOutputFormItem.push(attr.id)
            }
          })
        })
        this.changeOutputSelectedForm()
      }
    },
    editItemGroupName (index) {
      this.editItemGroupNameIndex = index
    },
    confirmItemGroupName (index) {
      let editGroup = this.finalElement[index]
      editGroup.attrs.forEach(attr => {
        attr.itemGroupName = editGroup.itemGroupName
        attr.itemGroup = editGroup.itemGroup
      })
      this.editItemGroupNameIndex = null
    },
    log (log) {
      this.finalElement.forEach(l => {
        l.attrs.forEach(attr => {
          attr.itemGroup = l.itemGroup
          attr.itemGroupName = l.itemGroupName
          if (attr.id === this.specialId) {
            this.editElement = attr
            this.openPanel = '1'
          }
        })
      })
    },
    initData (currentNode, node, requestTemplateId, isCheck) {
      this.isCheck = isCheck
      this.nodeId = currentNode
      this.nodeData = node
      this.initPage()
    },
    async initPage () {
      if (this.nodeData.nodeId === this.nodeId) {
        this.formData.nodeDefId = this.nodeData.nodeDefId
        this.formData.nodeId = this.nodeData.nodeId
        this.formData.nodeDefName = this.nodeData.nodeName
        this.getUserRoles()
        this.getHandlerRoles()
        await this.getSelectedForm()
        this.getTaskFormDataByNodeId()
      }
    },
    async getHandlerRoles () {
      const params = {
        params: {
          roles: this.formData.useRoles
        }
      }
      const { statusCode, data } = await getHandlerRoles(params)
      if (statusCode === 'OK') {
        this.handlerRolesOptions = data.map(d => {
          return {
            displayName: d,
            id: d
          }
        })
      }
    },
    async getTaskFormDataByNodeId () {
      if (!!this.requestTemplateId === false) {
        return
      }
      this.finalElement = []
      // this.selectedEntities = []
      const { statusCode, data } = await getTaskFormDataByNodeId(this.requestTemplateId, this.formData.nodeDefId)
      if (statusCode === 'OK') {
        this.formData = { ...data }
        this.formData.useRoles = data.useRoles && data.useRoles[0]
        this.getHandlerRoles()
        this.formData.nodeDefId = this.nodeData.nodeDefId
        this.formData.nodeId = this.nodeData.nodeId
        this.formData.nodeDefName = this.nodeData.nodeName
        if (data.items && data.items.length > 0) {
          data.items.sort(this.compare('sort'))
          this.selectedFormItem = data.items.filter(item => item.attrDefId !== '')
          this.selectedFormItem.forEach(sForm => {
            if (!this.selectedEntities.includes(sForm.entity)) {
              this.selectedEntities.push(sForm.entity)
            }
          })
          this.selectedInputFormItem = this.selectedFormItem
            .filter(item => item.isOutput === 'no')
            .map(attr => attr.attrDefId)
          this.selectedOutputFormItem = this.selectedFormItem
            .filter(item => item.isOutput === 'yes')
            .map(attr => attr.attrDefId)
        }
        if (data.items !== null && data.items.length > 0) {
          let itemGroupSet = new Set()
          data.items.forEach(item => {
            if (itemGroupSet.has(item.itemGroup)) {
              let exitEle = this.finalElement.find(ele => ele.itemGroup === item.itemGroup)
              exitEle.attrs.push(item)
            } else {
              itemGroupSet.add(item.itemGroup)
              this.finalElement.unshift({
                itemGroup: item.itemGroup,
                itemGroupName: item.itemGroupName,
                attrs: [item]
              })
            }
          })
        }
      }
    },
    compare (prop) {
      return function (obj1, obj2) {
        var val1 = obj1[prop]
        var val2 = obj2[prop]
        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
          val1 = Number(val1)
          val2 = Number(val2)
        }
        if (val1 < val2) {
          return -1
        } else if (val1 > val2) {
          return 1
        } else {
          return 0
        }
      }
    },
    async saveForm () {
      if (this.formData.name === '') {
        this.$Notice.warning({
          title: this.$t('warning'),
          desc: this.$t('name') + ' ' + this.$t('can_not_be_empty')
        })
        return
      }
      let tmp = [].concat(...JSON.parse(JSON.stringify(this.finalElement)).map(l => l.attrs))
      tmp.forEach((l, index) => {
        l.sort = index
        if (!isNaN(l.id) || l.id.startsWith('c_')) {
          l.id = ''
        }
      })
      let cloneFormData = JSON.parse(JSON.stringify(this.formData))
      cloneFormData.useRoles = [cloneFormData.useRoles]
      tmp.sort(this.compare('sort'))
      let res = {
        ...cloneFormData,
        items: tmp
      }
      const { statusCode, data } = await saveTaskForm(this.requestTemplateId, res)
      if (statusCode === 'OK') {
        this.$Notice.success({
          title: this.$t('successful'),
          desc: this.$t('successful')
        })
        this.formData = { ...data }
        this.formData.useRoles = data.useRoles[0]
        this.getHandlerRoles()
        data.items.forEach(item => {
          let findAttrs = this.finalElement.find(l => l.itemGroup === item.itemGroup)
          let findAttr = findAttrs.attrs.find(attr => attr.name === item.name)
          findAttr.id = item.id
        })
      }
    },
    changeInputSelectedForm () {
      let remove = []
      const test1 = []
        .concat(...this.finalElement.map(l => l.attrs))
        .filter(l => l.entity !== '')
        .map(m => m.attrDefId)
      const allSelectedFormItem = this.selectedInputFormItem.concat(this.selectedOutputFormItem)
      test1.forEach(t => {
        let tmp = t
        if (!allSelectedFormItem.includes(tmp)) {
          remove.push(tmp)
        }
      })
      remove.forEach(r => {
        let findTag = this.selectedFormItemOptions.find(xItem => xItem.id === r)
        let findAttr = this.finalElement.find(l => l.itemGroup === findTag.entityPackage + ':' + findTag.entityName)
          .attrs
        const findIndex = findAttr.findIndex(l => l.attrDefId === r)
        findAttr.splice(findIndex, 1)
      })

      this.selectedInputFormItem.forEach(item => {
        const seleted = this.selectedFormItemOptions.find(xItem => xItem.id === item)
        let itemGroup = seleted.entityPackage + ':' + seleted.entityName
        const elementType = {
          str: 'input',
          ref: 'select'
        }
        const attr = {
          attrDefDataType: seleted.dataType,
          attrDefId: seleted.id,
          attrDefName: seleted.name,
          defaultValue: '',
          defaultClear: 'no',
          // tag: tag,
          itemGroup: itemGroup,
          itemGroupName: itemGroup,
          packageName: seleted.entityPackage,
          entity: seleted.entityName,
          elementType: elementType[seleted.dataType],
          id: 'c_' + seleted.id,
          inDisplayName: 'yes',
          isEdit: 'no',
          multiple: seleted.multiple,
          selectList: [],
          isRefInside: 'no',
          required: 'no',
          isOutput: 'no',
          isView: 'yes',
          name: seleted.name,
          regular: '',
          sort: 0,
          title: seleted.description,
          width: 24,
          dataOptions: seleted.dataOptions,
          refEntity: seleted.refEntityName,
          refPackageName: seleted.refPackageName
        }
        const tagExist = this.finalElement.find(l => l.itemGroup === itemGroup)
        if (tagExist) {
          const find = tagExist.attrs.find(attr => attr.attrDefId === item)
          if (!find) {
            tagExist.attrs.push(attr)
          }
        } else {
          this.finalElement.push({
            // tag: tag,
            itemGroup: itemGroup,
            itemGroupName: itemGroup,
            attrs: [attr]
          })
        }
      })
    },
    changeOutputSelectedForm () {
      let remove = []
      const test1 = []
        .concat(...this.finalElement.map(l => l.attrs))
        .filter(l => l.entity !== '')
        .map(m => m.attrDefId)
      const allSelectedFormItem = this.selectedInputFormItem.concat(this.selectedOutputFormItem)
      test1.forEach(t => {
        let tmp = t
        if (!allSelectedFormItem.includes(tmp)) {
          remove.push(tmp)
        }
      })
      remove.forEach(r => {
        let findTag = this.selectedFormItemOptions.find(xItem => xItem.id === r)
        let findAttr = this.finalElement.find(l => l.itemGroup === findTag.entityPackage + ':' + findTag.entityName)
          .attrs
        const findIndex = findAttr.findIndex(l => l.id === r)
        findAttr.splice(findIndex, 1)
      })
      this.selectedOutputFormItem.forEach(item => {
        const seleted = this.selectedFormItemOptions.find(xItem => xItem.id === item)
        let itemGroup = seleted.entityPackage + ':' + seleted.entityName
        const elementType = {
          str: 'input',
          ref: 'select'
        }
        const attr = {
          attrDefDataType: seleted.dataType,
          attrDefId: seleted.id,
          attrDefName: seleted.name,
          defaultValue: '',
          defaultClear: 'no',
          // tag: tag,
          itemGroup: itemGroup,
          itemGroupName: itemGroup,
          packageName: seleted.entityPackage,
          entity: seleted.entityName,
          elementType: elementType[seleted.dataType],
          id: seleted.id,
          inDisplayName: 'yes',
          isEdit: 'yes',
          multiple: 'N',
          selectList: [],
          isRefInside: 'no',
          required: 'no',
          isOutput: 'yes',
          isView: 'yes',
          name: seleted.name,
          regular: '',
          sort: 0,
          title: seleted.description,
          width: 24,
          dataOptions: seleted.dataOptions,
          refEntity: seleted.refEntityName,
          refPackageName: seleted.refPackageName
        }
        const tagExist = this.finalElement.find(l => l.itemGroup === itemGroup)
        if (tagExist) {
          const find = tagExist.attrs.find(attr => attr.attrDefId === item)
          if (!find) {
            tagExist.attrs.push(attr)
          }
        } else {
          this.finalElement.push({
            // tag: tag,
            itemGroup: itemGroup,
            itemGroupName: itemGroup,
            attrs: [attr]
          })
        }
      })
    },
    cloneDog (val) {
      const itemNo = this.generateRandomString()
      if (this.isCheck === 'Y') return
      if (val.elementType === 'group') {
        this.finalElement.push({
          itemGroup: 'itemGroup' + itemNo,
          itemGroupName: 'itemGroup' + itemNo,
          attrs: []
        })
        return
      }
      let newItem = JSON.parse(JSON.stringify(val))
      newItem.id = 'c_' + itemNo
      newItem.title = newItem.title + itemNo
      newItem.name = newItem.name + itemNo
      this.specialId = newItem.id
      return newItem
    },
    generateRandomString () {
      let result = ''
      for (let i = 0; i < 4; i++) {
        result += Math.floor(Math.random() * 10)
      }
      return result
    },
    selectElement (itemIndex, eleIndex) {
      if (this.activeTag.itemGroupIndex !== -1 && this.activeTag.attrIndex !== -1) {
        this.finalElement[this.activeTag.itemGroupIndex].attrs[this.activeTag.attrIndex].isActive = false
      }
      this.activeTag = {
        itemGroupIndex: itemIndex,
        attrIndex: eleIndex
      }
      this.editElement = this.finalElement[itemIndex].attrs[eleIndex]
      this.editElement.inDisplayName = this.editElement.inDisplayName || 'yes'
      this.editElement.isActive = true
      this.openPanel = '1'
    },
    removeForm (itemIndex, eleIndex, element) {
      this.finalElement[itemIndex].attrs.splice(eleIndex, 1)
      const outputIndex = this.selectedOutputFormItem.findIndex(i => i === element.attrDefId)
      if (outputIndex > -1) {
        const index = this.selectedOutputFormItem.findIndex(inputItem => inputItem === element.attrDefId)
        this.selectedOutputFormItem.splice(index, 1)
        return
      }
      const inputIndex = this.selectedInputFormItem.findIndex(i => i === element.attrDefId)
      if (inputIndex > -1) {
        const index = this.selectedInputFormItem.findIndex(inputItem => inputItem === element.attrDefId)
        this.selectedInputFormItem.splice(index, 1)
      }

      if (element.id === this.editElement.id) {
        this.openPanel = ''
      }
    },
    async getSelectedForm () {
      this.entityOptions = []
      const { statusCode, data } = await getSelectedForm(this.requestTemplateId)
      if (statusCode === 'OK') {
        let entitySet = new Set()
        let formItemOptions = []
        data.forEach(d => {
          const itemGroup = d.entityPackage + ':' + d.entityName
          if (entitySet.has(itemGroup)) {
            let find = formItemOptions.find(f => f.packageName + ':' + f.name === itemGroup)
            find.attributes.push(d)
          } else {
            entitySet.add(itemGroup)
            formItemOptions.push({
              description: d.entityDisplayName,
              displayName: d.entityDisplayName,
              id: d.entityId,
              name: d.entityName,
              packageName: d.entityPackage,
              attributes: [d]
            })
            this.entityOptions.push({
              label: d.entityDisplayName,
              value: d.entityName
            })
          }
        })
        this.cacheFormItemOptions = JSON.parse(JSON.stringify(formItemOptions))
        this.formItemOptions = formItemOptions.filter(f => this.selectedEntities.includes(f.name))
        this.selectedFormItemOptions = data
      }
    },
    async getUserRoles () {
      const { statusCode, data } = await getUserRoles()
      if (statusCode === 'OK') {
        this.useRolesOptions = data
      }
    }
  },
  components: {
    draggable
  }
}
</script>
<style>
.ivu-input[disabled],
fieldset[disabled] .ivu-input {
  color: #757575 !important;
}
.ivu-select-input[disabled] {
  color: #757575 !important;
  -webkit-text-fill-color: #757575 !important;
}
.ivu-select-disabled .ivu-select-selection {
  color: #757575 !important;
}
</style>
<style scoped lang="scss">
.active-zone {
  color: #338cf0;
}
.ivu-form-item {
  margin-bottom: 8px;
}
.list-group-item- {
  display: inline-block;
  margin: 2px 0;
}
</style>
