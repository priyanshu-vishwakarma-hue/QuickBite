import React, { useContext, useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Coordinates } from "../context/contextApi";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../utils/cartSlice";
import AddToCartBtn from "./AddToCartBtn";
import { toggleDiffRes } from "../utils/toogleSlice";
import { MenuShimmer } from "./Shimmer";
import { nonVeg, veg } from "../utils/links";

function RestaurantMenu() {
    const { id } = useParams();
    const mainId = id.split("-").at(-1);

    const [resInfo, setResInfo] = useState(null);
    const [menuData, setMenuData] = useState([]);
    const [discountData, setDiscountData] = useState([]);
    
    const dealsContainer = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const { coord: { lat, lng } } = useContext(Coordinates);

    const checkScrollability = () => {
        const el = dealsContainer.current;
        if (el) {
            setCanScrollLeft(el.scrollLeft > 0);
            setCanScrollRight(el.scrollWidth > el.clientWidth + el.scrollLeft + 1);
        }
    };
    
    useEffect(() => {
        const el = dealsContainer.current;
        if (el) {
            checkScrollability();
            el.addEventListener('scroll', checkScrollability);
            window.addEventListener('resize', checkScrollability);
            return () => {
                el.removeEventListener('scroll', checkScrollability);
                window.removeEventListener('resize', checkScrollability);
            };
        }
    }, [discountData]);

    const scrollDeals = (scrollOffset) => {
        dealsContainer.current?.scrollBy({ left: scrollOffset, behavior: 'smooth' });
    };

    useEffect(() => {
        async function fetchMenu() {
            try {
                const data = await fetch(
                    `${import.meta.env.VITE_BASE_URL}/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=${lat}&lng=${lng}&restaurantId=${mainId.split("rest").at(-1)}&catalog_qa=undefined&submitAction=ENTER`
                );
                const res = await data.json();

                const restaurantInfo = res?.data?.cards.find(c => c?.card?.card?.["@type"].includes("food.v2.Restaurant"))?.card?.card?.info;
                const discountInfo = res?.data?.cards.find(c => c?.card?.card?.["@type"].includes("v2.GridWidget"))?.card?.card?.gridElements?.infoWithStyle?.offers;
                const menu = res?.data?.cards.find(c => c.groupedCard)?.groupedCard?.cardGroupMap?.REGULAR?.cards.filter(c => c?.card?.card?.itemCards || c?.card?.card?.categories);

                setResInfo(restaurantInfo);
                setDiscountData(discountInfo || []);
                setMenuData(menu || []);
            } catch (error) {
                console.error("Failed to fetch menu:", error);
            }
        }
        fetchMenu();
    }, [id, lat, lng, mainId]);

    if (!resInfo) return <MenuShimmer />;

    return (
        <div className="w-full">
            <div className="w-[95%] md:w-[800px] mx-auto pt-8 pb-20">
                <p className="text-xs text-slate-500">
                    <Link to="/" className="hover:text-slate-700">Home</Link> / 
                    <Link to="/" className="hover:text-slate-700">{resInfo.city}</Link> / 
                    <span className="text-slate-700"> {resInfo.name}</span>
                </p>

                <h1 className="font-bold pt-6 text-3xl">{resInfo.name}</h1>
                <div className="w-full h-auto bg-gradient-to-t from-slate-100/70 mt-4 p-1 rounded-3xl">
                    <div className="w-full border border-slate-200/70 rounded-2xl bg-white p-4">
                        <p className="font-bold"><i className="fi fi-ss-circle-star mt-1 text-green-600"></i> {resInfo.avgRatingString} ({resInfo.totalRatingsString}) • {resInfo.costForTwoMessage}</p>
                        <p className="font-semibold text-orange-600 underline cursor-pointer">{resInfo.cuisines.join(', ')}</p>
                    </div>
                </div>

                {discountData.length > 0 && (
                    <div className="w-full overflow-hidden mt-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-bold text-2xl">Deals for you</h2>
                            <div className="flex gap-3">
                                <button onClick={() => scrollDeals(-300)} disabled={!canScrollLeft} className="cursor-pointer rounded-full w-9 h-9 flex justify-center items-center bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed">
                                    <i className={`fi text-2xl mt-1 fi-rr-arrow-small-left ${canScrollLeft ? 'text-gray-800' : 'text-gray-300'}`}></i>
                                </button>
                                <button onClick={() => scrollDeals(300)} disabled={!canScrollRight} className="cursor-pointer rounded-full w-9 h-9 flex justify-center items-center bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed">
                                    <i className={`fi text-2xl mt-1 fi-rr-arrow-small-right ${canScrollRight ? 'text-gray-800' : 'text-gray-300'}`}></i>
                                </button>
                            </div>
                        </div>
                        <div ref={dealsContainer} className="flex gap-4 overflow-x-auto no-scrollbar">
                            {discountData.map((data, i) => (
                                <div key={i} className="flex-shrink-0"><Discount data={data} /></div>
                            ))}
                        </div>
                    </div>
                )}

                <h2 className="text-center mt-10 text-sm font-bold tracking-widest text-gray-500">MENU</h2>
                
                <div className="mt-4">
                    {menuData.map(({ card: { card } }, i) => (
                        <MenuCard card={card} key={i} resInfo={resInfo} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function MenuCard({ card, resInfo }) {
    const isCategory = card["@type"]?.includes("NestedItemCategory");
    const [isOpen, setIsOpen] = useState(!isCategory);

    if (!card.itemCards && !card.categories) return null;

    return (
        <>
            <div className="mt-7">
                <div className="flex justify-between cursor-pointer" onClick={() => setIsOpen(prev => !prev)}>
                    <h1 className="font-bold text-xl">{card.title} ({card.itemCards?.length || card.categories?.length})</h1>
                    <i className={`fi text-xl fi-rr-angle-small-${isOpen ? "up" : "down"}`}></i>
                </div>
                {isOpen && (
                    card.itemCards ? <DetailMenu itemCards={card.itemCards} resInfo={resInfo} /> :
                    card.categories.map((cat, i) => <MenuCard key={i} card={cat} resInfo={resInfo} />)
                )}
            </div>
            <hr className="my-5 border-t-8 border-gray-100" />
        </>
    );
}

function DetailMenu({ itemCards, resInfo }) {
    return (
        <div className="my-5">
            {itemCards.map(({ card: { info } }) => (
                <DetailMenuCard key={info.id} info={info} resInfo={resInfo} />
            ))}
        </div>
    );
}

function DetailMenuCard({ info, resInfo }) {
    const { name, defaultPrice, price, itemAttribute, ratings, description = "", imageId } = info;
    const isDiffRes = useSelector((state) => state.toogleSlice.isDiffRes);
    const dispatch = useDispatch();

    const handleIsDiffRes = () => dispatch(toggleDiffRes());
    const handleClearCart = () => {
        dispatch(clearCart());
        dispatch(toggleDiffRes());
    };
    
    const [isMore, setIsMore] = useState(false);
    const hasLongDescription = description.length > 100;

    return (
        <div className="relative w-full">
            <div className="flex w-full justify-between min-h-[150px] py-4">
                <div className="w-[65%] md:w-[75%] pr-4">
                    <img className="w-5" src={itemAttribute?.vegClassifier === "VEG" ? veg : nonVeg} alt="" />
                    <h3 className="font-bold text-lg mt-1">{name}</h3>
                    <p className="font-semibold text-base">₹{defaultPrice / 100 || price / 100}</p>
                    {ratings?.aggregatedRating?.rating && (
                         <div className="flex items-center gap-1 text-sm mt-1">
                            <i className="fi fi-ss-star text-green-600"></i>
                            <span>{ratings.aggregatedRating.rating} ({ratings.aggregatedRating.ratingCountV2})</span>
                        </div>
                    )}
                    <p className="text-gray-500 text-sm mt-2">
                        {isMore || !hasLongDescription ? description : `${description.substring(0, 100)}...`}
                         {hasLongDescription && (
                            <span className="text-blue-600 cursor-pointer ml-1" onClick={() => setIsMore(!isMore)}>
                                {isMore ? 'Show Less' : 'Show More'}
                            </span>
                        )}
                    </p>
                </div>
                <div className="w-[35%] md:w-[25%] relative">
                    {imageId && <img className="rounded-xl aspect-square object-cover w-full" src={`https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/${imageId}`} alt={name} />}
                    <AddToCartBtn info={info} resInfo={resInfo} handleIsDiffRes={handleIsDiffRes} />
                </div>
            </div>
            <hr />
            {isDiffRes && (
                <div className="w-full max-w-[520px] fixed bottom-10 left-1/2 -translate-x-1/2 h-auto flex flex-col gap-2 p-8 border z-50 shadow-lg bg-white rounded-lg">
                    <h2 className="font-bold text-xl">Items already in cart</h2>
                    <p>Your cart contains items from another restaurant. Would you like to reset your cart for adding items from this restaurant?</p>
                    <div className="flex justify-between gap-3 w-full uppercase mt-4">
                        <button onClick={handleIsDiffRes} className="border-2 w-1/2 p-3 border-green-600 text-green-600 font-bold rounded-md">NO</button>
                        <button onClick={handleClearCart} className="w-1/2 p-3 bg-green-600 text-white font-bold rounded-md">YES, START AFRESH</button>
                    </div>
                </div>
            )}
        </div>
    );
}

function Discount({ data: { info: { header, offerLogo, couponCode } } }) {
    return (
        <div className="flex gap-3 min-w-[300px] border p-3 h-auto rounded-xl items-center">
            <img src={`https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_96,h_96/${offerLogo}`} alt="" className="w-10 h-10" />
            <div>
                <h3 className="font-bold text-base leading-tight">{header}</h3>
                <p className="text-gray-500 text-xs font-semibold">{couponCode}</p>
            </div>
        </div>
    );
}

export default RestaurantMenu;