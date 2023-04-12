import Image from 'next/image'

const GameCard: React.FC<{ image: string; name: string }> = ({ image, name }) => {
  return (
    <div className="bg-brand-50 w-fit h-fit rounded-lg p-2 flex flex-col gap-2 relative">
      <div className="flex flex-col gap-2">
        <div className="bg-brand-100 rounded-t-lg px-10">
          <Image src={image} alt="courses" width={125} height={100} />
        </div>
        <div className="text-brand font-semibold text-sm">{name}</div>
      </div>
    </div>
  )
}

export default GameCard
