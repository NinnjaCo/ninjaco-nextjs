import Image from 'next/image'
import profileIcon from '@/images/profileIcon.svg'
import suitCase from '@/images/suitCase.svg'

const CourseCard: React.FC<{ image: string; name: string; mission: string; age: string }> = ({
  image,
  name,
  mission,
  age,
}) => {
  return (
    <div className="bg-brand-50 w-fit h-fit rounded-lg p-2 flex flex-col gap-2 relative">
      <div className="flex flex-col gap-2">
        <div className="bg-brand-100 rounded-t-lg px-10">
          <Image src={image} alt="courses" width={125} height={100} />
        </div>
        <div className="text-brand font-semibold text-sm">{name}</div>
        <div className=" flex gap-2">
          <Image src={suitCase} alt="suitcase" />
          <div className="text-brand-500 font-normal text-xs"> missions: </div>
          <div className="text-brand-500 font-normal text-xs">{mission}</div>
        </div>
        <div className=" flex gap-2">
          <Image src={profileIcon} alt="suitcase" />
          <div className="text-brand-500 font-normal text-xs"> age:</div>
          <div className="text-brand-500 font-normal text-xs">{age}</div>
        </div>
      </div>
    </div>
  )
}

export default CourseCard
