import type { AppProps } from 'next/app';
import Layout from './layout';
import './styles.scss';
import Head from 'next/head';
import { Analytics } from '@vercel/analytics/react';
 
export default function App({ Component, pageProps }: AppProps) {
  return <>
    <Head>
      <title>BrayanIBP</title>
      <meta property='og:title' content='Brayanibp' key='title' />
      <meta charSet='utf-8' />
      <meta name='author' content='Brayan Isaac Bernal Pérez' />
      <meta name="copyright" content='Brayan Isaac Bernal Pérez' />
      <meta httpEquiv='expires' content='43200'/>
      <meta name='keywords' content='brayanibp, developer, fullstack, frontend, backend, dev, development, brayan, bernal, brayan bernal, brayan bernal dev, back-end, full-stack, front-end, brayan isaac bernal pérez, brayan isaac bernal perez, brayanibo, desarrollador, web, mobile'/>
      <meta name='description' content='I am a Full-Stack Developer with +5 years of experience with Node.js, React.js | Angular, Redux, RxJS, MySQL, GCP and Firebase. I have worked in health insurance companies, software development companies and emerging startups, but also have a B2 English level.'/>
      <meta property='og:type' content='website' />
      <meta property='og:image' itemProp='image primaryImageOfPage' content={`${ process.env.NEXT_PUBLIC_SITE_PREVIEW_URL || 'https://drive.google.com/uc?export=view&id=1SSqbZKrCzz3K098YAqdtw_65Xh9wX0rQ'}`} />
      <meta property='og:url' content='brayanibp.dev' />
      <meta name="google-site-verification" content="75jwz6yeL2o54tRNmCKC1D08v5ZdbS9LoGZqOiW_hBY" />
      <link rel="shortcut icon" href="/image/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/image/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="512x512" href="/image/android-chrome-512x512.png" />
      <link rel="icon" type="image/png" sizes="192x192" href="/image/android-chrome-192x192.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/image/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/image/favicon-16x16.png" />
      <link rel="canonical" href="https://brayanibp.dev"/>
    </Head>
    <Layout>
      <Component {...pageProps} />
    </Layout>
    <Analytics />
  </>;
}