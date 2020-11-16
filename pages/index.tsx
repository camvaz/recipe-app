import React, { useContext, useState } from "react"
import Image from "next/image"
import { Box, Button, Grid, ResponsiveContext, Text, TextInput } from "grommet"

import AppLayout from "components/AppLayout/AppLayout"
import { Search } from "grommet-icons"
import SEO from "components/SEO/SEO"

interface indexProps {}

const index: React.FC<indexProps> = ({}) => {
  const [searchText, setSearchText] = useState("")
  const size = useContext(ResponsiveContext)

  return (
    <AppLayout>
      <SEO title="Inicio" />
      <Box
        width="100%"
        margin={{ vertical: "large" }}
        direction="row"
        align="center"
        justify="between"
      >
        <TextInput
          value={searchText}
          onChange={(e) => setSearchText(() => e.target.value)}
          placeholder="Buscar receta..."
          size={size}
          width="100%"
          icon={<Search color="dark-1" />}
        />
        <Button
          margin={{ left: "small" }}
          onClick={() => {}}
          primary
          label="Buscar"
          color="dark-1"
        />
      </Box>
      <Box width="100%">
        <Grid columns={"26%"} responsive gap="medium">
          {[0, 1, 2].map((_, i) => (
            <Box
              key={i}
              pad="medium"
              height="fit-content"
              border={{ style: "groove" }}
            >
              <Image
                src="https://source.unsplash.com/random"
                layout="responsive"
                alt="Unsplash"
                width="300px"
                height="200px"
              />
              <Text margin={{ top: "small" }}>Receta 1</Text>
            </Box>
          ))}
        </Grid>
      </Box>
    </AppLayout>
  )
}

export default index
