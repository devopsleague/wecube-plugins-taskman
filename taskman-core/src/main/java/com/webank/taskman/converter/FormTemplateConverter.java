package com.webank.taskman.converter;

import com.webank.taskman.base.BaseConverter;
import com.webank.taskman.domain.FormTemplate;
import com.webank.taskman.dto.req.FormTemplateSaveReqDto;
import com.webank.taskman.dto.resp.FormTemplateRespDto;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring",uses = {},unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface FormTemplateConverter extends BaseConverter<FormTemplateRespDto, FormTemplate> {

    FormTemplate reqToDomain(FormTemplateSaveReqDto req);

}