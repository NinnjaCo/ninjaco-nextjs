import { UserPlayGame } from '@/models/crud/game-enrollment.model'
import Image from 'next/image'
import React from 'react'

const GameEnrollmentCard: React.FC<{
  userPlayGame: UserPlayGame
}> = ({ userPlayGame }) => {
  return (
    <div className="bg-brand-50 w-fit h-fit rounded-lg p-2 flex flex-col gap-2 relative">
      <div className="flex flex-col gap-2">
        <div className="bg-brand-100 rounded-t-lg px-10 w-44 h-32 relative">
          <Image
            className="bg-brand-200 border-2 border-brand-400 rounded w-52 h-32"
            src={userPlayGame.game.image}
            style={{
              objectFit: 'contain',
            }}
            fill
            sizes="(max-width: 768px) 40vw,
              (max-width: 1200px) 50vw,
              60vw"
            alt="PP"
            placeholder="blur"
            blurDataURL={userPlayGame.game.image}
          />
          <div
            className="bg-green-400 rounded-full w-6 h-6 flex items-center justify-center text-white absolute top-2 right-2"
            style={{ fontSize: '0.8rem' }}
          >
            ✓
          </div>
        </div>
        <div className="text-brand font-semibold text-sm">{userPlayGame.game.title}</div>
      </div>
    </div>
  )
}

export default GameEnrollmentCard
