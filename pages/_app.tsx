import type { AppProps } from 'next/app';
import Layout from './layout';
import './styles.scss';
import { Analytics } from '@vercel/analytics/react';
 
export default function App({ Component, pageProps }: AppProps) {
  return <>
    <Layout>
      <Component {...pageProps} />
    </Layout>
    <Analytics />
  </>;
}