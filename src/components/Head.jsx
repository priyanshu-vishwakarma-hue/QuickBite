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
                className={`w-full bg-black/50 z-30 h-full fixed inset-0 ${visible ? "visible" : "invisible"}`}
            />
            <div className={`bg-white flex justify-end w-full md:w-[40%] h-full p-5 z-40 fixed duration-500 ${visible ? "left-0" : "-left-[100%]"}`}>
                <div className="flex flex-col gap-4 mt-3 w-full lg:w-3/4 mr-6">
                    <i className="fi fi-br-cross cursor-pointer text-2xl" onClick={handleVisibility}></i>
                    <input
                        type="text"
                        className="border p-5 focus:outline-none focus:shadow-lg w-full"
                        onChange={(e) => searchResultFun(e.target.value)}
                        placeholder="Search for area, street name.."
                    />
                    <div className="border p-5 h-full overflow-y-auto">
                        <ul>
                            {searchResult.map((data, index) => (
                                <li key={data.place_id} onClick={() => fetchLatAndLng(data.place_id)} className="my-5 cursor-pointer">
                                    <div className="flex gap-4">
                                        <i className="fi mt-1 fi-rr-marker"></i>
                                        <div>
                                            <p className="font-semibold">{data.structured_formatting.main_text}</p>
                                            <p className="text-sm opacity-65">{data.structured_formatting.secondary_text}</p>
                                        </div>
                                    </div>
                                    {index < searchResult.length - 1 && <hr className="my-4" />}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Login Modal */}
            <div
                onClick={handleLogin}
                className={`w-full bg-black/50 z-30 h-full fixed inset-0 ${loginVisible ? "visible" : "invisible"}`}
            />
            <div className={`bg-white flex w-full md:w-[40%] h-full p-5 z-40 fixed duration-500 ${loginVisible ? "right-0" : "-right-[100%]"}`}>
                <div className="m-3 w-full lg:w-[60%]">
                    <i className="fi fi-br-cross cursor-pointer text-2xl" onClick={handleLogin}></i>
                    <div className="my-10 w-full flex justify-between items-center">
                        <h2 className="font-bold text-4xl">Login</h2>
                        <img className="w-28" src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/Image-login_btpq7r" alt="" />
                    </div>
                    <SigninBtn />
                    <p className="text-sm mt-2 opacity-70">By clicking on Login, I accept the Terms & Conditions & Privacy Policy</p>
                </div>
            </div>

            {/* Main Header */}
            <div className="relative w-full">
                <header className="w-full sticky bg-white z-20 top-0 shadow-md h-24 flex justify-center items-center">
                    <div className="w-full px-4 sm:px-6 lg:w-[80%] mx-auto flex justify-between items-center">
                        <div className="flex items-center">
                            <Link to="/">
                                <img className="w-20" src="https://www.citygroup.com.bd/storage/brand_logo/2023-01-14-63c2674c59462.png" alt="QuickBite Logo" />
                            </Link>
                            <div className="flex items-center gap-2 cursor-pointer ml-4" onClick={handleVisibility}>
                                <span className="font-bold border-b-2 border-black hidden md:inline">Other</span>
                                <span className="ml-2 max-w-[150px] md:max-w-[250px] text-sm opacity-85 line-clamp-1">
                                    {address || 'Select a location'}
                                </span>
                                <i className="fi text-2xl mt-2 text-orange-500 fi-rs-angle-small-down"></i>
                            </div>
                        </div>
                        <nav className="flex items-center gap-6 md:gap-14">
                            {navItems.map(({ name, image, path }) =>
                                name === "Sign in" ? (
                                    <div onClick={handleLogin} key={path} className="nav-item">
                                        {userData ? (
                                            <img src={userData.photo} alt={userData.name} className="w-8 h-8 rounded-full" />
                                        ) : (
                                            <i className={`fi text-xl ${image}`}></i>
                                        )}
                                        <p className="text-lg font-medium hidden md:inline">{userData ? userData.name.split(' ')[0] : name}</p>
                                    </div>
                                ) : (
                                    <Link to={path} key={path} className="nav-item">
                                        <div className="cart-icon-container">
                                            <i className={`fi text-xl ${image}`}></i>
                                            {name === "Cart" && cartData.length > 0 && (
                                                <span className="cart-badge">{cartData.length}</span>
                                            )}
                                        </div>
                                        <p className="text-lg font-medium hidden md:inline">{name}</p>
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