import { useState, useEffect, useRef } from "react";
import { getJsObjects } from "./fetchJson";
import { useRive, Layout, Fit, Alignment, useStateMachineInput } from "@rive-app/react-canvas";

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
    productName: string;
    productDescription: string;
    IMG: string;
    cost: number;
    fixedIncome: number;
    minToPreventBankrupcy: number;
    divideDiceByToSell: number;
    timeToSell: number;
    sellingFolLastRounds: number;
    diceValues: number[];
}

interface scenarios {
    baseGame: string;
    random: string;
    scenarioName: string;
    menuText: string;
    scenarioLength: number;
    howToPlay: string;
    eventOrder: string[];
}

// Index 0 is config, 1 events, 2 is products, 3 is scenanrios
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
        setEconomySummary,
        scenarios,
        gameMode
    }:
        {
            eventData: events[],
            eventIndex: number,
            setEconomySummary: Function,
            scenarios: scenarios[],
            gameMode: number
        }) {

    const soloGame = scenarios[gameMode].random == "TRUE";

    return (
        <>
            {soloGame ?
                <div className="mt-8">
                    <h1 className="text-4xl text-center">{eventData[eventIndex].eventName}</h1>
                    <hr className="w-64 mb-8 mx-auto bg-black h-0.5 mt-1"></hr>
                    <img src={`investing_game/images/events/${eventData[eventIndex].IMG}.png`}></img>
                    <p className="text-3xl text-center">{eventData[eventIndex].eventText}</p>
                    <hr className="w-52 mb-0 mx-auto bg-black h-0.5 mt-4"></hr>
                </div>
                :
                <div className="flex items-center justify-center h-screen">
                    <h1 className="text-4xl pb-20 mx-6 text-center font-bold">Událost by měla být na tabuli.</h1>
                </div>
            }

            <div className="w-full fixed bottom-16">
                <button className="rounded-lg hover:scale-110 duration-200 border-2 border-black p-2 block text-3xl mx-auto" onClick={() => {
                    setEconomySummary(true);
                }}>Pokračovat</button>
            </div>
        </>
    );
}

function RiveDice({ diceRolled, diceValue }: { diceRolled: boolean, diceValue: number }) {
    const { rive, RiveComponent } = useRive({
        src: "investing_game/public/dice_roll.riv", // Path to your Rive file
        stateMachines: "dice_state",    // The state machine's name
        layout: new Layout({
            fit: Fit.FitWidth, // Layout options
            alignment: Alignment.Center,
        }),
        autoplay: false,
    });

    const diceNumberInput = useStateMachineInput(rive, "dice_state", "dice_number");

    if (diceNumberInput) {
        diceNumberInput.value = diceValue;
    }

    useEffect(() => {
        if (diceRolled) {
            rive?.play();

            // Set a timeout to stop the animation after 1 second
            const timeoutId = setTimeout(() => {
                rive?.stop();
            }, 1300);

            // Clear timeout when the component is unmounted or diceRolled changes
            return () => {
                clearTimeout(timeoutId);
            };
        }
    }, [diceRolled]);

    return <RiveComponent />;
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
    const [rolledDices, setRolledDices] = useState(false);
    const [diceRolledState, setRollDiceState] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        const initialDiceRolls: { [key: string]: number } = {};
        const initialRollDiceState: { [key: string]: boolean } = {};
        productData.forEach(item => {
            initialDiceRolls[item.productName] = Math.floor(Math.random() * 6) + 1;
            initialRollDiceState[item.productName] = false;
        });
        setDiceRolls(initialDiceRolls);
        setRollDiceState(initialRollDiceState);
    }, [productData]);

    const rollAllDice = () => {
        const newRollDiceState = { ...diceRolledState };
        Object.keys(newRollDiceState).forEach(key => {
            newRollDiceState[key] = true;
        });
        setRollDiceState(newRollDiceState);
        setTimeout(() => {
            setRolledDices(true);
        }, 2700);
    };

    return (
        <>
            <div className={`fixed -mt-8 pt-20 size-full bg-black/90 ${rolledDices ? 'hidden' : 'visible'}`} onClick={rollAllDice}>
                <div className="flex flex-wrap justify-center items-center gap-4">
                    {productData
                        .filter(item => item.diceValues[5] > 0)
                        .map((item) => (
                            <div className="size-40" key={item.productName}>
                                <RiveDice diceRolled={diceRolledState[item.productName]} diceValue={diceRolls[item.productName]} />
                            </div>
                        ))}
                    <h2 className="text-5xl text-white/80 text-center font-bold m-4">Kliknutím hodíš kostkami</h2>
                </div>
            </div>

            <div className="mt-8">
                <h1 className="text-4xl text-center">{eventData[eventIndex].eventName}</h1>
                <hr className="w-64 mb-8 mx-auto bg-black h-0.5 mt-1"></hr>
            </div>

            {productData.map((item: products) => {
                const diceRoll = diceRolls[item.productName];
                const diceIncome = item.diceValues[diceRoll - 1];

                return (
                    <div className="mt-3 mx-6 flex justify-between" key={item.productName}>
                        <h3 className="text-3xl flex-1 break-words">{item.productName}
                            {item.diceValues[5] > 0 && rolledDices && <img className="size-8 my-auto inline-block" src={`investing_game/images/dices/dice${diceRoll}.svg`}></img>}
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
                    const diceIncome = product.diceValues[diceRoll - 1];
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
        eventDataLength,
        currentRound,
        gameMode,
        scenarios,
        eventData
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
            currentRound: number,
            gameMode: number,
            scenarios: scenarios[],
            eventData: events[]
        }) {
    const productsInPortfolio = productData.filter(product => portfolioItems?.includes(product.productName));
    let incomeSum = 0;

    const scenario = scenarios[gameMode];
    let nextEvent: number;

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
                if (scenario.random === "TRUE") {
                    nextEvent = Math.floor(Math.random() * eventDataLength);
                }
                else {
                    nextEvent = eventData.findIndex(item => item.eventName.toLowerCase() === scenario.eventOrder[currentRound].toLowerCase());
                    if (nextEvent == -1) nextEvent = Math.floor(Math.random() * eventDataLength);
                }

                setEventIndex(nextEvent);
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
    const [scenarios] = useJson(3);
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
                    currentRound={year - new Date().getFullYear()}
                    gameMode={gameMode}
                    scenarios={scenarios}
                    eventData={eventData}
                />}
            </>
        );
    } else if (nextRound && !economySummary) {
        content = (
            <NewEvent
                eventData={eventData}
                eventIndex={eventIndex}
                setEconomySummary={setEcomomySummary}
                scenarios={scenarios}
                gameMode={gameMode}
            />
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
