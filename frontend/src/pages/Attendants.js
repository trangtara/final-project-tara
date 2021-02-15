import React from 'react'
import AttendantList from '../components/AttendantList'
import Layout from '../components/common/Layout'

const Attendants = () => {
  return (
    <Layout>
      {/* <h3 className="text-center mt-3 mb-5">List of all attendants</h3> */}
      <AttendantList />
    </Layout>
    )
}
 
export default Attendants