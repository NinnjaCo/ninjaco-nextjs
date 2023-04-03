import { AxiosInstance } from 'axios'
import { Session } from 'next-auth'
import { createClient } from './client'

/**
 * @interface ApiConfig passed to core api to create a client (axios) instance
 *
 * @enum {AxiosInstance} if the client is passed will be used (allows reuse)
 * @enum {Session} if a session is passed it it will be used to configure a new client
 * @enum {null} if null then a default client is returned
 */
export type ApiParam = Session | AxiosInstance | null

export class CoreApi {
  client: AxiosInstance

  constructor(param?: ApiParam) {
    if (typeof param === 'undefined' || param === null) {
      this.client = createClient()
    } else if (typeof param === 'object' && 'defaults' in param) {
      // default in param is a hack to check if it is an axios instance
      this.client = <AxiosInstance>(<unknown>param)
    } else {
      this.client = createClient(<Session>param)
    }
  }
}
