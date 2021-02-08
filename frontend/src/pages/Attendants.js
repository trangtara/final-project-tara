import React from 'react'
import AttendantList from '../components/AttendantList'
import Layout from '../components/common/Layout'

const Attendants = () => {
  return (
    <Layout>
      <h2>List of all attendants</h2>
      <AttendantList />
    </Layout>
    )
}
 
export default Attendants