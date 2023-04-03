import { ApiParam } from '@/api/client'
import { Test, TestRequest } from '@/models/crud/test'
import CrudApi from './crud.api'

export class TestApi extends CrudApi<Test, TestRequest> {
  constructor(param?: ApiParam) {
    super(param)
    this.setPath('/tests')
  }
}
