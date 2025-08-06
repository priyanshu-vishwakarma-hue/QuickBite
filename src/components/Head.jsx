import React, { useContext, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { Coordinates } from "../context/contextApi";
import { useDispatch, useSelector } from "react-redux";
import { toggleLogin, toogleSearchBar } from "../utils/toogleSlice";
import SigninBtn from "./SigninBtn";

function Head() {
    const navItems = [
        { name: "Search", image: "fi-rr-search", path: "/search" },
        { name: "Sign in", image: "fi-rr-user", path: "/signin" },
        { name: "Cart", image: "fi-rr-shopping-cart", path: "/cart" },
    ];

    const cartData = useSelector((state) => state.cartSlice.cartItems);
    const userData = useSelector((state) => state.authSlice.userData);
    const visible = useSelector((state) => state.toogleSlice.searchBarToogle);
    const loginVisible = useSelector((state) => state.toogleSlice.loginToggle);
    const dispatch = useDispatch();
    const [searchResult, setSearchResult] = useState([]);
    const [address, setAddress] = useState("");
    const { setCoord } = useContext(Coordinates);

    const handleVisibility = () => dispatch(toogleSearchBar());
    const handleLogin = () => dispatch(toggleLogin());

    async function searchResultFun(val) {
        if (val === "") {
            setSearchResult([]);
            return;
        };
        const res = await fetch(`https://cors-by-codethread-for-swiggy.vercel.app/cors/dapi/misc/place-autocomplete?input=${val}`);
        const data = await res.json();
        setSearchResult(data.data);
    }

    async function fetchLatAndLng(id) {
        if (id === "") return;
        handleVisibility();
        const res = await fetch(`https://cors-by-codethread-for-swiggy.vercel.app/cors/dapi/misc/address-recommend?place_id=${id}`);
        const data = await res.json();
        setCoord({
            lat: data.data[0].geometry.location.lat,
            lng: data.data[0].geometry.location.lng,
        });
        setAddress(data.data[0].formatted_address);
        setSearchResult([]);
    }

    return (
        <>
            {/* Location Search Modal */}
            <div
                onClick={handleVisibility}
                className={`w-full bg-black/60 z-30 h-full fixed inset-0 transition-opacity ${visible ? "opacity-100 visible" : "opacity-0 invisible"}`}
            />
            <div className={`bg-white w-full md:w-[40%] h-full p-8 z-40 fixed duration-500 transform ${visible ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="flex flex-col gap-6 h-full">
                    <div className="flex justify-between items-center">
                         <h2 className="text-2xl font-bold">Set Location</h2>
                         <i className="fi fi-br-cross cursor-pointer text-2xl" onClick={handleVisibility}></i>
                    </div>
                    <input
                        type="text"
                        className="border-2 border-gray-200 p-4 rounded-lg focus:outline-none focus:border-violet-500 w-full text-lg"
                        onChange={(e) => searchResultFun(e.target.value)}
                        placeholder="Search for area, street name.."
                    />
                    <ul className="border-t border-gray-200 pt-4 flex-1 overflow-y-auto">
                        {searchResult.map((data, index) => (
                            <li key={data.place_id} onClick={() => fetchLatAndLng(data.place_id)} className="py-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md">
                                <div className="flex gap-4 items-center">
                                    <i className="fi mt-1 fi-rr-marker text-violet-500"></i>
                                    <div>
                                        <p className="font-semibold">{data.structured_formatting.main_text}</p>
                                        <p className="text-sm text-gray-500">{data.structured_formatting.secondary_text}</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Login Modal */}
            <div
                onClick={handleLogin}
                className={`w-full bg-black/60 z-30 h-full fixed inset-0 transition-opacity ${loginVisible ? "opacity-100 visible" : "opacity-0 invisible"}`}
            />
            <div className={`bg-white w-full md:w-[40%] h-full p-8 z-40 fixed right-0 duration-500 transform ${loginVisible ? "translate-x-0" : "translate-x-full"}`}>
                 <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center">
                        <h2 className="font-bold text-3xl">Welcome</h2>
                        <i className="fi fi-br-cross cursor-pointer text-2xl" onClick={handleLogin}></i>
                    </div>
                    <div className="flex-1 flex flex-col justify-center items-center text-center">
                        <img className="w-32 mb-4" src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/v1605023353/ice_cube_3x_wxujfs.png" alt="" />
                        <h3 className="text-xl font-semibold">Login or Sign Up</h3>
                        <p className="text-gray-500 mt-2">to get started with your food journey</p>
                        <div className="w-full mt-8"><SigninBtn /></div>
                        <p className="text-xs text-gray-400 mt-4">By clicking on Login, I accept the Terms & Conditions & Privacy Policy</p>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="relative w-full">
                <header className="w-full sticky bg-white z-20 top-0 shadow-sm h-24 flex items-center">
                    <div className="w-full px-4 sm:px-6 lg:w-[80%] mx-auto flex justify-between items-center">
                        <div className="flex items-center">
                            <Link to="/" className="flex items-center gap-2">
                                <img className="w-10 h-10" src="https://cdn-icons-png.flaticon.com/512/3081/3081559.png" alt="QuickBite Logo" />
                                <span className="font-bold text-2xl hidden md:inline">QuickBite</span>
                            </Link>
                            <div className="flex items-center gap-2 cursor-pointer ml-6" onClick={handleVisibility}>
                                <span className="font-semibold border-b-2 border-dashed border-gray-800 hidden md:inline">Your Location</span>
                                <p className="ml-2 max-w-[150px] md:max-w-[250px] text-sm text-gray-600 line-clamp-1">
                                    {address || 'Select a location'}
                                </p>
                                <i className="fi text-xl mt-1 text-violet-600 fi-rs-angle-small-down"></i>
                            </div>
                        </div>
                        <nav className="flex items-center gap-6 md:gap-10">
                            {navItems.map(({ name, image, path }) =>
                                name === "Sign in" ? (
                                    <div onClick={handleLogin} key={path} className="nav-item">
                                        {userData ? (
                                            <img src={userData.photo} alt={userData.name} className="w-8 h-8 rounded-full" />
                                        ) : (
                                            <i className={`fi text-2xl ${image}`}></i>
                                        )}
                                        <p className="text-base font-medium hidden lg:inline">{userData ? userData.name.split(' ')[0] : name}</p>
                                    </div>
                                ) : (
                                    <Link to={path} key={path} className="nav-item">
                                        <div className="cart-icon-container">
                                            <i className={`fi text-2xl ${image}`}></i>
                                            {name === "Cart" && cartData.length > 0 && (
                                                <span className="cart-badge">{cartData.length}</span>
                                            )}
                                        </div>
                                        <p className="text-base font-medium hidden lg:inline">{name}</p>
                                    </Link>
                                )
                            )}
                        </nav>
                    </div>
                </header>
                <main>
                    <Outlet />
                </main>
            </div>
        </>
    );
}

export default Head;