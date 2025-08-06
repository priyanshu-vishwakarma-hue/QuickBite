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
                <h1 className="font-bold text-3xl text-slate-800">{title}</h1>
                <div className="flex gap-3">
                    <button onClick={() => handleScroll(-400)} disabled={!canScrollLeft} className="cursor-pointer rounded-full w-9 h-9 flex justify-center items-center bg-white border-2 border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition">
                        <i className={`fi text-xl mt-1 fi-rr-arrow-small-left ${canScrollLeft ? 'text-slate-800' : 'text-slate-300'}`}></i>
                    </button>
                    <button onClick={() => handleScroll(400)} disabled={!canScrollRight} className="cursor-pointer rounded-full w-9 h-9 flex justify-center items-center bg-white border-2 border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition">
                        <i className={`fi text-xl mt-1 fi-rr-arrow-small-right ${canScrollRight ? 'text-slate-800' : 'text-slate-300'}`}></i>
                    </button>
                </div>
            </div>

            {/* Added px-4 to this container to prevent clipping on hover */}
            <div ref={scrollContainer} className="flex mt-6 gap-8 w-full overflow-x-auto no-scrollbar py-4 px-4">
                {data.map(({ info, cta: { link } }) => (
                    <RestaurantCard {...info} link={link} key={info.id} />
                ))}
            </div>

            <hr className="border-t-2 border-slate-100 mt-10" />
        </div>
    );
}

export default TopRestaurant;