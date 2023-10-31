import { useEffect, useState } from 'react'

function useNotifyOnSuccess(dependant: boolean) {
  const [successData, setSuccessData] = useState<{
    handleNotifyUsers: () => Promise<void>
  }>()

  useEffect(() => {
    if (dependant === false) return
    ;(async () => {
      await successData?.handleNotifyUsers()
    })()
  }, [dependant])

  const handleSetSuccessData = function (
    handleNotifyUsers: () => Promise<void>
  ) {
    setSuccessData({
      handleNotifyUsers,
    })
  }
  return handleSetSuccessData
}

export default useNotifyOnSuccess
