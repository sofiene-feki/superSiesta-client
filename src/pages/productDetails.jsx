import { useEffect, useState } from "react";
import { StarIcon } from "@heroicons/react/20/solid";
import React from "react";
import { PlayIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { products } from "../constants/products";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addItem } from "../redux/cart/cartSlice";
import { openCart } from "../redux/ui/cartDrawer";

const reviews = {
  average: 4,
  totalCount: 117,
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ProductDetails() {
  const { name } = useParams(); // assumes route param named `productId`
  const dispatch = useDispatch();

  const product = products.find((p) => p.name === name);
  if (!product) return <p>Produit non trouvé</p>;

  const [selectedMedia, setSelectedMedia] = useState(product.media[0]);
  const [selectedColor, setSelectedColor] = useState(
    Array.isArray(product.colors) && product.colors.length > 0
      ? product.colors[0]
      : null
  );

  const [selectedSize, setSelectedSize] = useState(
    Array.isArray(product.sizes) && product.sizes.length > 0
      ? product.sizes[0]
      : null
  );

  useEffect(() => {
    if (product) {
      setSelectedMedia(product.media?.[0] || null);
      setSelectedColor(
        Array.isArray(product.colors) && product.colors.length > 0
          ? product.colors[0]
          : null
      );
      setSelectedSize(
        Array.isArray(product.sizes) && product.sizes.length > 0
          ? product.sizes[0]
          : null
      );
    }
  }, [name, products]); // re-run when the route param or products change

  if (!product) return <p>Produit non trouvé</p>;
  // Find the product based on productId param

  // Handle case if product not found
  const handleAddToCart = () => {
    dispatch(
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: selectedMedia.src,
        selectedSize: selectedSize?.id ?? null, // fallback to null
        selectedSizePrice: selectedSize?.price ?? null, // fallback to null
        selectedColor: selectedColor?.id ?? null,
        colors: product.colors,
        sizes: product.sizes,
      })
    );
    dispatch(openCart());
  };

  function formatDescription(text) {
    return (
      text
        // 1️⃣ Add newline before ✓ (except if it's the first char)
        .replace(/(?!^)\s*✓/g, "\n✓")
        // 2️⃣ Bold text between *...*
        .replace(/\*(.*?)\*/g, "<strong>$1</strong>")
    );
  }
  return (
    <div className=" py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto lg:flex lg:gap-12">
        {/* LEFT: Media gallery */}
        <div className="w-full lg:w-1/2">
          {/* Main Media */}
          <div className="mb-4">
            {selectedMedia.type === "image" ? (
              <img
                src={selectedMedia.src}
                alt={selectedMedia.alt}
                className="w-full h-auto object-cover rounded-lg shadow-md"
              />
            ) : (
              <video
                src={selectedMedia.src}
                controls
                className="w-full h-auto rounded-lg shadow-md"
                alt={selectedMedia.alt}
              />
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex flex-wrap gap-3 justify-start">
            {product.media.map((mediaItem, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedMedia(mediaItem)}
                className={`relative md:w-20 md:h-20 w-16 h-16  border-2 rounded-md overflow-hidden ${
                  selectedMedia.src === mediaItem.src
                    ? "border-[#87a736]"
                    : "border-gray-300"
                }`}
                aria-label={mediaItem.alt}
              >
                {mediaItem.type === "image" ? (
                  <img
                    src={mediaItem.src}
                    alt={mediaItem.alt}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <video
                      src={mediaItem.src}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                    />
                    {/* Play icon overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="rounded-full bg-gray-50/74  border border-white p-2">
                        <PlayIcon className="h-6 w-6 text-gray-500" />
                      </div>
                    </div>
                  </>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: Product Info */}
        <div className="w-full lg:w-1/2 mt-10 lg:mt-0">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl mb-2">
            {product.name}
          </h1>

          {/* Add your reviews and other info here */}

          <p className="text-3xl text-gray-900 mb-6">
            {selectedSize?.price != null ? selectedSize.price : product.price}{" "}
            DT
          </p>
          {/* Colors */}
          {/* Colors */}
          {Array.isArray(product.colors) && product.colors.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Couleur
              </h3>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.id}
                    aria-label={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={classNames(
                      color.classes,
                      selectedColor?.id === color.id
                        ? "ring-2 ring-[#87a736] ring-offset-2"
                        : "ring-1 ring-gray-300",
                      "w-8 h-8 rounded-full border border-gray-200 focus:outline-none"
                    )}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {Array.isArray(product.sizes) && product.sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Taille</h3>
              <div className="grid md:grid-cols-5 grid-cols-4 gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size.id}
                    disabled={!size.inStock}
                    onClick={() => setSelectedSize(size)}
                    className={classNames(
                      selectedSize?.id === size.id
                        ? "border-[#87a736] bg-[#87a736] text-white"
                        : "border-gray-300 bg-white text-gray-900",
                      !size.inStock && "opacity-50 cursor-not-allowed",
                      "border rounded-md px-2 py-1 text-sm font-medium hover:border-[#87a736]"
                    )}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-4  rounded-md bg-[#87a736] px-6 py-3 text-white font-semibold hover:bg-[#87a736] transition"
          >
            <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
            Ajouter au panier
          </button>

          {/* Description */}
          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-900">Description</h3>
            <p
              className="mt-2 text-base text-gray-700 whitespace-pre-line"
              dangerouslySetInnerHTML={{
                __html: formatDescription(product.description),
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
