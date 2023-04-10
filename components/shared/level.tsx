import { getLevelFromPoints, getLevelProgress } from '@/utils/shared'
import React from 'react'

const LevelIndicator = (props: { points: number }) => {
  const currentLevel = getLevelFromPoints(props.points)
  const currentLevelProgress = getLevelProgress(props.points)
  const nextLevel = currentLevel + 1

  return (
    <div className="flex w-full gap-1 items-center justify-start">
      {currentLevel}
      <div className="w-1/2 bg-brand rounded-full h-2.">
        <div
          className="bg-secondary h-2.5 rounded-full"
          style={{
            width: `${currentLevelProgress}%`,
          }}
        ></div>
      </div>
      {nextLevel}
    </div>
  )
}

export default LevelIndicator
