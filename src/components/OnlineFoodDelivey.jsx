import React, { useState } from "react";
import RestaurantCard from "./RestaurantCard";
import { useDispatch } from "react-redux";
import { setFilterValue } from "../utils/filterSlice";

function OnlineFoodDelivey({ data, title }) {
    const filterOptions = ["Ratings 4.0+", "Rs. 300-Rs. 600", "Offers", "Less than Rs. 300"];
    const [activeBtn, setActiveBtn] = useState(null);
    const dispatch = useDispatch();

    function handleFilterBtn(filterName) {
        const newActiveBtn = activeBtn === filterName ? null : filterName;
        setActiveBtn(newActiveBtn);
        dispatch(setFilterValue(newActiveBtn));
    }

    return (
        <div className="mt-12">
            <h1 className="font-bold my-7 text-3xl">{title}</h1>
            <div className="my-7 flex flex-wrap gap-4">
                {filterOptions.map((filterName, i) => (
                    <button
                        key={i}
                        onClick={() => handleFilterBtn(filterName)}
                        className={`filterBtn ${activeBtn === filterName ? "active" : ""}`}
                    >
                        {filterName}
                        {activeBtn === filterName && <i className="fi fi-br-cross text-xs ml-2"></i>}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-6 gap-y-10">
                {data.map(({ info, cta: { link } }) => (
                    <RestaurantCard {...info} link={link} key={info.id} />
                ))}
            </div>
        </div>
    );
}

export default OnlineFoodDelivey;