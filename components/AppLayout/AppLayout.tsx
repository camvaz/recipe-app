import React, { useContext, useState } from "react"
import Link from "next/link"
import { Box, Button, ResponsiveContext } from "grommet"
import { slide as Menu } from "react-burger-menu"

import Navbar from "components/Navbar/Navbar"
import { css, styled } from "goober"

const OuterContainer = styled("div")`
  .bm-menu {
    background: #000;
    width: 300px;
    height: 100%;
    padding: 32px 24px;
    a {
      text-align: center;
      display: block;
      color: #fff;
      margin-bottom: 24px;
    }
  }
`

interface AppLayoutProps {}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const size = useContext(ResponsiveContext)
  const [openMenu, setOpenMenu] = useState<boolean>(false)

  return (
    <OuterContainer id="outer-container">
      <Menu
        pageWrapId={"page-wrap"}
        outerContainerId={"outer-container"}
        isOpen={openMenu}
        onOpen={() => setOpenMenu(true)}
        onClose={() => setOpenMenu(false)}
        onStateChange={(state: any) => state.isOpen}
        burgerButtonClassName={css`
          display: ${openMenu ? "block" : "none"};
        `}
      >
        <Link href="/">Inicio</Link>
        <Button
          primary
          label="Iniciar sesión"
          style={{ color: "#000" }}
          href="/login"
          color="light-1"
        />
        <Button
          label="Registro"
          href="/login"
          style={{ border: "1px solid #fff" }}
          color="dark-1"
        />
      </Menu>
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
    </OuterContainer>
  )
}

export default AppLayout
