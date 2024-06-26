package models

type TaskTemplateTable struct {
	Id              string `json:"id" xorm:"'id' pk" primary-key:"id"`
	Name            string `json:"name" xorm:"name"`
	Description     string `json:"description" xorm:"description"`
	FormTemplate    string `json:"formTemplate" xorm:"form_template"`
	RequestTemplate string `json:"requestTemplate" xorm:"request_template"`
	NodeId          string `json:"nodeId" xorm:"node_id"`
	NodeDefId       string `json:"nodeDefId" xorm:"node_def_id"`
	NodeName        string `json:"nodeName" xorm:"node_name"`
	ExpireDay       int    `json:"expireDay" xorm:"expire_day"`
	Handler         string `json:"handler" xorm:"handler"`
	CreatedBy       string `json:"createdBy" xorm:"created_by"`
	CreatedTime     string `json:"createdTime" xorm:"created_time"`
	UpdatedBy       string `json:"updatedBy" xorm:"updated_by"`
	UpdatedTime     string `json:"updatedTime" xorm:"updated_time"`
	DelFlag         int    `json:"delFlag" xorm:"del_flag"`
	Sort            int    `json:"sort" xorm:"sort"`
	HandleMode      string `json:"handleMode" xorm:"handle_mode"`
	Type            string `json:"type" xorm:"type"`
}

func (TaskTemplateTable) TableName() string {
	return "task_template"
}

type TaskTemplateRoleTable struct {
	Id           string `json:"id" xorm:"id"`
	TaskTemplate string `json:"taskTemplate" xorm:"task_template"`
	Role         string `json:"role" xorm:"role"`
	RoleType     string `json:"roleType" xorm:"role_type"`
}

type TaskTemplateDto struct {
	Id              string                   `json:"id"`
	Type            string                   `json:"type"`
	NodeId          string                   `json:"nodeId"`
	NodeDefId       string                   `json:"nodeDefId"`
	NodeDefName     string                   `json:"nodeDefName"`
	Name            string                   `json:"name"`
	Description     string                   `json:"description"`
	ExpireDay       int                      `json:"expireDay"`
	UpdatedTime     string                   `json:"updatedTime"`
	UpdatedBy       string                   `json:"updatedBy"`
	RequestTemplate string                   `json:"requestTemplate"`
	Sort            int                      `json:"sort"`
	HandleMode      string                   `json:"handleMode"`
	HandleTemplates []*TaskHandleTemplateDto `json:"handleTemplates"`
}

type TaskTemplateProgressDto struct {
	Id          string `json:"id"`
	Type        string `json:"type"`
	Node        string `json:"node"`
	Handler     string `json:"handler"`
	Role        string `json:"role"`
	Status      int    `json:"status"`      // 状态值：1 进行中 2.未开始  3.已完成  4.报错被拒绝了
	ApproveType string `json:"approveType"` // 审批类型:custom.单人自定义 any.协同 all.并行
	Sort        int    `json:"sort"`        // 排序
}

type TaskTemplateIdObj struct {
	Id        string `json:"id"`
	Sort      int    `json:"sort"`
	Name      string `json:"name"`
	NodeDefId string `json:"nodeDefId"`
}

type TaskTemplateCreateResponse struct {
	TaskTemplate *TaskTemplateDto     `json:"taskTemplate"`
	Ids          []*TaskTemplateIdObj `json:"ids"`
}

type TaskTemplateDeleteResponse struct {
	Type string               `json:"type"`
	Ids  []*TaskTemplateIdObj `json:"ids"`
}

type TaskTemplateListIdsResponse struct {
	Type      string               `json:"type"`
	ProcDefId string               `json:"procDefId"`
	Ids       []*TaskTemplateIdObj `json:"ids"`
}

type TaskTemplateProgressDtoSort []*TaskTemplateProgressDto

func (s TaskTemplateProgressDtoSort) Len() int {
	return len(s)
}

func (s TaskTemplateProgressDtoSort) Swap(i, j int) {
	s[i], s[j] = s[j], s[i]
}

func (s TaskTemplateProgressDtoSort) Less(i, j int) bool {
	return s[i].Sort < s[j].Sort
}

type TaskTemplateTableSort []*TaskTemplateTable

func (s TaskTemplateTableSort) Len() int {
	return len(s)
}

func (s TaskTemplateTableSort) Swap(i, j int) {
	s[i], s[j] = s[j], s[i]
}

func (s TaskTemplateTableSort) Less(i, j int) bool {
	return s[i].Sort < s[j].Sort
}
