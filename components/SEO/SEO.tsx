import React from "react"
import Head from "next/head"

interface SEOProps {
  title: string
}

const SEO: React.FC<SEOProps> = ({ title }) => {
  return (
    <Head>
      <title>{title} | FridgeCook</title>
    </Head>
  )
}

export default SEO
