import type { AppProps } from 'next/app';
import Layout from './layout';
import './styles.scss';
import Head from 'next/head';
import { Analytics } from '@vercel/analytics/react';
 
export default function App({ Component, pageProps }: AppProps) {
  return <>
    <Head>
      <title>Brayanibp</title>
      <meta property='og:title' content='Brayanibp' key='title' />
      <meta charSet='utf-8' />
      <meta name='author' content='Brayan Isaac Bernal Pérez' />
      <meta name="copyright" content='Brayan Isaac Bernal Pérez' />
      <meta httpEquiv='expires' content='43200'/>
      <meta name='keywords' content='developer, fullstack, frontend, backend, dev, development, brayan, brayan bernal, back-end, full-stack, front-end, brayan isaac bernal pérez, brayan isaac bernal perez, desarrollador, web, mobile'/>
      <meta name='description' content='I am a Full-Stack Developer with +5 years of experience with Node.js, React.js | Angular, Redux, RxJS, MySQL, GCP and Firebase. I have worked in health insurance companies, software development companies and emerging startups, but also have a B2 English level.'/>
    </Head>
    <Layout>
      <Component {...pageProps} />
    </Layout>
    <Analytics />
  </>;
}