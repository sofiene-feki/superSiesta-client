import React, { Fragment, useState } from "react";
import {
  Dialog,
  Disclosure,
  MenuItem,
  MenuItems,
  Menu,
  MenuButton,
  Transition,
} from "@headlessui/react";
import {
  Bars3Icon,
  ShoppingBagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo_supersiesta.png";
import { useDispatch, useSelector } from "react-redux";
import { openCart } from "../../redux/ui/cartDrawer";
import { signOut } from "firebase/auth";
import { authLogout } from "../../redux/user/userSlice";
import { auth } from "../../service/firebase";
import userImg from "../../assets/user.jpg";

const navigation = [
  { name: "Accueil", href: "/" },
  { name: "Produits", href: "/shop" },
  { name: "À propos", href: "/about" },
  { name: "Nous Contacter", href: "/contact" },
  { name: "se connecter", href: "/login" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Header() {
  const location = useLocation();
  const currentPath = location.pathname;
  const totalQty = useSelector((state) => state.cart.totalQuantity);
  const dispatch = useDispatch();
  const [user, setUser] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { userInfo, isAuthenticated } = useSelector((state) => state.user);
  const userNavigation = [
    { name: "Your Profile", href: "#" },
    { name: "Mes commandes", href: "orders" },
    { name: "Sign out", href: "#" },
  ];
  const handleSignOut = async () => {
    try {
      await signOut(auth); // Firebase logout
      dispatch(authLogout()); // Clear Redux state
      //  navigate("/login"); // Redirect to login
    } catch (err) {
      console.error("Logout error:", err);
    }
  };
  return (
    <nav className="bg-white sticky top-0 z-60 shadow-lg">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="flex h-14.5 items-center justify-between">
          {/* Mobile: Menu button + Logo */}
          <div className="flex items-center md:hidden gap-1">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-[#2c2d84] focus:outline-none "
              aria-label="Toggle menu"
            >
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>

            <Link to="/" className="flex items-center h-10">
              <img
                className="h-full w-auto"
                src={logo}
                alt="Your Company"
                draggable={false}
              />
            </Link>
          </div>

          {/* Desktop: Logo */}
          <Link to="/" className="hidden md:flex items-center h-12">
            <img
              className="h-full w-auto"
              src={logo}
              alt="Your Company"
              draggable={false}
            />
          </Link>

          {/* Desktop: Nav Links */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 font-medium transition-colors ${
                  currentPath === item.href
                    ? "border-b-1 border-[#87a736] pb-1 text-[#87a736]"
                    : "text-[#2c2d84] hover:text-[#87a736]"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Cart + User */}
          <div className="flex items-center gap-3 mt-2 p-3 md:hidden">
            {isAuthenticated && userInfo && (
              <Menu as="div" className="relative ">
                <MenuButton className="flex items-center">
                  <img
                    className="w-9 h-9 rounded-full"
                    src={userImg}
                    alt="profile"
                  />
                </MenuButton>

                <MenuItems className="absolute  -right-15 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none z-50">
                  {userNavigation.map((item) => (
                    <MenuItems key={item.name}>
                      {({ active }) =>
                        item.name === "Sign out" ? (
                          <button
                            onClick={handleSignOut}
                            className={`w-full text-left px-4 py-2 text-sm text-gray-700 ${
                              active ? "bg-gray-100" : ""
                            }`}
                          >
                            {item.name}
                          </button>
                        ) : (
                          <Link
                            to={item.href}
                            className={`block px-4 py-2 text-sm text-gray-700 ${
                              active ? "bg-gray-100" : ""
                            }`}
                          >
                            {item.name}
                          </Link>
                        )
                      }
                    </MenuItems>
                  ))}
                </MenuItems>
              </Menu>
            )}
            <button
              onClick={() => dispatch(openCart())}
              className="relative text-[#2c2d84] transition md:hidden"
            >
              <ShoppingBagIcon className="w-8 h-8" />
              {totalQty > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {totalQty}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile: Dialog menu */}
      <Transition show={mobileMenuOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 md:hidden"
          onClose={setMobileMenuOpen}
        >
          {/* Background overlay */}
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          {/* Slide down panel */}
          <Transition.Child
            as={Fragment}
            enter="transition ease-out duration-200 transform"
            enterFrom="-translate-y-full"
            enterTo="translate-y-0"
            leave="transition ease-in duration-150 transform"
            leaveFrom="translate-y-0"
            leaveTo="-translate-y-full"
          >
            <Dialog.Panel className="fixed inset-x-0 top-0 bg-white border-t border-gray-200">
              {/* Close button */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <Link to="/" className="items-center h-12">
                  <img
                    className="h-full w-auto"
                    src={logo}
                    alt="Your Company"
                    draggable={false}
                  />
                </Link>{" "}
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-md text-gray-500 hover:text-gray-900"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Menu Links */}
              <div className="space-y-1 px-2 pt-2 pb-3">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block rounded-md px-3 py-2 text-base font-semibold transition-colors ${
                      currentPath === item.href
                        ? " pb-1 text-[#87a736]"
                        : "text-[#2c2d84] hover:text-[#87a736]"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </nav>
  );
}
