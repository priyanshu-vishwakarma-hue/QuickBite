import React, { useRef, useState, useEffect } from "react";

function OnYourMind({ data = [] }) {
    const scrollContainer = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScrollability = () => {
        const el = scrollContainer.current;
        if (el) {
            setCanScrollLeft(el.scrollLeft > 0);
            setCanScrollRight(el.scrollWidth > el.clientWidth + el.scrollLeft);
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
        <div className="mt-5">
            <div className='flex justify-between items-center mb-4'>
                <h1 className="font-bold text-2xl">What's on your mind?</h1>
                <div className="flex gap-3">
                    <button onClick={() => handleScroll(-300)} disabled={!canScrollLeft} className="cursor-pointer rounded-full w-9 h-9 flex justify-center items-center bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed">
                        <i className={`fi text-2xl mt-1 fi-rr-arrow-small-left ${canScrollLeft ? 'text-gray-800' : 'text-gray-300'}`}></i>
                    </button>
                    <button onClick={() => handleScroll(300)} disabled={!canScrollRight} className="cursor-pointer rounded-full w-9 h-9 flex justify-center items-center bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed">
                        <i className={`fi text-2xl mt-1 fi-rr-arrow-small-right ${canScrollRight ? 'text-gray-800' : 'text-gray-300'}`}></i>
                    </button>
                </div>
            </div>

            <div ref={scrollContainer} className="flex mt-4 overflow-x-auto no-scrollbar">
                {data.map((item) => (
                    <img
                        key={item.id}
                        className="w-40 flex-shrink-0"
                        src={`https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/${item.imageId}`}
                        alt={item.action?.text}
                    />
                ))}
            </div>

            <hr className="border mt-8" />
        </div>
    );
}

export default OnYourMind;