package models

type RequestTemplateTable struct {
	Id           string `json:"id" xorm:"id"`
	Group        string `json:"group" xorm:"group"`
	Name         string `json:"name" xorm:"name"`
	Description  string `json:"description" xorm:"description"`
	FormTemplate string `json:"formTemplate" xorm:"form_template"`
	Tags         string `json:"tags" xorm:"tags"`
	Status       string `json:"status" xorm:"status"`
	PackageName  string `json:"packageName" xorm:"package_name"`
	EntityName   string `json:"entityName" xorm:"entity_name"`
	ProcDefKey   string `json:"procDefKey" xorm:"proc_def_key"`
	ProcDefId    string `json:"procDefId" xorm:"proc_def_id"`
	ProcDefName  string `json:"procDefName" xorm:"proc_def_name"`
	CreatedBy    string `json:"createdBy" xorm:"created_by"`
	CreatedTime  string `json:"createdTime" xorm:"created_time"`
	UpdatedBy    string `json:"updatedBy" xorm:"updated_by"`
	UpdatedTime  string `json:"updatedTime" xorm:"updated_time"`
	EntityAttrs  string `json:"entityAttrs" xorm:"entity_attrs"`
	DelFlag      int    `json:"delFlag" xorm:"del_flag"`
}

type RequestTemplateGroupTable struct {
	Id          string `json:"id" xorm:"id"`
	Name        string `json:"name" xorm:"name" binding:"required"`
	Description string `json:"description" xorm:"description"`
	ManageRole  string `json:"manageRole" xorm:"manage_role" binding:"required"`
	CreatedBy   string `json:"createdBy" xorm:"created_by"`
	CreatedTime string `json:"createdTime" xorm:"created_time"`
	UpdatedBy   string `json:"updatedBy" xorm:"updated_by"`
	UpdatedTime string `json:"updatedTime" xorm:"updated_time"`
	DelFlag     int    `json:"delFlag" xorm:"del_flag"`
}

type RoleTable struct {
	Id          string `json:"id" xorm:"id"`
	DisplayName string `json:"displayName" xorm:"display_name"`
	UpdatedTime string `json:"updated_time" xorm:"updated_time"`
}

type RequestTemplateRoleTable struct {
	Id              string `json:"id" xorm:"id"`
	RequestTemplate string `json:"requestTemplate" xorm:"request_template"`
	Role            string `json:"role" xorm:"role"`
	RoleType        string `json:"roleType" xorm:"role_type"`
}

type CoreProcessQueryResponse struct {
	Status  string                 `json:"status"`
	Message string                 `json:"message"`
	Data    []*CodeProcessQueryObj `json:"data"`
}

type CodeProcessQueryObj struct {
	ExcludeMode     string `json:"excludeMode"`
	ProcDefId       string `json:"procDefId"`
	ProcDefKey      string `json:"procDefKey"`
	ProcDefName     string `json:"procDefName"`
	ProcDefVersion  string `json:"procDefVersion"`
	RootEntity      string `json:"rootEntity"`
	Status          string `json:"status"`
	CreatedTime     string `json:"createdTime"`
	CreatedUnixTime int64  `json:"-"`
	Tags            string `json:"tags"`
}

type RequestTemplateQueryObj struct {
	RequestTemplateTable
	MGMTRoles []*RoleTable `json:"mgmtRoles"`
	USERoles  []*RoleTable `json:"useRoles"`
}

type RequestTemplateUpdateParam struct {
	RequestTemplateTable
	MGMTRoles []string `json:"mgmtRoles"`
	USERoles  []string `json:"useRoles"`
}

type ProcEntityAttributeObj struct {
	Id             string `json:"id"`
	Name           string `json:"name"`
	Description    string `json:"description"`
	DataType       string `json:"dataType"`
	Mandatory      bool   `json:"mandatory"`
	RefPackageName string `json:"refPackageName"`
	RefEntityName  string `json:"refEntityName"`
	RefAttrName    string `json:"refAttrName"`
	ReferenceId    string `json:"referenceId"`
	Active         bool   `json:"active"`
}

type ProcEntity struct {
	Id          string                    `json:"id"`
	PackageName string                    `json:"packageName"`
	Name        string                    `json:"name"`
	Description string                    `json:"description"`
	DisplayName string                    `json:"displayName"`
	Attributes  []*ProcEntityAttributeObj `json:"attributes"`
}

type ProcDefObj struct {
	ProcDefId   string     `json:"procDefId"`
	ProcDefKey  string     `json:"procDefKey"`
	ProcDefName string     `json:"procDefName"`
	Status      string     `json:"status"`
	RootEntity  ProcEntity `json:"rootEntity"`
	CreatedTime string     `json:"createdTime"`
}

type ProcQueryResponse struct {
	Status  string        `json:"status"`
	Message string        `json:"message"`
	Data    []*ProcDefObj `json:"data"`
}

type ProcNodeObj struct {
	NodeId        string        `json:"nodeId"`
	NodeName      string        `json:"nodeName"`
	NodeType      string        `json:"nodeType"`
	NodeDefId     string        `json:"nodeDefId"`
	TaskCategory  string        `json:"taskCategory"`
	RoutineExp    string        `json:"routineExp"`
	ServiceId     string        `json:"serviceId"`
	ServiceName   string        `json:"serviceName"`
	BoundEntities []*ProcEntity `json:"boundEntities"`
}

type ProcNodeQueryResponse struct {
	Status  string         `json:"status"`
	Message string         `json:"message"`
	Data    []*ProcNodeObj `json:"data"`
}