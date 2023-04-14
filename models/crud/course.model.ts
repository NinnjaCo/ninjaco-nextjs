enum CourseType {
  ARDUINO = 'ARDUINO',
  HTML = 'HTML',
}
export interface Course {
  courseType: CourseType
  courseTitle: string
  courseImage: string
  courseDescription: string
  courseAgeRange?: string[]
  coursePrerequisites?: string[]
  courseObjectives?: string[]
  //missions: Mission[]
}

export interface CourseRequest {
  courseType: CourseType
  courseTitle: string
  courseImage: string
  courseDescription: string
  courseAgeRange?: string[]
  coursePrerequisites?: string[]
  courseObjectives?: string[]
}
