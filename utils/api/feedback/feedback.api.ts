import { ApiParam } from '../client'
import { Feedback, FeedbackRequest } from '@/models/crud/feedback.model'
import CrudApi from '../crud/crud.api'

export class FeedbackApi extends CrudApi<Feedback, FeedbackRequest> {
  path = '/feedbacks'
  constructor(param?: ApiParam) {
    super(param)
  }
}
