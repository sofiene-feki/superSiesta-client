import React from "react";
import { useState, useEffect } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

import medico from "../../assets/category/medico.png";
import relax from "../../assets/category/relax.png";
import soft from "../../assets/category/soft.png";
import tendresse from "../../assets/category/tendresse.png";
import venise from "../../assets/category/venise.png";
import topRelax from "../../assets/category/topRelax.png";
import oreiller from "../../assets/category/oreiller.webp";
import protege from "../../assets/category/protege.webp";

const categories = [
  {
    id: 1,
    link: "/category/soft+",
    image: soft,
    bg: "from-[#abc8ee]/30 via-[#abc8ee]/20 to-transparent",
    startPrice: 220,
  },
  {
    id: 2,
    link: "/category/venise+",
    image: venise,
    bg: "from-[#f4ad9f]/20 via-[#f4ad9f]/10 to-transparent",
    startPrice: 260,
  },
  {
    id: 3,
    link: "/category/medico+",
    image: medico,
    bg: "from-[#90bfb6]/20 via-[#90bfb6]/10 to-transparent",
    startPrice: 360,
  },
  {
    id: 4,
    link: "/category/relax+",
    image: relax,
    bg: "from-[#9996ba]/20 via-[#9996ba]/10 to-transparent",
    startPrice: 435,
  },
  {
    id: 5,
    link: "/category/tendresse+",
    image: tendresse,
    bg: "from-[#ce8392]/20 via-[#ce8392]/10 to-transparent",
    startPrice: 595,
  },
  {
    id: 6,
    link: "/category/topRelax+",
    image: topRelax,
    bg: "from-[#c1a3a3]/20 via-[#c1a3a3]/10 to-transparent",
    startPrice: 885,
  },
  {
    id: 7,
    link: "/category/oreiller",
    image: oreiller,
    bg: "from-[#000000]/20 via-[#000000]/10 to-transparent",
    startPrice: 25,
  },
  {
    id: 8,
    link: "/category/protege",
    image: protege,
    bg: "from-[#000000]/20 via-[#000000]/10 to-transparent",
    startPrice: 70,
  },
];

// ✅ Arrows
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

function MobileNextArrow({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="absolute top-1/2 right-2 -translate-y-1/2 z-20 
                 bg-white rounded-full p-4 shadow-xl hover:bg-gray-100 
                 transition flex items-center justify-center"
    >
      <ChevronRightIcon className="w-5 h-5 text-gray-700" />
    </button>
  );
}

function MobilePrevArrow({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="absolute top-1/2 left-2 -translate-y-1/2 z-20 
                 bg-white rounded-full p-4 shadow-xl hover:bg-gray-100 
                 transition flex items-center justify-center"
    >
      <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
    </button>
  );
}

export default function Category() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Detect window size on mount and resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Desktop slider settings
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
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <MobileNextArrow />,
    prevArrow: <MobilePrevArrow />,
  };

  return (
    <section className="max-w-screen-xl  mb-0 mx-auto  sm:px-6 lg:px-8 pt-4 md:py-8">
      {/* Header */}
      <header className="flex items-center px-2 md:px:0 justify-between mb-4">
        <h2 className="text-xl  break-words bg-clip-text  drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] md:text-2xl font-bold tracking-tight text-gray-900">
          Nos Collections
        </h2>
        <Link
          to="/categories"
          className="text-blue-600 break-words bg-clip-text  drop-shadow-[0_2px_4px_rgba(0,0,255,0.3)] font-semibold hover:underline"
        >
          Voir tous →
        </Link>
      </header>

      {/* ✅ Conditional settings */}
      <Slider
        className="shadow-lg  md:shadow-xl hover:shadow-2xl transition-shadow duration-300  border border-gray-200  bg-white"
        {...(isMobile ? mobileSettings : desktopSettings)}
      >
        {categories.map((cat) => (
          <div key={cat.id} className="pr-1 py-0 md:px-3 md:py-3">
            <Link
              to={cat.link}
              className="relative group rounded-lg overflow-hidden  h-92 md:h-92  block"
            >
              {/* Gradient background */}
              <div
                className={`absolute inset-0 bg-gradient-to-b ${cat.bg} z-10`}
              />

              {/* Category Image */}
              <img
                src={cat.image}
                alt="Category"
                className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
              />

              {/* Top-right price badge */}
              <div className="absolute top-3 right-0 z-20 bg-white text-gray-800 text-sm md:text-base font-semibold px-5 py-2 rounded-l-md shadow-lg backdrop-blur-sm bg-opacity-90 animate-pulse-glow">
                À partir de {cat.startPrice}
                <span className="absolute top-1 right-2  text-gray-500 text-[10px] font-bold ">
                  DT
                </span>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 group-hover:bg-black/5 transition z-20" />

              {/* Bottom text */}
              <p className="absolute bottom-3 left-4 z-20 text-gray[800] text-lg md:text-md font-semibold underline-offset-4 group-hover:underline">
                Découvrir notre collection →
              </p>
            </Link>
          </div>
        ))}
      </Slider>
    </section>
  );
}
