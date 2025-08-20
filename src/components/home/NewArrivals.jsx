import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { getNewArrivals } from "../../functions/product"; // API call
import Product from "../product/Product";

function NextArrow({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="absolute shadow-2xl top-1/2 -right-10 -translate-y-1/2 z-10 
                 bg-white h-10 w-10 shadow-lg hover:bg-gray-100 transition flex items-center justify-center"
    >
      <ChevronRightIcon className="w-6 h-6 text-gray-700" />
    </button>
  );
}

function PrevArrow({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="absolute shadow-2xl top-1/2 -left-10 -translate-y-1/2 z-10 
                 bg-white h-10 w-10 shadow-lg hover:bg-gray-100 transition flex items-center justify-center"
    >
      <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
    </button>
  );
}

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
    const fetchNewArrivals = async () => {
      setLoading(true);
      try {
        const { data } = await getNewArrivals();
        const normalizedProducts = normalizeMediaSrc(data.products || []);
        setProducts(normalizedProducts);
        console.log(
          "✅ New arrivals fetched and normalized:",
          normalizedProducts
        );
      } catch (err) {
        console.error("❌ Error fetching new arrivals:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
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
      <div className="flex px-2 items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900">
          Dernières Nouveautés
        </h2>
        <h2 className="cursor-pointer text-blue-600 font-semibold hover:underline">
          Voir tous →
        </h2>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-md cursor-pointer animate-pulse"
            >
              <div className="aspect-square w-full rounded-t-md bg-gray-200" />
              <div className="p-2 bg-white">
                <div className="mt-2 flex justify-between">
                  <div className="h-5 w-3/4 bg-gray-300 rounded"></div>
                  <div className="h-5 w-1/4 bg-gray-300 rounded"></div>
                </div>
                <div className="mt-4 h-10 w-full bg-gray-300 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Slider {...(isMobile ? mobileSettings : desktopSettings)}>
          {products.map((product) => (
            <div key={product._id} className="py-3 px-1">
              <Product product={product} />
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
}
