import { Outlet } from "react-router-dom"

import DashHeader from "./DashHeader"
import DashFooter from "./DashFooter"

const DashLayout = () => {
  return (
    <div className="dash-layout border">
      <DashHeader />
      <div className="dash-container">
        <Outlet />
      </div>
      <DashFooter />
    </div>
  )
}

export default DashLayout
