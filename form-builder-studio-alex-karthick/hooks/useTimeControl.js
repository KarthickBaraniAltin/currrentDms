import React, { useEffect, useState } from 'react'

export default function useTimeControl() {
    const [startViewTime, setStartViewTime] = useState(undefined)

    useEffect(() => {
        setStartViewTime(new Date().toUTCString())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return { startViewTime, setStartViewTime }
}
