import React from 'react'
import { useSelector } from 'react-redux'

const LoadingIndicator = () => {
  const isLoading = useSelector((store) => store.isLoading.isLoading)

  return (
    <div>
      {isLoading &&
        <p>Page is loading...</p>
      }
    </div>
  )
}
 
export default LoadingIndicator