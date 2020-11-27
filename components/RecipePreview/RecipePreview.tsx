import React from "react"
import Image from "next/image"
import { useRouter } from "next/router"
import { Box, Text } from "grommet"

interface RecipePreviewProps {
  imagen: string
  id: string
  nombre: string
}

const RecipePreview: React.FC<RecipePreviewProps> = ({
  id,
  imagen,
  nombre,
}) => {
  const router = useRouter()
  return (
    <Box
      style={{ cursor: "pointer" }}
      pad={{ horizontal: "medium", top: "medium", bottom: "small" }}
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
  )
}

export default RecipePreview
