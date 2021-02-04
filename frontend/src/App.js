import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore, combineReducers } from '@reduxjs/toolkit'

import { user } from './reducers/user'
import Home from './pages/Home'
import LogIn from './pages/Login'
import SignUp from './pages/SignUp'
import Registration from './pages/Registration'
import { attendant } from './reducers/attendant'
import CheckinPage from './pages/CheckinPage'
import { checkin } from './reducers/checkin'
import NavigationPage from './pages/NavigationPage'
import Attendants from './pages/Attendants'
import { loadingStatus } from './reducers/loadingStatus'

const reducer = combineReducers({ 
  user: user.reducer, 
  attendant: attendant.reducer,
  checkin: checkin.reducer,
  isLoading: loadingStatus.reducer
})


const store = configureStore({ reducer })

export const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" exact component={LogIn} />
          <Route path="/signup" exact component={SignUp} />
          <Route path="/navigation" exact component={NavigationPage} />
          <Route path="/registration" exact component={Registration} />
          <Route path="/checkin/:attendantId" exact component={CheckinPage} />
          <Route pathe="/attendants" exact component={Attendants} />
        </Switch>
      </Router>
    </Provider>
  )
}
