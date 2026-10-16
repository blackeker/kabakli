import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="tr">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        
        {/* SEO Meta Tags */}
        <title>Ahmet Kabaklı Menü - Günlük Menü Bilgileri</title>
        <meta name="description" content="Ahmet Kabaklı'nın günlük menü bilgilerini görüntüleyebileceğiniz uygulama. Kahvaltı ve akşam yemeği menülerini tarih別に görüntüleyin." />
        <meta name="keywords" content="Ahmet Kabaklı, menü, yemek, kahvaltı, akşam yemeği, günlük menü" />
        
        {/* Open Graph Meta Tags (for Facebook, LinkedIn, etc.) */}
        <meta property="og:title" content="Ahmet Kabaklı Menü" />
        <meta property="og:description" content="Günlük menü bilgilerini görüntüleyebileceğiniz uygulama" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ahmetkabakli.menu" />
        <meta property="og:image" content="/icons/icon-512x512.png" />
        <meta property="og:site_name" content="Ahmet Kabaklı Menü" />
        <meta property="og:locale" content="tr_TR" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Ahmet Kabaklı Menü" />
        <meta name="twitter:description" content="Günlük menü bilgilerini görüntüleyebileceğiniz uygulama" />
        <meta name="twitter:image" content="/icons/icon-512x512.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}