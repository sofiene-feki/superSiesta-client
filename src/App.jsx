import { useState } from "react";
import React from "react";

import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import About from "./pages/about";
import Shop from "./pages/shop";
import Header from "./components/header/Header";
import HeaderBottom from "./components/header/HeaderBottom";
import Cart from "./components/cart/Cart";
import ProductDetails from "./pages/productDetails";
import Home from "./pages/home";
import CheckoutPage from "./pages/checkout";
import Footer from "./components/footer/Footer";
import Category from "./pages/catrgory";
import Contact from "./pages/contact";

function App() {
  return (
    <>
      <Header />
      <HeaderBottom />
      <Cart />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="shop" element={<Shop />} />
        <Route path="category/:category" element={<Category />} />
        <Route path="Checkout" element={<CheckoutPage />} />
        <Route path="/product/:name" element={<ProductDetails />} />
        <Route path="/*" element={"rawa7"} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
