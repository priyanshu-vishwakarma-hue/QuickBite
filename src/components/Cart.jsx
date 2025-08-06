import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, deleteItem } from "../utils/cartSlice";
import toast from "react-hot-toast";
import { toggleLogin } from "../utils/toogleSlice";
import { veg, nonVeg } from "../utils/links";

function Cart() {
    const cartData = useSelector((state) => state.cartSlice.cartItems);
    const resInfo = useSelector((state) => state.cartSlice.resInfo);
    const userData = useSelector((state) => state.authSlice.userData);
    const dispatch = useDispatch();

    const totalPrice = cartData.reduce(
        (acc, curVal) => acc + (curVal.price / 100 || curVal.defaultPrice / 100),
        0
    );

    function handleRemoveFromCart(index) {
        if (cartData.length > 1) {
            let newArr = [...cartData];
            newArr.splice(index, 1);
            dispatch(deleteItem(newArr));
            toast.success("Item removed");
        } else {
            dispatch(clearCart());
            toast.success("Cart cleared");
        }
    }

    const handleClearCart = () => dispatch(clearCart());
    const handlePlaceOrder = () => {
        if (!userData) {
            toast.error("Please login to place an order.");
            dispatch(toggleLogin());
            return;
        }
        toast.success("Order placed successfully!");
        // Potentially clear cart or navigate to an order confirmation page
    };

    if (cartData.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] text-center">
                 <img src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/2xempty_cart_yfxml0" alt="Empty Cart" className="w-64" />
                <h1 className="text-2xl font-bold mt-4">Your cart is empty</h1>
                <p className="text-gray-500">You can go to home page to view more restaurants</p>
                <Link to="/" className="bg-violet-600 text-white font-bold py-3 px-6 rounded-lg mt-6 hover:bg-violet-700 transition-colors">
                    SEE RESTAURANTS NEAR YOU
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full bg-gray-50 min-h-screen py-10">
            <div className="w-full max-w-4xl mx-auto p-4 md:p-0">
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <Link to={`/restaurantMenu/${resInfo.id}`}>
                        <div className="flex items-center gap-5">
                            <img className="rounded-lg w-24 h-24 object-cover" src={`https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/${resInfo.cloudinaryImageId}`} alt={resInfo.name} />
                            <div>
                                <p className="text-3xl font-bold">{resInfo.name}</p>
                                <p className="text-lg text-gray-500">{resInfo.areaName}</p>
                            </div>
                        </div>
                    </Link>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                    {cartData.map((item, index) => (
                        <div key={item.id}>
                            <div className="flex w-full my-5 justify-between">
                                <div className="w-[70%]">
                                    <img className="w-5" src={item.itemAttribute?.vegClassifier === "VEG" ? veg : nonVeg} alt="" />
                                    <h2 className="font-bold text-lg">{item.name}</h2>
                                    <p className="font-semibold text-base">₹{item.defaultPrice / 100 || item.price / 100}</p>
                                    <p className="text-sm text-gray-400 mt-2 line-clamp-2">{item.description}</p>
                                </div>
                                <div className="w-[25%] relative">
                                    <img className="rounded-lg aspect-square object-cover" src={`https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/${item.imageId}`} alt="" />
                                    <button onClick={() => handleRemoveFromCart(index)} className="absolute bottom-[-15px] left-1/2 -translate-x-1/2 bg-red-500 text-white text-sm font-bold rounded-lg px-4 py-1 shadow-md hover:bg-red-600">
                                        Remove
                                    </button>
                                </div>
                            </div>
                            {index < cartData.length - 1 && <hr className="my-4" />}
                        </div>
                    ))}
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                    <h2 className="text-2xl font-bold">Total: <span className="text-violet-600">₹{totalPrice.toFixed(2)}</span></h2>
                    <div className="flex justify-between mt-6">
                        <button onClick={handlePlaceOrder} className="w-1/2 bg-violet-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-violet-700 transition-colors">
                            Place Order
                        </button>
                        <button onClick={handleClearCart} className="w-1/2 ml-4 border border-red-500 text-red-500 font-bold py-3 px-6 rounded-lg hover:bg-red-500 hover:text-white transition-colors">
                            Clear Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;