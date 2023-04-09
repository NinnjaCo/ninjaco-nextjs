import { ApiParam, CoreApi } from '../client'
import { User } from 'next-auth'
import { UserRequest } from '@/models/crud'
import CrudApi from '../crud/crud.api'

export class UserApi extends CrudApi<User, UserRequest> {
  path = '/users'
  constructor(param?: ApiParam) {
    super(param)
  }
}
