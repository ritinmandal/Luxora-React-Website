import React, { useState, useMemo, lazy, Suspense } from 'react';
import { ThemeProvider, createTheme, CssBaseline, CircularProgress, Box } from '@mui/material';
import { Routes, Route } from 'react-router-dom';

import Header from '../Layouts/Header';
import Footer from '../Layouts/Footer';
import ProtectedRoute from '../Components/ProtectedRoute';
import ScrollToTop from '../Components/ScrollToTop';
import PaymentGateway from '../Pages/PaymentGateway';
import AdminDashboard from '../Pages/Admindashboard';

const Home = lazy(() => import('../Pages/Home'));
const Rooms = lazy(() => import('../Pages/Rooms'));
const AuthForm = lazy(() => import('../Pages/Signup'));
const MyCart = lazy(() => import('../Pages/MyCart'));
const Dashboard = lazy(() => import('../Pages/Dashboard'));
const About = lazy(() => import('../Pages/Aboutpg'));
const TestimonialsAndStats = lazy(() => import('../Pages/Blogs'));
const DiningPagePremium = lazy(() => import('../Pages/Dining'));
const Contact = lazy(() => import('../Pages/Contact'));
const OrderReceived = lazy(() => import('../Pages/OrderReceived'));

const Routing = () => {
  const [darkMode, setDarkMode] = useState(false);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
        },
      }),
    [darkMode]
  );

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} />

      <ScrollToTop />

      <Suspense
        fallback={
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
            <CircularProgress />
          </Box>
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/signup" element={<AuthForm />} />
          <Route path="/cart" element={<MyCart />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<TestimonialsAndStats />} />
          <Route path="/dine" element={<DiningPagePremium />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/order_received" element={<OrderReceived />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path='/payment_gateway' element={<PaymentGateway/>}/>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>

      <Footer />
    </ThemeProvider>
  );
};

export default Routing;
