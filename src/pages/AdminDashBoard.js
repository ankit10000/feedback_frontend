import React from 'react'
import ShowFeedBackData from '../components/ShowFeedBackData'

function AdminDashBoard() {
  return (
    <div>
         <main>
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"></div>
            <div className="px-4 py-6 sm:px-0">
            <ShowFeedBackData />
          </div>
        </main>
    </div>
  )
}

export default AdminDashBoard