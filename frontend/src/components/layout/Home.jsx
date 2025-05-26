import React from 'react';
import { Outlet } from 'react-router';
import Header from './Header';

export default function Home() {
  return (
    <>
      <Header />
      <main style={{ padding: '1rem' }}>
        <Outlet />
      </main>
    </>
  );
}