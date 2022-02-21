import { useSearchParams } from "react-router-dom"

// Pass in a single key and value, and update the search params
// TODO: update so that you can pass it objects (etc)
export function useUpdateParams (key, val) {
  const [searchParams, setSearchParams] = useSearchParams()

  const currentParams = Object.fromEntries([...searchParams])
  const newParams = { ...currentParams, [key]: val }

  setSearchParams(newParams)
}