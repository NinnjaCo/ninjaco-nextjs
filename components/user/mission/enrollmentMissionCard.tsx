import { MissionEnrollment } from '@/models/crud/mission-enrollment.model'
import Image from 'next/image'
import suitCase from '@/images/suitCase.svg'

const MissionEnrollmentCard: React.FC<{ mission: MissionEnrollment }> = ({ mission }) => {
  return (
    <div className="bg-brand-50 w-fit h-fit rounded-lg p-2 flex flex-col gap-2 relative shadow-md">
      <div className="flex flex-col gap-2">
        <div className="bg-brand-100 rounded-t-lg px-10 w-44 h-32 relative">
          <Image
            className="bg-brand-200 border-2 border-brand-400 rounded w-52 h-32"
            src={mission.mission.image}
            style={{
              objectFit: 'contain',
            }}
            fill
            sizes="(max-width: 768px) 40vw,
              (max-width: 1200px) 50vw,
              60vw"
            alt="PP"
            placeholder="blur"
            blurDataURL={mission.mission.image}
          />
        </div>
        <div className="text-brand font-semibold text-sm">{mission.mission.title}</div>
        <div className=" flex gap-2">
          <Image src={suitCase} alt="suitcase" className="w-4 h-4" width={16} height={16} />
          <div className="text-brand-500 font-normal text-xs"> levels: </div>
          <div className="text-brand-500 font-normal text-xs">{mission.mission.levels.length}</div>
        </div>
      </div>
      {mission.completed ? (
        <div className=" bg-success-dark stroke-2 rounded-full w-6 h-6 flex items-center justify-center text-white absolute top-2 right-2 text-xs">
          ✓
        </div>
      ) : null}
    </div>
  )
}

export default MissionEnrollmentCard
