package com.webank.taskman.service;


import com.baomidou.mybatisplus.extension.service.IService;
import com.webank.taskman.base.QueryResponse;
import com.webank.taskman.domain.TaskTemplate;
import com.webank.taskman.dto.req.TemplateQueryReqDto;
import com.webank.taskman.dto.req.TaskTemplateSaveReqDto;
import com.webank.taskman.dto.resp.TaskTemplateByRoleRespDto;
import com.webank.taskman.dto.resp.TaskTemplateResp;

public interface TaskTemplateService extends IService<TaskTemplate> {

    TaskTemplateResp saveTaskTemplateByReq(TaskTemplateSaveReqDto taskTemplateReq);

    TaskTemplateResp taskTemplateDetail(String id);

    QueryResponse<TaskTemplateByRoleRespDto> selectTaskTemplatePage(Integer page, Integer pageSize, TemplateQueryReqDto req);
}