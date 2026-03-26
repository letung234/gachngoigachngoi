import { SiteConfig } from 'src/types/config.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

const configApi = {
  // Get public site config (no auth required)
  getPublicConfig() {
    return http.get<SuccessResponse<SiteConfig>>('/site-config')
  }
}

export default configApi