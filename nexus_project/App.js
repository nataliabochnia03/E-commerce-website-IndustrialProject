import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';

import Home from './views/Home';

import Login from './views/Login';
import Signup from './views/Signup';

import Product from './views/Product';
import ProductsCategory from './views/ProductsCategory';
import SearchResult from './views/SearchResult';

import Admin from './views/Admin';
import AdminImportSpecificProduct from './views/AdminImportSpecificProduct';
import AdminStock from './views/AdminStock';
import AdminImportBulkProducts from './views/AdminImportBulkProducts';
import AdminCategories from './views/AdminCategories';
import AdminCategoriesNew from './views/AdminCategoriesNew';
import AdminCategoriesEdit from './views/AdminCategoriesEdit';

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/product/:productId" element={<Product />} />
            <Route path="/category/:categoryName" element={<ProductsCategory />} />
            <Route path="/search/:searchTerm" element={<SearchResult />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/import-specific-product" element={<AdminImportSpecificProduct />} />
            <Route path="/admin/stock" element={<AdminStock />} />
            <Route path="/admin/import-bulk-products" element={<AdminImportBulkProducts />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/categories/new" element={<AdminCategoriesNew />} />
            <Route path="/admin/categories/edit/:id" element={<AdminCategoriesEdit />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
