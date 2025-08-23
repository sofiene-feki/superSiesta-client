import ModelViewer from "./ModelViewer";
import iso9001 from "../../assets/Iso9001.png";
import iso14001 from "../../assets/Iso14001.png";
import iso45001 from "../../assets/Iso45001.png";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";
import bannerBG from "../../assets/bannerBG.jpg";
import React from "react";
import { Link } from "react-router-dom";

export default function Banner() {
  return (
    <div
      className="flex flex-col min-h-[60vh]  md:flex-row p-3 md:p-10 gap-4 mx-auto md:mx-10 shadow-xl rounded-b-xl bg-white"
      style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.9)), url(${bannerBG})`,
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Left Column: Titles */}
      <div className="w-full md:w-1/2 flex flex-col justify-center ">
        <div>
          <h1
            className="text-3xl md:text-7xl font-eras font-extraBold bg-gradient-to-r from-[#27297c] to-[#27297c] 
               text-transparent bg-clip-text drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] 
               animate-fade-up duration-[1200ms] ease-out"
          >
            Super Siesta
          </h1>
          <h1
            className="text-3xl md:text-7xl font-eras bg-gradient-to-r from-[#27297c] to-[#27297c] 
                 text-transparent bg-clip-text drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] 
                 animate-fade-up duration-[1200ms] ease-out"
          >
            {" "}
            Sommeil plaisir,
          </h1>
          <h1
            className="text-3xl md:text-7xl font-eras bg-gradient-to-r from-[#27297c] to-[#27297c] 
                 text-transparent bg-clip-text drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] 
                 animate-fade-up duration-[1200ms] ease-out"
          >
            {" "}
            Sommeil Hygiène
          </h1>
        </div>
        <div className="flex gap-2 mt-2 md:gap-4 md:mt-4">
          <span
            className="inline-block px-2 py-2 text-white font-semibold"
            style={{
              transform: "skewX(-10deg)",
              backgroundColor: "#2c2d84",
            }}
          >
            <span style={{ transform: "skewX(10deg)", display: "flex" }}>
              <ShieldCheckIcon className="w-6 h-6 " />
              Garantie 10 ans
            </span>
          </span>
          <div className="flex gap-2">
            <div className="flex flex-col items-center text-[10px] text-gray-600">
              <img className="w-6 h-auto" src={iso9001} alt="ISO 14001" />
              <span>ISO 9001</span>
            </div>
            <div className="flex flex-col items-center text-[10px] text-gray-600">
              <img className="w-6 h-auto" src={iso14001} alt="ISO 45001" />
              <span>ISO 14001</span>
            </div>
            <div className="flex flex-col items-center text-[10px] text-gray-600">
              <img className="w-6 h-auto" src={iso45001} alt="ISO 9001" />
              <span>ISO 45001</span>
            </div>
          </div>
        </div>
      </div>
      {/* Right Column: Model Viewer */}
      <div className="w-full md:w-1/2 md:px-30 px-0 flex flex-col mt-4 items-center ">
        <ModelViewer />
        <Link to="/shop" className="w-full block">
          <button className="mt-1 md:mt-6 w-full inline-flex items-center justify-center gap-2  py-3 bg-[#2c2d84] text-white text-lg font-bold rounded-md shadow-lg  hover:shadow-xl transition duration-300 ease-in-out">
            Voir nos produits
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </Link>
      </div>
    </div>
  );
}
