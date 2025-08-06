import { signInWithPopup, signOut } from "firebase/auth";
import React from "react";
import { auth, provider } from "../config/firebaseAuth";
import { useDispatch, useSelector } from "react-redux";
import { addUserData, removeUserData } from "../utils/authSlice";
import { useNavigate } from "react-router-dom";
import { toggleLogin } from "../utils/toogleSlice";

function SigninBtn() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.authSlice.userData);

    async function handleAuth() {
        try {
            let data = await signInWithPopup(auth, provider);
            const userData = {
                name: data.user.displayName,
                photo: data.user.photoURL,
            };
            dispatch(addUserData(userData));
            dispatch(toggleLogin())
            navigate("/");
        } catch (error) {
            console.error("Authentication error:", error);
        }
    }

    async function handleLogout() {
        await signOut(auth);
        dispatch(removeUserData());
        dispatch(toggleLogin());
    }

    const buttonClass = "my-4 w-full text-lg font-semibold p-4 rounded-lg transition-all duration-200";

    return (
        <>
            {userData ? (
                <button onClick={handleLogout} className={`${buttonClass} bg-red-500 hover:bg-red-600 text-white`}>
                    Logout
                </button>
            ) : (
                <button onClick={handleAuth} className={`${buttonClass} bg-violet-600 hover:bg-violet-700 text-white flex items-center justify-center gap-3`}>
                    <i className="fi fi-brands-google text-2xl"></i>
                    <span>Continue with Google</span>
                </button>
            )}
        </>
    );
}

export default SigninBtn;