import React from 'react'
import Layout from '../components/common/Layout'
import RegistrationForm from '../components/RegistrationForm'

const Registration = () => {
  //const errorMessage = useSelector((store) => store.attendant.attendant.errorMessage)
  return (
    <Layout>
      <RegistrationForm/>
    </Layout>
    )
}
 
export default Registration