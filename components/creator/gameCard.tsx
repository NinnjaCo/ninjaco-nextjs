import { Game } from '@/models/crud/game.model'
import Image from 'next/image'

const GameCard: React.FC<{ game: Game }> = ({ game }) => {
  return (
    <div className="bg-brand-50 w-fit h-fit rounded-lg p-2 flex flex-col gap-2 relative">
      <div className="flex flex-col gap-2">
        <div className="bg-brand-100 rounded-t-lg px-10 w-44 h-32 relative">
          <Image
            className="bg-brand-200 border-2 border-brand-400 rounded w-52 h-32"
            src={game.image}
            style={{
              objectFit: 'contain',
            }}
            fill
            sizes="(max-width: 768px) 40vw,
              (max-width: 1200px) 50vw,
              60vw"
            alt="PP"
            placeholder="blur"
            blurDataURL={game.image}
          />
        </div>
        <div className="text-brand font-semibold text-sm">{game.title}</div>
      </div>
    </div>
  )
}

export default GameCard
