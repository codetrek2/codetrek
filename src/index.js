import React, { useContext } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { AuthProvider, AuthContext } from './component/Auth/AuthContext'; // Import AuthContext along with AuthProvider
import Navbar from './component/Navbar/Navbar';
import Footer from './component/Footer/Footer';
import Home from './Pages/Home/Home';
import Profile from './Pages/Profile/Profile';
import Tickets from './Pages/Tickets/Tickets';
import Messages from './Pages/Messages/Messages';
import MyTickets from './Pages/MyTickets/MyTickets'
import Contacts from './Pages/Contacts/Contacts';
import PostsPage from './Pages/PostsPage/PostsPage';
import AuthGuard from './component/Auth/AuthGuard';

// Separate AppContent for cleaner structure
const AppContent = () => {
  const { currentUser, loading } = useContext(AuthContext);

  if (loading) {
    return <p>Loading...</p>; // Optionally replace with a spinner or another loading component
  }

  return (
    <>
      {currentUser && <Navbar />} {/* Render Navbar only if the user is authenticated */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/profile"
          element={
            <AuthGuard>
              <Profile />
            </AuthGuard>
          }
        />
        <Route
          path="/myTickets"
          element={
            <AuthGuard>
              <MyTickets />
            </AuthGuard>
          }
        />
        <Route
          path="/posts"
          element={
            <AuthGuard>
              <PostsPage />
            </AuthGuard>
          }
        />
        <Route
          path="/ticket/:id"
          element={
            <AuthGuard>
              <Tickets />
            </AuthGuard>
          }
        />
        <Route
          path="/messages"
          element={
            <AuthGuard>
              <Messages />
            </AuthGuard>
          }
        />
        <Route
          path="/contact"
          element={
            <AuthGuard>
              <Contacts />
            </AuthGuard>
          }
        />
      </Routes>
      <Footer />
    </>
  );
};

const App = () => (
  <AuthProvider>
    <Router>
      <AppContent />
    </Router>
  </AuthProvider>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
