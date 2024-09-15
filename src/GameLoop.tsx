// import { useState, useEffect } from "react";
import { useEffect } from "react";
// import { useRive, Layout, Fit, Alignment, useStateMachineInput } from "@rive-app/react-canvas";
import { useGame } from "./GameContext";
import { useGameLoop } from "./GameLoopContext";

interface products {
    baseGame: string;
    productName: string;
    productDescription: string;
    color: number;
    cost: number;
    fixedIncome: number;
    minToPreventBankrupcy: number;
    divideDiceByToSell: number;
    timeToSell: number;
    sellingForLastRounds: number;
    diceValues: number[];
}

function NewEvent() {

    const { gameMode } = useGame();
    const { scenarios, eventData, eventIndex, setEconomySummary } = useGameLoop();

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

// function RiveDice({ diceRolled, diceValue }: { diceRolled: boolean, diceValue: number }) {
//     const { rive, RiveComponent } = useRive({
//         src: "investing_game/public/dice_roll.riv", // Path to your Rive file
//         stateMachines: "dice_state",    // The state machine's name
//         layout: new Layout({
//             fit: Fit.FitWidth, // Layout options
//             alignment: Alignment.Center,
//         }),
//         autoplay: false,
//     });
//
//     const diceNumberInput = useStateMachineInput(rive, "dice_state", "dice_number");
//
//     if (diceNumberInput) {
//         diceNumberInput.value = diceValue;
//     }
//
//     useEffect(() => {
//         if (diceRolled) {
//             rive?.play();
//
//             // Set a timeout to stop the animation after 1 second
//             const timeoutId = setTimeout(() => {
//                 rive?.stop();
//             }, 1300);
//
//             // Clear timeout when the component is unmounted or diceRolled changes
//             return () => {
//                 clearTimeout(timeoutId);
//             };
//         }
//     }, [diceRolled]);
//
//     return <RiveComponent />;
// }
//
// function EconomyAfterEvent() {
//     const { portfolioItems, setPortfolioItems, eventData, eventIndex } = useGameLoop();
//     const [diceRolls, setDiceRolls] = useState<{ [key: string]: number }>({});
//
//     useEffect(() => {
//         // Initialize dice rolls
//     }, [portfolioItems]);
//
//     const applyEventEffects = () => {
//         const updatedPortfolioItems = portfolioItems.map((item) => {
//             const diceRoll = diceRolls[item.productName];
//             const diceIncome = item.diceValues[diceRoll - 1];
//
//             if ((eventData[eventIndex] as any)[item.productName]) {
//                 return {
//                     ...item,
//                     cost: item.cost + (eventData[eventIndex] as any)[item.productName][0] + diceIncome,
//                     fixedIncome: item.fixedIncome + (eventData[eventIndex] as any)[item.productName][1],
//                 };
//             }
//             return item;
//         });
//
//         setPortfolioItems(updatedPortfolioItems);
//     };
//
//     return (
//         <>
//             {/* Your component JSX */}
//             <button onClick={applyEventEffects}>Apply Effects</button>
//         </>
//     );
// }

function Portfolio() {
    const {
        portfolioItems,
        productData,
        oldPortfolioItems,
        liquidity,
        setLiquidity,
        setPortfolioItems,
        figmaColors
    } = useGameLoop();

    const uniquePortfolioItems = portfolioItems.filter((item, index, self) =>
        index === self.findIndex((t) => t.productName === item.productName));

    return (
        <div className="font-[Inter] bg-figma-black pb-20">
            <h1 className="mx-5 pt-20 text-lg font-medium text-white">Moje Portfolio</h1>
            {/* Map over productData with products in portfolio first */}
            {[...uniquePortfolioItems, ...productData.filter(product => !portfolioItems.some(item => item.productName === product.productName))].map((product, index) => {
                const itemsInPortfolio = portfolioItems.filter(
                    (item) => item.productName === product.productName
                );

                const count = itemsInPortfolio.length;
                const oldCount = oldPortfolioItems.filter(
                    (item) => item.productName === product.productName
                ).length;

                // Ensure cost and fixedIncome are valid
                const adjustedCost = Math.max(product.cost, 1);
                const isTimeToSellValid = product.timeToSell > -1;

                return (
                    <div className={`${count <= 0 && 'flex'} mt-4 mx-6`}>
                        <div className={`${count > 0 ? 'max-w-96' : 'w-72'}`} key={`${product.productName}-${index}`}>
                            <div className={`rounded-t-xl ${count > 0 ? `bg-${figmaColors[product.color]}` : 'bg-figma-light-gray'} pt-2 pb-1 flex`}>
                                <h2 className="text-xl font-bold mx-3 text-figma-black grow"> {product.productName} </h2>
                                <h2 className={`text-2xl font-bold ${count > 0 ? 'mr-6' : 'mr-0'} text-figma-black`}>{adjustedCost}</h2>
                                {/* Buy Button */}
                                <button className="mx-3"
                                    onClick={() => {
                                        if ((liquidity ?? 0) >= adjustedCost) {
                                            const newItem = { ...product, autoSellIn: -1 };
                                            setPortfolioItems([...portfolioItems, newItem]);
                                            setLiquidity((liquidity ?? 0) - adjustedCost);
                                        }
                                    }}
                                    disabled={(liquidity ?? 0) < adjustedCost}>
                                    <svg
                                        className={`${(liquidity ?? 0) < adjustedCost && 'cursor-not-allowed'}
                                    ${count <= 0 && 'hidden'}`}
                                        width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="15.572" cy="15" r="12.5" fill="#0B1F42" stroke="#0B1F42" />
                                        <path d="M15.572 8.06665V21.9333" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                        <path d="M8.63852 15L22.5052 15" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </button>
                            </div>
                            <div className="rounded-b-xl bg-[#FFFDFD]">
                                {itemsInPortfolio.map((item, itemIndex) => {
                                    return (
                                        <div key={`${product.productName}-${index}-${itemIndex}`} className="flex items-center space-x-2 mx-3 py-2 ">
                                            <div className="flex grow border-figma-stone/40 border rounded-lg mr-2 p-2 font-bold">
                                                <h2 className="text-[12px] my-auto text-figma-stone">VÝNOS:</h2>
                                                <h2 className="text-xl my-auto grow flex"><span className="mx-3">+</span>{item.fixedIncome > 0 && item.fixedIncome}{item.diceValues[5] > 0 &&
                                                    <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <rect x="5.82291" y="5.36719" width="19.2341" height="19.2341" rx="2" stroke="#0B1F42" strokeLinejoin="round" />
                                                        <circle cx="10.8362" cy="10.5508" r="2" transform="rotate(-45 10.8362 10.5508)" fill="#0B1F42" />
                                                        <circle cx="15.5904" cy="15.3047" r="2" transform="rotate(-45 15.5904 15.3047)" fill="#0B1F42" />
                                                        <circle cx="20.0437" cy="19.7578" r="2" transform="rotate(-45 20.0437 19.7578)" fill="#0B1F42" />
                                                    </svg>}
                                                    {item.fixedIncome <= 0 && item.diceValues[5] <= 0 && 0}
                                                </h2>
                                                <h2 className="my-auto text-[11px] text-figma-stone">PRODEJ</h2>
                                                <h2 className="my-auto text-xl ml-6 mr-[14px] text-center">{item.cost}</h2>
                                            </div>
                                            {/* Sell Button */}
                                            <button
                                                className={`${(isTimeToSellValid || count > oldCount) && count > 0
                                                    ? 'border-black text-black'
                                                    : 'border-black/30 text-black/30 cursor-not-allowed'
                                                    }`}
                                                onClick={() => {
                                                    if ((isTimeToSellValid || count > oldCount) && count > 0) {
                                                        const indexToSell = portfolioItems.findIndex(
                                                            (item) => item.productName === product.productName
                                                        );

                                                        if (indexToSell !== -1) {
                                                            const updatedPortfolioItems = [...portfolioItems];
                                                            updatedPortfolioItems.splice(indexToSell, 1);
                                                            setPortfolioItems(updatedPortfolioItems);
                                                            setLiquidity((liquidity ?? 0) + adjustedCost);
                                                        }
                                                    }
                                                }}
                                                disabled={!((isTimeToSellValid || count > oldCount) && count > 0)}
                                            >
                                                <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="15.572" cy="15" r="12.5" fill="#FFFDFD" stroke="#0B1F42" />
                                                    <path d="M11.572 15L19.572 15" stroke="#0B1F42" strokeWidth="2" strokeLinecap="round" />
                                                </svg>
                                            </button>
                                        </div>
                                    );
                                })}
                                {count <= 0 &&
                                    <div className="flex justify-center rounded-lg mr-2 py-5 font-bold">
                                        <h2 className="text-[12px] my-auto text-figma-stone">VÝNOS:</h2>
                                        <h2 className="text-xl my-auto flex"><span className="mx-3">+</span>{product.fixedIncome > 0 && product.fixedIncome}{product.diceValues[5] > 0 &&
                                            <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect x="5.82291" y="5.36719" width="19.2341" height="19.2341" rx="2" stroke="#0B1F42" strokeLinejoin="round" />
                                                <circle cx="10.8362" cy="10.5508" r="2" transform="rotate(-45 10.8362 10.5508)" fill="#0B1F42" />
                                                <circle cx="15.5904" cy="15.3047" r="2" transform="rotate(-45 15.5904 15.3047)" fill="#0B1F42" />
                                                <circle cx="20.0437" cy="19.7578" r="2" transform="rotate(-45 20.0437 19.7578)" fill="#0B1F42" />
                                            </svg>}
                                            {product.fixedIncome <= 0 && product.diceValues[5] <= 0 && 0}
                                        </h2>
                                    </div>
                                }
                            </div>
                        </div>
                        {/* Buy Button */}
                        {count <= 0 &&
                            <button className="my-auto mx-auto pr-[2px]"
                                onClick={() => {
                                    if ((liquidity ?? 0) >= adjustedCost) {
                                        const newItem = { ...product, autoSellIn: -1 };
                                        setPortfolioItems([...portfolioItems, newItem]);
                                        setLiquidity((liquidity ?? 0) - adjustedCost);
                                    }
                                }}
                                disabled={(liquidity ?? 0) < adjustedCost}>
                                <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="15.705" cy="15.1543" r="12.5" fill="#245375" stroke="#245375" />
                                    <path d="M15.705 8.22119V22.0879" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                    <path d="M8.77158 15.1543L22.6382 15.1543" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </button>}
                    </div>
                );
            })}
        </div>
    );
}

function ChangeSummary() {
    const { portfolioItems, setLiquidity, setShowSite, setNextRound, setOldPortfolioItems } = useGameLoop();
    let incomeSum = 0;

    // Group portfolio items by product name
    const groupedItems = portfolioItems.reduce((acc: { [key: string]: products[] }, item) => {
        if (!acc[item.productName]) {
            acc[item.productName] = [];
        }
        acc[item.productName].push(item);
        return acc;
    }, {});

    return (
        <>
            <div className="mt-16 mb-8">
                <h1 className="text-4xl text-center">Výnosy:</h1>
                <hr className="w-64 mx-auto bg-black h-0.5 mt-1"></hr>
            </div>
            {Object.entries(groupedItems).map(([productName, items]) => {
                const count = items.length;
                const fixedIncome = items[0].fixedIncome;
                const totalIncome = count * fixedIncome;
                incomeSum += totalIncome;

                return (
                    <div className="mt-6 mx-6 flex justify-between" key={productName}>
                        <h3 className="text-3xl flex-1 break-words">{productName}</h3>
                        <h3 className="text-3xl text-right">
                            {count} x ${fixedIncome}
                        </h3>
                    </div>
                );
            })}
            <div style={{ clear: 'both' }}></div>
            <hr className="w-56 mx-auto bg-black h-0.5 mt-6"></hr>
            <h2 className="mt-2 block text-3xl text-center">
                Celkově: <span className="ml-1">${incomeSum}</span>
            </h2>
            <button
                className="rounded-lg hover:scale-110 duration-200 border-2 border-black p-2 block text-3xl mx-auto mt-5"
                onClick={() => {
                    setLiquidity((prevLiquidity: number) => (prevLiquidity ?? 0) + incomeSum);
                    setShowSite(0);
                    setOldPortfolioItems([...portfolioItems]);
                    setNextRound(true);
                }}
            >
                Další kolo
            </button>
        </>
    );
}

function TopBar() {
    const { round } = useGame();
    const { liquidity, configData } = useGameLoop();
    if (liquidity === null) {
        return <h1>Loading...</h1>;
    }

    return (
        <div className="fixed top-0 py-1 text-xl w-full bg-sky-900 font-[Inter]">
            <div className="flex">
                <svg className="w-14 my-auto" width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="15.8669" cy="15.5" r="10.5" stroke="#FFFDFD" />
                    <path d="M13.1711 12.8945C13.1711 12.8945 13.0495 10.1379 15.952 10.1379C15.952 10.1379 18.5634 10.1379 18.5635 12.8945C18.5635 15.5788 15.8428 15.5304 15.8428 18.1294" stroke="#FFFDFD" strokeLinecap="round" />
                    <path d="M15.9026 20.5477V20.8621" stroke="#FFFDFD" strokeLinecap="round" />
                </svg>
                <div className="grow flex justify-center pr-4">
                    <p className="mx-5 my-auto text-white font-bold">{round}/{configData.roundsAmount}</p>
                    <h1 className="text-white font-bold my-auto">OBCHOD</h1>
                </div>
                <div className="bg-white rounded-md w-14 mr-6 my-1">
                    <p className="text-center px-2 text-black font-bold text-xl">{liquidity}</p>
                </div>
            </div>
        </div>
    );
}

function NavigationArrows() {
    const { setShowSite, showSite } = useGameLoop();

    const buttonText = ['MOJE PORTFOLIO', 'UKONČIT KOLO', 'DALŠÍ KOLO'];
    return (
        <>
            <div className="w-full flex justify-end fixed bottom-0 font-[Inter] font-bold bg-sky-900">
                <div className="flex items-center justify-end">
                    <button className='flex rounded-full hover:scale-110 duration-200 text-white border-white border-2 py-2 px-4 m-2'
                        onClick={() => setShowSite(showSite + 1)}>

                        <svg className="my-auto" width="19" height="15" viewBox="0 0 19 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.86694 7.5H17.8669M17.8669 7.5L11.8669 1.5M17.8669 7.5L11.8669 13.5" stroke="#FFFDFD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="mx-3 text-lg">{buttonText[showSite]}</span>
                    </button>
                </div>
            </div>
        </>
    );
}

function GameLoop() {

    const { round, setEndGame, setTotalScore } = useGame();
    const { portfolioItems, configData, setLiquidity, setPortfolioItems, setNewPortfolioItems,
        isInitialized, setOldPortfolioItems, newPortfolioItems, showSite, liquidity, productData,
        nextRound, economySummary } = useGameLoop();

    useEffect(() => {
        if (configData) {
            // setLiquidity(configData.startingMoney);
            setLiquidity(999);

            const initialPortfolioItems = configData.startingProducts.map((productName: string) => {
                const product = productData.find((p: products) => p.productName === productName);
                if (product) {
                    // Create a copy to avoid mutating the original productData
                    return { ...product, autoSellIn: -1 };
                } else {
                    throw new Error(`Product ${productName} not found in productData`);
                }
            });

            setPortfolioItems(initialPortfolioItems);
            setNewPortfolioItems(initialPortfolioItems);
            setOldPortfolioItems(initialPortfolioItems);
            isInitialized.current = true;
        }
    }, [configData]);

    useEffect(() => {
        setPortfolioItems([...newPortfolioItems]);
    }, [showSite]);

    // When calculating the total score at the end of the game
    if (round >= configData.roundsAmount) {
        let score = portfolioItems.reduce((acc, item) => acc + item.cost, 0);
        setTotalScore((liquidity ?? 0) + score);
        setEndGame(true);
    }


    if (!productData || portfolioItems === null || liquidity === null) {
        return <h1>Loading...</h1>;
    }


    let content = null;
    if (!nextRound) {
        content = (
            <>
                <TopBar />
                <NavigationArrows />

                {showSite === 1 && <Portfolio />}

                {showSite === 2 && <ChangeSummary />}
            </>
        );
    } else if (nextRound && !economySummary) {
        content = (
            <NewEvent />
        );
        // } else if (nextRound && economySummary) {
        //     content = (
        //         <EconomyAfterEvent />
        //     );
    }
    return content;
}

export default GameLoop;
