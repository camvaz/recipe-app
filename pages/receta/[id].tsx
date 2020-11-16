import AppLayout from "components/AppLayout/AppLayout"
import SEO from "components/SEO/SEO"
import { useRouter } from "next/router"
import React from "react"

interface RecipeProps {}

const RecipeID: React.FC<RecipeProps> = ({}) => {
  const router = useRouter()
  const { id } = router.query
  return (
    <AppLayout>
      <SEO title={id as string} />
    </AppLayout>
  )
}

export default RecipeID
