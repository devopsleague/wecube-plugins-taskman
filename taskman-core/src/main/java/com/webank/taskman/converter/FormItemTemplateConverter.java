package com.webank.taskman.converter;

import com.webank.taskman.base.BaseConverter;
import com.webank.taskman.domain.FormItemTemplate;
import com.webank.taskman.dto.req.FormItemTemplateSaveReqDto;
import com.webank.taskman.dto.FormItemTemplateDto;
import com.webank.taskman.dto.resp.FormItemTemplateRespDto;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", uses = {}, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface FormItemTemplateConverter extends BaseConverter<FormItemTemplateDto, FormItemTemplate> {

    FormItemTemplate toEntityBySaveReq(FormItemTemplateSaveReqDto req);

    FormItemTemplateRespDto toRespByEntity(FormItemTemplate formItemTemplate);

    List<FormItemTemplateRespDto> toRespByEntity( List<FormItemTemplate> formItemTemplate);


}