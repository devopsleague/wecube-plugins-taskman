package com.webank.taskman.dto.req;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.util.List;

@ApiModel(value = "AddRequestInfoReq",description = "add RequestInfo req")
public class RequestInfoSaveReqDto {

    @ApiModelProperty(value = "主键",required = false,dataType = "String",position = 100)
    private String id;

    @ApiModelProperty(value = "请求模板id",required = true,dataType = "String",position = 101)
    private String requestTempId;

    @ApiModelProperty(value = "Existing data id,such as guid in cmdb",required = true,dataType = "String",position = 102)
    private String rootEntity;

    @ApiModelProperty(value = "紧急程度",required = true,dataType = "String",position = 103)
    private String emergency;

    @ApiModelProperty(value = "请求信息名称",required = true,dataType = "String",position = 103)
    private String name;

    @ApiModelProperty(value = "描述",required = false,dataType = "String",position = 104)
    private String description;

    @ApiModelProperty(value = "",required = false,position = 107)
    private String status;

    private List<FormItemInfoRequestDto> formItems;


    public String getId() {
        return id;
    }

    public RequestInfoSaveReqDto setId(String id) {
        this.id = id;
        return this;
    }

    public String getRequestTempId() {
        return requestTempId;
    }

    public RequestInfoSaveReqDto setRequestTempId(String requestTempId) {
        this.requestTempId = requestTempId;
        return this;
    }

    public String getRootEntity() {
        return rootEntity;
    }

    public RequestInfoSaveReqDto setRootEntity(String rootEntity) {
        this.rootEntity = rootEntity;
        return this;
    }

    public String getEmergency() {
        return emergency;
    }

    public RequestInfoSaveReqDto setEmergency(String emergency) {
        this.emergency = emergency;
        return this;
    }

    public String getName() {
        return name;
    }

    public RequestInfoSaveReqDto setName(String name) {
        this.name = name;
        return this;
    }

    public String getDescription() {
        return description;
    }

    public RequestInfoSaveReqDto setDescription(String description) {
        this.description = description;
        return this;
    }

    public String getStatus() {
        return status;
    }

    public RequestInfoSaveReqDto setStatus(String status) {
        this.status = status;
        return this;
    }

    public List<FormItemInfoRequestDto> getFormItems() {
        return formItems;
    }

    public RequestInfoSaveReqDto setFormItems(List<FormItemInfoRequestDto> formItems) {
        this.formItems = formItems;
        return this;
    }
}