import { Direction } from '@/components/user/game/gridCell'
import React from 'react'

/**
 *  Component for Player
 * @param color, a hex color
 * @param width, width of the svg
 * @param height, height of the svg
 *
 * @returns an svg of Player
 */

const Player = ({
  playerColor,
  directionColor,
  width,
  height,
  className,
  strokeColor,
  direction,
}: {
  playerColor: string
  directionColor: string
  width: number
  height: number
  direction: Direction
  className?: string
  strokeColor?: string
}) => {
  const renderDirection = () => {
    switch (direction) {
      case Direction.UP:
        return (
          <path
            d="M26 49.5C26 62 20.1797 62 13 62C5.8203 62 0 62 0 49.5C0 42.5964 10.5 21 13 21C16.5 21 26 42.5964 26 49.5Z"
            fill={directionColor}
          />
        )
      case Direction.DOWN:
        return (
          <path
            d="M0 46.5C0 34 5.8203 34 13 34C20.1797 34 26 34 26 46.5C26 53.4036 15.5 75 13 75C9.5 75 0 53.4036 0 46.5Z"
            fill={directionColor}
          />
        )
      case Direction.LEFT:
        return (
          <path
            d="M28.5 35C41 35 41 40.8203 41 48C41 55.1797 41 61 28.5 61C21.5964 61 0 50.5 0 48C0 44.5 21.5964 35 28.5 35Z"
            fill={directionColor}
            className="transform -translate-x-3"
          />
        )
      case Direction.RIGHT:
        return (
          <path
            d="M12.5 63C0 63 0 57.1797 0 50C0 42.8203 0 37 12.5 37C19.4036 37 41 47.5 41 50C41 53.5 19.4036 63 12.5 63Z"
            fill={directionColor}
          />
        )
    }
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 26 75"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke={strokeColor}
      className={className}
    >
      {renderDirection()}
      <path
        d="M10.25 53C9.47084 53 8.81725 52.7462 8.28925 52.2387C7.76126 51.7312 7.49817 51.1038 7.50001 50.3566V34.4963H4.75001C3.97084 34.4963 3.31726 34.2425 2.78926 33.735C2.26126 33.2274 1.99818 32.6001 2.00001 31.8529V18.6359C2.00001 17.182 2.53901 15.937 3.61701 14.9008C4.69501 13.8646 5.98934 13.3474 7.50001 13.3491H18.5C20.0125 13.3491 21.3077 13.8672 22.3857 14.9034C23.4637 15.9396 24.0018 17.1838 24 18.6359V31.8529C24 32.6018 23.736 33.2301 23.208 33.7376C22.68 34.2451 22.0273 34.498 21.25 34.4963H18.5V50.3566C18.5 51.1056 18.236 51.7338 17.708 52.2413C17.18 52.7489 16.5273 53.0018 15.75 53H10.25ZM12.0375 10.4414L7.77501 6.34414C7.50001 6.0798 7.36251 5.7714 7.36251 5.41895C7.36251 5.0665 7.50001 4.7581 7.77501 4.49377L12.0375 0.396508C12.3125 0.132169 12.6333 0 13 0C13.3667 0 13.6875 0.132169 13.9625 0.396508L18.225 4.49377C18.5 4.7581 18.6375 5.0665 18.6375 5.41895C18.6375 5.7714 18.5 6.0798 18.225 6.34414L13.9625 10.4414C13.6875 10.7057 13.3667 10.8379 13 10.8379C12.6333 10.8379 12.3125 10.7057 12.0375 10.4414Z"
        fill={playerColor}
      />
    </svg>
  )
}

export default Player
