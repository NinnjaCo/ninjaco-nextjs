import { Course } from '@/models/crud/course.model'
import Image from 'next/image'
import profileIcon from '@/images/profileIcon.svg'
import suitCase from '@/images/suitCase.svg'

const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
  console.log(course)
  return (
    <div className="bg-brand-50 w-fit h-fit rounded-lg p-2 flex flex-col gap-2 relative shadow-md">
      <div className="flex flex-col gap-2 w-fit h-fit">
        <div className="bg-brand-100 rounded-t-lg px-10 w-44 h-32 relative">
          <Image
            className="bg-brand-200 border-2 border-brand-400 rounded w-52 h-32"
            src={course.image}
            style={{
              objectFit: 'contain',
            }}
            fill
            alt="PP"
            priority
          />
        </div>
        <div className="text-brand font-semibold text-sm">{course.title}</div>
        <div className=" flex gap-2">
          <Image src={suitCase} alt="suitcase" />
          <div className="text-brand-500 font-normal text-xs">missions:</div>
          <div className="text-brand-500 font-normal text-xs">{course.missions.length}</div>
        </div>
        <div className=" flex gap-2">
          <Image src={profileIcon} alt="suitcase" />
          <div className="text-brand-500 font-normal text-xs">age:</div>
          <div className="text-brand-500 font-normal text-xs">
            {course.ageRange ? course.ageRange[0] : ''}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseCard
