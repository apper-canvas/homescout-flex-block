import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/Layout";
import HomePage from "@/components/pages/HomePage";
import SearchPage from "@/components/pages/SearchPage";
import FavoritesPage from "@/components/pages/FavoritesPage";
import MyToursPage from "@/components/pages/MyToursPage";
import PropertyDetailsPage from "@/components/pages/PropertyDetailsPage";
function App() {
  return (
    <BrowserRouter>
      <div className="App">
<Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="favorites" element={<FavoritesPage />} />
            <Route path="my-tours" element={<MyToursPage />} />
            <Route path="property/:id" element={<PropertyDetailsPage />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;