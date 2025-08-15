import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import Product from "../product/Product";
import { products } from "../../constants/products";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

function NextArrow({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="absolute shadow-2xl top-1/2 -right-10 -translate-y-1/2 z-10 
                 bg-white h-30 w-10  shadow-lg 
                 hover:bg-gray-100 transition flex items-center justify-center"
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
                 bg-white h-30 w-10  shadow-lg 
                 hover:bg-gray-100 transition flex items-center justify-center"
    >
      <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
    </button>
  );
}

export default function NewArrivals() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Detect window size on mount and resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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

  // Mobile slider settings
  const mobileSettings = {
    dots: false, // Facebook style usually doesn't use dots
    infinite: false, // stops at the last card
    speed: 500,
    slidesToShow: 1.2, // 1 full + 0.2 next
    slidesToScroll: 1,
    arrows: false, // optional on mobile
    swipeToSlide: true, // smoother feel
    centerMode: false, // set true if you want centered look
    rtl: false, // you had rtl: true, remove unless need
  };

  return (
    <div className="mx-auto max-w-7xl   py-4 md:py-16 sm:px-6 sm:py-8">
      <div className="flex items-center px-2 justify-between mb-4">
        <h2 className="text-xl  break-words bg-clip-text  drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] md:text-2xl font-bold tracking-tight  px-2 text-gray-900">
          Meilleures ventes
        </h2>
        <h2 className="cursor-pointer  break-words bg-clip-text  drop-shadow-[0_2px_4px_rgba(0,0,255,0.3)] text-blue-600 font-semibold hover:underline">
          Voir tous →
        </h2>
      </div>

      <Slider
        className="shadow-xl  hover:shadow-2xl transition-shadow duration-300  border border-gray-200 bg-white"
        {...(isMobile ? mobileSettings : desktopSettings)}
      >
        {products.map((product) => (
          <div key={product.id} className="py-3 px-1 ">
            <Product product={product} />
          </div>
        ))}
      </Slider>
    </div>
  );
}
