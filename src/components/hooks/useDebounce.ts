import { Dispatch, SetStateAction, useEffect, useState } from 'react'

const useDebouncedInput = function <T>(
  initialValue: T
): [T, Dispatch<SetStateAction<T>>, T] {
  const [inputState, setInputState] = useState(initialValue)
  const [debouncedValue, setDebouncedValue] =
    useState<typeof inputState>(initialValue)

  useEffect(() => {
    const countDown = setTimeout(() => {
      setDebouncedValue(inputState)
    }, 500)

    return () => {
      clearTimeout(countDown)
    }
  }, [inputState])
  return [inputState, setInputState, debouncedValue]
}

export default useDebouncedInput
