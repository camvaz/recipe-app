import React, { useContext } from "react"
import {
  Box,
  Button,
  Heading,
  Paragraph,
  ResponsiveContext,
  Tab,
  Tabs,
  Text,
} from "grommet"
import Image from "next/image"
import { GetServerSidePropsContext } from "next"

import AppLayout from "components/AppLayout/AppLayout"
import SEO from "components/SEO/SEO"
import { firestore } from "pages/_app"
import { Recipe } from "models/Recipe"
import { SSRError } from "models/SSRError"
import NotFound from "components/NotFound/NotFound"
import { Star } from "grommet-icons"

interface RecipeProps {}

const RecipeID: React.FC<
  RecipeProps & { data: { success?: Recipe; error?: SSRError } }
> = ({ data }) => {
  const size = useContext(ResponsiveContext)
  const { success, error } = data

  return (
    <AppLayout>
      {success ? (
        <>
          <SEO title={success.nombre} />
          <Box
            direction="column"
            align="center"
            justify="start"
            margin={{ vertical: "large" }}
            width="100%"
          >
            <Image
              src={success.imagen}
              layout="intrinsic"
              alt="Unsplash"
              priority
              sizes="(max-width:350px) 350px, 500px"
              width={"auto"}
              height={300}
            />
            <Box
              direction="row"
              margin={{ vertical: "medium" }}
              justify="around"
              align="center"
            >
              <Heading margin={{ right: "large", vertical: "none" }}>
                {success.nombre}
              </Heading>
              <Button
                label="Agregar a favoritos"
                primary
                gap="xxsmall"
                icon={<Star />}
                size="small"
                color="dark-1"
              />
            </Box>
            <Tabs>
              <Tab title="Ingredientes">
                <Paragraph>{success.ingredientes}</Paragraph>
              </Tab>
              <Tab title="Preparación">
                <Paragraph>{success.preparacion}</Paragraph>
              </Tab>
              <Tab title="Opiniones"></Tab>
            </Tabs>
          </Box>
        </>
      ) : error ? (
        <>
          <SEO title={"Receta no encontrada"} />
          <NotFound />
          <Text size={size}>Receta no encontrada</Text>
        </>
      ) : null}
    </AppLayout>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const id = context.params?.id
  if (!id)
    return {
      props: { data: { error: { code: 400, message: "ID Not Found" } } },
    }

  const success = await firestore
    .collection("recetas")
    .doc(id as string)
    .get()
    .then((res) =>
      res.exists
        ? {
            id: res.id,
            ...res.data(),
          }
        : null
    )
    .catch(() => null)

  if (!success)
    return {
      props: { data: { error: { code: 404, message: "Recipe Not Found" } } },
    }

  return { props: { data: { success } } }
}

export default RecipeID
