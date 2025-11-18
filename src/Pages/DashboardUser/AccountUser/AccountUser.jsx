import React from 'react';
import TopSectionProfile from '../../../Components/DashboardUserComponent/TopSectionProfile/TopSectionProfile';
import BottomSectionProfile from '../../../Components/DashboardUserComponent/BottomSectionProfile/BottomSectionProfile';
import "./accountUser.css"

const AccountUser = () => {
  return (
    <div className='AccountUser_container'>
      <TopSectionProfile />
      <BottomSectionProfile />
    </div>
  );
}

export default AccountUser;
