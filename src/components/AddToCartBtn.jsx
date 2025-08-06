import React from "react";
import { addToCart } from "../utils/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

function AddToCartBtn({ info, resInfo, handleIsDiffRes }) {
    const cartData = useSelector((state) => state.cartSlice.cartItems);
    const getResInfoFromLocalStore = useSelector((state) => state.cartSlice.resInfo);
    const dispatch = useDispatch();

    function handleAddToCart() {
        const isAdded = cartData.find((data) => data.id === info.id);

        if (!isAdded) {
            if (getResInfoFromLocalStore.name === resInfo.name || getResInfoFromLocalStore.length === 0) {
                dispatch(addToCart({ info, resInfo }));
                toast.success("Added to cart!");
            } else {
                handleIsDiffRes();
            }
        } else {
            toast.error("Already in cart!");
        }
    }

    return (
        <button
            onClick={handleAddToCart}
            className="bg-indigo-600 hover:bg-indigo-700 text-white absolute bottom-[-20px] left-1/2 -translate-x-1/2 text-lg font-bold rounded-lg px-10 py-2 shadow-lg transition-transform transform hover:scale-105"
        >
            ADD
        </button>
    );
}

export default AddToCartBtn;