export interface Course {
  title: string
  description: string
  image: string
  ageRange: string
  preRequisites: string
  objectives: string
  type: string
  //missions: Mission[]
}

export interface CourseRequest {
  title: string
  description: string
  image: string
  ageRange: string
  preRequisites: string
  objectives: string
  type: string
}
