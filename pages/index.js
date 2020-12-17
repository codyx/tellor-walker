import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import 'antd/dist/antd.css';
import Dashboard from '../components/dashboard';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Tellor Walker</title>
        <link rel="icon" href="/tellor-walker-fav.png" />
      </Head>

      <Image
        src="/TellorWalker.png"
        alt="Tellor Walker"
        width="150"
        height="150"
        style={{
          margin: '0 auto',
        }}
      />
      <main className={styles.main}>
        <Dashboard />
      </main>

      <footer className={styles.footer}>
        <a
          href="https://github.com/codyx/tellor-walker"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="github.svg" alt="Tellor Walker GitHub" className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}
