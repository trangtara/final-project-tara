import React from 'react'
import { useSelector } from 'react-redux'
import NavigationPage from './NavigationPage'
import Login from './Login'

import '../styling/pageWrapper.css'

const Home = () => {
  const accessToken = useSelector((store) => store.user.login.accessToken)
  return (
    <div className="main-container">
      {accessToken && 
      <>
      <NavigationPage />
      </>
      }
      {!accessToken && (
        <div>
          <h1 className="page-title">Welcome to Home Page</h1>
      <Login />
      </div>
      )}
    </div>
  )
}
 
export default Home