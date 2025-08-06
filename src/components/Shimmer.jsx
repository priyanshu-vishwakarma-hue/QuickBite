import React from "react";

function Shimmer() {
    return (
        <div className="w-full animate-pulse">
            <div className="w-full flex justify-center items-center gap-5 flex-col h-[350px] bg-gray-200">
                <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
                <div className="h-8 bg-gray-300 rounded-md w-1/3"></div>
            </div>

            <div className="w-[80%] mx-auto py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
                {Array(12).fill("").map((_, i) => (
                    <div key={i} className="w-full">
                        <div className="w-full h-48 bg-gray-300 rounded-2xl"></div>
                        <div className="mt-3 space-y-2">
                            <div className="h-6 bg-gray-300 rounded-md w-3/4"></div>
                            <div className="h-4 bg-gray-300 rounded-md w-1/2"></div>
                            <div className="h-4 bg-gray-300 rounded-md w-5/6"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Shimmer;

export function MenuShimmer() {
    return (
        <div className="w-full max-w-3xl mx-auto mt-10 p-4 animate-pulse">
            <div className="w-full h-64 bg-gray-300 rounded-xl"></div>
            <div className="w-full flex mt-10 justify-between">
                <div className="w-[45%] h-10 bg-gray-300 rounded-xl"></div>
                <div className="w-[45%] h-10 bg-gray-300 rounded-xl"></div>
            </div>
            <div className="w-full mt-20 flex flex-col gap-9">
                {Array(5).fill("").map((_, i) => (
                    <div key={i} className="w-full h-40 flex justify-between items-center">
                        <div className="w-[60%] flex flex-col gap-5 h-full">
                            <div className="w-full h-5 bg-gray-300 rounded"></div>
                            <div className="w-[50%] h-5 bg-gray-300 rounded"></div>
                            <div className="w-[30%] h-5 bg-gray-300 rounded"></div>
                        </div>
                        <div className="w-[30%] rounded-xl h-full bg-gray-300"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}