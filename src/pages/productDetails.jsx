import React, { useEffect, useState } from "react";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { products } from "../constants/products";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../redux/cart/cartSlice";
import { openCart } from "../redux/ui/cartDrawer";
import {
  HiOutlineX,
  HiOutlineCheck,
  HiOutlinePencil,
  HiOutlineTrash,
} from "react-icons/hi";
import ProductMediaGallery from "../components/product/ProductMediaGallery";
import ProductInfoForm from "../components/product/ProductInfoForm";
import ProductSizesEditor from "../components/product/ProductSizesEditor";
import ProductColorsEditor from "../components/product/ProductColorsEditor";
import {
  getProduct,
  productCreate,
  removeProduct,
  updateProduct,
} from "../functions/product";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ProductDetails() {
  const { slug } = useParams(); // 👈 make sure your route param is `:slug`
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userInfo);
  const navigate = useNavigate();
  const location = useLocation();

  const modeFromState = location.state?.mode || "view"; // default is view
  const [currentMode, setCurrentMode] = useState(modeFromState);

  const isEdit = currentMode === "edit";
  const isView = currentMode === "view";
  const isCreate = currentMode === "create";

  const emptyProduct = {
    Title: "",
    price: 0,
    promotion: 0,
    Quantity: 0,
    sold: 0,
    Description: "",
    category: "",
    media: [],
    colors: [],
    sizes: [],
  };

  const [product, setProduct] = useState(isCreate ? emptyProduct : null);
  const [loading, setLoading] = useState(true);

  const SERVER_URL = "https://supersiesta-server-i63m.onrender.com";

  const normalizeMediaSrc = (product) => {
    if (!product?.media) return product;

    const normalizedMedia = product.media.map((m) => ({
      ...m,
      src: m.src.startsWith("http") ? m.src : SERVER_URL + m.src,
    }));

    return { ...product, media: normalizedMedia };
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!isCreate) {
          const { data } = await getProduct(slug); // fetch by slug
          const normalizedProduct = normalizeMediaSrc(data); // update media src
          setProduct(normalizedProduct);
          console.log("✅ Product fetched:", normalizedProduct);
        }
      } catch (error) {
        console.error("❌ Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [isCreate, slug]);

  const [selectedMedia, setSelectedMedia] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  // Keep selections in sync when product changes
  useEffect(() => {
    if (product) {
      setSelectedMedia(product?.media?.[0] || null);
      setSelectedColor(product?.colors?.[0] || null);
      setSelectedSize(product?.sizes?.[0] || null);
    }
  }, [product]);

  if (loading) return <p>Chargement...</p>;
  if (!product) return <p>Produit non trouvé</p>;

  const handleAddToCart = () => {
    dispatch(
      addItem({
        productId: product._id,
        name: product.Title,
        price: selectedSize?.price ?? product.Price,
        image: selectedMedia?.src,
        selectedSize: selectedSize?.name ?? null,
        selectedSizePrice: selectedSize?.price ?? null,
        selectedColor: selectedColor?.name ?? null,
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
      src: url, // preview for UI
      alt: file.name,
      type: file.type.includes("video") ? "video" : "image",
      file: file, // ✅ store actual File object
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
    console.log(`Updated `, product);
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

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      // Basic fields
      formData.append("Title", product.Title);
      formData.append("Price", Number(product.price));
      formData.append("Promotion", Number(product.promotion));
      formData.append("Description", product.Description);
      formData.append("Category", product.category);
      formData.append("Quantity", product.Quantity);
      formData.append("sold", product.sold);
      // JSON fields
      formData.append("colors", JSON.stringify(product.colors || []));
      formData.append("sizes", JSON.stringify(product.sizes || []));

      // Media files
      console.log("Media before append:", product.media);

      product.media?.forEach((mediaItem, idx) => {
        if (mediaItem.file) {
          console.log(`✅ Appending media file ${idx}:`, mediaItem.file.name);
          formData.append("mediaFiles", mediaItem.file);
        } else {
          console.warn(`⚠️ No file found at index ${idx}`, mediaItem);
        }
      });

      // Optional single files
      if (product.imageFile) {
        console.log("Appending main image:", product.imageFile.name);
        formData.append("imageFile", product.imageFile);
      }
      if (product.pdf) {
        console.log("Appending PDF:", product.pdf.name);
        formData.append("pdf", product.pdf);
      }
      if (product.video) {
        console.log("Appending Video:", product.video.name);
        formData.append("video", product.video);
      }

      // 🔍 Debug FormData contents
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value instanceof File ? value.name : value);
      }

      // Send to server
      const res = await productCreate(formData);
      console.log("✅ Product created:", res.data);

      setCurrentMode("view");
    } catch (err) {
      console.error(
        "❌ Error creating product:",
        err.response?.data || err.message
      );
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();

      // -------------------------
      // Basic fields
      // -------------------------
      formData.append("Title", product.Title || "");
      formData.append("Price", Number(product.Price) || 0);
      formData.append("promotion", Number(product.promotion) || 0);
      formData.append("Description", product.Description || "");
      formData.append("Quantity", product.Quantity);
      formData.append("sold", product.sold);
      if (product.category) formData.append("Category", product.category);

      // -------------------------
      // Colors (send as indexed fields)
      // -------------------------
      if (Array.isArray(product.colors)) {
        product.colors.forEach((c, i) => {
          if (c.name) formData.append(`colors[${i}][name]`, c.name);
          if (c.value) formData.append(`colors[${i}][value]`, c.value);
        });
      }

      // -------------------------
      // Sizes (send as indexed fields)
      // -------------------------
      if (Array.isArray(product.sizes)) {
        product.sizes.forEach((s, i) => {
          if (s.name) formData.append(`sizes[${i}][name]`, s.name);
          if (s.price !== undefined)
            formData.append(`sizes[${i}][price]`, Number(s.price));
        });
      }

      // -------------------------
      // Media handling
      // -------------------------
      const existingMediaIds = product.media
        .filter((m) => m._id && !m.file) // keep only DB media
        .map((m) => m._id);

      const newFiles = product.media.filter((m) => m.file); // new uploads

      console.log("🖼️ Full media array:", product.media);
      console.log("📌 Existing media IDs to keep:", existingMediaIds);
      console.log("🆕 New media files to upload:", newFiles);

      // Append new files
      newFiles.forEach((m, idx) => {
        console.log(`✅ Appending new media file ${idx}:`, m.file.name);
        formData.append("mediaFiles", m.file);
      });

      // Append existing media IDs as repeated fields
      existingMediaIds.forEach((id) =>
        formData.append("existingMediaIds[]", id)
      );

      // -------------------------
      // Optional single files
      // -------------------------
      if (product.imageFile) formData.append("imageFile", product.imageFile);
      if (product.pdf) formData.append("pdf", product.pdf);
      if (product.video) formData.append("video", product.video);

      // -------------------------
      // Debug FormData contents
      // -------------------------
      console.log("📦 FormData contents before sending:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value instanceof File ? value.name : value);
      }

      // -------------------------
      // Send to server
      // -------------------------
      const res = await updateProduct(slug, formData);
      console.log("✅ Product updated:", res.data);

      setCurrentMode("view");
    } catch (err) {
      console.error(
        "❌ Error updating product:",
        err.response?.data || err.message
      );
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await removeProduct(slug);

      // update UI by filtering out deleted product
      //  setProducts((prev) => prev.filter((p) => p.slug !== slug));

      alert("✅ Product deleted successfully");
    } catch (error) {
      console.error("❌ Failed to delete product:", error);
      alert("Failed to delete product");
    }
    navigate("/shop"); // redirect to shop page
  };

  return (
    <div className="py-4 md:py-10 px-4 sm:px-6 lg:px-8">
      {user && (
        <div className="flex max-w-7xl mx-auto items-center justify-between border-b border-gray-200 pb-4 mb-6">
          {/* Center title */}
          <h1 className="md:text-xl text-base font-semibold text-gray-800">
            {isCreate ? "Créer un produit" : isEdit ? "Modifier produit" : ""}
          </h1>

          {/* Right actions (only if user is logged in) */}

          <div className="flex gap-2">
            {isCreate || isEdit ? (
              <>
                {/* Cancel */}
                <button
                  onClick={() => {
                    if (currentMode === "create") {
                      navigate(-1);
                    } else if (currentMode === "edit") {
                      setCurrentMode("view");
                    }
                  }}
                  className="flex items-center gap-1 md:px-4 px-2 md:py-2 py-1 
                       bg-gray-200 text-gray-700 rounded-lg 
                       hover:bg-gray-300 transition 
                       focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400"
                >
                  <HiOutlineX className="h-5 w-5" />
                  <span>Annuler</span>
                </button>

                {/* Save */}
                {/* Save */}
                <button
                  onClick={() => {
                    if (currentMode === "create") {
                      handleSubmit(); // 👉 create product
                    } else if (currentMode === "edit") {
                      handleUpdate(); // 👉 update product
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600  
             focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-400 
             rounded-xl shadow-sm hover:bg-green-100 transition"
                >
                  <HiOutlineCheck className="h-5 w-5" />
                  <span>Enregistrer</span>
                </button>
              </>
            ) : (
              <>
                {/* Edit */}
                <button
                  onClick={() => setCurrentMode("edit")}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 shadow-sm transition  focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400"
                >
                  <HiOutlinePencil className="h-5 w-5" />
                  <span>Modifier</span>
                </button>

                {/* Delete */}
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 shadow-sm transition  focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-400"
                >
                  <HiOutlineTrash className="h-5 w-5" />
                  <span>Supprimer</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto lg:flex lg:gap-12">
        {/* LEFT: Media gallery */}
        <ProductMediaGallery
          media={product?.media} // pass media array directly
          selectedMedia={selectedMedia} // currently selected
          onSelectMedia={setSelectedMedia} // when clicking thumbnail
          onAddMedia={handleFileUpload} // upload handler
          onDeleteMedia={deleteMedia} // delete handler
          isEditable={isEdit || isCreate} // edit/create flag
        />

        {/* RIGHT: Product Info */}
        <div className="w-full lg:w-1/2 mt-10 lg:mt-0">
          {/* Name, Price, Description */}
          {isEdit || isCreate ? (
            <>
              <ProductInfoForm product={product} setProduct={setProduct} />
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl mb-2">
                {product.Title}
              </h1>
              <p className="text-3xl text-gray-900 mb-6">
                {selectedSize?.price ?? product.Price} DT
              </p>
              <div className="mb-6">
                {" "}
                <h3 className="font-semibold">Description</h3>
                <p
                  className="mt-2 text-base text-gray-700 whitespace-pre-line"
                  dangerouslySetInnerHTML={{
                    __html: formatDescription(product.Description),
                  }}
                />
              </div>
            </>
          )}

          {/* Sizes */}
          <div className="mb-2">
            <h3 className="font-semibold text-gray-800 mb-1">Sizes & Prices</h3>
            {isEdit || isCreate ? (
              <ProductSizesEditor
                product={product}
                setProduct={setProduct}
                handleChangeProduct={handleChangeProduct}
              />
            ) : (
              <div className="grid md:grid-cols-4 grid-cols-3 gap-2 mt-2">
                {product.sizes.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedSize(s)}
                    className={classNames(
                      selectedSize?.name === s.name
                        ? "border-[#87a736] bg-[#87a736] text-white"
                        : "border-gray-300 bg-white text-gray-900",
                      "border rounded-md px-2 py-2 text-xs font-medium hover:border-[#87a736]"
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
            <h3 className="font-semibold mb-1">Colors</h3>
            {isEdit || isCreate ? (
              <ProductColorsEditor
                product={product}
                setProduct={setProduct}
                handleChangeProduct={handleChangeProduct}
              />
            ) : (
              <div className="flex gap-3 mt-2">
                {product.colors?.map((c, i) => (
                  <button
                    key={i}
                    style={{ backgroundColor: c.value ?? "#000" }}
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
