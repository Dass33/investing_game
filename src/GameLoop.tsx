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
    minToPreventBankruptcy: number;
    timeToSell: number;
    sellingForLastRounds: number;
    diceValues: number[];
    autoSellIn: number;
}

interface events {
    baseGame: string;
    advancedGame: string;
    eventName: string;
    eventText: string;
    eventValue: number;
    IMG: string;
    color: number;
}

function NewEvent() {

    const { gameMode, round } = useGame();
    const { scenarios, setShowHelp, eventData, eventIndex, setEconomySummary,
        liquidity, figmaColors, configData } = useGameLoop();

    const soloGame = scenarios[gameMode].random == "TRUE";


    return (
        <>
            {soloGame ?
                <>
                    <div className={`z-10 fixed top-0 py-1 text-figma-black text-xl w-full font-[Inter] bg-${figmaColors[eventData[eventIndex].color]}`}>
                        <div className="flex">
                            <button onClick={() => setShowHelp(true)}>
                                <svg className="w-14 my-auto" width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="15.8669" cy="15.5" r="10.5" stroke="#0B1F42" />
                                    <path d="M13.1711 12.8945C13.1711 12.8945 13.0495 10.1379 15.952 10.1379C15.952 10.1379 18.5634 10.1379 18.5635 12.8945C18.5635 15.5788 15.8428 15.5304 15.8428 18.1294" stroke="#0B1F42" strokeLinecap="round" />
                                    <path d="M15.9026 20.5477V20.8621" stroke="#0B1F42" strokeLinecap="round" />
                                </svg>
                            </button>
                            <div className="grow flex justify-center pr-4">
                                <p className="ml-2 mr-4 my-auto font-bold">{round}/{scenarios[gameMode].scenarioLength}</p>
                                <h1 className="font-bold my-auto text-lg mr-2">BREAKING NEWS</h1>
                            </div>
                            <div className="bg-white rounded-md w-14 mr-6 my-1">
                                <p className="text-center px-2 text-figma-black font-bold text-xl">{liquidity}</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 text-figma-black max-w-[39rem] mx-auto">
                        <div className="relative">
                            <img src={`events/${eventData[eventIndex].IMG}.png`}></img>
                            <p className={`absolute font-bold text-base bottom-5 w-[90%] mx-5 px-3 text-figma-black bg-${figmaColors[eventData[eventIndex].color]}`}>BREAKING NEWS</p>
                        </div>
                        <h1 className="text-2xl font-bold mx-4 mt-7 leading-7">{eventData[eventIndex].eventName}</h1>
                        <p className="text-lg mx-4 mt-3 leading-6">{eventData[eventIndex].eventText}</p>
                    </div>
                </>
                :
                <div className="h-screen bg-figma-white text-figma-black font-medium font-[Inter] md:flex md:items-center md:justify-center">
                    <div className="md:w-[50rem] xl:w-[74rem] mx-auto md:flex md:items-center md:justify-center md:pb-40 md:gap-16">
                        <img src={configData.campaignInstruction_IMG} alt="placeholder" className="mx-auto pt-12 relative z-10 md:w-72 md:pt-0 md:mx-0"></img>
                        <p className="text-center pt-12 text-lg px-7 md:pt-0" dangerouslySetInnerHTML={{ __html: configData.campaignInstructionText }} />
                    </div>
                </div>
            }

            <div className={`z-10 w-full flex justify-center fixed font-[Inter] font-medium ${soloGame ? 'bg-' + figmaColors[eventData[eventIndex].color] + ' bottom-0' : 'bottom-12 md:bottom-20'}`}>
                <button className='flex rounded-full hover:scale-110 duration-200 text-figma-black border-figma-black border py-2 px-6 m-3'
                    onClick={() => { setEconomySummary(true); }}>

                    <svg className="my-auto" width="19" height="15" viewBox="0 0 19 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.86694 7.5H17.8669M17.8669 7.5L11.8669 1.5M17.8669 7.5L11.8669 13.5" stroke="#0B1F42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="mx-3 text-lg">{configData.buttonNewsText}</span>
                </button>
            </div>
        </>
    );
}

function NewsTutorial() {

    const { setNewsTutorial, configData } = useGameLoop();
    return (
        <div className="bg-figma-black h-screen text-white font-medium font-[Inter]">
            <img src={configData.newsTutorial_IMG} alt="placeholder" className="mx-auto pt-12 relative z-10"></img>
            <p className="text-center pt-8 text-xl mx-auto max-w-96 font-light px-6">{configData.newsTutorialText}</p>

            <div className="z-10 w-full flex justify-center fixed bottom-14 md:bottom-20 font-[Inter] font-bold ">
                <button className='flex rounded-full hover:scale-110 duration-200 text-white border-white border-2 py-2 px-4 m-2'
                    onClick={() => { setNewsTutorial(false) }}>

                    <svg className="my-auto" width="19" height="15" viewBox="0 0 19 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.86694 7.5H17.8669M17.8669 7.5L11.8669 1.5M17.8669 7.5L11.8669 13.5" stroke="#FFFDFD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="mx-3 text-lg">{configData.buttonNewsText}</span>
                </button>
            </div>
        </div>
    );
}

function RiveDice({ diceValue, diceColor, throwDelayIndex }: { diceValue: number, diceColor: number, throwDelayIndex: number }) {
    const { rive, RiveComponent } = useRive({
        src: "dice_roll.riv", // Path to your Rive file
        stateMachines: "dice_state",    // The state machine's name
        layout: new Layout({
            fit: Fit.FitWidth, // Layout options
            alignment: Alignment.Center,
        }),
        autoplay: true,
    });

    const diceNumberInput = useStateMachineInput(rive, "dice_state", "number_to_roll");
    const diceColorInput = useStateMachineInput(rive, "dice_state", "color_to_pick");
    const throwDice = useStateMachineInput(rive, "dice_state", "throw");

    setTimeout(() => throwDice?.fire(), throwDelayIndex * 400);

    if (diceNumberInput) diceNumberInput.value = diceValue;
    if (diceColorInput) diceColorInput.value = diceColor;

    return <RiveComponent />;
}

function EconomyAfterEvent() {
    const { round, gameMode } = useGame();

    const {
        productData,
        setProductData,
        portfolioItems,
        setPortfolioItems,
        setLiquidity,
        scenarios,
        liquidity,
        setEconomySummary,
        setNextRound,
        setShowPortfolio,
        eventData,
        eventIndex,
        setEconomyHistory,
        economyHistory,
        setShowHelp,
        configData
    } = useGameLoop();

    const [isLatestEvent, setIsLatestEvent] = useState(true);
    const [economyOfRound, setEconomyOfRound] = useState(round);
    const [eventToShow, setEventToShow] = useState(eventData[eventIndex]);
    const [changesApplied, setChangesApplied] = useState(false);
    const [displayedProductData, setDisplayedProductData] = useState(productData);

    useEffect(() => {
        setEconomyHistory([...economyHistory, eventIndex]);
    }, []);

    useEffect(() => {
        if (economyHistory[economyOfRound - 1] !== undefined) {
            setEventToShow(eventData[economyHistory[economyOfRound - 1]]);
        }
    }, [economyHistory, economyOfRound]);

    useEffect(() => {
        if (economyOfRound !== round) setIsLatestEvent(false);
        else setIsLatestEvent(true);
    }, [economyOfRound]);

    // Recompute displayedProductData when economyOfRound changes
    useEffect(() => {
        if (economyOfRound === round) {
            // Latest data
            setDisplayedProductData(productData);
        } else if (economyOfRound < round) {
            // Start from latest productData and reverse apply events to reach the selected round
            let newProductData = productData.map(item => ({ ...item }));

            // Reverse apply events from economyOfRound to round - 1
            for (let i = round - 1; i >= economyOfRound; i--) {
                const eventAfterRound: any = eventData[economyHistory[i]];
                const eventAtRound: any = eventData[economyHistory[i - 1]];

                newProductData = newProductData.map(item => {
                    let costChange = Number(eventAfterRound[item.productName][0]);
                    let newIncome = Number(eventAtRound[item.productName][1]);

                    return {
                        ...item,
                        cost: Math.max(0, Number(item.cost) - costChange),
                        fixedIncome: Math.max(0, newIncome),
                    };
                });
            }
            setDisplayedProductData(newProductData);
        }
    }, [economyOfRound, productData, economyHistory, eventData, round]);

    // Apply cost and income changes when the component mounts and it's the latest event
    useEffect(() => {
        if (isLatestEvent && !changesApplied) {
            const event: any = eventData[eventIndex];

            // Update productData
            const updatedProductData = productData.map(item => {
                let costChange = Number(event[item.productName][0]);
                let newIncome = Number(event[item.productName][1]);

                return {
                    ...item,
                    cost: Math.max(0, Number(item.cost) + costChange),
                    fixedIncome: Math.max(0, newIncome),
                };
            });
            setProductData(updatedProductData);

            // Update portfolioItems
            const updatedPortfolioItems = portfolioItems.map(item => {
                let costChange = Number(event[item.productName][0]);
                let newIncome = Number(event[item.productName][1]);

                return {
                    ...item,
                    cost: Math.max(0, Number(item.cost) + costChange),
                    fixedIncome: Math.max(0, newIncome),
                };
            });
            setPortfolioItems(updatedPortfolioItems);

            setChangesApplied(true);
        }
    }, [isLatestEvent, changesApplied, productData, portfolioItems, eventData, eventIndex]);

    return (
        <>
            <div className="z-10 fixed top-0 py-1 text-figma-white text-xl w-full font-[Inter] bg-figma-indigo">
                <div className="flex">
                    <button onClick={() => setShowHelp(true)}>
                        <svg className="w-14 my-auto" width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="15.8669" cy="15.5" r="10.5" stroke="#FFFDFD" />
                            <path d="M13.1711 12.8945C13.1711 12.8945 13.0495 10.1379 15.952 10.1379C15.952 10.1379 18.5634 10.1379 18.5635 12.8945C18.5635 15.5788 15.8428 15.5304 15.8428 18.1294" stroke="#FFFDFD" strokeLinecap="round" />
                            <path d="M15.9026 20.5477V20.8621" stroke="#FFFDFD" strokeLinecap="round" />
                        </svg>
                    </button>
                    <div className="grow flex justify-center pr-4">
                        <p className="mx-4 my-auto font-bold">{round}/{scenarios[gameMode].scenarioLength}</p>
                        <h1 className="font-bold my-auto text-lg mr-2">{configData.buttonNewsText.toUpperCase()}</h1>
                    </div>
                    <div className="bg-white rounded-md w-14 mr-6 my-1">
                        <p className="text-center px-2 text-figma-black font-bold text-xl">{liquidity}</p>
                    </div>
                </div>
            </div>

            <div className="pt-12 bg-figma-white h-screen">
                <div className="max-w-[40rem] mx-auto">
                    <h1 className="font-bold text-lg text-center text-figma-black mx-auto min-h-20 max-w-80 pt-4 pb-1">
                        {eventToShow.eventName}
                    </h1>
                    <div className="justify-center flex gap-4 mb-2">
                        <button onClick={() => setEconomyOfRound(economyOfRound - 1)} disabled={economyOfRound <= 1}>
                            <svg className="my-auto" width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g opacity={economyOfRound > 1 ? '1' : '0.2'}>
                                    <circle cx="15.2888" cy="15.2925" r="14.5" fill="#EEF1F4" stroke="#0B1F42" />
                                    <g clipPath="url(#clip0_5954_123572)">
                                        <path d="M22.3154 15.064L7.8855 15.064" stroke="#0B1F42" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M13.1991 9.75032L7.8855 15.064L13.1991 20.3776" stroke="#0B1F42" strokeLinecap="round" strokeLinejoin="round" />
                                    </g>
                                </g>
                                <defs>
                                    <clipPath id="clip0_5954_123572">
                                        <rect width="12" height="16" fill="white" transform="translate(23.0603 9.06396) rotate(90)" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </button>

                        <span className="text-figma-black text-center font-bold text-6xl min-w-16">{economyOfRound}</span>

                        <button onClick={() => setEconomyOfRound(economyOfRound + 1)} disabled={economyOfRound >= round}>
                            <svg className="my-auto" width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g opacity={isLatestEvent ? '0.2' : '1'}>
                                    <circle cx="15" cy="15" r="14.5" transform="matrix(-1 0 0 1 30.2888 0.29248)" fill="#EEF1F4" stroke="#0B1F42" />
                                    <g clipPath="url(#clip0_5954_123573)">
                                        <path d="M8.26225 15.064L22.6921 15.064" stroke="#0B1F42" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M17.3785 9.75032L22.6921 15.064L17.3785 20.3776" stroke="#0B1F42" strokeLinecap="round" strokeLinejoin="round" />
                                    </g>
                                </g>
                                <defs>
                                    <clipPath id="clip0_5954_123573">
                                        <rect width="12" height="16" fill="white" transform="matrix(4.37114e-08 1 1 -4.37114e-08 7.51733 9.06396)" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </button>
                    </div>
                    <div className="flex justify-end w-full text-[10px] font-bold text-figma-black px-6">
                        <span className="mr-5 text-center" dangerouslySetInnerHTML={{ __html: configData.buySellNewsText }} />
                        <span className="my-auto" dangerouslySetInnerHTML={{ __html: configData.earningsNewsText }} />
                    </div>
                    <div className="pb-24">
                        {displayedProductData.map(item => {
                            const costChange = (eventToShow as any)[item.productName][0];
                            const newIncome = (eventToShow as any)[item.productName][1];

                            return (
                                <div
                                    className={`relative z-10 mt-2 mx-3 py-2 pl-3 pr-6 flex text-figma-white text-base rounded-full font-bold 
                            ${(((costChange > 0 && newIncome >= 0) || (costChange >= 0 && newIncome > 0)) && 'bg-figma-teal') ||
                                        (((costChange < 0 && newIncome <= 0) || (costChange <= 0 && newIncome < 0)) && 'bg-figma-berries') ||
                                        (((costChange < 0 && newIncome > 0) || (costChange > 0 && newIncome < 0) || (costChange == 0 && newIncome == 0)) &&
                                            'bg-figma-black')
                                        }`}
                                    key={item.productName}
                                >
                                    <div className="my-auto ml-2 mr-3">
                                        {((costChange > 0 && newIncome >= 0) || (costChange >= 0 && newIncome > 0)) &&
                                            <svg width="13" height="16" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M6.77746 15.18L6.77747 0.750122" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M12.0911 6.06377L6.77747 0.750122L1.46382 6.06376" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>}
                                        {((costChange < 0 && newIncome <= 0) || (costChange <= 0 && newIncome < 0)) &&
                                            <svg width="13" height="17" viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M6.77734 1.37992L6.77734 15.8098" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M1.4637 10.4962L6.77734 15.8098L12.091 10.4962" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        }
                                        {((costChange < 0 && newIncome > 0) || (costChange > 0 && newIncome < 0) || (costChange == 0 && newIncome == 0))
                                            &&
                                            <svg width="10" height="2" viewBox="0 0 10 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M8.83362 1.06006L0.721069 1.06006" stroke="#FFFDFD" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        }
                                    </div>

                                    <h3 className="my-auto flex-1 break-words font-bold text-base text-left grow">{item.productName}</h3>
                                    {costChange != 0 && <h3 className="w-6 my-auto text-[10px] font-bold text-right">({costChange > 0 && '+'}{costChange})</h3>}
                                    <h3 className="ml-1 min-w-6 my-auto text-lg font-bold text-right">{item.cost}</h3>
                                    {newIncome != 0 ? <h3 className="w-6 ml-2 my-auto text-[10px] font-bold text-right">({newIncome > 0 && '+'}{newIncome})</h3>
                                        : <div className="w-6 ml-2"></div>
                                    }
                                    <h3 className="min-w-3 ml-2 my-auto text-lg font-bold text-right">{item.fixedIncome}</h3>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="z-10 w-full flex justify-center fixed font-[Inter] font-medium bottom-0 bg-figma-indigo">
                <button className='flex rounded-full hover:scale-110 duration-200 text-figma-white border-figma-white border py-2 px-6 m-3'
                    onClick={() => {
                        const updatedPortfolioItems = [...portfolioItems];
                        let addLiquidity = 0;

                        for (let i = portfolioItems.length - 1; i >= 0; i--) {
                            if (updatedPortfolioItems[i].autoSellIn === 1) {
                                // if (portfolioItems[i].sellingForLastRounds) {
                                // }
                                // else 
                                addLiquidity += portfolioItems[i].cost;
                                updatedPortfolioItems.splice(i, 1);
                            }
                            else if (portfolioItems[i].autoSellIn > 1) --portfolioItems[i].autoSellIn;
                        }
                        setPortfolioItems(updatedPortfolioItems);
                        setLiquidity((liquidity ?? 0) + addLiquidity);

                        setEconomySummary(false);
                        setNextRound(false);
                        setShowPortfolio(true);
                    }}>

                    <svg className="my-auto" width="19" height="15" viewBox="0 0 19 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.86694 7.5H17.8669M17.8669 7.5L11.8669 1.5M17.8669 7.5L11.8669 13.5" stroke="#FFFDFD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="mx-3 text-lg">{configData.buttonPortfolioText}</span>
                </button>
            </div>
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
        figmaColors,
        scenarios,
        setShowPortfolio,
        setRoundStart,
        setShowHelp,
        configData
    } = useGameLoop();

    const { round, setRound, gameMode } = useGame();
    const [roundEndingAlert, setRoundEndingAlert] = useState(false);
    const [insufficientLiquidity, setInsufficientLiquidity] = useState(false);
    const [delaydSellAlert, setDelayedSellAlert] = useState(false);
    const [delaydSellAlertShown, setDelayedSellAlertShown] = useState(false);
    const [productIndexToDelaySell, setPoductIndexToDelaySell] = useState<number>(-1);
    const [rerenderTrigger, setRerenderTrigger] = useState(false);

    const uniquePortfolioItems = portfolioItems.filter((item, index, self) =>
        index === self.findIndex((t) => t.productName === item.productName));

    if (liquidity === null) {
        return (
            <div className="bg-figma-black h-screen">
                <h1 className="text-center pt-36 lg:mt-56 text-white">Loading...</h1>
            </div>
        );
    }
    //scrolling prevention
    useEffect(() => {
        if (roundEndingAlert || insufficientLiquidity) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
        return () => {
            document.body.classList.remove('overflow-hidden');
        };
    }, [roundEndingAlert, insufficientLiquidity, delaydSellAlert]);

    return (
        <>
            {roundEndingAlert &&
                <div className="fixed z-0 bg-figma-black/70 h-screen w-screen backdrop-blur-sm">
                    <img src={configData.endRound_IMG} alt="placeholder" className="mx-auto pt-28 relative z-10"></img>
                    <p className="text-center mt-16 text-lg font-bold text-white">{configData.endRoundText}</p>
                    <div className="absolute flex w-full gap-8 bottom-20 justify-center text-white text-xl">
                        <button className="border border-white rounded-full flex px-10 py-2" onClick={() => setRoundEndingAlert(false)}>
                            <span className="my-auto">{configData.buttonNoText}</span>
                        </button>
                        <button className="border border-white rounded-full flex px-10 py-2" onClick={() => {
                            setShowPortfolio(false);
                            setRoundStart(true);
                            setRound(round + 1);
                        }}>
                            <span className="my-auto">{configData.buttonYesText}</span>
                        </button>
                    </div>
                </div>
            }
            {delaydSellAlert &&
                <div className="fixed z-0 bg-figma-black/70 h-screen w-screen backdrop-blur-sm">
                    <img src={configData.reallySell_IMG} alt="placeholder" className="mx-auto pt-28 relative z-10"></img>
                    <p className="text-center mt-16 text-lg font-bold text-white">{configData.reallySell_1_Text} {portfolioItems[productIndexToDelaySell].productName}. <br />{configData.reallySell_2_Text}</p>
                    <div className="absolute flex w-full gap-8 bottom-20 justify-center text-white text-xl">
                        <button className="border border-white rounded-full flex px-10 py-2" onClick={() => setDelayedSellAlert(false)}>
                            <span className="my-auto">{configData.buttonNoText}</span>
                        </button>
                        <button className="border border-white rounded-full flex px-10 py-2" onClick={() => {
                            if (productIndexToDelaySell != -1) {
                                const item = portfolioItems[productIndexToDelaySell]
                                item.autoSellIn = Math.ceil(Math.floor(Math.random() * 6 + 1) / Number(item.timeToSell));
                                setDelayedSellAlertShown(true);
                                setDelayedSellAlert(false);
                            }
                        }}>
                            <span className="my-auto">{configData.buttonYesText}</span>
                        </button>
                    </div>
                </div>
            }
            {insufficientLiquidity &&
                <div className="fixed flex items-center justify-center z-0 bg-figma-black/70 h-screen w-screen backdrop-blur-sm">
                    <div className="max-w-80 bg-figma-white rounded-2xl relative pb-10 px-7">
                        <button className="text-white text-xl rounded-full absolute right-4 top-2" onClick={() => setInsufficientLiquidity(false)}>
                            <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.93018 4.00952L19.3471 19.4264" stroke="#0B1F42" strokeWidth="2" strokeLinecap="round" />
                                <path d="M3.93018 19.4268L19.3471 4.00988" stroke="#0B1F42" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>
                        <img src={configData.noBudget_IMG} alt="placeholder" className="mx-auto pt-16 relative z-10"></img>
                        <p className="text-center mt-5 text-lg font-bold text-figma-black">{configData.noBudgetText}</p>
                    </div>
                </div>
            }
            <div className="z-10 fixed top-0 py-1 text-xl w-full font-[Inter] bg-figma-stone">
                <div className="flex">
                    <button onClick={() => setShowHelp(true)}>
                        <svg className="w-14 my-auto" width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="15.8669" cy="15.5" r="10.5" stroke="#FFFDFD" />
                            <path d="M13.1711 12.8945C13.1711 12.8945 13.0495 10.1379 15.952 10.1379C15.952 10.1379 18.5634 10.1379 18.5635 12.8945C18.5635 15.5788 15.8428 15.5304 15.8428 18.1294" stroke="#FFFDFD" strokeLinecap="round" />
                            <path d="M15.9026 20.5477V20.8621" stroke="#FFFDFD" strokeLinecap="round" />
                        </svg>
                    </button>
                    <div className="grow flex justify-center pr-4">
                        <p className="mx-5 my-auto text-white font-bold">{round}/{scenarios[gameMode].scenarioLength}</p>
                        <h1 className="text-white font-bold my-auto">{configData.buttonPortfolioText.toUpperCase()}</h1>
                    </div>
                    <div className="bg-white rounded-md w-14 mr-6 my-1">
                        <p className="text-center px-2 text-black font-bold text-xl">{liquidity}</p>
                    </div>
                </div>
            </div>

            <div className="font-[Inter] bg-figma-black min-h-screen">
                <div className="md:mx-5">
                    <h1 className="mx-auto w-80 sm:w-96 lg:w-fit pt-20 text-lg font-medium text-white">{configData.portfolioTitleText}</h1>
                    {/* Map over productData with products in portfolio first */}
                    <div className="grid lg:grid-cols-2 xl:grid-cols-3 flex-col justify-center pb-24">
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
                            const isTimeToSellValid = Number(product.timeToSell) > -1;

                            return (
                                <div className={`${count <= 0 && 'flex'} mt-4 min-w-80 sm:min-w-96 mx-auto h-fit`}>
                                    <div className={`${count > 0 ? 'max-w-96' : 'w-[17rem] sm:w-72'}`} key={`${product.productName}-${index}`}>
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
                                                    } else {
                                                        setInsufficientLiquidity(true);
                                                        setRoundEndingAlert(false);
                                                    }
                                                }}>
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
                                                        <div className={`flex grow border-figma-stone/40 border ${item.autoSellIn > 0 ? 'border-dashed' : 'border-solid'} rounded-lg mr-2 p-2 font-bold`}>
                                                            <h2 className="text-[12px] my-auto text-figma-stone">{configData.earningsPortfolioText}</h2>
                                                            <h2 className="text-xl my-auto grow flex"><span className="mx-3">+</span>{item.fixedIncome > 0 && item.fixedIncome}{item.diceValues[5] > 0 &&
                                                                <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <rect x="5.82291" y="5.36719" width="19.2341" height="19.2341" rx="2" stroke="#0B1F42" strokeLinejoin="round" />
                                                                    <circle cx="10.8362" cy="10.5508" r="2" transform="rotate(-45 10.8362 10.5508)" fill="#0B1F42" />
                                                                    <circle cx="15.5904" cy="15.3047" r="2" transform="rotate(-45 15.5904 15.3047)" fill="#0B1F42" />
                                                                    <circle cx="20.0437" cy="19.7578" r="2" transform="rotate(-45 20.0437 19.7578)" fill="#0B1F42" />
                                                                </svg>}
                                                                {item.fixedIncome <= 0 && item.diceValues[5] <= 0 && 0}
                                                            </h2>
                                                            <h2 className="my-auto text-[11px] text-figma-stone">{configData.sellPortfolioText}</h2>
                                                            <h2 className="my-auto text-xl ml-4 mr-[14px] text-center">{item.cost}</h2>
                                                        </div>
                                                        {/* Sell Button */}
                                                        {item.autoSellIn > 0
                                                            ?
                                                            <p className="size-[31px] font-bold text-figma-black text-center text-[8px] leading-tight">
                                                                Prodej za {item.autoSellIn} {item.autoSellIn > 1 ? 'kola' : 'kolo'}</p>
                                                            :
                                                            <button
                                                                className={`${(isTimeToSellValid || count > oldCount) && count > 0
                                                                    ? 'border-black text-black'
                                                                    : 'border-black/30 text-black/30 cursor-not-allowed'
                                                                    }`}
                                                                onClick={() => {
                                                                    if ((Number(item.timeToSell) > 0) && count > 0) {
                                                                        if (delaydSellAlertShown) {
                                                                            item.autoSellIn = Math.ceil(Math.floor(Math.random() * 6 + 1) / Number(item.timeToSell));
                                                                            setRerenderTrigger(!rerenderTrigger);
                                                                        } else {
                                                                            setPoductIndexToDelaySell(portfolioItems.findIndex((item) => item.productName === product.productName));
                                                                            setDelayedSellAlert(true);
                                                                            setRoundEndingAlert(false);
                                                                            setInsufficientLiquidity(false);
                                                                        }
                                                                    }
                                                                    else if ((isTimeToSellValid || count > oldCount) && count > 0) {
                                                                        const indexToSell = portfolioItems.findIndex(
                                                                            (item) => item.productName === product.productName
                                                                        );

                                                                        if (indexToSell !== -1 && indexToSell) {
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
                                                            </button>}
                                                    </div>
                                                );
                                            })}
                                            {count <= 0 &&
                                                <div className="flex justify-center rounded-lg mr-2 py-5 font-bold">
                                                    <h2 className="text-[12px] my-auto text-figma-stone">{configData.earningsPortfolioText}</h2>
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
                                                } else {
                                                    setInsufficientLiquidity(true);
                                                    setRoundEndingAlert(false);
                                                }

                                            }}>
                                            <svg className={`${(liquidity ?? 0) < adjustedCost && 'cursor-not-allowed'}`}
                                                width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="15.705" cy="15.1543" r="12.5" fill="#245375" stroke="#245375" />
                                                <path d="M15.705 8.22119V22.0879" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                                <path d="M8.77158 15.1543L22.6382 15.1543" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                            </svg>
                                        </button>}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            {!roundEndingAlert && !delaydSellAlert && <div className="z-10 w-full flex justify-center fixed bottom-0 font-[Inter] font-bold bg-figma-stone md:pb-4">
                <div className="flex items-center justify-end">
                    <button className='flex rounded-full hover:scale-110 duration-200 text-white border-white border-2 py-2 px-4 m-2'
                        onClick={() => {
                            setRoundEndingAlert(true);
                            setInsufficientLiquidity(false);
                        }}>

                        <svg className="my-auto" width="19" height="15" viewBox="0 0 19 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.86694 7.5H17.8669M17.8669 7.5L11.8669 1.5M17.8669 7.5L11.8669 13.5" stroke="#FFFDFD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="mx-3 text-lgm">{configData.buttonEndRoundText}</span>
                    </button>
                </div>
            </div>}
        </>
    );
}

function PortfolioTutorial() {
    const { setPortfolioTutorial, configData } = useGameLoop();
    return (
        <>
            <div className="bg-figma-black h-screen text-white">
                <img src={configData.portfolioTutorial_IMG} alt="placeholder" className="mx-auto pt-16 relative z-10"></img>
                <p className="text-center pt-8 text-xl mx-auto max-w-96 font-light px-6">{configData.portfolioTutorialText}</p>
                <div className="absolute bottom-14 md:bottom-20 w-full">
                    <button className="mx-auto border border-white rounded-full flex pl-6 pr-10" onClick={() => {
                        setPortfolioTutorial(false);
                        localStorage.setItem("tutorial", "false");
                    }}>
                        <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.3755 20.4526H28.3755M28.3755 20.4526L22.3755 14.4526M28.3755 20.4526L22.3755 26.4526" stroke="#FFFDFD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="my-auto">{configData.buttonPortfolioText}</span>
                    </button>
                </div>
            </div>
        </>
    );
}

function Earnings() {
    const { liquidity, scenarios, setShowEarnings, portfolioItems,
        setLiquidity, setShowSite, setNextRound, setOldPortfolioItems,
        setShowHelp, configData } = useGameLoop();
    const { round, gameMode } = useGame();
    let incomeSum = 0;

    // Group portfolio items by product name
    const groupedItems = portfolioItems.reduce((acc: { [key: string]: products[] }, item) => {
        if (!acc[item.productName]) {
            acc[item.productName] = [];
        }
        acc[item.productName].push(item);
        return acc;
    }, {});

    const popInDelay = 0.5;
    let sumDelay = 1;

    if (liquidity === null) {
        return (
            <div className="bg-figma-black h-screen">
                <h1 className="text-center pt-36 lg:mt-56 text-white">Loading...</h1>
            </div>
        );
    }

    return (
        <>
            <div className="z-10 fixed top-0 py-1 text-xl w-full font-[Inter] bg-[linear-gradient(135deg,rgba(255,211,42,1)0%,rgba(255,96,48,1)25%,rgba(255,1,91,1)50%,rgba(170,75,179,1)75%,rgba(25,156,249,1)100%)]">
                <div className="flex">
                    <button onClick={() => setShowHelp(true)}>
                        <svg className="w-14 my-auto" width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="15.8669" cy="15.5" r="10.5" stroke="#FFFDFD" />
                            <path d="M13.1711 12.8945C13.1711 12.8945 13.0495 10.1379 15.952 10.1379C15.952 10.1379 18.5634 10.1379 18.5635 12.8945C18.5635 15.5788 15.8428 15.5304 15.8428 18.1294" stroke="#FFFDFD" strokeLinecap="round" />
                            <path d="M15.9026 20.5477V20.8621" stroke="#FFFDFD" strokeLinecap="round" />
                        </svg>
                    </button>
                    <div className="grow flex justify-center pr-4 text-figma-white">
                        <p className="mx-4 my-auto font-bold">{round}/{scenarios[gameMode].scenarioLength}</p>
                        <h1 className="font-bold my-auto text-lg mr-2">{configData.buttonEarningsText.toUpperCase()}</h1>
                    </div>
                    <div className="bg-white rounded-md w-14 mr-6 my-1">
                        <p className="text-center px-2 text-figma-black font-bold text-xl">{liquidity}</p>
                    </div>
                </div>
            </div>

            <div className="relative z-0 h-screen flex flex-col justify-center custom-radial-gradient">
                <h1 className="mb-6 text-xl text-white text-center -mt-10">{configData.yourEarningsText} {round}. {configData.roundText}</h1>
                <div className="flex justify-center">
                    <div className="w-full max-w-[609px] min-w-80">
                        <div className="border border-white rounded-t-xl mx-8 bg-figma-black pb-6 pt-1">
                            {Object.entries(groupedItems).map(([productName, items], index) => {
                                const count = items.length;
                                const fixedIncome = Number(items[0].fixedIncome);
                                const randomDice = Math.floor(Math.random() * 6); // 0-5
                                const totalIncome = count * (fixedIncome + items[0].diceValues[randomDice]);
                                incomeSum += totalIncome;
                                ++sumDelay;

                                return (
                                    <div className="mt-2 mx-4 flex justify-between text-white text-base font-medium" key={productName}>
                                        <h3 className="my-auto flex-1 break-words text-lg grow">{productName}</h3>
                                        {items[0].diceValues[5] > 0 && (
                                            <div className="size-10">
                                                <RiveDice diceValue={randomDice + 1} diceColor={items[0].color} throwDelayIndex={index} />
                                            </div>
                                        )}
                                        <h3
                                            className="text-center w-12 my-auto text-lg font-bold pop-in"
                                            style={{ animationDelay: `${(index + 1) * popInDelay}s` }}
                                        >
                                            +{count * (fixedIncome + Number(items[0].diceValues[randomDice]))}
                                        </h3>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mx-8 text-base bg-white rounded-b-xl flex pl-6 pr-7 py-3 text-figma-black font-medium">
                            <div style={{ clear: 'both' }}></div>
                            <div className="flex w-full">
                                <h2 className="my-auto grow">{configData.earningsSumText}</h2>
                                <h2
                                    className="text-2xl font-bold pop-in"
                                    style={{ animationDelay: `${sumDelay * popInDelay}s` }}
                                >
                                    +{incomeSum}
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="z-10 w-full flex justify-center fixed bottom-0 font-[Inter] font-bold 
                bg-[linear-gradient(135deg,rgba(255,211,42,1)0%,rgba(255,96,48,1)25%,rgba(255,1,91,1)50%,rgba(170,75,179,1)75%,rgba(25,156,249,1)100%)]">
                <div className="flex items-center justify-end py-1 md:pb-4">
                    <button className='flex rounded-full hover:scale-110 duration-200 text-white border-white border-2 py-2 px-4 m-2'
                        onClick={() => {
                            setLiquidity((prevLiquidity: number) => (prevLiquidity ?? 0) + incomeSum);
                            setShowSite(0);
                            setOldPortfolioItems([...portfolioItems]);
                            setNextRound(true);
                            setShowEarnings(false);
                        }}>

                        <svg className="my-auto" width="19" height="15" viewBox="0 0 19 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.86694 7.5H17.8669M17.8669 7.5L11.8669 1.5M17.8669 7.5L11.8669 13.5" stroke="#FFFDFD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="mx-3 text-lg">{configData.buttonNewsText}</span>
                    </button>
                </div>
            </div>
        </>
    );
}

function EarningsTutorial() {

    const { setEarningsTutorial, configData } = useGameLoop();
    return (
        <>
            <div className="bg-figma-black h-screen text-white">
                <img src={configData.earningsTutorial_IMG} alt="placeholder" className="mx-auto pt-16 relative z-10"></img>
                <p className="text-center pt-8 text-xl mx-auto max-w-96 font-light px-6">
                    {configData.earningsTutorialText}
                    <br></br><br></br>
                    {configData.earningsTutorailPromptText}
                </p>
                <div className="absolute bottom-14 md:bottom-20 w-full">
                    <button className="mx-auto border border-white rounded-full flex pl-6 pr-10" onClick={() => setEarningsTutorial(false)}>
                        <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.3755 20.4526H28.3755M28.3755 20.4526L22.3755 14.4526M28.3755 20.4526L22.3755 26.4526" stroke="#FFFDFD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="my-auto">{configData.buttonEarningsText}</span>
                    </button>
                </div>
            </div>
        </>
    );
}

function NewRound() {
    const { round, gameMode } = useGame();
    const { scenarios, setEventIndex, eventData, setRoundStart, setShowEarnings, setShowBankruptcy } = useGameLoop();

    const soloGame = scenarios[gameMode].random == "TRUE";

    useEffect(() => {
        let newEvent;
        if (soloGame) newEvent = Math.floor(Math.random() * eventData.length);
        else newEvent = (eventData as any[]).findIndex((item: events) => item.eventName === scenarios[gameMode].eventOrder[round - 1]);
        setEventIndex(newEvent);
        if (eventData[newEvent].bankrouptcy === "TRUE") setShowBankruptcy(true);
    }, []);

    return (
        <div className="bg-[linear-gradient(135deg,rgba(255,211,42,1)0%,rgba(255,96,48,1)25%,rgba(225,1,91,1)50%,rgba(170,75,179,1)75%,rgba(25,156,249,1)100%)]
                    h-screen flex flex-col items-center justify-center relative" >
            <svg
                className="h-screen w-full absolute px-6 py-8 z-0"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <pattern id="verticalLines" patternUnits="userSpaceOnUse" width="47" height="100%">
                        <path d="M0 0V100000%" stroke="#9FD7FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#verticalLines)" />
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

            <div className="absolute z-10 bottom-16 w-full">
                <button className="block mx-auto  hover:scale-110 duration-200" onClick={() => {
                    setRoundStart(false);
                    setShowEarnings(true);
                }}>
                    <svg className="size-20" width="41" height="41" viewBox="10 10 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.3755 20.4526H28.3755M28.3755 20.4526L22.3755 14.4526M28.3755 20.4526L22.3755 26.4526" stroke="#FFFDFD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

function ShowHelp() {
    const { gameMode } = useGame();
    const { figmaColors, scenarios, setShowHelp, configData, productData } = useGameLoop();

    return (
        <div>
            <div className="z-10 fixed top-0 py-1 text-figma-black text-xl w-full font-[Inter] bg-figma-stone-40">
                <div className="flex">
                    <button onClick={() => setShowHelp(false)}>
                        <svg className="w-14 my-auto" width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="15.8669" cy="15.5" r="10.5" stroke="#0B1F42" />
                            <path d="M13.1711 12.8945C13.1711 12.8945 13.0495 10.1379 15.952 10.1379C15.952 10.1379 18.5634 10.1379 18.5635 12.8945C18.5635 15.5788 15.8428 15.5304 15.8428 18.1294" stroke="#0B1F42" strokeLinecap="round" />
                            <path d="M15.9026 20.5477V20.8621" stroke="#0B1F42" strokeLinecap="round" />
                        </svg>
                    </button>
                    <div className="grow flex items-center justify-center pr-4">
                        <h1 className="font-bold text-lg mr-2 mt-0.5">{configData.helpHeadlineText}</h1>
                    </div>
                    <div className="mr-6 my-1 flex items-center">
                        <button onClick={() => setShowHelp(false)}>
                            <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.86035 4.05005L19.2772 19.4669" stroke="#0B1F42" strokeWidth="2" strokeLinecap="round" />
                                <path d="M3.86035 19.4673L19.2772 4.0504" stroke="#0B1F42" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div className="mt-16 max-w-[40rem] mx-auto md:mt-20">
                {productData.map((item) => {
                    return (
                        <div className="relative z-0 mt-1 mx-3 pl-3 pr-6 text-figma-black" key={item.productName}>
                            <h3 className={`text-lg rounded-lg font-bold pl-4 py-1 bg-${figmaColors[item.color]}`}>{item.productName}</h3>
                            <p className="mt-4 text-base font-medium min-h-16 mb-10">{item.productDescription}</p>
                        </div>
                    );
                })}
                <h2 className="text-lg mb-1 text-figma-black font-bold text-center">{configData.helpHowToPlayText}</h2>

                <div className="relative z-0 mx-5 text-figma-black">
                    <img className="h-36 mx-auto" src={scenarios[gameMode].IMG}></img>
                    <p className="mt-4 text-center text-lg font-medium min-h-16 mb-8">{scenarios[gameMode].howToPlay}</p>

                    <img className="h-36 mx-auto" src={scenarios[gameMode].IMG2}></img>
                    <p className="mt-4 text-center text-lg font-medium min-h-16 mb-8">{scenarios[gameMode].howToPlay2}</p>

                    <img className="h-36 mx-auto" src={configData.portfolioTutorial_IMG}></img>
                    <p className="mt-4 text-center text-lg font-medium min-h-16 mb-8" >{configData.portfolioTutorialText}</p>

                    <img className="h-36 mx-auto" src={configData.earningsTutorial_IMG}></img>
                    <p className="mt-4 text-center text-lg font-medium min-h-16 mb-8" >{configData.earningsTutorialText}</p>

                    <img className="h-36 mx-auto" src={configData.newsTutorial_IMG}></img>
                    <p className="mt-4 text-center text-lg font-medium min-h-16 mb-8" >{configData.newsTutorialText}</p>
                </div>
            </div>
        </div>
    );
}

function Bankruptcy() {

    const { gameMode, round } = useGame();
    const { portfolioItems, setPortfolioItems, scenarios,
        setShowHelp, eventData, eventIndex, liquidity,
        figmaColors, setShowBankruptcy, configData } = useGameLoop();

    const [rollingDices, SetRollingDices] = useState(false);
    const [bankruptItems, setBankruptItems] = useState<string[]>([]);
    const whiteDice = 8;

    useEffect(() => {
        const updatedBankruptCatergories: string[] = [];
        const updatedPorftoliItems = portfolioItems.filter(item => {
            const randomDice = Math.floor(Math.random() * 18) + 1;
            const isBankrupt = item.minToPreventBankruptcy >= randomDice && item.minToPreventBankruptcy > 0;

            if (isBankrupt) {
                if (updatedBankruptCatergories.indexOf(item.productName) === -1) updatedBankruptCatergories.push(item.productName);
            }
            return !isBankrupt;
        });
        setBankruptItems(updatedBankruptCatergories);
        setPortfolioItems(updatedPorftoliItems);
    }, []);


    return (
        <>
            <div className={`z-10 fixed top-0 py-1 text-figma-black text-xl w-full font-[Inter] bg-${figmaColors[eventData[eventIndex].color]}`}>
                <div className="flex">
                    <button onClick={() => setShowHelp(true)}>
                        <svg className="w-14 my-auto" width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="15.8669" cy="15.5" r="10.5" stroke="#0B1F42" />
                            <path d="M13.1711 12.8945C13.1711 12.8945 13.0495 10.1379 15.952 10.1379C15.952 10.1379 18.5634 10.1379 18.5635 12.8945C18.5635 15.5788 15.8428 15.5304 15.8428 18.1294" stroke="#0B1F42" strokeLinecap="round" />
                            <path d="M15.9026 20.5477V20.8621" stroke="#0B1F42" strokeLinecap="round" />
                        </svg>
                    </button>
                    <div className="grow flex justify-center pr-4">
                        <p className="ml-2 mr-4 my-auto font-bold">{round}/{scenarios[gameMode].scenarioLength}</p>
                        <h1 className="font-bold my-auto text-lg mr-2">{configData.crisisNewsHeadlineText}</h1>
                    </div>
                    <div className="bg-white rounded-md w-14 mr-6 my-1">
                        <p className="text-center px-2 text-figma-black font-bold text-xl">{liquidity}</p>
                    </div>
                </div>
            </div>
            {!rollingDices ?
                <>
                    <div className="mt-8 text-figma-black max-w-[39rem] mx-auto">
                        <div className="relative">
                            <img src={`events/${eventData[eventIndex].IMG}.png`}></img>
                            <p className={`absolute font-bold text-base bottom-5 w-[90%] mx-5 px-3 text-figma-black bg-${figmaColors[eventData[eventIndex].color]}`}>{configData.crisisNewsHeadlineText}</p>
                        </div>
                        <h1 className="text-2xl font-bold mx-4 mt-7 leading-7">{eventData[eventIndex].eventName}</h1>
                        <p className="text-lg mx-4 mt-3 leading-6">{eventData[eventIndex].eventText}</p>
                    </div>

                </>
                :
                <div className="bg-figma-black h-screen">
                    <h1 className="pt-40 font-bold text-lg text-figma-white text-center">{configData.crisisHeadlineText}</h1>
                    <div className="pt-12">
                        <div className="size-10 mx-auto">
                            <RiveDice diceValue={1} diceColor={whiteDice} throwDelayIndex={0} />
                        </div>
                        <h2 className="pt-16 font-medium text-lg text-figma-white text-center">{configData.crisisBankruptcyText}</h2>
                        <div className="py-10 my-8 rounded-lg font-bold text-lg max-w-72 sm:max-w-96 mx-auto text-figma-white border border-figma-white text-center">
                            {bankruptItems.length === 0 && <p>{configData.crisisNoBankruptcyText}</p>}
                            {bankruptItems.map(item => <p key={item}>{item}</p>)}
                        </div>
                    </div>

                </div>}
            <div className={`z-10 w-full flex justify-center fixed bottom-0 font-[Inter] font-medium md:pb-3 ${'bg-' + figmaColors[eventData[eventIndex].color]}`}>
                <button className='flex rounded-full hover:scale-110 duration-200 text-figma-black border-figma-black border py-2 px-6 m-3'
                    onClick={() => { !rollingDices ? SetRollingDices(true) : setShowBankruptcy(false) }}>

                    <svg className="my-auto" width="19" height="15" viewBox="0 0 19 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.86694 7.5H17.8669M17.8669 7.5L11.8669 1.5M17.8669 7.5L11.8669 13.5" stroke="#0B1F42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="mx-3 text-lg">Krize</span>
                </button>
            </div>
        </>
    );
}

function GameLoop() {

    const { round, setEndGame, setTotalScore, gameMode } = useGame();
    const { portfolioItems, configData, setLiquidity, setPortfolioItems, setNewPortfolioItems,
        setOldPortfolioItems, liquidity, productData, nextRound, economySummary, scenarios, roundStart,
        earningsTutorial, portfolioTutorial, newsTutorial, showPortfolio, showEarnings, showHelp,
        showBankruptcy } = useGameLoop();

    const soloGame = scenarios[gameMode].random == "TRUE";

    useEffect(() => {
        if (configData) {
            setLiquidity(configData.startingMoney);
            // setLiquidity(9999);

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

    // calculating the total score at the end of the game
    if (round > scenarios[gameMode].scenarioLength) {
        let score = portfolioItems.reduce((acc, item) => acc + Number(item.cost), 0);
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
    else if (showBankruptcy) content = <Bankruptcy />;
    else if (showHelp) content = <ShowHelp />;
    else if (showEarnings && earningsTutorial) content = <EarningsTutorial />;
    else if (showEarnings) content = <Earnings />;
    else if (nextRound && !economySummary && newsTutorial) content = <NewsTutorial />;
    else if (nextRound && !economySummary && !soloGame) content = <NewEvent />;
    else if (nextRound) content = <EconomyAfterEvent />;
    else if (showPortfolio && portfolioTutorial) content = <PortfolioTutorial />;
    else if (showPortfolio) content = <Portfolio />;

    return content;
}

export default GameLoop;
