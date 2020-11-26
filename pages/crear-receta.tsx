import UserAppLayout from "components/UserAppLayout/UserAppLayout"
import { FirebaseContext } from "context/FirebaseContext"
import { Heading, ResponsiveContext, Tab, Tabs } from "grommet"
import React, { useContext } from "react"
import { useAuthState } from "react-firebase-hooks/auth"

interface CrearRecetaProps {}

const CrearReceta: React.FC<CrearRecetaProps> = ({}) => {
  const { auth } = useContext(FirebaseContext)
  const [user] = useAuthState(auth)
  const size = useContext(ResponsiveContext)

  return (
    <UserAppLayout>
      <Heading alignSelf="start" size={size}>
        Crear receta.
      </Heading>
      <Tabs>
        <Tab title="Descripción"></Tab>
        <Tab title="Preparación"></Tab>
        <Tab title="Ingredientes"></Tab>
      </Tabs>
    </UserAppLayout>
  )
}

export default CrearReceta
