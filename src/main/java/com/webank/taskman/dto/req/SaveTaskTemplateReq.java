package com.webank.taskman.dto.req;


import com.webank.taskman.constant.TemplateTypeEnum;
import com.webank.taskman.dto.RoleDTO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotBlank;
import java.util.List;

@ApiModel
public class SaveTaskTemplateReq {

    @ApiModelProperty(value = "主键",required = false,dataType = "String",position = 1)
    private String id;

    @NotBlank(message = "流程编排id不能为空")
    @ApiModelProperty(value = "流程编排id",required = true,dataType = "String",position = 2)
    private String procDefId;

    @NotBlank(message = "流程编排key不能为空")
    @ApiModelProperty(value = "流程编排key",required = true,dataType = "String",position = 3)
    private String procDefKey;

    @NotBlank(message = "流程编排名称不能为空")
    @ApiModelProperty(value = "流程编排名称",required = true,dataType = "String",position = 4)
    private String procDefName;

    @NotBlank(message = "流程节点不能为空")
    @ApiModelProperty(value = "节点Id",required = true,dataType = "String",position = 5)
    private String nodeDefId;

    @ApiModelProperty(value = "节点名称",required = true,dataType = "String",position = 6)
    private String nodeName;

    @NotBlank(message = "名称不能为空")
    @ApiModelProperty(value = "任务名称",required = true,dataType = "String",position = 7)
    private String name;

    @NotBlank(message = "描述不能为空")
    @ApiModelProperty(value = "任务描述",required = true,dataType = "String",position = 8)
    private String description;

    @ApiModelProperty(value = "使用角色集",required = false,position = 9)
    private List<RoleDTO> useRoles;

    @ApiModelProperty(value = "管理角色集",required = false,position = 10)
    private List<RoleDTO> manageRoles;

    @ApiModelProperty(value = "任务表单模板",required = false,position = 11)
    private SaveFormTemplateReq form;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getProcDefId() {
        return procDefId;
    }

    public void setProcDefId(String procDefId) {
        this.procDefId = procDefId;
    }

    public String getProcDefKey() {
        return procDefKey;
    }

    public void setProcDefKey(String procDefKey) {
        this.procDefKey = procDefKey;
    }

    public String getProcDefName() {
        return procDefName;
    }

    public void setProcDefName(String procDefName) {
        this.procDefName = procDefName;
    }

    public String getNodeDefId() {
        return nodeDefId;
    }

    public void setNodeDefId(String nodeDefId) {
        this.nodeDefId = nodeDefId;
    }

    public String getNodeName() {
        return nodeName;
    }

    public void setNodeName(String nodeName) {
        this.nodeName = nodeName;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<RoleDTO> getUseRoles() {
        return useRoles;
    }

    public void setUseRoles(List<RoleDTO> useRoles) {
        this.useRoles = useRoles;
    }

    public List<RoleDTO> getManageRoles() {
        return manageRoles;
    }

    public void setManageRoles(List<RoleDTO> manageRoles) {
        this.manageRoles = manageRoles;
    }

    public SaveFormTemplateReq getForm() {
        this.form.setTempType(TemplateTypeEnum.TASK.getType());
        return form;

    }

    public void setForm(SaveFormTemplateReq form) {
        this.form = form;
    }
}