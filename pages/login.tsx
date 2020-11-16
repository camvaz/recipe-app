import React, { useContext } from "react"
import * as yup from "yup"
import { Form, Formik } from "formik"
import {
  Box,
  Button,
  FormField,
  ResponsiveContext,
  Text,
  TextInput,
} from "grommet"
import { Lock, MailOption } from "grommet-icons"
import { useRouter } from "next/router"

import AuthLayout from "components/AuthLayout/AuthLayout"
import SEO from "components/SEO/SEO"

interface LoginProps {}

const validationSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
})

const Login: React.FC<LoginProps> = ({}) => {
  const router = useRouter()
  const size = useContext(ResponsiveContext)
  return (
    <AuthLayout>
      <SEO title="Entrar" />
      <Box direction="column" responsive>
        <Box direction="row" align="center" margin={{ bottom: "medium" }}>
          <Text size={size} margin={{ right: "small" }}>
            ¿Nuevo en FridgeCook?
          </Text>
          <Button
            primary
            color="dark-1"
            label="Registrate aquí"
            size={size}
            onClick={(e) => {
              e.persist()
              router.push("/registro")
            }}
          />
        </Box>
        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={() => {}}
          validationSchema={validationSchema}
        >
          {({ values, setValues, errors, touched, setTouched }) => {
            const onChangeValues = (e: any) => {
              e.persist()
              const value = e.target.value
              setTouched({ ...touched, [e.target.name]: value.length > 0 })
              setValues((state) => ({
                ...state,
                [e.target.name]: e.target.value,
              }))
            }

            return (
              <Form>
                <FormField
                  required
                  label="Correo"
                  error={
                    errors.email && touched.email ? (
                      <Text size="small" color="status-error">
                        Por favor, ingresa un email válido.
                      </Text>
                    ) : null
                  }
                >
                  <TextInput
                    placeholder="Ingresa correo"
                    size={size}
                    name="email"
                    value={values.email}
                    onChange={onChangeValues}
                    icon={<MailOption color="dark-1" />}
                  />
                </FormField>
                <FormField label="Contraseña" required>
                  <TextInput
                    size={size}
                    placeholder="Ingresa contraseña"
                    name="password"
                    type="password"
                    value={values.password}
                    onChange={onChangeValues}
                    icon={<Lock color="dark-1" />}
                  />
                </FormField>
                <Button
                  margin={{ top: "large" }}
                  style={{ display: "block", width: "100%" }}
                  type="submit"
                  label="Iniciar sesión"
                  size={size}
                  primary
                  color="dark-1"
                />
              </Form>
            )
          }}
        </Formik>
      </Box>
    </AuthLayout>
  )
}

export default Login
