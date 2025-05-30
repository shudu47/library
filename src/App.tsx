import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import BookDetailsPage from './pages/BookDetailsPage';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageBooksPage from './pages/admin/ManageBooksPage';
import ManageOrdersPage from './pages/admin/ManageOrdersPage';
import AddBookPage from './pages/admin/AddBookPage';
import EditBookPage from './pages/admin/EditBookPage';
import PrivateRoute from './components/auth/PrivateRoute';
import NotFoundPage from './pages/NotFoundPage';
import NewBorrowingPage from './pages/admin/NewBorrowingPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public routes */}
        <Route index element={<HomePage />} />
        <Route path="books/:id" element={<BookDetailsPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="login" element={<LoginPage />} />
        
        {/* Admin routes */}
        <Route path="admin" element={<PrivateRoute />}>
          <Route index element={<AdminDashboard />} />
          <Route path="books" element={<ManageBooksPage />} />
          <Route path="books/add" element={<AddBookPage />} />
          <Route path="books/edit/:id" element={<EditBookPage />} />
          <Route path="orders" element={<ManageOrdersPage />} />
          <Route path="newborrowing" element={<NewBorrowingPage />} />
        </Route>
        
        {/* Not found */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;


