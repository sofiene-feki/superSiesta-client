import React, { useEffect, useState } from "react";
import {
  PlayIcon,
  ShoppingCartIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { products } from "../constants/products";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../redux/cart/cartSlice";
import { openCart } from "../redux/ui/cartDrawer";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ProductDetails({ mode = "view" }) {
  const { name } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userInfo); // Get user from Redux

  const [currentMode, setCurrentMode] = useState(mode);
  const toggleMode = () => {
    setCurrentMode((prev) => (prev === "edit" ? "view" : "edit"));
  };
  const isEdit = currentMode === "edit";
  const isView = currentMode === "view";
  const isCreate = currentMode === "create";
  // Initialize product based on mode
  const initialProduct = isCreate
    ? {
        name: "",
        price: "",
        description: "",
        media: [],
        colors: [],
        sizes: [],
      }
    : products.find((p) => p.name === name);

  const [product, setProduct] = useState(initialProduct);
  const [selectedMedia, setSelectedMedia] = useState(
    initialProduct?.media?.[0] || null
  );
  const [selectedColor, setSelectedColor] = useState(
    initialProduct?.colors?.[0] || null
  );
  const [selectedSize, setSelectedSize] = useState(
    initialProduct?.sizes?.[0] || null
  );

  useEffect(() => {
    setSelectedMedia(product?.media?.[0] || null);
    setSelectedColor(product?.colors?.[0] || null);
    setSelectedSize(product?.sizes?.[0] || null);
  }, [product]);

  if (!product) return <p>Produit non trouvé</p>;

  const handleAddToCart = () => {
    dispatch(
      addItem({
        productId: product.id,
        name: product.name,
        price: selectedSize?.price ?? product.price,
        image: selectedMedia?.src,
        selectedSize: selectedSize?.id ?? null,
        selectedSizePrice: selectedSize?.price ?? null,
        selectedColor: selectedColor?.id ?? null,
        colors: product.colors,
        sizes: product.sizes,
      })
    );
    dispatch(openCart());
  };

  // Media functions
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const newMedia = {
      src: url,
      alt: file.name,
      type: file.type.includes("video") ? "video" : "image",
    };
    setProduct((prev) => ({ ...prev, media: [...prev.media, newMedia] }));
    setSelectedMedia(newMedia);
  };

  const deleteMedia = (idx) => {
    const updatedMedia = product.media.filter((_, i) => i !== idx);
    setProduct((prev) => ({ ...prev, media: updatedMedia }));
    setSelectedMedia(updatedMedia[0] || null);
  };

  // Generic handler for colors/sizes
  const handleChangeProduct = (e, idx, key, type) => {
    const value = e.target.value;
    setProduct((prev) => ({
      ...prev,
      [type]: prev[type].map((item, i) =>
        i === idx ? { ...item, [key]: value } : item
      ),
    }));
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
    <div className="py-10 px-4 sm:px-6 lg:px-8">
      {user && (
        <button
          onClick={toggleMode}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {isEdit ? "Switch to View Mode" : "Switch to Edit Mode"}
        </button>
      )}

      <div className="max-w-7xl mx-auto lg:flex lg:gap-12">
        {/* LEFT: Media gallery */}
        <div className="w-full lg:w-1/2 mb-6 lg:mb-0">
          <div className="mb-4">
            {selectedMedia ? (
              selectedMedia.type === "image" ? (
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
                />
              )
            ) : (
              <p className="text-gray-400">No media</p>
            )}
          </div>

          <div className="flex flex-wrap gap-3 justify-start">
            {product.media.map((mediaItem, idx) => (
              <div key={idx} className="relative">
                <button
                  onClick={() => setSelectedMedia(mediaItem)}
                  className={`relative md:w-20 md:h-20 w-16 h-16 border-2 rounded-md overflow-hidden ${
                    selectedMedia?.src === mediaItem.src
                      ? "border-[#87a736]"
                      : "border-gray-300"
                  }`}
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
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="rounded-full bg-gray-50/74 border border-white p-2">
                          <PlayIcon className="h-6 w-6 text-gray-500" />
                        </div>
                      </div>
                    </>
                  )}
                </button>

                {isEdit || isCreate ? (
                  <button
                    onClick={() => deleteMedia(idx)}
                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow text-red-500 hover:bg-red-100"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
            ))}

            {(isEdit || isCreate) && (
              <label className="w-16 h-16 border border-gray-300 rounded-md flex items-center justify-center text-gray-500 cursor-pointer">
                +
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* RIGHT: Product Info */}
        <div className="w-full lg:w-1/2 mt-10 lg:mt-0">
          {/* Name, Price, Description */}
          {isEdit || isCreate ? (
            <>
              <input
                type="text"
                value={product.name}
                onChange={(e) =>
                  setProduct({ ...product, name: e.target.value })
                }
                placeholder="Product Name"
                className="border w-full mb-4  p-1"
              />
              <input
                type="number"
                value={product.price}
                onChange={(e) =>
                  setProduct({ ...product, price: e.target.value })
                }
                placeholder="Price"
                className="border w-full mb-4 p-1"
              />
              <textarea
                value={product.description}
                onChange={(e) =>
                  setProduct({ ...product, description: e.target.value })
                }
                placeholder="Description"
                className="border w-full p-2 mb-4"
              />
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl mb-2">
                {product.name}
              </h1>
              <p className="text-3xl text-gray-900 mb-6">
                {selectedSize?.price ?? product.price} DT
              </p>
              <div className="mb-6">
                {" "}
                <h3 className="font-semibold">Description</h3>
                <p
                  className="mt-2 text-base text-gray-700 whitespace-pre-line"
                  dangerouslySetInnerHTML={{
                    __html: formatDescription(product.description),
                  }}
                />
              </div>
            </>
          )}

          {/* Sizes */}
          <div className="mb-6">
            <h3 className="font-semibold">Sizes & Prices</h3>
            {isEdit || isCreate ? (
              <div className="mt-2 space-y-2">
                {product.sizes.map((s, i) => (
                  <div
                    key={i}
                    className="flex flex-row md:flex-row gap-2 items-center w-full"
                  >
                    <input
                      type="text"
                      value={s.name}
                      onChange={(e) =>
                        handleChangeProduct(e, i, "name", "sizes")
                      }
                      placeholder="Size (e.g., 80x190)"
                      className="border rounded p-2 w-full md:w-1/2"
                    />
                    <input
                      type="text"
                      value={s.price ?? ""}
                      onChange={(e) =>
                        handleChangeProduct(e, i, "price", "sizes")
                      }
                      placeholder="Price"
                      className="border rounded p-2 w-full md:w-1/4"
                    />
                    <button
                      onClick={() =>
                        setProduct((prev) => ({
                          ...prev,
                          sizes: prev.sizes.filter((_, idx) => idx !== i),
                        }))
                      }
                      className="bg-red-500 text-white px-4 py-2 rounded w-full md:w-auto"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  onClick={() =>
                    setProduct((prev) => ({
                      ...prev,
                      sizes: [...(prev.sizes || []), { name: "", price: "" }],
                    }))
                  }
                  className="mt-2 bg-indigo-500 text-white px-4 py-2 rounded w-full md:w-auto"
                >
                  + Add Size
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-4 grid-cols-3 gap-1 md:gap-2 mt-2">
                {product.sizes.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedSize(s)}
                    className={classNames(
                      selectedSize?.name === s.name
                        ? "border-[#87a736] bg-[#87a736] text-white"
                        : "border-gray-300 bg-white text-gray-900",
                      "border rounded-md px-1 py-2 text-xs font-medium hover:border-[#87a736]"
                    )}
                  >
                    {s.name} - {s.price ?? product.price} DT
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Colors */}
          <div className="mb-6">
            <h3 className="font-semibold">Colors</h3>
            {isEdit || isCreate ? (
              <>
                {product.colors?.map((c, i) => (
                  <div key={i} className="flex gap-2 mt-2 items-center">
                    <input
                      type="text"
                      value={c.name}
                      onChange={(e) =>
                        handleChangeProduct(e, i, "name", "colors")
                      }
                      placeholder="Color Name"
                      className="border rounded p-2 flex-1"
                    />
                    <input
                      type="color"
                      value={c.value ?? "#000000"}
                      onChange={(e) =>
                        handleChangeProduct(e, i, "value", "colors")
                      }
                      className="w-12 h-10 border rounded"
                    />
                    <button
                      onClick={() =>
                        setProduct((prev) => ({
                          ...prev,
                          colors: prev.colors.filter((_, idx) => idx !== i),
                        }))
                      }
                      className="bg-red-500 text-white px-2 rounded"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  onClick={() =>
                    setProduct((prev) => ({
                      ...prev,
                      colors: [
                        ...(prev.colors || []),
                        { name: "", value: "#000000" },
                      ],
                    }))
                  }
                  className="mt-3 bg-indigo-500 text-white px-4 py-2 rounded w-full md:w-auto"
                >
                  + Add Color
                </button>
              </>
            ) : (
              <div className="flex gap-3 mt-2">
                {product.colors?.map((c, i) => (
                  <button
                    key={i}
                    style={{ backgroundColor: c.name ?? "#000" }}
                    className={classNames(
                      selectedColor?.name === c.name
                        ? "ring-2 ring-[#87a736] ring-offset-2"
                        : "ring-1 ring-gray-300",
                      "w-8 h-8 rounded-full border border-gray-200"
                    )}
                    onClick={() => setSelectedColor(c)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Add to Cart */}
          {isView && (
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-4 rounded-md bg-[#87a736] px-6 py-3 text-white font-semibold hover:bg-[#87a736] transition"
            >
              <ShoppingCartIcon className="h-6 w-6" />
              Ajouter au panier
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
