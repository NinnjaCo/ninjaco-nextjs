import { Course } from '@/models/crud/course.model'
import { CourseEnrollment } from '@/models/crud/course-enrollment.model'
import Image from 'next/image'
import profileIcon from '@/images/profileIcon.svg'
import suitCase from '@/images/suitCase.svg'

const enrollmentCourseCard: React.FC<{ course: CourseEnrollment }> = ({ course }) => {
  return (
    <div className="bg-brand-50 w-fit h-fit rounded-lg p-2 flex flex-col gap-2 relative shadow-md">
      <div className="flex flex-col gap-2 w-fit h-fit">
        <div className="bg-brand-100 rounded-t-lg px-10 w-44 h-32 relative">
          <Image
            className="bg-brand-200 border-2 border-brand-400 rounded w-52 h-32"
            src={course.course.image}
            style={{
              objectFit: 'contain',
            }}
            fill
            sizes="(max-width: 768px) 40vw,
              (max-width: 1200px) 50vw,
              60vw"
            alt="PP"
            placeholder="blur"
            blurDataURL={course.course.image}
          />
          {course.completed ? (
            <div className=" bg-success-dark stroke-2 rounded-full w-6 h-6 flex items-center justify-center text-white absolute top-2 right-2 text-xs">
              ✓
            </div>
          ) : null}
        </div>
        <div className="text-brand font-semibold text-sm">{course.course.title}</div>
        <div className=" flex gap-2">
          <Image src={suitCase} alt="suitcase" className="w-4 h-4" width={16} height={16} />
          <div className="text-brand-500 font-normal text-xs">missions:</div>
          <div className="text-brand-500 font-normal text-xs">{course.course.missions.length}</div>
        </div>
        <div className=" flex gap-2">
          <Image src={profileIcon} alt="age" className="w-4 h-4" width={16} height={16} />
          <div className="text-brand-500 font-normal text-xs">age:</div>
          <div className="text-brand-500 font-normal text-xs">
            {course.course.ageRange ? course.course.ageRange[0] : ''}
          </div>
        </div>
      </div>
    </div>
  )
}

export default enrollmentCourseCard
