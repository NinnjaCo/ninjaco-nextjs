import { Course } from '@/models/crud/course.model'
import { Level } from '@/models/crud/level.model'
import { Mission } from '@/models/crud/mission.model'
import React from 'react'

interface Props {
  course: Course
  level: Level
  mission: Mission
}

const ArduinoLevel = ({ course, level, mission }: Props) => {
  return <div>ArduinoLevel</div>
}

export default ArduinoLevel