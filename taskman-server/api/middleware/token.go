package middleware

import (
	"fmt"
	"github.com/WeBankPartners/go-common-lib/token"
	"github.com/WeBankPartners/wecube-plugins-taskman/taskman-server/common/log"
	"github.com/WeBankPartners/wecube-plugins-taskman/taskman-server/models"
	"github.com/gin-gonic/gin"
	"net/http"
	"strings"
)

func GetRequestUser(c *gin.Context) string {
	return c.GetString("user")
}

func GetRequestRoles(c *gin.Context) []string {
	return c.GetStringSlice("roles")
}

var (
	whiteListUrl = map[string]struct{}{
		models.UrlPrefix + "/api/v1/login/seed":          {},
		models.UrlPrefix + "/api/v1/login":               {},
		models.UrlPrefix + "/api/v2/auth/roles":          {},
		models.UrlPrefix + "/api/v2/auth/roles/apply":    {},
		models.UrlPrefix + "/api/v2/auth/users/register": {},
	}
)

func isWhiteListUrl(url string) (result bool) {
	if paramIndex := strings.Index(url, "?"); paramIndex > 0 {
		url = url[:paramIndex]
	}
	_, result = whiteListUrl[url]
	return
}

func AuthCoreRequestToken() gin.HandlerFunc {
	return func(c *gin.Context) {
		if isWhiteListUrl(c.Request.RequestURI) {
			c.Next()
		} else {
			err := authCoreRequest(c)
			if err != nil {
				log.Logger.Error("Validate core token fail", log.Error(err))
				c.JSON(http.StatusUnauthorized, models.EntityResponse{Status: "ERROR", Message: "Core token validate fail "})
				c.Abort()
			} else {
				c.Next()
			}
		}
	}
}

func AuthCorePluginToken() gin.HandlerFunc {
	return func(c *gin.Context) {
		err := authCoreRequest(c)
		if err != nil {
			log.Logger.Error("Validate core token fail", log.Error(err))
			c.JSON(http.StatusOK, pluginInterfaceResultObj{ResultCode: "1", ResultMessage: "Token authority validate fail", Results: pluginInterfaceResultOutput{Outputs: []string{}}})
			c.Abort()
		} else {
			c.Next()
		}
	}
}

type pluginInterfaceResultObj struct {
	ResultCode    string                      `json:"resultCode"`
	ResultMessage string                      `json:"resultMessage"`
	Results       pluginInterfaceResultOutput `json:"results"`
}

type pluginInterfaceResultOutput struct {
	Outputs []string `json:"outputs"`
}

func authCoreRequest(c *gin.Context) error {
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" {
		return fmt.Errorf("can not find Request Header Authorization ")
	}
	authToken, err := token.DecodeJwtToken(authHeader, models.Config.Wecube.JwtSigningKey)
	if err != nil {
		return err
	}
	if authToken.User == "" {
		return fmt.Errorf("token content is illegal,main message is empty ")
	}
	c.Set("user", strings.ReplaceAll(authToken.User, " ", ""))
	var roles []string
	for _, v := range authToken.Roles {
		roles = append(roles, strings.ReplaceAll(v, " ", ""))
	}
	c.Set("roles", roles)
	return nil
}
