import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppProviders from './providers/AppProviders';
import { ROUTES } from './config/routes.config';
import Header from './components/layouts/Header/Header';
import Footer from './components/layouts/Footer/Footer';
import AuthModal from './features/auth/AuthModal/AuthModal';
import Home from './pages/Home/Home';
import Services from './pages/Services/Services';
import Partners from './pages/Partners/Partners';
import Profile from './pages/Profile/Profile';
import BookingDetail from './features/bookings/BookingDetail/BookingDetail';
import BookOrder from './pages/BookOrder/BookOrder';
import Queue from './pages/Queue/Queue';

function App() {
  return (
    <AppProviders>
      <Header />
      <Routes>
        <Route path={ROUTES.home} element={<Home />} />
        <Route path={ROUTES.services} element={<Services />} />
        <Route path={ROUTES.partners} element={<Partners />} />
        <Route path={ROUTES.profile} element={<Profile />} />
        <Route path={ROUTES.bookingDetail} element={<BookingDetail />} />
        <Route path={ROUTES.book} element={<BookOrder />} />
        <Route path={ROUTES.queue} element={<Queue />} />
      </Routes>
      <Footer />
      <AuthModal />
    </AppProviders>
  );
}

export default App;
