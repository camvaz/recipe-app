import { Form, Formik } from "formik"
import {
  Box,
  Button,
  FormField,
  Heading,
  ResponsiveContext,
  Tab,
  Tabs,
  TextArea,
  TextInput,
} from "grommet"
import React, { useContext } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { useToasts } from "react-toast-notifications"

import UserAppLayout from "components/UserAppLayout/UserAppLayout"
import { FirebaseContext } from "context/FirebaseContext"
import useUser from "hooks/useUser"
import { genHash } from "utils/genHash"
import SEO from "components/SEO/SEO"

interface CrearRecetaProps {}

const CrearReceta: React.FC<CrearRecetaProps> = ({}) => {
  const { auth, storage, firestore } = useContext(FirebaseContext)
  const [user] = useAuthState(auth)
  const size = useContext(ResponsiveContext)
  const { addToast } = useToasts()
  const userInfo = useUser(user?.email, firestore)

  const handleImageUpload = ({
    name,
    imageFile,
  }: {
    name: string
    imageFile: any
  }) =>
    storage
      .ref(
        `/recetas/${name}/${genHash(imageFile.name)}.${
          imageFile.type === "image/png" ? "png" : "jpg"
        }`
      )
      .put(imageFile)
      .then(
        (img) =>
          "https://firebasestorage.googleapis.com/v0/b/" +
          img.metadata.bucket +
          "/o/" +
          img.metadata.fullPath.replace(/\//g, "%2F") +
          "?alt=media"
      )
      .catch((e) => {
        console.log(e)
        return null
      })

  return (
    <UserAppLayout>
      <SEO title="Crear receta" />
      <Heading alignSelf="start" size={"medium"}>
        Crear receta.
      </Heading>
      <Formik
        initialValues={{
          nombre: "",
          imagen: "",
          preparacion: "",
          ingredientes: "",
          imageFile: null,
          imageURL: "",
        }}
        onSubmit={async (
          { nombre, preparacion, ingredientes, imageFile },
          { setSubmitting }
        ) => {
          setSubmitting(true)
          const imageURL = await handleImageUpload({
            name: nombre,
            imageFile: imageFile,
          })

          if (!imageURL)
            return addToast("Error al subir receta, intente mas tarde.", {
              appearance: "error",
            })

          await firestore
            .collection("recetas")
            .add({
              nombre,
              preparacion,
              ingredientes,
              imagen: imageURL,
              author: userInfo.id,
            })
            .then(() => {})
            .catch((err) => {
              console.log(err)
              addToast("Error al subir receta, intente mas tarde.")
            })
          setSubmitting(false)
        }}
      >
        {({ values, setValues, touched, setTouched }) => {
          const onChangeValues = (e: any) => {
            e.persist()
            const value = e.target.value
            setTouched({ ...touched, [e.target.name]: value.length > 0 })
            setValues((state) => ({
              ...state,
              [e.target.name]: e.target.value,
            }))
          }

          const onChangePicture = (e: any) => {
            setValues((state) => {
              const imageFile = e.target.files[0]
              return {
                ...state,
                imageFile,
                imageURL: URL.createObjectURL(imageFile),
              }
            })
          }

          return (
            <Form
              style={{
                width: "100%",
                minHeight: 500,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Tabs>
                <Tab title="Descripción">
                  <FormField label="Nombre" required>
                    <TextInput
                      size={size}
                      placeholder="Ingresa nombre"
                      name="nombre"
                      type="text"
                      value={values.nombre}
                      onChange={onChangeValues}
                    />
                  </FormField>
                  <Box
                    direction="row"
                    align="center"
                    style={{ flexWrap: "wrap" }}
                  >
                    <FormField
                      margin={{ right: "medium" }}
                      label="Imagen"
                      required
                    >
                      <input
                        type="file"
                        accept="image/x-png,image/jpeg"
                        onChange={onChangePicture}
                      />
                    </FormField>
                    <img
                      src={values.imageURL}
                      alt="Aquí va tu imágen"
                      style={{ width: 300 }}
                    />
                  </Box>
                </Tab>
                <Tab title="Preparación">
                  <FormField label="Describe aquí tu preparación" required>
                    <TextArea
                      name="preparacion"
                      placeholder="Escribe aquí..."
                      value={values.preparacion}
                      onChange={onChangeValues}
                    />
                  </FormField>
                </Tab>
                <Tab title="Ingredientes">
                  <FormField label="Enlista aquí tus ingredientes" required>
                    <TextArea
                      name="ingredientes"
                      placeholder="Escribe aquí..."
                      value={values.ingredientes}
                      onChange={onChangeValues}
                    />
                  </FormField>
                </Tab>
              </Tabs>
              <Button
                primary
                type="submit"
                label="Guardar"
                alignSelf="center"
                margin={{ top: "auto" }}
              />
            </Form>
          )
        }}
      </Formik>
    </UserAppLayout>
  )
}

export default CrearReceta
