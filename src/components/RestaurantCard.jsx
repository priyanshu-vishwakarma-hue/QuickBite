import React from "react";
import { Link } from "react-router-dom";

function RestaurantCard(info) {
    return (
        <Link to={`/restaurantMenu/${info.link.split("/").at(-1)}`} className="block group w-[295px] flex-shrink-0">
            <div className="w-full h-48 relative rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 group-hover:shadow-xl group-hover:scale-105">
                <img
                    className="w-full h-full object-cover"
                    src={`https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/${info?.cloudinaryImageId}`}
                    alt={info?.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                {info?.aggregatedDiscountInfoV3 && (
                     <p className="absolute bottom-3 left-4 text-white text-2xl font-extrabold tracking-tighter">
                        {info.aggregatedDiscountInfoV3.header} {info.aggregatedDiscountInfoV3.subHeader}
                    </p>
                )}
            </div>
            <div className="mt-4 px-1">
                <h2 className="text-lg font-bold text-slate-800 truncate">{info?.name}</h2>
                <div className="flex items-center gap-2 text-base font-semibold text-slate-700">
                    <i className="fi fi-ss-circle-star text-green-500"></i>
                    <span>{info?.avgRating} • {info?.sla?.slaString}</span>
                </div>
                <p className="line-clamp-1 text-slate-500">{info.cuisines.join(", ")}</p>
                <p className="line-clamp-1 text-slate-500">{info.locality}</p>
            </div>
        </Link>
    );
}

export default RestaurantCard;