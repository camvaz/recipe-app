import React, { useContext, useState } from "react"
import { Box, ResponsiveContext } from "grommet"
import { slide as Menu } from "react-burger-menu"

import Navbar from "components/Navbar/Navbar"

interface AppLayoutProps {}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const size = useContext(ResponsiveContext)
  const [openMenu, setOpenMenu] = useState<boolean>(false)
  return (
    <div id="outer-container">
      <Menu
        pageWrapId={"page-wrap"}
        outerContainerId={"outer-container"}
        isOpen={openMenu}
        onOpen={() => setOpenMenu(true)}
        onClose={() => setOpenMenu(false)}
        onStateChange={(state: any) => state.isOpen}
      />
      <main id="page-wrap">
        <Box
          width="100%"
          direction="column"
          justify="center"
          align="center"
          pad={{ horizontal: size }}
        >
          <Navbar setOpenMenu={setOpenMenu} />
          {children}
        </Box>
      </main>
    </div>
  )
}

export default AppLayout
