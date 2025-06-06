package task

import (
	"encoding/json"
	"fmt"
	"github.com/WeBankPartners/wecube-plugins-taskman/taskman-server/api/middleware"
	"github.com/WeBankPartners/wecube-plugins-taskman/taskman-server/common/exterror"
	"github.com/WeBankPartners/wecube-plugins-taskman/taskman-server/common/log"
	"github.com/WeBankPartners/wecube-plugins-taskman/taskman-server/models"
	"github.com/WeBankPartners/wecube-plugins-taskman/taskman-server/service"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
	"io"
	"net/http"
)

func GetTaskFormStruct(c *gin.Context) {
	procInstId := c.Query("procInstId")
	nodeDefId := c.Query("nodeDefId")
	result, err := service.GetTaskFormStruct(procInstId, nodeDefId)
	if err != nil {
		result.Status = "ERROR"
		result.Message = err.Error()
	}
	log.Info(nil, log.LOGGER_APP, "task form struct", log.JsonObj("response", result))
	c.JSON(http.StatusOK, result)
}

func CreateTask(c *gin.Context) {
	response := models.PluginTaskCreateResp{ResultCode: "0", ResultMessage: "success", Results: models.PluginTaskCreateOutput{}}
	var err error
	defer func() {
		if err != nil {
			log.Error(nil, log.LOGGER_APP, "Task create handle fail", zap.Error(err))
			response.ResultCode = "1"
			response.ResultMessage = err.Error()
		}
		bodyBytes, _ := json.Marshal(response)
		c.Set("responseBody", string(bodyBytes))
		c.JSON(http.StatusOK, response)
	}()
	var param models.PluginTaskCreateRequest
	c.ShouldBindJSON(&param)
	if len(param.Inputs) == 0 {
		return
	}
	requestToken := c.GetHeader("Authorization")
	requestLanguage := c.GetHeader(middleware.AcceptLanguageHeader)
	if requestLanguage == "" {
		requestLanguage = "en"
	}
	for _, input := range param.Inputs {
		output, _, tmpErr := service.PluginTaskCreateNew(input, param.RequestId, param.DueDate, param.AllowedOptions, requestToken, requestLanguage)
		if tmpErr != nil {
			output.ErrorCode = "1"
			output.ErrorMessage = tmpErr.Error()
			err = tmpErr
		}
		response.Results.Outputs = append(response.Results.Outputs, output)
	}
}

func SaveTaskForm(c *gin.Context) {
	taskId := c.Param("taskId")
	var param models.TaskApproveParam
	var task models.TaskTable
	var operator = middleware.GetRequestUser(c)
	if err := c.ShouldBindJSON(&param); err != nil {
		middleware.ReturnParamValidateError(c, err)
		return
	}
	var err error
	for _, v := range param.FormData {
		tmpErr := validateFormRequire(v)
		if tmpErr != nil {
			err = tmpErr
			break
		}
	}
	if err == nil {
		err = service.ValidateRequestForm(param.FormData, c.GetHeader("Authorization"))
	}
	if err != nil {
		middleware.ReturnParamValidateError(c, err)
		return
	}
	task, err = service.GetSimpleTask(taskId)
	if err != nil {
		middleware.ReturnServerHandleError(c, err)
		return
	}
	err = service.SaveTaskFormNew(&task, operator, &param)
	if err != nil {
		middleware.ReturnServerHandleError(c, err)
	} else {
		service.GetOperationLogService().RecordTaskLog(taskId, task.Name, operator, "saveTask", c.Request.RequestURI, c.GetString("requestBody"))
		middleware.ReturnSuccess(c)
	}
}

func validateFormRequire(param *models.RequestPreDataTableObj) error {
	var err error
	requireMap := make(map[string]int)
	for _, v := range param.Title {
		if v.Required == "yes" {
			requireMap[v.Name] = 1
		}
	}
	for _, v := range param.Value {
		for dataKey, dataValue := range v.EntityData {
			if _, b := requireMap[dataKey]; b {
				if dataValue == nil {
					err = fmt.Errorf("form:%s:%s data:%s can not empty ", v.PackageName, v.EntityName, dataKey)
				} else {
					if fmt.Sprintf("%s", dataValue) == "" {
						err = fmt.Errorf("form:%s:%s data:%s can not empty ", v.PackageName, v.EntityName, dataKey)
					}
				}
			}
			if err != nil {
				break
			}
		}
		if err != nil {
			break
		}
	}
	return err
}

func ApproveTask(c *gin.Context) {
	taskId := c.Param("taskId")
	var param models.TaskApproveParam
	if err := c.ShouldBindJSON(&param); err != nil {
		middleware.ReturnParamValidateError(c, err)
		return
	}
	var err error
	var operator = middleware.GetRequestUser(c)
	var taskHandle *models.TaskHandleTable
	var taskHandleTemplate *models.TaskHandleTemplateTable
	var request models.RequestTable
	var handleMode string
	for _, v := range param.FormData {
		// 敏感数据解密
		if err = service.HandleSensitiveDataDecode(v); err != nil {
			middleware.ReturnServerHandleError(c, err)
			return
		}
		tmpErr := validateFormRequire(v)
		if tmpErr != nil {
			err = tmpErr
			break
		}
	}
	if err == nil {
		err = service.ValidateRequestForm(param.FormData, c.GetHeader("Authorization"))
	}
	if err != nil {
		middleware.ReturnParamValidateError(c, err)
		return
	}
	taskTable, getTaskErr := service.GetSimpleTask(taskId)
	if getTaskErr != nil {
		middleware.ReturnParamValidateError(c, getTaskErr)
		return
	}
	if taskTable.Status == string(models.TaskStatusDone) {
		middleware.ReturnError(c, exterror.New().TemplateApproveCompleteError)
		return
	}
	if taskTable.Request == "" {
		if err = service.ApproveCustomTask(taskTable, operator, c.GetHeader("Authorization"), c.GetHeader(middleware.AcceptLanguageHeader), param); err != nil {
			middleware.ReturnServerHandleError(c, err)
			return
		}
		middleware.ReturnSuccess(c)
		return
	}
	if request, err = service.GetSimpleRequest(taskTable.Request); err != nil {
		middleware.ReturnServerHandleError(c, err)
	}
	if request.Status == string(models.RequestStatusDraft) {
		middleware.ReturnError(c, exterror.New().RequestHandleError)
		return
	}
	if param.TaskHandleId == "" {
		err = fmt.Errorf("param taskHandleId is empty")
		middleware.ReturnParamValidateError(c, err)
		return
	}
	taskHandle, err = service.GetTaskHandleService().GetIgnoreDeleted(param.TaskHandleId)
	if err != nil {
		middleware.ReturnServerHandleError(c, err)
		return
	}
	if taskHandle == nil {
		middleware.ReturnParamValidateError(c, fmt.Errorf("taskHandleId is invalid"))
		return
	}
	if taskHandle.LatestFlag == 0 {
		middleware.ReturnUpdateRequestHandlerStatusError(c)
		return
	}
	if taskHandle.Handler != operator {
		middleware.ReturnTaskApproveNotPermissionError(c)
		return
	}
	if taskHandle.TaskHandleTemplate != "" {
		if taskHandleTemplate, err = service.GetTaskTemplateService().GetTaskHandleTemplate(taskHandle.TaskHandleTemplate); err != nil {
			middleware.ReturnServerHandleError(c, err)
			return
		}
		if taskHandleTemplate != nil {
			handleMode = taskHandleTemplate.HandleMode
		}
	}
	err = service.ApproveTask(taskTable, operator, c.GetHeader("Authorization"), c.GetHeader(middleware.AcceptLanguageHeader), handleMode, param)
	if err != nil {
		middleware.ReturnServerHandleError(c, err)
	} else {
		service.GetOperationLogService().RecordTaskLog(taskId, taskTable.Name, operator, "approveTask", c.Request.RequestURI, c.GetString("requestBody"))
		middleware.ReturnSuccess(c)
	}
}

func ChangeTaskStatus(c *gin.Context) {
	taskId := c.Param("taskId")
	operation := c.Param("operation")
	lastedUpdateTime := c.Param("latestUpdateTime")
	if operation != "mark" && operation != "start" && operation != "quit" && operation != "give" {
		middleware.ReturnChangeTaskStatusError(c)
		return
	}
	taskObj, err := service.ChangeTaskStatus(taskId, middleware.GetRequestUser(c), operation, lastedUpdateTime)
	if err != nil {
		middleware.ReturnServerHandleError(c, err)
		return
	}
	service.GetOperationLogService().RecordTaskLog(taskId, "", middleware.GetRequestUser(c), "changeTaskStatus", c.Request.RequestURI, operation)
	middleware.ReturnData(c, taskObj)
}

// UpdateTaskHandle 更新任务处理节点
func UpdateTaskHandle(c *gin.Context) {
	var param models.TaskHandleUpdateParam
	var err error
	if err = c.ShouldBindJSON(&param); err != nil {
		middleware.ReturnParamValidateError(c, err)
		return
	}
	if param.TaskId == "" || param.TaskHandleId == "" {
		middleware.ReturnParamEmptyError(c, "taskId or taskHandleId")
		return
	}
	err = service.UpdateTaskHandle(param, middleware.GetRequestUser(c), c.GetHeader("Authorization"), c.GetHeader(middleware.AcceptLanguageHeader))
	if err != nil {
		middleware.ReturnServerHandleError(c, err)
		return
	}
	service.GetOperationLogService().RecordTaskLog(param.TaskId, "", middleware.GetRequestUser(c), "changeTaskStatus", c.Request.RequestURI, middleware.GetRequestUser(c))
	middleware.ReturnSuccess(c)
}

func UploadTaskAttachFile(c *gin.Context) {
	taskId := c.Param("taskId")
	taskHandleId := c.Param("taskHandleId")
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ResponseErrorJson{StatusCode: "PARAM_HANDLE_ERROR", StatusMessage: "Http read upload file fail:" + err.Error(), Data: nil})
		return
	}
	if file.Size > models.UploadFileMaxSize {
		middleware.ReturnUploadFileTooLargeError(c)
		return
	}
	f, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ResponseErrorJson{StatusCode: "PARAM_HANDLE_ERROR", StatusMessage: "File open error:" + err.Error(), Data: nil})
		return
	}
	b, err := io.ReadAll(f)
	defer f.Close()
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ResponseErrorJson{StatusCode: "PARAM_HANDLE_ERROR", StatusMessage: "Read content fail error:" + err.Error(), Data: nil})
		return
	}
	err = service.UploadAttachFile("", taskId, taskHandleId, file.Filename, middleware.GetRequestUser(c), b)
	if err != nil {
		middleware.ReturnServerHandleError(c, err)
	} else {
		service.GetOperationLogService().RecordTaskLog(taskId, "", middleware.GetRequestUser(c), "uploadTaskFile", c.Request.RequestURI, file.Filename)
		middleware.ReturnData(c, service.GetAttachFileListByTaskHandleId(taskHandleId))
	}
}
