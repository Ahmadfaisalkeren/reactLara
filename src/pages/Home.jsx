import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const Home = () => {
  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: '1' }}>
          <h1 className='text-center mt-3'>Welcome To Laravel API and Vite + React JS CRUD App</h1>
        </div>
      </div>
    </div>
  );
};

export default Home;
