import React from "react";
import OnYourMind from "./onYourMind";
import TopRestaurant from "./TopRestaurant";
import OnlineFoodDelivey from "./OnlineFoodDelivey";
import { useSelector } from "react-redux";
import Shimmer from "./Shimmer";
import useRestaurantsData from "../hooks/useRestaurantsData";

function Body() {
    const [topRestaurantData, topResTitle, onlineTitle, onYourMindData, data] = useRestaurantsData();

    const filterVal = useSelector((state) => state?.filterSlice?.filterVal);

    const filteredData = topRestaurantData?.filter((item) => {
        if (!filterVal) return true;

        const costForTwo = parseInt(item?.info?.costForTwo?.replace(/[^0-9]/g, '')) || 0;

        switch (filterVal) {
            case "Ratings 4.0+":
                return item?.info?.avgRating > 4;
            case "Rs. 300-Rs. 600":
                return costForTwo >= 300 && costForTwo <= 600;
            case "Offers":
                return item?.info?.aggregatedDiscountInfoV3; // Check if offer object exists
            case "Less than Rs. 300":
                return costForTwo < 300;
            default:
                return true;
        }
    });

    if (!data || Object.keys(data).length === 0) {
        return <Shimmer />;
    }
    
    if (data.communication || data.tid === "") {
        return (
            <div className="flex mt-32 md:mt-64 overflow-hidden justify-center items-center flex-col text-center p-4">
                <img
                    className="w-72"
                    src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_476,h_476/portal/m/location_unserviceable.png"
                    alt="Location unserviceable"
                />
                <h1 className="text-xl font-bold mt-4">Location unserviceable</h1>
                <p>We don’t have any services here till now. Try changing location.</p>
            </div>
        );
    }

    return (
        <div className="w-full pb-20">
            {topRestaurantData?.length ? (
                <div className="w-full px-4 sm:px-10 lg:w-[80%] mx-auto mt-3 overflow-hidden">
                    {onYourMindData && onYourMindData.length > 0 && (
                        <OnYourMind data={onYourMindData} />
                    )}
                    {topRestaurantData && topRestaurantData.length > 0 && (
                        <TopRestaurant data={topRestaurantData} title={topResTitle} />
                    )}

                    <OnlineFoodDelivey
                        data={filterVal ? filteredData : topRestaurantData}
                        title={onlineTitle}
                    />
                </div>
            ) : (
                <Shimmer />
            )}
        </div>
    );
}

export default Body;