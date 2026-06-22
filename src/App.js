import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import AuthModal from './components/AuthModal/AuthModal';
import Home from './pages/Home/Home';
import Services from './pages/Services/Services';
import Partners from './pages/Partners/Partners';
import Profile from './pages/Profile/Profile';
import BookingDetail from './pages/BookingDetail/BookingDetail';
import BookOrder from './pages/BookOrder/BookOrder';
import Queue from './pages/Queue/Queue';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/booking/:id" element={<BookingDetail />} />
          <Route path="/book" element={<BookOrder />} />
          <Route path="/queue" element={<Queue />} />
        </Routes>
        <Footer />
        <AuthModal />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
