import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import React from "react";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { openCart } from "../../redux/ui/cartDrawer";
import { addItem } from "../../redux/cart/cartSlice";
import { useDispatch } from "react-redux";

export default function Product({ product }) {
  const view = useSelector((state) => state.view.view);
  const dispatch = useDispatch();
  // Get first image media for preview, fallback to placeholder if none
  const mainMedia = product.media?.find((m) => m.type === "image");
  const imageSrc = mainMedia
    ? mainMedia.src
    : "https://via.placeholder.com/300";
  const imageAlt = mainMedia ? mainMedia.alt : product.name;

  // Get first color name or empty string
  const firstColor = product.colors?.[0]?.name || "";
  const firstSize = product.sizes?.[0]?.name || "M";

  const handleAddToCart = () => {
    dispatch(
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: imageSrc,
        selectedSize: firstSize,
        selectedColor: firstColor,
        colors: product.colors,
        sizes: product.sizes,
      })
    );
    dispatch(openCart());
  };

  if (view === "list") {
    return (
      <div className="flex space-x-4 p-4 border border-gray-100 rounded-md shadow-md hover:shadow-md">
        <img
          alt={imageAlt}
          src={imageSrc}
          className="w-54 h-54 object-cover rounded-md flex-shrink-0"
        />
        <div className="flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              <Link to={`/product/${product.name}`}>{product.name}</Link>
            </h3>
            <p className="text-sm text-gray-500">{firstColor}</p>
          </div>
          <p className="text-md font-medium text-gray-900">{product.price}</p>
        </div>
      </div>
    );
  }

  // Default grid view
  return (
    <div className="group relative border border-gray-200 rounded-md cursor-pointer">
      <Link to={`/product/${product.name}`}>
        {/* Image Wrapper (no padding) */}
        <div className="aspect-square w-full rounded-t-md bg-gray-200 overflow-hidden">
          <img
            alt={imageAlt}
            src={imageSrc}
            className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
        </div>

        {/* Product Info + Button Wrapper (with padding) */}
        <div className="p-2 bg-white">
          {/* Product Info */}
          <div className="mt-2 flex justify-between">
            <h3 className="text-md font-medium text-gray-700 group-hover:text-[#87a736] transition-colors duration-300">
              {product.name.length > 25
                ? product.name.slice(0, 25) + "..."
                : product.name}
            </h3>

            <p className="text-md font-medium text-gray-900 group-hover:text-[#87a736] transition-colors duration-300">
              {product.price}
            </p>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-2 w-full px-2 py-2 mt-4
        bg-[#87a736] text-white font-semibold rounded-lg shadow-sm 
        hover:bg-[#87a736] hover:text-white transition duration-300 ease-in-out"
          >
            <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
            Ajouter au panier
          </button>
        </div>
      </Link>
    </div>
  );
}
