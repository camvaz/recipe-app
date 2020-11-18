import React, { useContext, useState } from "react"
import Image from "next/image"
import { Box, Button, Grid, ResponsiveContext, Text, TextInput } from "grommet"
import { useRouter } from "next/router"
import { Search } from "grommet-icons"

import AppLayout from "components/AppLayout/AppLayout"
import SEO from "components/SEO/SEO"
import { firestore } from "./_app"
import { Recipe } from "models/Recipe"
import { SSRError } from "models/SSRError"

interface indexProps {}

const index: React.FC<
  indexProps & { data: { success?: Recipe[]; error?: SSRError } }
> = ({ data }) => {
  const [searchText, setSearchText] = useState("")
  const size = useContext(ResponsiveContext)
  const router = useRouter()

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
          {data.success?.map(({ id, imagen, nombre }, i) => (
            <Box
              key={i}
              style={{ cursor: "pointer" }}
              pad="medium"
              height="fit-content"
              border={{ style: "groove" }}
              onClick={() => router.push(`/receta/${id}`)}
            >
              <Image
                src={imagen}
                layout="responsive"
                alt="Unsplash"
                width="300px"
                height="200px"
              />
              <Text margin={{ top: "small" }}>{nombre}</Text>
            </Box>
          ))}
        </Grid>
      </Box>
    </AppLayout>
  )
}

export async function getServerSideProps() {
  const success = await firestore
    .collection("recetas")
    .get()
    .then((docs) => {
      const recipes: Recipe[] = []
      docs.forEach((doc) =>
        recipes.push({ ...doc.data(), id: doc.id } as Recipe)
      )
      return recipes
    })
    .catch(() => null)

  if (!success)
    return {
      props: { data: { error: { code: 404, message: "Recipe Not Found" } } },
    }

  return { props: { data: { success } } }
}

export default index
