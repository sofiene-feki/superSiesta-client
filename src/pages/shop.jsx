import ShopFilters from "../components/shop/shopFilters";
import React, { useEffect } from "react";
import { products } from "../constants/products";
import { useSelector } from "react-redux";

export default function Shop() {
  const filters = useSelector((state) => state.filters);
  const { selected, openSections } = useSelector((state) => state.filters);

  useEffect(() => {
    console.log("Filters state changed:", filters);
  }, [filters]); // will log every time filters updates
  return <ShopFilters products={products} />;
}
