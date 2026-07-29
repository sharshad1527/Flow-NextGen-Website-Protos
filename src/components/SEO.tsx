import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title: string
  description: string
  ogImage?: string
  canonicalPath?: string
}

const SITE_NAME = 'Flow NextGen'
const BASE_URL = 'https://flownextgen.netlify.app'
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.webp`

export function SEO({ title, description, ogImage, canonicalPath }: SEOProps) {
  const fullTitle = `${title} | ${SITE_NAME}`
  const image = ogImage || DEFAULT_OG_IMAGE
  const url = canonicalPath ? `${BASE_URL}${canonicalPath}` : BASE_URL

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Canonical */}
      <link rel="canonical" href={url} />
    </Helmet>
  )
}
