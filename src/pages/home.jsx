import Banner from "../components/home/Banner";
import BannerBottom from "../components/home/BannerBottom";
import BestSellers from "../components/home/BestSellers";
import Category from "../components/home/Category";
import ModelViewer from "../components/home/ModelViewer";
import NewArrivals from "../components/home/NewArrivals";
import SpecialOffer from "../components/home/SpecialOffer";
import React from "react";

export default function Home() {
  return (
    <div className="">
      {" "}
      <Banner />
      <BannerBottom />
      <div className="h-2 bg-gray-200 block md:hidden"></div>
      <Category />
      <div className="h-2 bg-gray-200 block md:hidden"></div>
      <NewArrivals />
      <div className="h-2 bg-gray-200 block md:hidden"></div>
      <SpecialOffer />
      <div className="h-2 bg-gray-200 block md:hidden"></div>
      <BestSellers />
      <div className="h-2 bg-gray-200 block md:hidden"></div>
    </div>
  );
}
