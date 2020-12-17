import React from 'react';
import Head from 'next/head';
import 'antd/dist/antd.css';
import LayoutComponent from '../components/layout';
import Dashboard from '../components/dashboard';

export default function Home() {
  // <div className={styles.container}>}
  return (
    <div>
      <Head>
        <title>Tellor Walker</title>
        <link rel="icon" href="/tellor-walker-fav.png" />
      </Head>
      <LayoutComponent>
        <Dashboard />
      </LayoutComponent>
    </div>
  );
}
