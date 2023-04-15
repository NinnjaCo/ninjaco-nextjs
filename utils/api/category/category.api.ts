import { ApiParam } from '../client'
import { Category, CategoryRequest } from '@/models/crud/category.model'
import CrudApi from '../crud/crud.api'

export class CategoryApi extends CrudApi<Category, CategoryRequest> {
  path = '/categories'
  constructor(param?: ApiParam) {
    super(param)
  }
}
