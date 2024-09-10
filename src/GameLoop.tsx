import { useState, useEffect, useRef } from "react";
import { getJsObjects } from "./fetchJson";

// interface config {
//     imgages: string;
//     startingMoney: number;
//     startingProducts: Array<string>;
//     luckLowerBound: number;
//     luckUpperBound: number;
//     roundsAmount: number;
//     howToPlay: string;
//     investingTimer: number;
//     eventTimer: number;
// }

interface events {
    baseGame: string;
    advancedGame: string;
    eventName: string;
    eventText: string;
    eventValue: number;
    IMG: string;
}

interface products {
    baseGame: string;
    advancedGame: string;
    productName: string;
    productDescription: string;
    cost: number;
    minHoldingTime: number;
    timeToSell: number;
    fixedIncome: number;
    diceMultiplier: number;
    minDiceForProfit: number;
    IMG: string;
}

// Index 0 is config, 1 events, 2 is products
function useJson(index: number) {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedData = await getJsObjects();
                if (fetchedData) {
                    setData(fetchedData[index]);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setData(null);
            }
        };
        fetchData();
    }, [index]);

    return [data, setData];
}

function NewEvent(
    {
        eventData,
        eventIndex,
        setEconomySummary

    }:
        {
            eventData: events[],
            eventIndex: number,
            setEconomySummary: Function
        }) {


    return (
        <>
            <div className="mt-8">
                <h1 className="text-4xl text-center">{eventData[eventIndex].eventName}</h1>
                <hr className="w-64 mb-8 mx-auto bg-black h-0.5 mt-1"></hr>
                <img src={`investing_game/images/events/${eventData[eventIndex].IMG}.png`}></img>
                <p className="text-3xl text-center">{eventData[eventIndex].eventText}</p>
                <hr className="w-52 mb-0 mx-auto bg-black h-0.5 mt-4"></hr>
            </div>

            <button className="rounded-lg hover:scale-110 duration-200 border-2 border-black p-2 block text-3xl mx-auto mt-5" onClick={() => {
                setEconomySummary(true);
            }}>Pokračovat</button>
        </>
    );
}

function EconomyAfterEvent(
    {
        setNextRound,
        eventData,
        setYear,
        year,
        setProductData,
        productData,
        eventIndex,
        setEconomySummary
    }:
        {
            setNextRound: Function,
            eventData: events[],
            setYear: Function,
            year: number,
            setProductData: Function,
            productData: products[],
            eventIndex: number,
            setEconomySummary: Function
        }) {

    const [diceRolls, setDiceRolls] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        // Generate dice rolls for each product only once
        const initialDiceRolls: { [key: string]: number } = {};
        productData.forEach(item => {
            initialDiceRolls[item.productName] = Math.floor(Math.random() * 6);
        });
        setDiceRolls(initialDiceRolls);
    }, [productData]);

    return (
        <>
            <div className="mt-8">
                <h1 className="text-4xl text-center">{eventData[eventIndex].eventName}</h1>
                <hr className="w-64 mb-8 mx-auto bg-black h-0.5 mt-1"></hr>
            </div>

            {(productData).map((item: products) => {
                const diceRoll = diceRolls[item.productName];
                const diceIncome = (diceRoll >= item.minDiceForProfit) ? item.diceMultiplier * diceRoll : 0;

                return (
                    <div className="mt-3 mx-6 flex justify-between" key={item.productName}>
                        <h3 className="text-3xl flex-1 break-words">{item.productName}
                            {diceIncome > 0 && <img className="size-8 my-auto inline-block" src={`investing_game/images/dices/dice${diceRoll}.svg`}></img>}
                        </h3>
                        <h3 className="text-3xl text-right">
                            <span className={(eventData[eventIndex] as any)[item.productName][1] >= 0 ? 'text-green-700' : 'text-red-700'}>
                                ${(eventData[eventIndex] as any)[item.productName][1]}</span>&nbsp;
                            <span className={(eventData[eventIndex] as any)[item.productName][0] + diceIncome >= 0 ? 'text-green-700' : 'text-red-700'}>
                                ${(eventData[eventIndex] as any)[item.productName][0] + diceIncome}</span>
                        </h3>
                    </div>
                );
            })}

            <button className="rounded-lg hover:scale-110 duration-200 border-2 border-black p-2 block text-3xl mx-auto mt-5" onClick={() => {

                const updatedProducts = productData.map(product => {
                    const diceRoll = diceRolls[product.productName];
                    const diceIncome = (diceRoll > product.minDiceForProfit) ? product.diceMultiplier * diceRoll : 0;
                    if ((eventData[eventIndex] as any)[product.productName]) {
                        return {
                            ...product,
                            cost: Number(product.cost) + (eventData[eventIndex] as any)[product.productName][0] + diceIncome,
                            fixedIncome: Number(product.fixedIncome) + (eventData[eventIndex] as any)[product.productName][1],
                        };
                    }
                    return product;
                });
                setProductData(updatedProducts);

                setNextRound(false);
                setYear(year + 1);
                setEconomySummary(false);

            }}>Pokračovat</button>
        </>
    )
}

function Portfolio({ portfolioItems,
    setNewPortfolioItems,
    newPortfolioItems,
    productData,
    liquidity,
    setLiquidity,
    oldPortfolioItems,
    portfolioItemCount,
    setPortfolioItemCount
}:
    {
        portfolioItems: string[] | null,
        setNewPortfolioItems: Function,
        newPortfolioItems: string[] | null,
        productData: products[],
        liquidity: number, setLiquidity: Function,
        oldPortfolioItems: string[] | null
        portfolioItemCount: { [key: string]: number },
        setPortfolioItemCount: Function
    }) {
    const uniquePortfolioItems = Array.from(new Set(portfolioItems));

    const productsInPortfolio = productData.filter(product => uniquePortfolioItems.includes(product.productName));
    const productsNotInPortfolio = productData.filter(product => !uniquePortfolioItems.includes(product.productName));

    const combinedProductList = [...productsInPortfolio, ...productsNotInPortfolio];


    return (
        <>
            <div className="mt-16">
                <h1 className="text-4xl text-center">Vaše portfolio</h1>
                <hr className="w-64 mx-auto bg-black h-0.5 mt-1"></hr>
            </div>
            {combinedProductList.map((product) => {
                const initialCount = portfolioItems!.filter(item => item === product.productName).length;
                const oldInitialCount = oldPortfolioItems ? oldPortfolioItems.filter((item: string) => item === product.productName).length
                    : initialCount;
                const isTimeToSellValid = product.timeToSell > -1;

                const count = portfolioItemCount[product.productName] ?? initialCount;

                //trying to stop going to negative numbers
                if (product.cost < 1) product.cost = 1;
                if (product.fixedIncome < 0) product.fixedIncome = 0;

                return (
                    <div className="mt-8 mx-6" key={product.productName}>
                        <h2 className="text-3xl">
                            {product.productName}
                            <span className="float-right">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                </svg>
                            </span>
                        </h2>
                        <div className="mt-2 flex items-center justify-between">

                            <div className="flex items-center space-x-2">
                                <button
                                    className={`size-12 border-solid border-2 text-3xl rounded-lg flex items-center justify-center 
                    ${(isTimeToSellValid || count > oldInitialCount) && count > 0 ? 'border-black text-black' : 'border-black/30 text-black/30 hover:cursor-not-allowed'}`}
                                    onClick={() => {
                                        if ((isTimeToSellValid || count > oldInitialCount) && count > 0) {
                                            const indexToSell = newPortfolioItems?.findIndex((toSellItem: string) => toSellItem === product.productName);

                                            if (indexToSell !== -1 && newPortfolioItems) {
                                                const updatedPortfolioItems = [...newPortfolioItems];
                                                updatedPortfolioItems.splice(indexToSell!, 1);
                                                setNewPortfolioItems(updatedPortfolioItems);
                                            }

                                            setPortfolioItemCount((prevCount: { [key: string]: number }) => ({ ...prevCount, [product.productName]: count - 1 }));
                                            setLiquidity(liquidity + Number(product.cost));
                                        }
                                    }}
                                >
                                    -
                                </button>
                                <span className="text-2xl">{count}</span>
                                <button
                                    className={`size-12 border-solid border-2 text-3xl rounded-lg flex items-center justify-center
                    ${liquidity < product.cost ? 'border-black/30 text-black/30' : 'border-black text-black'}`}

                                    onClick={() => {
                                        if (liquidity >= Number(product.cost)) {
                                            setNewPortfolioItems((previousItems: string[]) => [...previousItems, product.productName]);

                                            setPortfolioItemCount((prevCount: { [key: string]: number }) => ({ ...prevCount, [product.productName]: count + 1 }));
                                            setLiquidity(liquidity - Number(product.cost));
                                        }
                                    }}
                                >
                                    +
                                </button>
                            </div>

                            <div className="flex space-x-3 text-3xl">
                                <span>+${product.fixedIncome}</span>
                                <span>${product.cost}</span>
                            </div>
                        </div>
                        <hr className="w-full mx-auto bg-black h-0.5 mt-3"></hr>
                    </div>
                );
            })}
        </>
    );
}

function ChangeSummary(
    {
        portfolioItems,
        productData,
        setNextRound,
        setShowSite,
        setOldPortfolioItems,
        portfolioItemCount,
        liquidity,
        setLiquidity,
        setEventIndex,
        eventDataLength
    }:
        {
            portfolioItems: string[] | null,
            productData: products[],
            setNextRound: Function,
            setShowSite: Function,
            setOldPortfolioItems: Function,
            portfolioItemCount: { [key: string]: number },
            liquidity: number,
            setLiquidity: Function,
            setEventIndex: Function,
            eventDataLength: number
        }) {
    const productsInPortfolio = productData.filter(product => portfolioItems?.includes(product.productName));
    let incomeSum = 0;

    return (
        <>
            <div className="mt-16 mb-8">
                <h1 className="text-4xl text-center">Výnosy:</h1>
                <hr className="w-64 mx-auto bg-black h-0.5 mt-1"></hr>
            </div>
            {productsInPortfolio.map((item: products) => {
                incomeSum += portfolioItemCount[item.productName] * Number(item.fixedIncome);

                return (
                    <div className="mt-6 mx-6 flex justify-between" key={item.productName}>
                        <h3 className="text-3xl flex-1 break-words">{item.productName}</h3>
                        <h3 className="text-3xl text-right">{portfolioItemCount[item.productName]} x ${(item.fixedIncome)}</h3>
                    </div>
                );
            })}
            <div style={{ clear: 'both' }}></div>
            <hr className="w-56 mx-auto bg-black h-0.5 mt-6"></hr>
            <h2 className="mt-2 block text-3xl text-center">Celkově: <span className="ml-1">${incomeSum}</span></h2>
            <button className="rounded-lg hover:scale-110 duration-200 border-2 border-black p-2 block text-3xl mx-auto mt-5" onClick={() => {
                setShowSite(0);
                setOldPortfolioItems(portfolioItems);
                setNextRound(true);
                setLiquidity(liquidity + incomeSum);
                setEventIndex(Math.floor(Math.random() * eventDataLength));
            }}>Další kolo</button>
        </>
    );
}

function TopBar({ liquidity, year }: { liquidity: number | null, year: number }) {
    if (liquidity === null) {
        return <h1>Loading...</h1>;
    }

    return (
        <div className="fixed top-0 py-1 text-3xl w-full bg-black/90 text-white">
            <p className="float-left px-2">{year}</p>
            <p className="float-right px-2">{liquidity}$</p>
        </div>
    );
}

function NavigationArrows({ showSite, setShowSite, numberOfSites }:
    { showSite: number, setShowSite: Function, numberOfSites: number }) {

    return (
        <>
            <div className="fixed flex justify-center items-center w-full bottom-12 space-x-3">
                <button className={`inline rounded-lg hover:scale-110 duration-200 ${showSite <= 0 ? 'text-black/60' : 'text-black'}`}
                    onClick={() => setShowSite(showSite - 1)} disabled={showSite <= 0}>

                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 5 24 14" strokeWidth={1.5} stroke="currentColor" className="w-20">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                </button>
                <button className={`inline rounded-lg hover:scale-110 duration-200 ${showSite >= numberOfSites ? 'text-black/60' : 'text-black'}`}
                    onClick={() => setShowSite(showSite + 1)} disabled={showSite >= numberOfSites}>

                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 5 24 14" strokeWidth={1.5} stroke="currentColor" className="w-20">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                </button>
            </div>
        </>
    );
}

function GameLoop(
    {
        SetEndGame,
        year,
        setYear,
        setTotalScore,
        gameMode
    }:
        {
            SetEndGame: Function,
            year: number,
            setYear: Function,
            setTotalScore: Function,
            gameMode: number
        }
) {
    const [configData] = useJson(0);
    const [eventData] = useJson(1);
    const [productData, setProductData] = useJson(2);
    const [showSite, setShowSite] = useState(0);
    const numberOfSites = 1;
    const [liquidity, setLiquidity] = useState<number | null>(null);
    const [portfolioItems, setPortfolioItems] = useState<Array<string> | null>(null);
    const [newPortfolioItems, setNewPortfolioItems] = useState<Array<string> | null>(null);
    const [oldPortfolioItems, setOldPortfolioItmes] = useState<Array<string> | null>(null);
    const [nextRound, setNextRound] = useState(false);
    const [portfolioItemCount, setPortfolioItemCount] = useState<{ [key: string]: number }>({});
    const [eventIndex, setEventIndex] = useState<number>(0);
    const [economySummary, setEcomomySummary] = useState(false);
    const isInitialized = useRef(false);

    useEffect(() => {
        if (configData) {
            setLiquidity(configData.startingMoney);
            setPortfolioItems(configData.startingProducts);
            setNewPortfolioItems(configData.startingProducts);

            const initialCount: { [key: string]: number } = {};
            configData.startingProducts.forEach((product: string) => {
                initialCount[product] = (initialCount[product] || 0) + 1;
            });

            setPortfolioItemCount(initialCount);
            if (!isInitialized.current) {
                setOldPortfolioItmes(configData.startingProducts);
                isInitialized.current = true;
            }
        }
    }, [configData]);

    useEffect(() => {
        setPortfolioItems(newPortfolioItems);
    }, [showSite]);

    // useEffect(() => {
    //     const interval = setTimeout(() => {
    //         if (!nextRound) {
    //             setShowSite(0);
    //             setOldPortfolioItmes(portfolioItems);
    //             setNextRound(true);
    //             let incomeSum = 0;
    //             productData.forEach((product: products) => {
    //                 incomeSum += portfolioItemCount[product.productName] * product.fixedIncome;
    //             });
    //             setLiquidity(prev => (prev || 0) + incomeSum);
    //             setEventIndex(Math.floor(Math.random() * eventData.length));
    //         }
    //         else if (nextRound && !economySummary) {
    //             setEcomomySummary(true);
    //         } else {
    //             const updatedProducts = productData.map((product: products) => {
    //                 const diceRoll = Math.floor(Math.random() * 6);
    //                 const diceIncome = (diceRoll >= product.minDiceForProfit) ? product.diceMultiplier * diceRoll : 0;
    //                 if ((eventData[eventIndex] as any)[product.productName]) {
    //                     return {
    //                         ...product,
    //                         cost: Number(product.cost) + (eventData[eventIndex] as any)[product.productName][0] + diceIncome,
    //                         fixedIncome: Number(product.fixedIncome) + (eventData[eventIndex] as any)[product.productName][1],
    //                     };
    //                 }
    //                 return product;
    //             });
    //             setProductData(updatedProducts);
    //             setNextRound(false);
    //             setYear((prevYear: number) => prevYear + 1);
    //             setEcomomySummary(false);
    //         }
    //     }, 10000);
    //
    //     return () => clearTimeout(interval);
    // }, [nextRound, economySummary]);

    if (!productData || liquidity === null) {
        return <h1>Loading...</h1>;
    }

    if ((year - new Date().getFullYear()) >= configData.roundsAmount) {
        let score = 0;
        productData.find((product: products) => {
            if (portfolioItemCount[product.productName]) {
                score += portfolioItemCount[product.productName] * product.cost;
            }
        });

        setTotalScore(liquidity + score);
        SetEndGame(true);
    }

    // Render logic outside of the return block to avoid conditional hooks
    let content = null;
    if (!nextRound) {
        content = (
            <>
                <TopBar liquidity={liquidity} year={year} />
                <NavigationArrows
                    showSite={showSite}
                    setShowSite={setShowSite}
                    numberOfSites={numberOfSites} />

                {showSite === 0 && <Portfolio
                    portfolioItems={portfolioItems}
                    setNewPortfolioItems={setNewPortfolioItems}
                    newPortfolioItems={newPortfolioItems}
                    productData={productData}
                    liquidity={liquidity}
                    setLiquidity={setLiquidity}
                    oldPortfolioItems={oldPortfolioItems}
                    portfolioItemCount={portfolioItemCount}
                    setPortfolioItemCount={setPortfolioItemCount} />}

                {showSite === 1 && <ChangeSummary
                    portfolioItems={portfolioItems}
                    productData={productData}
                    setNextRound={setNextRound}
                    setShowSite={setShowSite}
                    setOldPortfolioItems={setOldPortfolioItmes}
                    portfolioItemCount={portfolioItemCount}
                    liquidity={liquidity}
                    setLiquidity={setLiquidity}
                    setEventIndex={setEventIndex}
                    eventDataLength={eventData.length}
                />}
            </>
        );
    } else if (nextRound && !economySummary) {
        content = (
            <NewEvent
                eventData={eventData}
                eventIndex={eventIndex}
                setEconomySummary={setEcomomySummary} />
        );
    } else if (nextRound && economySummary) {
        content = (
            <EconomyAfterEvent
                setNextRound={setNextRound}
                eventData={eventData}
                setYear={setYear}
                year={year}
                setProductData={setProductData}
                productData={productData}
                eventIndex={eventIndex}
                setEconomySummary={setEcomomySummary} />
        );
    }

    // Return the content
    return content;
}

export default GameLoop;
