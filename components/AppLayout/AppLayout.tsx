import React, { useContext } from "react"
import { Box, ResponsiveContext } from "grommet"

import Navbar from "components/Navbar/Navbar"

interface AppLayoutProps {}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const size = useContext(ResponsiveContext)

  return (
    <Box
      width="100%"
      direction="column"
      justify="center"
      align="center"
      pad={{ horizontal: size }}
    >
      <Navbar />
      {children}
    </Box>
  )
}

export default AppLayout
