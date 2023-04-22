import { Mission } from '@/models/crud/mission.model'
import Image from 'next/image'
import suitCase from '@/images/suitCase.svg'

const MissionCard: React.FC<{ mission: Mission }> = ({ mission }) => {
  return (
    <div className="bg-brand-50 w-fit h-fit rounded-lg p-2 flex flex-col gap-2 relative shadow-md">
      <div className="flex flex-col gap-2">
        <div className="bg-brand-100 rounded-t-lg px-10 w-44 h-32 relative">
          <Image
            className="bg-brand-200 border-2 border-brand-400 rounded w-52 h-32"
            src={mission.image}
            style={{
              objectFit: 'contain',
            }}
            fill
            sizes="(max-width: 768px) 40vw,
              (max-width: 1200px) 50vw,
              60vw"
            alt="PP"
            placeholder="blur"
            blurDataURL={mission.image}
          />
        </div>
        <div className="text-brand font-semibold text-sm text-start">{mission.title}</div>
        <div className=" flex gap-2">
          <Image src={suitCase} alt="suitcase" className="w-4 h-4" width={16} height={16} />
          <div className="text-brand-500 font-normal text-xs"> levels: </div>
          <div className="text-brand-500 font-normal text-xs">{mission.levels.length}</div>
        </div>
      </div>
    </div>
  )
}

export default MissionCard
