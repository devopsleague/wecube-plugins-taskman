package com.webank.taskman.dto.resp;


import java.util.ArrayList;
import java.util.List;

import com.webank.taskman.dto.RoleDto;

public class TaskTemplateRespDto {
    private String id;

    private String procDefId;

    private String procDefKey;

    private String procDefName;

    private String name;

    private String nodeName;

    private String nodeDefId;

    private String description;

    private List<RoleDto> useRoles = new ArrayList<>();

    private List<RoleDto> manageRoles = new ArrayList<>();

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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNodeName() {
        return nodeName;
    }

    public void setNodeName(String nodeName) {
        this.nodeName = nodeName;
    }

    public String getNodeDefId() {
        return nodeDefId;
    }

    public void setNodeDefId(String nodeDefId) {
        this.nodeDefId = nodeDefId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<RoleDto> getUseRoles() {
        return useRoles;
    }

    public void setUseRoles(List<RoleDto> useRoles) {
        this.useRoles = useRoles;
    }

    public List<RoleDto> getManageRoles() {
        return manageRoles;
    }

    public void setManageRoles(List<RoleDto> manageRoles) {
        this.manageRoles = manageRoles;
    }

    @Override
    public String toString() {
        return "TaskTemplateResp{" +
                "id='" + id + '\'' +
                ", procDefId='" + procDefId + '\'' +
                ", procDefKey='" + procDefKey + '\'' +
                ", procDefName='" + procDefName + '\'' +
                ", name='" + name + '\'' +
                ", nodeName='" + nodeName + '\'' +
                ", nodeDefId='" + nodeDefId + '\'' +
                ", description='" + description + '\'' +
                ", useRoles=" + useRoles +
                ", manageRoles=" + manageRoles +
                '}';
    }
}