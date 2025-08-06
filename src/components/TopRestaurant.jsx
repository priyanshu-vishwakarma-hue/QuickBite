import React, { useRef, useState, useEffect } from "react";
import RestaurantCard from "./RestaurantCard";

function TopRestaurant({ data = [], title }) {
    const scrollContainer = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScrollability = () => {
        const el = scrollContainer.current;
        if (el) {
            setCanScrollLeft(el.scrollLeft > 0);
            setCanScrollRight(el.scrollWidth > el.clientWidth + el.scrollLeft + 1); // +1 for pixel rounding issues
        }
    };

    useEffect(() => {
        checkScrollability();
        const el = scrollContainer.current;
        el?.addEventListener('scroll', checkScrollability);
        window.addEventListener('resize', checkScrollability);
        return () => {
            el?.removeEventListener('scroll', checkScrollability);
            window.removeEventListener('resize', checkScrollability);
        };
    }, [data]);

    const handleScroll = (scrollOffset) => {
        if (scrollContainer.current) {
            scrollContainer.current.scrollBy({ left: scrollOffset, behavior: 'smooth' });
        }
    };

    return (
        <div className="mt-14 w-full">
            <div className="flex justify-between items-center mt-5">
                <h1 className="font-bold text-2xl">{title}</h1>
                <div className="flex gap-3">
                    <button onClick={() => handleScroll(-300)} disabled={!canScrollLeft} className="cursor-pointer rounded-full w-9 h-9 flex justify-center items-center bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed">
                        <i className={`fi text-2xl mt-1 fi-rr-arrow-small-left ${canScrollLeft ? 'text-gray-800' : 'text-gray-300'}`}></i>
                    </button>
                    <button onClick={() => handleScroll(300)} disabled={!canScrollRight} className="cursor-pointer rounded-full w-9 h-9 flex justify-center items-center bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed">
                        <i className={`fi text-2xl mt-1 fi-rr-arrow-small-right ${canScrollRight ? 'text-gray-800' : 'text-gray-300'}`}></i>
                    </button>
                </div>
            </div>

            <div ref={scrollContainer} className="flex mt-4 gap-5 w-full overflow-x-auto no-scrollbar">
                {data.map(({ info, cta: { link } }) => (
                    <div className="hover:scale-95 duration-300 flex-shrink-0" key={info.id}>
                        <RestaurantCard {...info} link={link} />
                    </div>
                ))}
            </div>

            <hr className="border mt-10" />
        </div>
    );
}

export default TopRestaurant;