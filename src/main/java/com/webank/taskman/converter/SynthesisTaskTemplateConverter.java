package com.webank.taskman.converter;

import com.webank.taskman.base.BaseConverter;
import com.webank.taskman.domain.TaskTemplate;
import com.webank.taskman.dto.resp.TaskTemplateByRoleResp;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;


@Mapper(componentModel = "spring",uses = {},unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface SynthesisTaskTemplateConverter extends BaseConverter<TaskTemplateByRoleResp, TaskTemplate> {

}