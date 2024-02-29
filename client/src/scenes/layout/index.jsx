import React,{ useState }from 'react'
import {Box, useMediaQuery} from '@mui/material'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Navbar from 'components/Navbar'
import Sidebar from 'components/Sidebar'
import { useGetUserQuery } from 'state/api'
const Layout = () => {


  /* this is for screens, if it is not mobile, it will be set to true, otherwise to false, depending on the min-width,
  so to be non-mobile it must be >= 600px ...*/
  const isNonMobile=useMediaQuery("(min-width: 600px)");

  const [isSidebarOpen, setIsSidebarOpen]=useState(true);
  const userId=useSelector((state)=>state.global.userId);
  const {data}=useGetUserQuery(userId);
  console.log('data ', data)
  return (

/* material ui has a Box component that allows passing properties 
as if they are css properties */


    /* displays the box as flex if it is a desktop screen, otherwise display will be block */
    <Box display={isNonMobile ? "flex": "block"} width='100%' height="100%"> 
    <Sidebar  
    user={data || {}}
    isNonMobile={isNonMobile} 
    drawerWidth="250px" 
    isSidebarOpen={isSidebarOpen}
    setIsSidebarOpen={setIsSidebarOpen}
    />
    <Box flexGrow={1}>
     <Navbar
     user={data || {}} 
     isSidebarOpen={isSidebarOpen}
     setIsSidebarOpen={setIsSidebarOpen}/>
    <Outlet/>
    </Box>
   
   </Box>
  )
}

export default Layout;
