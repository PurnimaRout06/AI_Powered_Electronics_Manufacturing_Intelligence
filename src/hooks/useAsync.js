import { useCallback, useEffect, useRef, useState } from 'react'

// Wraps any async service call with the loading/data/error states every
// data-driven component in this app needs. Pass a memoized fn (or include
// deps) so it only re-runs when its inputs actually change.
export function useAsync(fn, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const mounted = useRef(true)

  const run = useCallback(() => {
    setLoading(true)
    setError(null)
    fn()
      .then((result) => {
        if (mounted.current) {
          setData(result)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (mounted.current) {
          setError(err)
          setLoading(false)
        }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    mounted.current = true
    run()
    return () => {
      mounted.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run])

  return { data, loading, error, refetch: run }
}
