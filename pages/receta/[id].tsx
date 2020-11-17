import React, { useContext } from "react"
import { Box, ResponsiveContext, Text } from "grommet"
import { GetServerSidePropsContext } from "next"

import AppLayout from "components/AppLayout/AppLayout"
import SEO from "components/SEO/SEO"
import { firestore } from "pages/_app"
import { Recipe } from "models/Recipe"
import { SSRError } from "models/SSRError"
import NotFound from "components/NotFound/NotFound"

interface RecipeProps {}

const RecipeID: React.FC<
  RecipeProps & { data: { success?: Recipe; error?: SSRError } }
> = ({ data }) => {
  const size = useContext(ResponsiveContext)

  return (
    <AppLayout>
      {data.success ? (
        <>
          <SEO title={data.success.nombre} />
          <Box>{data && JSON.stringify(data, null, 0)}</Box>
        </>
      ) : data.error ? (
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
