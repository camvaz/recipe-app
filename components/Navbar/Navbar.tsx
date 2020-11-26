import { Box, Button, Header, Heading, ResponsiveContext } from "grommet"
import { Cafeteria, Menu } from "grommet-icons"
import { useRouter } from "next/router"
import React, { Dispatch, SetStateAction, useContext } from "react"

interface NavbarProps {
  setOpenMenu: Dispatch<SetStateAction<boolean>>
}

const Navbar: React.FC<NavbarProps> = ({ setOpenMenu }) => {
  const size = useContext(ResponsiveContext)
  const router = useRouter()

  return (
    <Header
      margin={{ top: "small" }}
      justify="between"
      align="center"
      width="100%"
    >
      <Menu
        fill="dark-1"
        color="dark-1"
        size={"medium"}
        style={{ cursor: "pointer" }}
        onClick={() => setOpenMenu((x) => !x)}
      />
      <Box direction="row" align="center" onClick={() => router.push("/")}>
        <Cafeteria color="dark-1" size={size} />
        <Heading size={size} margin={{ left: "small", vertical: "none" }}>
          FridgeCook
        </Heading>
      </Box>
      <Box direction="row">
        <Button
          primary
          color="dark-1"
          label="Iniciar Sesión"
          margin={{ right: "small" }}
          href="/login"
        />
        <Button href="/registro" color="dark-1" label="Registro" />
      </Box>
    </Header>
  )
}

export default Navbar
