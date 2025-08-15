import React, { useEffect, useState } from "react";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";
import medico from "../../assets/category/medicop.jpg";
import eco from "../../assets/eco+.png";

export default function SpecialOfferCard() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    function updateCountdown() {
      const now = new Date();
      const distance = new Date("2025-09-31T23:59:59") - now;

      if (distance <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((distance / (1000 * 60)) % 60),
        seconds: Math.floor((distance / 1000) % 60),
      });
    }

    updateCountdown();
    const timerId = setInterval(updateCountdown, 1000);

    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="max-w-7xl h-auto mx-auto bg-white border border-gray-200 shadow-xl overflow-hidden flex flex-col md:flex-row hover:shadow-2xl transition-shadow duration-300 relative">
      {/* Discount Ribbon */}
      <div className="absolute top-4 left-4 bg-red-500 text-white text-xs md:text-sm font-bold py-1 px-3 rounded-tr-lg rounded-bl-lg shadow-lg z-10">
        -20%
      </div>

      {/* Left Image Section */}
      <div className="md:w-1/2 flex items-center justify-center h-42 sm:h-42 md:h-[300px] lg:h-[400px] relative">
        {/* Top shadow overlay */}
        <div className="absolute top-0 left-0 w-full h-10 bg-gradient-to-b from-gray-200/50 to-transparent pointer-events-none"></div>

        <img
          src={medico}
          alt="Medico Pillow"
          className="max-h-full max-w-full pt-10 object-contain relative z-10"
        />
      </div>

      {/* Right Info Section */}
      <div className="md:w-1/2 md:p-8 p-4 flex flex-col justify-between space-y-4 bg-gray-50">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            {/* Title + Price */}
            <div className="relative space-y-2">
              <h2 className="text-gray-900 font-extrabold text-2xl md:text-4xl tracking-tight">
                Offre Spéciale
              </h2>
              <img
                className="absolute -top-2 right-2 md:-right-8 w-8 h-8 md:w-10 md:h-10"
                src={eco}
                alt="Eco"
              />
              {/* Price */}
              <div className="flex items-end gap-2">
                <div className="relative flex items-start">
                  <h3 className="text-2xl md:text-4xl font-bold text-[#87a736] leading-none">
                    220
                  </h3>
                  <span className="absolute -top-1 right-0 translate-x-full text-sm font-semibold text-gray-700">
                    DT
                  </span>
                </div>

                <span className="line-through text-gray-400 text-sm md:ml-0 ml-3 mt-1">
                  250
                </span>
                <span className="text-xs text-red-500 font-semibold">
                  Économisez 30 DT
                </span>
              </div>
            </div>

            {/* Countdown */}
            <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-center shadow-lg">
              <p className="text-xs md:text-base font-medium">
                Reste : <span className="font-semibold">{timeLeft.days} j</span>
              </p>
              <div className="flex items-center gap-1 mt-1">
                <ClockSquare value={timeLeft.hours} />
                <ClockSquare value={timeLeft.minutes} />
                <ClockSquare value={timeLeft.seconds} />
              </div>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="text-lg md:text-xl font-semibold text-gray-800">
            Soft+ (Matelas orthopédique)
          </h3>

          {/* Features */}
          <ul className="space-y-2 text-gray-700 text-sm md:text-base">
            {[
              "Deux couches de mousse densité 20/22",
              "Jusqu’à 80kg par personne",
              "Matelas réversible (été/hiver)",
              "Tissu 80% coton anti-acarien",
            ].map((feature) => (
              <li key={feature} className="flex items-center">
                <svg
                  className="w-5 h-5 text-[#87a736] mr-2 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <button
          className="flex items-center justify-center gap-3 px-6 py-2 text-white text-lg font-bold rounded-xl shadow-lg bg-gradient-to-r from-[#87a736] via-green-500 to-[#87a736] bg-[length:200%_200%] animate-gradientMove hover:scale-105 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 focus:ring-4 focus:ring-green-300"
          aria-label="Acheter Medico Pillow"
        >
          <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
          Acheter Maintenant
        </button>
      </div>
    </div>
  );
}

function ClockSquare({ label, value }) {
  const paddedValue = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center">
      <div className="w-6 h-6 md:h-8 md:w-8 bg-gray-800 shadow-lg text-white rounded-md flex items-center justify-center font-mono font-bold text-md md:text-lg select-none">
        {paddedValue}
      </div>
      <span className="text-xs text-white">{label}</span>
    </div>
  );
}
