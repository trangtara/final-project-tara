import React from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'

import Navigation from '../components/Navigation'

const NavigationPage = () => {
  const accessToken = useSelector((store) => store.user.login.accessToken)
  
  return (
    <div className="main-container">
      <Navigation />
      {!accessToken && <Redirect to="/login"/>}
    </div>
  );
}
 
export default NavigationPage;