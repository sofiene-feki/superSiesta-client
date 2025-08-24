import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getBestSellers } from "../../functions/product"; // API call
import Product from "../product/Product";
import { LoadingProduct, NextArrow, PrevArrow } from "../ui";
import { Link } from "react-router-dom";

export default function NewArrivals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const SERVER_URL = "https://supersiesta-server-i63m.onrender.com";

  const normalizeMediaSrc = (input) => {
    if (!input) return input;

    if (Array.isArray(input)) {
      return input.map((product) => normalizeMediaSrc(product));
    }

    if (!input.media) return input;

    const normalizedMedia = input.media.map((m) => ({
      ...m,
      src: m.src.startsWith("http") ? m.src : SERVER_URL + m.src,
    }));

    return { ...input, media: normalizedMedia };
  };

  useEffect(() => {
    const fetchBestSellers = async () => {
      setLoading(true);
      try {
        const { data } = await getBestSellers();
        const normalizedProducts = normalizeMediaSrc(data.products || []);
        setProducts(normalizedProducts);
        console.log(
          "✅ Best sellers fetched and normalized:",
          normalizedProducts
        );
      } catch (err) {
        console.error("❌ Error fetching best sellers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  const desktopSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  const mobileSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1.2,
    slidesToScroll: 1,
    arrows: false,
    swipeToSlide: true,
    centerMode: false,
  };

  return (
    <div className="mx-auto max-w-7xl md:mb-16 py-4 md:py-8 sm:px-6 sm:py-8">
      <div className="flex px-2 items-center mb-2 justify-between">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900">
          Meilleur Vente
        </h2>
        <Link to="/shop">
          {" "}
          <h2 className="cursor-pointer text-blue-600 font-semibold hover:underline">
            Voir tous →
          </h2>
        </Link>
      </div>

      {loading ? (
        <LoadingProduct length={isMobile ? 1 : 4} cols={4} />
      ) : (
        <Slider
          className="shadow-lg  md:shadow-xl hover:shadow-2xl transition-shadow duration-300  md:border border-gray-200   bg-white"
          {...(isMobile ? mobileSettings : desktopSettings)}
        >
          {products.map((product) => (
            <div key={product._id} className="md:py-3 md:px-2 py-1 px-1">
              <Product product={product} />
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
}
