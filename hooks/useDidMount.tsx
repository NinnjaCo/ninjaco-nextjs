import React from 'react'

function useDidMount(callback: () => void) {
  const didMountRef = React.useRef(false)

  React.useEffect(() => {
    if (didMountRef.current) callback()
    else didMountRef.current = true
  }, [callback])
}
export default useDidMount
