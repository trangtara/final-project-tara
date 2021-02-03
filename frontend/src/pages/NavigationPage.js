import React from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import LoadingIndicator from '../components/LoadingIndicator'

import Navigation from '../components/Navigation'

const NavigationPage = () => {
  const accessToken = useSelector((store) => store.user.login.accessToken)
  
  return (
    <div className="main-container">
      <LoadingIndicator />
      <Navigation />
      {!accessToken && <Redirect to="/login"/>}
    </div>
  );
}
 
export default NavigationPage;