import { useState } from "react";
import React from "react";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { ListBulletIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
} from "@heroicons/react/20/solid";
import Product from "../product/Product";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setGridView, setListView } from "../../redux/ui/viewSlice";
import PriceRangeSlider from "./PriceRangeSlider";
import Pagination from "./Pagination";
import { useEffect } from "react";
import {
  setPriceRange,
  toggleFilter,
  toggleSection,
} from "../../redux/shopFilters/filtreSlice";
import {
  setCurrentPage,
  setProductsPerPage,
  setSortOption,
} from "../../redux/shopFilters/pageOptions";
import { useParams } from "react-router-dom";

const sortOptions = [
  { name: "Most Popular", href: "#", current: true },
  { name: "Best Rating", href: "#", current: false },
  { name: "Newest", href: "#", current: false },
  { name: "Price: Low to High", href: "#", current: false },
  { name: "Price: High to Low", href: "#", current: false },
];
const pageOptions = [
  { value: 12, current: true },
  { value: 24, current: false },
  { value: 36, current: false },
  { value: 48, current: false },
];
const filters = [
  {
    id: "category",
    name: "Category",
    options: [
      { value: "new-arrivals", label: "New Arrivals" },
      { value: "sale", label: "Sale" },
      { value: "travel", label: "Travel" },
      { value: "organization", label: "Organization" },
      { value: "accessories", label: "Accessories" },
    ],
  },
  {
    id: "size",
    name: "Size",
    options: [
      { value: "2l", label: "2L" },
      { value: "6l", label: "6L" },
      { value: "12l", label: "12L" },
      { value: "18l", label: "18L" },
      { value: "20l", label: "20L" },
      { value: "40l", label: "40L" },
    ],
  },
  {
    id: "color",
    name: "Color",
    options: [
      { value: "white", label: "White" },
      { value: "beige", label: "Beige" },
      { value: "blue", label: "Blue" },
      { value: "brown", label: "Brown" },
      { value: "green", label: "Green" },
      { value: "purple", label: "Purple" },
    ],
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ShopFilters({ products }) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const params = useParams();
  useEffect(() => {
    console.log(params);
  }, [params.category]);
  const formattedCategory = params.category
    ? params.category.charAt(0).toUpperCase() + params.category.slice(1)
    : "";
  const view = useSelector((state) => state.view.view);
  const { selected, openSections } = useSelector((state) => state.filters);
  const priceRange = useSelector((state) => state.filters.selected.priceRange);
  const { currentPage, productsPerPage, sortOption } = useSelector(
    (state) => state.pageOptions
  );

  const dispatch = useDispatch();
  const totalProducts = products.length;
  const pageCount = Math.ceil(totalProducts / productsPerPage);

  // Sort your products based on sortOption here before slicing
  //const sortedProducts = sortProducts(products, sortOption);

  const paginatedProducts = products.slice(
    currentPage * productsPerPage,
    (currentPage + 1) * productsPerPage
  );

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (newSort) => {
    dispatch(setSortOption(newSort));
  };

  const handlePageSizeChange = (newSize) => {
    dispatch(setProductsPerPage(newSize));
  };

  const start = currentPage * productsPerPage + 1;
  const end = Math.min((currentPage + 1) * productsPerPage, totalProducts);

  return (
    <div>
      <div>
        {/* Mobile filter dialog */}
        <Dialog
          open={mobileFiltersOpen}
          onClose={setMobileFiltersOpen}
          className="relative z-40 lg:hidden"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
          />

          <div className="fixed inset-0 z-40 flex">
            <DialogPanel
              transition
              className="relative ml-auto flex size-full max-w-xs transform flex-col overflow-y-auto bg-white pt-4 pb-6 shadow-xl transition duration-300 ease-in-out data-closed:translate-x-full"
            >
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="relative -mr-2 flex size-10 items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                >
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon aria-hidden="true" className="size-6" />
                </button>
              </div>

              {/* Filters */}
              <form className="mt-4 border-t border-gray-200">
                {filters.map((section) => (
                  <Disclosure
                    key={section.id}
                    as="div"
                    className="border-t border-gray-200 px-4 py-6"
                  >
                    <h3 className="-mx-2 -my-3 flow-root">
                      <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                        <span className="font-medium text-gray-900">
                          {section.name}
                        </span>
                        <span className="ml-6 flex items-center">
                          <PlusIcon
                            aria-hidden="true"
                            className="size-5 group-data-open:hidden"
                          />
                          <MinusIcon
                            aria-hidden="true"
                            className="size-5 group-not-data-open:hidden"
                          />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pt-6">
                      <div className="space-y-6">
                        {section.options.map((option, optionIdx) => (
                          <div key={option.value} className="flex gap-3">
                            <div className="flex h-5 shrink-0 items-center">
                              <div className="group grid size-4 grid-cols-1">
                                <input
                                  defaultValue={option.value}
                                  id={`filter-mobile-${section.id}-${optionIdx}`}
                                  name={`${section.id}[]`}
                                  type="checkbox"
                                  className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                />
                                <svg
                                  fill="none"
                                  viewBox="0 0 14 14"
                                  className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                                >
                                  <path
                                    d="M3 8L6 11L11 3.5"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="opacity-0 group-has-checked:opacity-100"
                                  />
                                  <path
                                    d="M3 7H11"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="opacity-0 group-has-indeterminate:opacity-100"
                                  />
                                </svg>
                              </div>
                            </div>
                            <label
                              htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                              className="min-w-0 flex-1 text-gray-500"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                ))}
              </form>
            </DialogPanel>
          </div>
        </Dialog>

        <main className="mx-auto max-w-7xl  px-4 sm:px-6 lg:px-8">
          <div className="block md:flex items-baseline justify-between border-b border-gray-200 md:pt-24 pt-8 pb-0 gap-4">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 w-full md:w-1/4">
              {formattedCategory || "Shop"}{" "}
              <span className="hidden md:inline text-xs md:text-base font-medium tracking-tight text-gray-600">
                products ({totalProducts})
              </span>
            </h1>

            {/* Settings */}
            <div className="flex flex-wrap w-full md:w-3/4 justify-between items-center gap-4">
              {/* Left: View/filter buttons */}
              <div className="hidden md:flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => dispatch(setGridView())}
                  className={`px-2 py-2 border border-gray-300 rounded shadow-sm cursor-pointer transition 
    ${
      view === "grid"
        ? "bg-[#2c2d84] shadow-md text-white"
        : "bg-white hover:bg-gray-100"
    }`}
                >
                  <span className="sr-only">View grid</span>
                  <Squares2X2Icon aria-hidden="true" className="size-5" />
                </button>

                <button
                  type="button"
                  onClick={() => dispatch(setListView())}
                  className={`px-2 py-2 border border-gray-300 rounded shadow-sm cursor-pointer transition 
    ${
      view === "list"
        ? "bg-[#2c2d84] shadow-md text-white"
        : "bg-white hover:bg-gray-100"
    }`}
                >
                  <span className="sr-only">View list</span>
                  <ListBulletIcon aria-hidden="true" className="size-5" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="p-2 text-gray-400 hover:text-gray-500 lg:hidden"
              >
                <div className="flex items-center gap-2">
                  <FunnelIcon className="size-5" aria-hidden="true" />
                  <span className="inline md:hidden text-xs font-medium tracking-tight text-gray-600">
                    products ({totalProducts})
                  </span>
                </div>
              </button>
              {/* Right: Sort and Affichage */}
              <div className="flex items-center gap-4">
                {/* Sort Menu */}
                <Menu as="div" className="relative inline-block text-left">
                  <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    Sort
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="-mr-1 ml-1 size-5 shrink-0 text-gray-400 group-hover:text-gray-500"
                    />
                  </MenuButton>
                  <MenuItems className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black/5 focus:outline-none">
                    <div className="py-1">
                      {sortOptions.map((option) => (
                        <MenuItems className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black/5 focus:outline-none">
                          <div className="py-1">
                            {sortOptions.map((option) => (
                              <MenuItem key={option.name}>
                                <button
                                  type="button"
                                  onClick={() =>
                                    dispatch(setSortOption(option.value))
                                  }
                                  className={classNames(
                                    sortOption === option.value
                                      ? "font-medium text-gray-900"
                                      : "text-gray-500",
                                    "block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                  )}
                                >
                                  {option.name}
                                </button>
                              </MenuItem>
                            ))}
                          </div>
                        </MenuItems>
                      ))}
                    </div>
                  </MenuItems>
                </Menu>

                {/* Affichage Menu */}
                <Menu as="div" className="relative inline-block text-left">
                  <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    Affichage
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="-mr-1 ml-1 size-5 shrink-0 text-gray-400 group-hover:text-gray-500"
                    />
                  </MenuButton>
                  <MenuItems className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black/5 focus:outline-none">
                    <div className="py-1">
                      {pageOptions.map((option) => (
                        <MenuItem key={option.value}>
                          <button
                            type="button"
                            onClick={() =>
                              dispatch(setProductsPerPage(option.value))
                            }
                            className={classNames(
                              productsPerPage === option.value
                                ? "font-medium text-gray-900"
                                : "text-gray-500",
                              "block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            )}
                          >
                            {option.value}
                          </button>
                        </MenuItem>
                      ))}
                    </div>
                  </MenuItems>
                </Menu>
              </div>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pt-6 pb-24">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Filters */}
              <form className="hidden space-y-2 lg:block">
                <Disclosure
                  as="div"
                  className="border border-gray-100 bg-gray-100 shadow-md py-6 px-4"
                  defaultOpen={openSections.includes("priceRange")}
                >
                  <h3 className="-my-3 flow-root">
                    <Disclosure.Button className="group flex w-full items-center justify-between py-3 text-sm text-gray-400 hover:text-gray-500">
                      <span className="font-bold text-xl text-gray-900">
                        Prix
                      </span>
                      <span className="ml-6 flex items-center">
                        <PlusIcon
                          aria-hidden="true"
                          className="size-5 group-data-open:hidden"
                        />
                        <MinusIcon
                          aria-hidden="true"
                          className="size-5 group-not-data-open:hidden"
                        />
                      </span>
                    </Disclosure.Button>
                  </h3>
                  <DisclosurePanel className="pt-6">
                    <PriceRangeSlider
                      values={priceRange}
                      setValues={(newValues) =>
                        dispatch(setPriceRange(newValues))
                      }
                    />
                  </DisclosurePanel>
                </Disclosure>
                {filters.map((section) => (
                  <Disclosure
                    key={section.id}
                    as="div"
                    defaultOpen={openSections.includes(section.id)} // initial open controlled here
                    className="border border-gray-100 bg-gray-100 shadow-md py-6 px-4"
                  >
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="flex w-full items-center justify-between py-3 text-sm text-gray-400 hover:text-gray-500">
                          <span className="font-medium text-gray-900">
                            {section.name}
                          </span>
                          <span className="ml-6 flex items-center">
                            {open ? (
                              <MinusIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            ) : (
                              <PlusIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            )}
                          </span>
                        </Disclosure.Button>
                        <Disclosure.Panel className="pt-4">
                          <div className="space-y-3">
                            {section.options.map((option, optionIdx) => (
                              <div
                                key={option.value}
                                className="flex items-center"
                              >
                                <input
                                  id={`filter-${section.id}-${optionIdx}`}
                                  type="checkbox"
                                  checked={
                                    selected[section.id]?.includes(
                                      option.value
                                    ) || false
                                  }
                                  onChange={() =>
                                    dispatch(
                                      toggleFilter({
                                        sectionId: section.id,
                                        value: option.value,
                                      })
                                    )
                                  }
                                  className="h-4 w-4 rounded-sm border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label
                                  htmlFor={`filter-${section.id}-${optionIdx}`}
                                  className="ml-3 text-sm text-gray-600"
                                >
                                  {option.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))}
              </form>

              {/* Product grid */}
              <div className="lg:col-span-3">
                <div
                  className={
                    view === "list"
                      ? " flex flex-col space-y-4"
                      : " grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 xl:gap-x-8"
                  }
                >
                  {paginatedProducts.map((product) => (
                    <Product key={product.id} product={product} />
                  ))}
                </div>{" "}
                <div className="flex justify-between items-center mt-8">
                  <Pagination
                    currentPage={currentPage}
                    pageCount={pageCount}
                    onPageChange={handlePageChange}
                  />
                  <p className="text-gray-500 mt-8">
                    {start} à {end} sur {totalProducts} produits
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
