import React, { useCallback, useContext, useEffect, useState } from "react"
import { GetServerSidePropsContext } from "next"
import { useRouter } from "next/router"
import Image from "next/image"
import {
  Box,
  Button,
  FormField,
  Heading,
  Markdown,
  Paragraph,
  ResponsiveContext,
  Tab,
  Tabs,
  Text,
  TextArea,
  TextInput,
} from "grommet"
import { Star } from "grommet-icons"
import { useToasts } from "react-toast-notifications"
import { useAuthState } from "react-firebase-hooks/auth"

import AppLayout from "components/AppLayout/AppLayout"
import SEO from "components/SEO/SEO"
import { firestore } from "pages/_app"
import { Recipe } from "models/Recipe"
import { SSRError } from "models/SSRError"
import NotFound from "components/NotFound/NotFound"
import { FirebaseContext } from "context/FirebaseContext"
import { Opinion } from "models/Opinion"
import useUser from "hooks/useUser"
import { Form, Formik } from "formik"

interface RecipeProps {}

const RecipeID: React.FC<
  RecipeProps & { data: { success?: Recipe; error?: SSRError } }
> = ({ data }) => {
  const size = useContext(ResponsiveContext)
  const router = useRouter()
  const { addToast } = useToasts()
  const { auth, firestore } = useContext(FirebaseContext)
  const [opinions, setOpinions] = useState<Opinion[]>([])
  const [user] = useAuthState(auth)
  const userInfo = useUser(user?.email, firestore)
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
                onClick={() => {
                  if (!user) {
                    router.push("/login")
                  }

                  firestore
                    .collection("users")
                    .doc(userInfo.id)
                    .set(
                      { favoritos: [...userInfo.favoritos, id] },
                      { merge: true }
                    )
                    .then(() =>
                      addToast("Agregado a favoritos", {
                        appearance: "success",
                      })
                    )
                    .catch((err) => {
                      console.log(err)
                      addToast("Erro al agregar a favoritos", {
                        appearance: "warning",
                      })
                    })
                }}
              />
            </Box>
            <Tabs>
              <Tab title="Ingredientes">
                <Box margin={{ vertical: "small" }}>
                  <Markdown>{success.ingredientes}</Markdown>
                </Box>
              </Tab>
              <Tab title="Preparación">
                <Box margin={{ vertical: "small" }}>
                  <Markdown>{success.preparacion}</Markdown>
                </Box>
              </Tab>
              <Tab title="Opiniones">
                {/* {JSON.stringify(opinions, null, 2)} */}
                <Box margin={{ top: "medium" }}>
                  {opinions.map(({ author, message }, i) => (
                    <Box key={i}>
                      <Text weight="bold">{author}</Text>
                      <Paragraph margin={{ top: "small", bottom: "medium" }}>
                        {message}
                      </Paragraph>
                    </Box>
                  ))}
                  <Formik
                    initialValues={{ author: "", message: "" }}
                    onSubmit={(
                      { author, message },
                      { setSubmitting, setValues }
                    ) => {
                      setSubmitting(true)
                      firestore
                        .collection("recetas")
                        .doc(id as string)
                        .collection("opiniones")
                        .add({ author, message })
                        .then(() => {
                          addToast("Comentario agregado con éxito", {
                            appearance: "success",
                          })
                          setValues(() => ({ author: "", message: "" }))
                        })
                        .catch(() =>
                          addToast(
                            "Error al subir comentario, intenta más tarde.",
                            { appearance: "error" }
                          )
                        )
                      setSubmitting(false)
                    }}
                  >
                    {({ values, setValues }) => {
                      const onChangeValues = (e: any) => {
                        e.persist()
                        setValues((state) => ({
                          ...state,
                          [e.target.name]: e.target.value,
                        }))
                      }
                      return (
                        <Form>
                          <Text weight="bold">Deja un comentario</Text>
                          <FormField label="Autor" required>
                            <TextInput
                              size={size}
                              placeholder="Ingresa tu nombre"
                              name="author"
                              value={values.author}
                              onChange={onChangeValues}
                            />
                          </FormField>
                          <FormField label="Comentario" required>
                            <TextArea
                              size={size}
                              name="message"
                              placeholder="Escribe aquí..."
                              value={values.message}
                              onChange={onChangeValues}
                            />
                          </FormField>
                          <Button
                            primary
                            label="Comentar"
                            color={"dark-1"}
                            type="submit"
                          />
                        </Form>
                      )
                    }}
                  </Formik>
                </Box>
              </Tab>
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
