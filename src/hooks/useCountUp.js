import { useEffect, useState } from 'react'

export function useCountUp(target, active, duration = 1400) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!active) return undefined

    let start = null
    let frameId

    const step = (timestamp) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      setValue(Math.floor(progress * target))
      if (progress < 1) {
        frameId = requestAnimationFrame(step)
      }
    }

    frameId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frameId)
  }, [active, target, duration])

  return value
}
