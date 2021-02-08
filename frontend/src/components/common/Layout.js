import React from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'

import Navigation from '../Navigation'

const Layout = (props) => {
  const accessToken = useSelector((store) => store.user.login.accessToken)
  
  return (
    <div>
      {accessToken &&
        <div className="container">
          <Navigation />
          {props.children}
        </div>
      }
      {!accessToken && <Redirect to="/login" />}
    </div>
  );
}
 
export default Layout;