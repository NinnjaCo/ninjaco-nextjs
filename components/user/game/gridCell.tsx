import Flag from '@/components/creator/game/flag'
import Player from '@/components/creator/game/player'
import Wall from '@/components/creator/game/wall'
import clsx from 'clsx'

export interface GridCell {
  row: number
  col: number
  isWall: boolean
  isPlayer: boolean
  isGoal: boolean
}

export const GridCellComponent = ({
  cell,
  size,
  onClick,
}: {
  cell: GridCell
  size: number
  onClick: (row, col) => void
}) => {
  // a react component that renders a cell given its information in the cell

  return (
    <div
      className={clsx(
        'border-2 border-brand-200',
        cell.isWall && 'bg-brand-700',
        cell.isPlayer && 'bg-brand-white',
        cell.isGoal && 'bg-brand-white',
        !cell.isWall && !cell.isPlayer && !cell.isGoal && 'bg-brand-100'
      )}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
      role="button"
      tabIndex={0}
      onKeyDown={() => {
        onClick(cell.row, cell.col)
      }}
    >
      {cell.isPlayer && (
        <Player
          color="#EDC052"
          width={22}
          height={45}
          className="absolute -translate-y-5"
          strokeColor="#29375B"
        />
      )}
      {cell.isGoal && (
        <Flag
          color="#EDC052"
          width={30}
          height={35}
          className="absolute -translate-y-3"
          strokeColor="#29375B"
        />
      )}
      {cell.isWall && <Wall color="#465B81" width={23} height={22} />}
    </div>
  )
}
