import { useState, useEffect } from "react";
import { useRive, Layout, Fit, Alignment, useStateMachineInput } from "@rive-app/react-canvas";
import { useGame } from "./GameContext";
import { useGameLoop } from "./GameLoopContext";

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
    sellingForLastRounds: number;
    diceValues: number[];
}

// class PortfolioProducts {
//     productName: string;
//     cost: number;
//     fixedIncome: number;
//     timeToSell: number;
//     autoSellIn: number = -1;
//
//     constructor(productName: string, cost: number, fixedIncome: number, timeToSell: number) {
//         this.productName = productName;
//         this.cost = cost;
//         this.fixedIncome = fixedIncome;
//         this.timeToSell = timeToSell;
//     }
//
// }


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

function EconomyAfterEvent() {

    const { setRound, round } = useGame();
    const { productData, eventData, eventIndex, setProductData, setNextRound, setEconomySummary } = useGameLoop();

    const [diceRolls, setDiceRolls] = useState<{ [key: string]: number }>({});
    const [rolledDices, setRolledDices] = useState(false);
    const [diceRolledState, setRollDiceState] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        const initialDiceRolls: { [key: string]: number } = {};
        const initialRollDiceState: { [key: string]: boolean } = {};
        productData.forEach((item: products) => {
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
                        .filter((item: products) => item.diceValues[5] > 0)
                        .map((item: products) => (
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
                    <div className="mt-3 mx-6 flex justify-between" key={item.productName}> <h3 className="text-3xl flex-1 break-words">{item.productName}
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

                const updatedProducts = productData.map((product: products) => {
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
                setRound(round + 1);
                setEconomySummary(false);

            }}>Pokračovat</button>
        </>
    )
}

function Portfolio() {

    const { portfolioItems, productData, oldPortfolioItems, portfolioItemCount, newPortfolioItems, liquidity, setLiquidity, setPortfolioItemCount, setNewPortfolioItems } = useGameLoop();
    const uniquePortfolioItems = Array.from(new Set(portfolioItems));

    const productsInPortfolio = productData.filter((product: products) => uniquePortfolioItems.includes(product.productName));
    const productsNotInPortfolio = productData.filter((product: products) => !uniquePortfolioItems.includes(product.productName));

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
                                            setLiquidity((liquidity ?? 0) + Number(product.cost));
                                        }
                                    }}
                                >
                                    -
                                </button>
                                <span className="text-2xl">{count}</span>
                                <button
                                    className={`size-12 border-solid border-2 text-3xl rounded-lg flex items-center justify-center
                    ${(liquidity ?? 0) < product.cost ? 'border-black/30 text-black/30' : 'border-black text-black'}`}

                                    onClick={() => {
                                        if ((liquidity ?? 0) >= Number(product.cost)) {
                                            setNewPortfolioItems((previousItems: string[]) => [...previousItems, product.productName]);

                                            setPortfolioItemCount((prevCount: { [key: string]: number }) => ({ ...prevCount, [product.productName]: count + 1 }));
                                            setLiquidity((liquidity ?? 0) - Number(product.cost));
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

function ChangeSummary() {
    const { gameMode, round } = useGame();
    const { productData, portfolioItems, portfolioItemCount, scenarios, setShowSite, setOldPortfolioItems, setLiquidity, setNextRound, liquidity, eventData, setEventIndex } = useGameLoop();

    const productsInPortfolio = productData.filter((product: products) => portfolioItems?.includes(product.productName));
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
                setLiquidity((liquidity ?? 0) + incomeSum);
                if (scenario.random === "TRUE") {
                    nextEvent = Math.floor(Math.random() * eventData.length);
                }
                else {
                    nextEvent = eventData.findIndex(item => item.eventName.toLowerCase() === scenario.eventOrder[round].toLowerCase());
                    if (nextEvent == -1) nextEvent = Math.floor(Math.random() * eventData.length);
                }

                setEventIndex(nextEvent);
            }}>Další kolo</button>
        </>
    );
}

function TopBar() {
    const { round } = useGame();
    const { liquidity } = useGameLoop();
    if (liquidity === null) {
        return <h1>Loading...</h1>;
    }

    return (
        <div className="fixed top-0 py-1 text-3xl w-full bg-black/90 text-white">
            <p className="float-left px-2">{round}</p>
            <p className="float-right px-2">{liquidity}$</p>
        </div>
    );
}

function NavigationArrows() {
    const { setShowSite, showSite, numberOfSites } = useGameLoop();

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

function GameLoop() {

    const { round, setEndGame, setTotalScore } = useGame();
    const { portfolioItems, configData, setLiquidity, setPortfolioItems, setNewPortfolioItems, setPortfolioItemCount, isInitialized, setOldPortfolioItems, newPortfolioItems, showSite, liquidity, productData, portfolioItemCount, nextRound, economySummary } = useGameLoop();

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
                setOldPortfolioItems(configData.startingProducts);
                isInitialized.current = true;
            }
        }
    }, [configData]);

    useEffect(() => {
        setPortfolioItems(newPortfolioItems);
    }, [showSite]);


    if (!productData || portfolioItems === null || liquidity === null) {
        return <h1>Loading...</h1>;
    }

    if (round >= configData.roundsAmount) {
        let score = 0;
        productData.find((product: products) => {
            if (portfolioItemCount[product.productName]) {
                score += portfolioItemCount[product.productName] * product.cost;
            }
        });

        setTotalScore(liquidity + score);
        setEndGame(true);
    }

    let content = null;
    if (!nextRound) {
        content = (
            <>
                <TopBar />
                <NavigationArrows />

                {showSite === 0 && <Portfolio />}

                {showSite === 1 && <ChangeSummary />}
            </>
        );
    } else if (nextRound && !economySummary) {
        content = (
            <NewEvent />
        );
    } else if (nextRound && economySummary) {
        content = (
            <EconomyAfterEvent />
        );
    }
    return content;
}

export default GameLoop;
