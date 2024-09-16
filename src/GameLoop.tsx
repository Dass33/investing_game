import { useState, useEffect } from "react";
import { useRive, Layout, Fit, Alignment, useStateMachineInput } from "@rive-app/react-canvas";
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

function RiveDice({ diceValue, diceColor }: { diceValue: number, diceColor: number }) {
    const { rive, RiveComponent } = useRive({
        src: "dice_roll.riv", // Path to your Rive file
        stateMachines: "dice_state",    // The state machine's name
        layout: new Layout({
            fit: Fit.FitWidth, // Layout options
            alignment: Alignment.Center,
        }),
        autoplay: true,
    });

    console.log(diceColor);
    const diceNumberInput = useStateMachineInput(rive, "dice_state", "number_to_roll");
    const diceColorInput = useStateMachineInput(rive, "dice_state", "color_to_pick");

    if (diceNumberInput) diceNumberInput.value = diceValue;
    if (diceColorInput) diceColorInput.value = diceColor;

    return <RiveComponent />;
}

function EconomyAfterEvent() {
    const { portfolioItems, setPortfolioItems, eventData, eventIndex } = useGameLoop();
    const [diceRolls, setDiceRolls] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        // Initialize dice rolls
    }, [portfolioItems]);

    const applyEventEffects = () => {
        const updatedPortfolioItems = portfolioItems.map((item) => {
            const diceRoll = diceRolls[item.productName];
            const diceIncome = item.diceValues[diceRoll - 1];

            if ((eventData[eventIndex] as any)[item.productName]) {
                return {
                    ...item,
                    cost: item.cost + (eventData[eventIndex] as any)[item.productName][0] + diceIncome,
                    fixedIncome: item.fixedIncome + (eventData[eventIndex] as any)[item.productName][1],
                };
            }
            return item;
        });

        setPortfolioItems(updatedPortfolioItems);
    };

    return (
        <>
            {/* Your component JSX */}
            <button onClick={applyEventEffects}>Apply Effects</button>
        </>
    );
}

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

function Earnings() {
    const { portfolioItems, setLiquidity, setShowSite, setNextRound, setOldPortfolioItems } = useGameLoop();
    const { round } = useGame();
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
        <div className="relative z-0 h-screen flex flex-col justify-center custom-radial-gradient">
            <h1 className="mb-12 text-xl text-white text-center -mt-44">Tvoje výnosy za {round}. kolo</h1>
            <div className="border border-white rounded-t-xl mx-8 bg-figma-black pb-6">

                {Object.entries(groupedItems).map(([productName, items]) => {
                    const count = items.length;
                    const fixedIncome = items[0].fixedIncome;
                    const totalIncome = count * fixedIncome;
                    incomeSum += totalIncome;

                    return (
                        <div className="mt-6 mx-4 flex justify-between text-white text-base font-medium" key={productName}>
                            <h3 className="my-auto flex-1 break-words text-lg grow">{productName}</h3>
                            {items[0].diceValues[5] > 0 &&
                                <div className="size-10">
                                    <RiveDice diceValue={4} diceColor={items[0].color} />
                                </div>}
                            <h3 className="text-center w-12 my-auto text-lg font-bold">
                                +{fixedIncome}
                            </h3>
                        </div>
                    );
                })}
            </div>
            <div className="mx-8 text-base bg-white rounded-b-xl flex pl-6 pr-7 py-3 text-figma-black font-medium">
                <div style={{ clear: 'both' }}></div>
                <div className="flex w-full ">
                    <h2 className="my-auto grow">CELKEM</h2>
                    <h2 className="text-2xl font-bold">+{incomeSum}</h2>
                </div>
            </div>
        </div>
    );
}

// <button
//     className="rounded-lg hover:scale-110 duration-200 border-2 border-black p-2 block text-3xl mx-auto mt-5"
//     onClick={() => {
//         setLiquidity((prevLiquidity: number) => (prevLiquidity ?? 0) + incomeSum);
//         setShowSite(0);
//         setOldPortfolioItems([...portfolioItems]);
//         setNextRound(true);
//     }}
// >
//     Další kolo
// </button>
//
function EarningsTutorial() {

    const { setEarningsTutorial } = useGameLoop();
    return (
        <>
            <div className="bg-figma-black h-screen text-white">
                <img src='random-vynos.svg' alt="placeholder" className="mx-auto pt-16 relative z-10"></img>
                <p className="text-center pt-8 lg:mt-56 text-xl lg:text-3xl font-light px-6">
                    Výnosy některých investic nejsou stejné, v každém kole jsou ovlivěny nahodilými událostmi.
                    <br></br><br></br>
                    Pojďme se podívat kolik investice vynesly.
                </p>
                <div className="absolute bottom-14 w-full">
                    <button className="mx-auto border border-white rounded-full flex pl-6 pr-10" onClick={() => setEarningsTutorial(false)}>
                        <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.3755 20.4526H28.3755M28.3755 20.4526L22.3755 14.4526M28.3755 20.4526L22.3755 26.4526" stroke="#FFFDFD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="my-auto">Výnosy</span>
                    </button>
                </div>
            </div>
        </>
    );
}

function NewRound() {
    const { round, gameMode } = useGame();
    const { scenarios, setRoundStart } = useGameLoop();
    return (
        <div className="bg-[linear-gradient(135deg,rgba(255,211,42,1)0%,rgba(255,96,48,1)25%,rgba(255,1,91,1)50%,rgba(170,75,179,1)75%,rgba(25,156,249,1)100%)]
                    h-screen flex flex-col items-center justify-center relative"
            onClick={() => setRoundStart(false)}>

            <svg className="h-full w-full absolute px-8 py-6 z-0" width="331" height="614" viewBox="0 0 331 614" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 0.808472V612.894" stroke="#9FD7FF" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M48.0264 0.808472V612.894" stroke="#9FD7FF" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M95.0518 0.808472V612.894" stroke="#9FD7FF" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M142.078 0.808472V612.894" stroke="#9FD7FF" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M189.104 0.808472V612.894" stroke="#9FD7FF" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M236.13 0.808472V612.894" stroke="#9FD7FF" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M283.157 0.808472V612.894" stroke="#9FD7FF" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M330.183 0.808472V612.894" stroke="#9FD7FF" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            <svg className="relative z-10" width="284" height="150" viewBox="0 0 284 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M282.691 100.058C282.691 110.624 274.127 119.188 263.561 119.188H260.668C252.674 116.894 244.435 108.791 244.435 100.058C244.432 91.8328 253.253 83.6315 260.536 80.9282C260.536 80.9282 261.221 80.9282 263.561 80.9282C274.127 80.9282 282.691 89.492 282.691 100.058Z" fill="#0B1F42" stroke="#0B1F42" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M260.668 119.188C271.233 119.188 279.798 110.623 279.798 100.058C279.798 89.4929 271.233 80.9282 260.668 80.9282C250.103 80.9282 241.539 89.4929 241.539 100.058C241.539 110.623 250.103 119.188 260.668 119.188Z" fill="#AA4BB3" stroke="#0B1F42" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M264.687 97.7783L269.561 97.8132" stroke="#0B1F42" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M253.657 98.9099C254.131 98.9099 254.514 98.1318 254.514 97.172C254.514 96.2123 254.131 95.4342 253.657 95.4342C253.184 95.4342 252.8 96.2123 252.8 97.172C252.8 98.1318 253.184 98.9099 253.657 98.9099Z" fill="#0B1F42" stroke="#0B1F42" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M253.657 103.948C253.657 103.948 255.151 109.22 260.354 109.22C265.558 109.22 267.116 103.948 267.116 103.948" stroke="#0B1F42" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M44.3067 49.9876C44.3067 61.0274 35.3588 69.9752 24.319 69.9752H21.2963C12.9431 67.579 4.33496 59.1125 4.33496 49.9876C4.33142 41.3937 13.5483 32.8245 21.1583 30C21.1583 30 21.8732 30 24.319 30C35.3588 30 44.3067 38.9479 44.3067 49.9876Z" fill="#0B1F42" stroke="#0B1F42" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M21.2962 69.9752C32.3351 69.9752 41.2838 61.0265 41.2838 49.9876C41.2838 38.9488 32.3351 30 21.2962 30C10.2574 30 1.30859 38.9488 1.30859 49.9876C1.30859 61.0265 10.2574 69.9752 21.2962 69.9752Z" fill="#FFD32A" stroke="#0B1F42" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M13.9683 53.9564C13.9683 53.9564 15.5292 59.4639 20.9659 59.4639C26.4026 59.4639 28.0307 53.9564 28.0307 53.9564" stroke="#0B1F42" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M11.9971 46.502C11.9971 46.502 12.4349 48.6921 13.9599 48.6921C15.485 48.6921 15.9417 46.502 15.9417 46.502" stroke="#0B1F42" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M26.0596 46.502C26.0596 46.502 26.4974 48.6921 28.0224 48.6921C29.5475 48.6921 30.0042 46.502 30.0042 46.502" stroke="#0B1F42" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            <h1 className="text-[9rem] text-white relative z-10">{round}/{scenarios[gameMode].scenarioLength}</h1>

            <svg className="relative z-10" width="294" height="197" viewBox="0 0 294 197" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M43.7296 121.773C43.7296 132.631 34.9289 141.431 24.0708 141.431H21.0978C12.882 139.074 4.41553 130.747 4.41553 121.773C4.41205 113.32 13.4773 104.892 20.962 102.114C20.962 102.114 21.6653 102.114 24.0708 102.114C34.9289 102.114 43.7296 110.914 43.7296 121.773Z" fill="#0B1F42" stroke="#0B1F42" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M21.0987 141.431C31.9559 141.431 40.7575 132.63 40.7575 121.773C40.7575 110.915 31.9559 102.114 21.0987 102.114C10.2415 102.114 1.43994 110.915 1.43994 121.773C1.43994 132.63 10.2415 141.431 21.0987 141.431Z" fill="#FFFDFD" stroke="#0B1F42" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M13.8939 120.499C14.3804 120.499 14.7747 119.7 14.7747 118.713C14.7747 117.727 14.3804 116.927 13.8939 116.927C13.4075 116.927 13.0132 117.727 13.0132 118.713C13.0132 119.7 13.4075 120.499 13.8939 120.499Z" fill="#0B1F42" stroke="#0B1F42" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M27.723 120.499C28.2095 120.499 28.6038 119.7 28.6038 118.713C28.6038 117.727 28.2095 116.927 27.723 116.927C27.2366 116.927 26.8423 117.727 26.8423 118.713C26.8423 119.7 27.2366 120.499 27.723 120.499Z" fill="#0B1F42" stroke="#0B1F42" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M21.0993 133.337C23.6074 133.337 25.6405 131.275 25.6405 128.731C25.6405 126.187 23.6074 124.125 21.0993 124.125C18.5913 124.125 16.5581 126.187 16.5581 128.731C16.5581 131.275 18.5913 133.337 21.0993 133.337Z" fill="#0B1F42" stroke="#0B1F42" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M205.31 49.7416C205.31 60.4716 196.613 69.1684 185.883 69.1684H182.945C174.827 66.8394 166.46 58.6104 166.46 49.7416C166.457 41.3887 175.415 33.06 182.811 30.3147C182.811 30.3147 183.506 30.3147 185.883 30.3147C196.613 30.3147 205.31 39.0115 205.31 49.7416Z" fill="#0B1F42" stroke="#0B1F42" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M182.946 69.1684C193.676 69.1684 202.373 60.4707 202.373 49.7416C202.373 39.0124 193.676 30.3147 182.946 30.3147C172.217 30.3147 163.52 39.0124 163.52 49.7416C163.52 60.4707 172.217 69.1684 182.946 69.1684Z" fill="#EB4C79" stroke="#0B1F42" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M187.093 47.1627L192.9 46.6348" stroke="#0B1F42" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M177.859 47.1627L172.052 46.6348" stroke="#0B1F42" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M175.826 53.599C175.826 53.599 177.343 58.952 182.627 58.952C187.912 58.952 189.494 53.599 189.494 53.599" stroke="#0B1F42" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M292.56 147.865C292.56 158.434 283.994 167 273.426 167H270.532C262.535 164.706 254.294 156.601 254.294 147.865C254.291 139.638 263.115 131.435 270.4 128.731C270.4 128.731 271.084 128.731 273.426 128.731C283.994 128.731 292.56 137.297 292.56 147.865Z" fill="#0B1F42" stroke="#0B1F42" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M270.532 167C281.1 167 289.667 158.433 289.667 147.865C289.667 137.298 281.1 128.731 270.532 128.731C259.964 128.731 251.397 137.298 251.397 147.865C251.397 158.433 259.964 167 270.532 167Z" fill="#A3D7FD" stroke="#0B1F42" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M270.531 159.246C272.973 159.246 274.952 157.239 274.952 154.763C274.952 152.287 272.973 150.28 270.531 150.28C268.09 150.28 266.111 152.287 266.111 154.763C266.111 157.239 268.09 159.246 270.531 159.246Z" fill="#0B1F42" stroke="#0B1F42" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M261.631 144.528C261.631 144.528 262.05 146.625 263.51 146.625C264.97 146.625 265.407 144.528 265.407 144.528" stroke="#0B1F42" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M275.092 144.528C275.092 144.528 275.511 146.625 276.971 146.625C278.431 146.625 278.868 144.528 278.868 144.528" stroke="#0B1F42" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </div>
    );
}

function TopBar() {
    const { round, gameMode } = useGame();
    const { liquidity, scenarios, showSite } = useGameLoop();
    if (liquidity === null) {
        return (
            <div className="bg-figma-black h-screen">
                <h1 className="text-center pt-36 lg:mt-56 text-white">Loading...</h1>
            </div>
        );
    }

    return (
        <div className={`z-10 fixed top-0 py-1 text-xl w-full font-[Inter] ${showSite === 0 ?
            'bg-[linear-gradient(135deg,rgba(255,211,42,1)0%,rgba(255,96,48,1)25%,rgba(255,1,91,1)50%,rgba(170,75,179,1)75%,rgba(25,156,249,1)100%)]'
            : 'bg-figma-stone'}`}>
            <div className="flex">
                <svg className="w-14 my-auto" width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="15.8669" cy="15.5" r="10.5" stroke="#FFFDFD" />
                    <path d="M13.1711 12.8945C13.1711 12.8945 13.0495 10.1379 15.952 10.1379C15.952 10.1379 18.5634 10.1379 18.5635 12.8945C18.5635 15.5788 15.8428 15.5304 15.8428 18.1294" stroke="#FFFDFD" strokeLinecap="round" />
                    <path d="M15.9026 20.5477V20.8621" stroke="#FFFDFD" strokeLinecap="round" />
                </svg>
                <div className="grow flex justify-center pr-4">
                    <p className="mx-5 my-auto text-white font-bold">{round}/{scenarios[gameMode].scenarioLength}</p>
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

    const buttonText = ['Novinky', 'MOJE PORTFOLIO', 'UKONČIT KOLO', 'DALŠÍ KOLO'];
    return (
        <>
            <div className={`z-10 w-full flex justify-center fixed bottom-0 font-[Inter] font-bold ${showSite === 0 ?
                'bg-[linear-gradient(135deg,rgba(255,211,42,1)0%,rgba(255,96,48,1)25%,rgba(255,1,91,1)50%,rgba(170,75,179,1)75%,rgba(25,156,249,1)100%)]'
                : 'bg-figma-stone'}`}>
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

    const { round, setEndGame, setTotalScore, gameMode } = useGame();
    const { portfolioItems, configData, setLiquidity, setPortfolioItems, setNewPortfolioItems,
        setOldPortfolioItems, showSite, liquidity, productData,
        nextRound, economySummary, scenarios, roundStart, earningsTutorial, portfolioTutorial, newsTutorial } = useGameLoop();

    useEffect(() => {
        if (configData) {
            setLiquidity(configData.startingMoney);
            // setLiquidity(999);

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
        }
    }, []);

    // useEffect(() => {
    //     setPortfolioItems([...newPortfolioItems]);
    // }, [showSite]);

    // calculating the total score at the end of the game
    if (round >= scenarios[gameMode].scenarioLength) {
        let score = portfolioItems.reduce((acc, item) => acc + item.cost, 0);
        setTotalScore((liquidity ?? 0) + score);
        setEndGame(true);
    }

    if (!productData || portfolioItems === null || liquidity === null) {
        return (
            <div className="bg-figma-black h-screen">
                <h1 className="text-center pt-36 lg:mt-56 text-white">Loading...</h1>
            </div>
        );
    }

    let content = null;
    if (roundStart) content = <NewRound />;

    else if (nextRound && !economySummary) content = <NewEvent />;
    else if (nextRound && economySummary) content = <EconomyAfterEvent />;
    else if (showSite === 0 && earningsTutorial) content = <EarningsTutorial />;
    else content = (
        <>
            <TopBar />
            <NavigationArrows />

            {showSite === 0 && <Earnings />}
            {showSite === 1 && <Portfolio />}
        </>
    );
    return content;
}

export default GameLoop;
