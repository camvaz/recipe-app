import React, { useCallback, useContext, useEffect, useState } from "react"
import { GetServerSidePropsContext } from "next"
import { useRouter } from "next/router"
import Image from "next/image"
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
import { Star } from "grommet-icons"

import AppLayout from "components/AppLayout/AppLayout"
import SEO from "components/SEO/SEO"
import { firestore } from "pages/_app"
import { Recipe } from "models/Recipe"
import { SSRError } from "models/SSRError"
import NotFound from "components/NotFound/NotFound"
import { FirebaseContext } from "context/FirebaseContext"
import { Opinion } from "models/Opinion"

interface RecipeProps {}

const RecipeID: React.FC<
  RecipeProps & { data: { success?: Recipe; error?: SSRError } }
> = ({ data }) => {
  const size = useContext(ResponsiveContext)
  const router = useRouter()
  const { firestore } = useContext(FirebaseContext)
  const [opinions, setOpinions] = useState<Opinion[]>([])
  const { success, error } = data
  const { id } = router.query

  const fetchOpiniones = useCallback(() => {
    if (!id || error) return
    else
      firestore
        .collection("recetas")
        .doc(id as string)
        .collection("opiniones")
        .onSnapshot((docs) => {
          const tempOpinons: Opinion[] = []
          docs.forEach((doc) => {
            tempOpinons.push({ id: doc.id, ...doc.data() } as Opinion)
          })
          setOpinions(() => tempOpinons)
        })
  }, [id, setOpinions, firestore])

  useEffect(() => {
    fetchOpiniones()
    return () => {}
  }, [id])

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
              <Tab title="Opiniones">{JSON.stringify(opinions, null, 2)}</Tab>
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

  return !success
    ? {
        props: { data: { error: { code: 404, message: "Recipe Not Found" } } },
      }
    : { props: { data: { success } } }
}

export default RecipeID
