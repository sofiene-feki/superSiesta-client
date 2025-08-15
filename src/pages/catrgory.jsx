import ShopFilters from "../components/shop/shopFilters";
import React, { useEffect, useState } from "react";
import { products } from "../constants/products";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

export default function Category() {
  const { category } = useParams(); // read category from URL (e.g. /category/imprimante)

  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    // Filter by category param (case-insensitive)
    const categoryProducts = products.filter(
      (p) => p.category?.toLowerCase() === category?.toLowerCase()
    );
    setFilteredProducts(categoryProducts);
    console.log(category);
  }, [category]);

  return <ShopFilters products={filteredProducts} />;
}
