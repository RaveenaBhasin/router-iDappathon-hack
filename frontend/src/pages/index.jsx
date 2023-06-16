import Head from 'next/head'
import { Footer } from '@/components/Footer'
import Header from '@/components/Header'
export default function Home() {
  return (
    <>
      <Head>
        <title>ChainFlow</title>
        <meta
          name="description"
          content="Cross Chain Fund Transfer Accelerator"
        />
      </Head>
      <Header />
      <main>
      
      </main>
      <Footer />
    </>
  )
}
