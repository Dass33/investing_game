import { useState, useEffect } from "react";
import { useRive, Layout, Fit, Alignment, useStateMachineInput } from "@rive-app/react-canvas";
import { useGame } from "./GameContext";
import { useGameLoop } from "./GameLoopContext";
import { ShowHelp } from "./ShowHelp";
import { ContinuousColorLegend, LineChart } from "@mui/x-charts";

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
    const { scenarios, setShowHelp, eventData, eventIndex, setNextRound,
        liquidity, figmaColors, configData, setRolledThisBancrupcy } = useGameLoop();

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
                                <h1 className="font-bold my-auto text-sm xs:text-lg mr-2">{configData.crisisNewsHeadlineText}</h1>
                            </div>
                            <div className="bg-white rounded-md min-w-14 mr-6 my-1">
                                <p className="text-center px-2 text-figma-black font-bold text-xl">{liquidity?.toFixed(1)}</p>
                            </div>
                        </div>
                    </div>
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
                <div className="h-screen bg-figma-white text-figma-black font-medium font-[Inter] md:flex md:items-center md:justify-center">
                    <div className="md:w-[50rem] xl:w-[74rem] mx-auto md:flex md:items-center md:justify-center md:pb-40 md:gap-16">
                        <img src={configData.campaignInstruction_IMG} alt="placeholder" className="mx-auto pt-12 relative z-10 md:w-72 md:pt-0 md:mx-0"></img>
                        <div>
                            <p className="text-center pt-12 text-lg px-7 md:pt-0">{configData.campaignInstructionText}</p>
                            <p className="text-center pt-12 text-lg px-7 md:pt-0">{configData.campaignInstructionText2}</p>
                        </div>
                    </div>
                </div>
            }

            <div className={`z-10 w-full flex justify-center fixed font-[Inter] font-medium ${soloGame ? 'bg-' + figmaColors[eventData[eventIndex].color] + ' bottom-0' : 'bottom-12 md:bottom-20'}`}>
                <button className='flex rounded-full hover:scale-110 duration-200 text-figma-black border-figma-black border py-2 px-6 m-3'
                    onClick={() => {
                        setRolledThisBancrupcy(false);
                        setNextRound(false);
                    }}>

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

    const { setNewsTutorial, configData, scenarios } = useGameLoop();
    const { gameMode } = useGame();
    return (
        <div className="bg-figma-black h-screen text-white font-medium font-[Inter]">
            <img src={configData.newsTutorial_IMG} alt="placeholder" className="mx-auto pt-12 relative z-10"></img>
            <p className="text-center pt-8 text-xl mx-auto max-w-96 font-light px-6">{configData.newsTutorialText}</p>

            <div className="z-10 w-full flex justify-center fixed bottom-14 md:bottom-20 font-[Inter] font-bold ">
                <button className='flex rounded-full hover:scale-110 duration-200 text-white border-white border-2 py-2 px-4 m-2'
                    onClick={() => {
                        setNewsTutorial(false)
                        if (scenarios[gameMode].random == "TRUE") {
                            localStorage.setItem("tutorial", "false");
                        }
                    }}>

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

function Portfolio() {
    const {
        productData,
        liquidity,
        setLiquidity,
        scenarios,
        setShowPortfolio,
        setRoundStart,
        setShowHelp,
        configData,
        setProductHistory,
        productHistory,
        eventData,
        eventIndex,
        setProductData,
        prevRoundLiquidity,
        setPrevRoundLiquidity,
        portfolioRisk, setPortfolioRisk
    } = useGameLoop();

    const {
        portfolioRiskHistory,
        setPortfolioRiskHistory
    } = useGame();

    const { round, setRound, gameMode } = useGame();
    const [insufficientLiquidity, setInsufficientLiquidity] = useState(false);
    const [delaydSellAlert, setDelayedSellAlert] = useState(false);
    // const [delaydSellAlertShown, setDelayedSellAlertShown] = useState(false);
    const [, setDelayedSellAlertShown] = useState(false);
    const [changesApplied, setChangesApplied] = useState(false);
    const [openedProduct, setOpenedProduct] = useState(-1);
    const [buySellAmount, setBuySellAmount] = useState(1);

    if (liquidity === null) {
        return (
            <div className="bg-figma-black h-screen">
                <h1 className="text-center pt-36 lg:mt-56 text-white">Loading...</h1>
            </div>
        );
    }
    //scrolling prevention
    useEffect(() => {
        if (insufficientLiquidity) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
        return () => {
            document.body.classList.remove('overflow-hidden');
        };
    }, [insufficientLiquidity, delaydSellAlert, openedProduct]);

    useEffect(() => {
        setProductHistory([...productHistory, productData]);
    }, []);

    useEffect(() => {
        if (!changesApplied) {
            const event: any = eventData[eventIndex];

            // Update productData
            const updatedProductData = productData.map(item => {
                let costChange = Number(event[item.productName][0]);
                return {
                    ...item,
                    invested: Math.max(0, Number(item.invested) * costChange),
                    cost: Math.max(1, Number(item.cost) * costChange),
                };
            });
            setProductData(updatedProductData);

            setChangesApplied(true);
        }
    }, [changesApplied, productData, eventData, eventIndex]);

    useEffect(() => {
        let portfolioValue = 0;
        let risk = 0;
        productData.forEach(item => {
            portfolioValue += item.invested;
            risk += item.riskScore * item.invested;
        })
        setPortfolioRisk((risk + liquidity) / (portfolioValue + liquidity));
    }, [productData]);

    const percentConversion = 100;
    const portfolioWorth: number = Number(productData.reduce((total, p) => total + p.invested, 0) + liquidity);
    const portfolioPercentChange: number = portfolioWorth * percentConversion /
        (productHistory[round]?.reduce((total: number, p) => total + Number(p.invested), 0) + (prevRoundLiquidity || configData.startingMoney)) - percentConversion;

    const currentProduct = openedProduct >= 0 ? productData[openedProduct] : null;
    const currentAdjustedCost = currentProduct ? Math.max(currentProduct.cost, 1) : null;
    const currentPercentChange = currentAdjustedCost && currentProduct ?
        parseFloat(((currentAdjustedCost / productHistory[round]?.filter(historicProduct => historicProduct.productName === currentProduct?.productName)[0].cost - 1)
            * percentConversion).toFixed(1)) : null;
    const currentProductHistory = productHistory.map(item => Number(item.filter(product => product.productName === currentProduct?.productName)[0]?.cost));
    currentProductHistory.shift();

    return (
        <>
            {delaydSellAlert &&
                <div className="fixed z-0 bg-figma-black/70 h-screen w-screen backdrop-blur-sm">
                    <img src={configData.reallySell_IMG} alt="placeholder" className="mx-auto pt-28 relative z-10"></img>
                    <p className="text-center mt-16 text-lg font-bold text-white">{configData.reallySell_1_Text} {currentProduct?.productName}. <br />{configData.reallySell_2_Text}</p>
                    <div className="absolute flex w-full gap-8 bottom-20 justify-center text-white text-xl">
                        <button className="border border-white rounded-full flex px-10 py-2" onClick={() => setDelayedSellAlert(false)}>
                            <span className="my-auto">{configData.buttonNoText}</span>
                        </button>
                        <button className="border border-white rounded-full flex px-10 py-2" onClick={() => {
                            if (currentProduct?.timeToSell != -1) {
                                productData.map(item => {
                                    if (item.ID === currentProduct?.ID) {
                                        return {
                                            ...item,
                                            // dice has 6 sides
                                            autoSellIn: Math.ceil(Math.floor(Math.random() * 6 + 1) / Number(item.timeToSell)),
                                        };
                                    } else return item;
                                });
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
            {openedProduct >= 0 &&
                <div className="fixed flex items-center justify-center z-0 bg-figma-black/70 h-screen w-screen backdrop-blur-sm">
                    <div className="mt-4 max-w-[374px] mx-2 sm:w-96 bg-figma-white rounded-2xl relative pb-5 px-3">
                        <button className="text-xl rounded-full absolute right-0 -top-10" onClick={() => {
                            setOpenedProduct(-1);
                            setBuySellAmount(1);
                        }}>
                            <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="15.3345" cy="15.6252" r="12" fill="#FFFDFD" />
                                <path d="M18.4146 12.5444L12.2519 18.7071" stroke="#0B1F42" strokeLinecap="round" />
                                <path d="M12.2515 12.5442L18.4142 18.7069" stroke="#0B1F42" strokeLinecap="round" />
                            </svg>
                        </button>
                        <div>
                            <div className='rounded-xl bg-figma-white text-figma-black pt-2 pb-1 flex flex-col'>
                                <div className="flex w-full">
                                    <img src={`riskScore/risk${currentProduct?.riskScore}.svg`} alt="NaN" className="-mt-0.5" />
                                    <h2 className="text-base self-center font-bold grow ml-2">{currentProduct?.productName}</h2>
                                    {currentPercentChange != null && <div className="self-center">
                                        {currentPercentChange > 0 &&
                                            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M5.59995 2.56555C5.7924 2.23222 6.27352 2.23222 6.46597 2.56555L10.796 10.0654C10.9884 10.3987 10.7479 10.8154 10.363 10.8154H1.70294C1.31804 10.8154 1.07748 10.3987 1.26993 10.0654L5.59995 2.56555Z" fill="#0CB43F" />
                                            </svg>
                                        }
                                        {currentPercentChange < 0 &&
                                            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M6.76724 10.3752C6.57479 10.7086 6.09366 10.7086 5.90121 10.3752L1.57119 2.87543C1.37874 2.5421 1.6193 2.12543 2.0042 2.12543L10.6642 2.12543C11.0491 2.12543 11.2897 2.54209 11.0973 2.87543L6.76724 10.3752Z" fill="#EB4C79" />
                                            </svg>
                                        }
                                    </div>}
                                    <h2 className="self-center text-sm font-bold mr-3">{currentPercentChange}%</h2>
                                    <h2 className='text-lg font-bold min-w-6 text-right pr-1'>{currentProduct?.invested.toFixed(1)}</h2>
                                </div>

                                <div className="flex mx-2 mt-8 mb-4">
                                    <div className="font-medium text-xs">
                                        <div className="flex">
                                            <span className="w-20">{configData.earningsProperty}</span>
                                            <img src={`productProperties/dots${currentProduct?.potentialEarnings}.svg`} alt="NaN" className="mt-0.5 w-10 mb-1" />
                                        </div>

                                        <div className="flex">
                                            <span className="w-20">{configData.securityProperty}</span>
                                            <img src={`productProperties/dots${currentProduct?.security}.svg`} alt="NaN" className="mt-0.5 w-10" />
                                        </div>

                                        <div className="flex">
                                            <span className="w-20">{configData.liquidityProperty}</span>
                                            <img src={`productProperties/dots${currentProduct?.liquidity}.svg`} alt="NaN" className="mt-0.5 w-10" />
                                        </div>
                                    </div>
                                    <div className="grow text-center text-xs font-medium">
                                        <p className="font-bold">{((currentProduct?.invested || 0) / (currentProduct?.cost || 1)).toFixed(2)}</p>
                                        <p>({currentProduct?.cost.toFixed(1)})</p>
                                    </div>
                                    <div className="mx-auto relative w-[115px] h-[75px]">
                                        <div className="absolute top-0 w-full h-[75px] rounded-lg overflow-hidden">
                                            <svg width="115" height="56" viewBox="0 0 115 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g>
                                                    <path d="M0 4.32715C0 2.11801 1.79086 0.327148 4 0.327148H111C113.209 0.327148 115 2.11801 115 4.32715V51.3271C115 53.5363 113.209 55.3271 111 55.3271H4C1.79086 55.3271 0 53.5363 0 51.3271V4.32715Z" fill="#0B1F42" />
                                                    <path d="M112.5 5.38184H3" stroke="#721C7A" strokeWidth="0.5" />
                                                    <path d="M112.5 12.7773H3" stroke="#721C7A" strokeWidth="0.5" />
                                                    <path d="M112.5 20.1729H3" stroke="#721C7A" strokeWidth="0.5" />
                                                    <path d="M112.5 27.5684H3" stroke="#721C7A" strokeWidth="0.5" />
                                                    <path d="M112.5 34.9639H3" stroke="#721C7A" strokeWidth="0.5" />
                                                    <path d="M112.5 42.3594H3" stroke="#721C7A" strokeWidth="0.5" />
                                                    <path d="M112.5 49.7549H3" stroke="#721C7A" strokeWidth="0.5" />
                                                </g>
                                            </svg>

                                            <div className="absolute -top-2 right-0">
                                                <LineChart
                                                    series={[
                                                        {
                                                            data: [...currentProductHistory, (currentProduct?.cost || 0)],
                                                            color: "#FFD32A",
                                                            curve: "linear",
                                                            showMark: false
                                                        },
                                                    ]}
                                                    leftAxis={null}
                                                    width={120}
                                                    height={62}
                                                    margin={{
                                                        left: 0,
                                                        right: 3,
                                                        top: 3,
                                                        bottom: -3,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full font-bold flex justify-center items-center gap-3 mt-4">
                                    <button disabled={(currentProduct?.invested || 0) < buySellAmount || Number(currentProduct?.timeToSell) < 0}
                                        onClick={() => {
                                            setLiquidity(liquidity + buySellAmount)
                                            const updatedProductData = productData.map(item => {
                                                if (item.productName === currentProduct?.productName) {
                                                    return {
                                                        ...item,
                                                        invested: Number(Number(currentProduct?.invested || 0) - buySellAmount),
                                                    };
                                                } else return item;
                                            });
                                            setProductData(updatedProductData);
                                        }}
                                        className="px-[10px] py-[6px] bg-figma-rose rounded-full">
                                        {configData.toSell}</button>
                                    <div className="flex items-center">
                                        <button disabled={buySellAmount <= 1} onClick={() => setBuySellAmount(buySellAmount - 1)}>
                                            <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="15.5" cy="15.8271" r="11.5" stroke="#0B1F42" />
                                                <path d="M11.1406 15.827L19.856 15.827" stroke="#0B1F42" strokeLinecap="round" />
                                            </svg>
                                        </button>
                                        <input className="mx-1 w-8 bg-figma-white text-center
                                            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            type="number" value={buySellAmount}
                                            onChange={(e) => {
                                                setBuySellAmount(Number(e.target.value))
                                                e.target.value = buySellAmount.toString();
                                            }} />
                                        <button onClick={() => setBuySellAmount(buySellAmount + 1)}>
                                            <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="15.5" cy="15.8271" r="11.5" stroke="#0B1F42" />
                                                <path d="M15.4985 11.4694V20.1847" stroke="#0B1F42" strokeLinecap="round" />
                                                <path d="M11.1406 15.827L19.856 15.827" stroke="#0B1F42" strokeLinecap="round" />
                                            </svg>
                                        </button>
                                    </div>
                                    <button disabled={buySellAmount > liquidity} onClick={() => {
                                        setLiquidity(liquidity - buySellAmount)
                                        const updatedProductData = productData.map(item => {
                                            if (item.productName === currentProduct?.productName) {
                                                return {
                                                    ...item,
                                                    invested: Number(Number(currentProduct?.invested || 0) + buySellAmount),
                                                };
                                            } else return item;
                                        });
                                        setProductData(updatedProductData);
                                    }}
                                        className="px-[10px] py-[6px] bg-figma-lime rounded-full">
                                        {configData.toBuy}</button>
                                </div>

                            </div>
                        </div>

                        <hr className="bg-figma-stone h-0.5 mt-4" />
                        <p className="mt-3">{currentProduct?.productDescription}</p>
                    </div>
                </div>
            }
            <div className="z-10 fixed top-0 text-xl w-full font-[Inter]">
                <div className="bg-figma-stone">
                    <div className="flex py-1 w-96 sm:w-[26rem] lg:w-[56rem] xl:w-[77rem] mx-auto">
                        <button onClick={() => setShowHelp(true)}>
                            <svg className="ml-[7px] sm:ml-[14px] w-12 my-auto" width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="15.8669" cy="15.5" r="10.5" stroke="#FFFDFD" />
                                <path d="M13.1711 12.8945C13.1711 12.8945 13.0495 10.1379 15.952 10.1379C15.952 10.1379 18.5634 10.1379 18.5635 12.8945C18.5635 15.5788 15.8428 15.5304 15.8428 18.1294" stroke="#FFFDFD" strokeLinecap="round" />
                                <path d="M15.9026 20.5477V20.8621" stroke="#FFFDFD" strokeLinecap="round" />
                            </svg>
                        </button>
                        <div className="grow flex justify-center pr-4">
                            <p className="mx-5 my-auto text-white font-bold">{round}/{scenarios[gameMode].scenarioLength}</p>
                            <h1 className="text-white font-bold my-auto">{configData.buttonPortfolioText.toUpperCase()}</h1>
                        </div>
                        <div className="flex items-center bg-white rounded-lg min-w-14 mr-4 sm:mr-6 my-1">
                            <svg className="-mb-0.5 ml-2" width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13.2217 8.12476C13.2217 10.345 11.4219 12.1448 9.20166 12.1448C6.98146 12.1448 5.18164 10.345 5.18164 8.12476C5.18164 5.90456 6.98146 4.10474 9.20166 4.10474C11.4219 4.10474 13.2217 5.90456 13.2217 8.12476Z" fill="#245375" />
                                <path d="M8.46135 3.15894C6.04531 3.51605 4.18997 5.59445 4.18167 8.10781C2.13565 7.92031 0.533203 6.19966 0.533203 4.10474C0.533203 1.88454 2.33303 0.0847168 4.55322 0.0847168C6.44765 0.0847168 8.03602 1.39512 8.46135 3.15894Z" fill="#245375" />
                            </svg>
                            <p className="text-center px-2 text-black font-bold text-xl">{liquidity.toFixed(1)}</p>
                        </div>
                    </div>
                    <div className="bg-figma-pool-40">
                        <div className="px-4 flex py-1 w-96 sm:w-[25rem] lg:w-[56rem] xl:w-[77rem] mx-auto">
                            <div className="relative">
                                <span className="absolute text-figma-white text-xs top-[7px] left-[6px] w-5 text-center">{portfolioRisk.toFixed(1)}</span>
                                <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.8562 17.8294C0.579185 16.5523 0.579184 14.4819 1.8562 13.2049L13.5862 1.47485C14.8632 0.197837 16.9337 0.197836 18.2107 1.47485L29.9407 13.2049C31.2177 14.4819 31.2177 16.5523 29.9407 17.8294L18.2107 29.5594C16.9337 30.8364 14.8632 30.8364 13.5862 29.5594L1.8562 17.8294Z" fill="#0B1F42" />
                                </svg>
                            </div>
                            <h1 className="ml-3 text-sm self-center text-figma-black grow">{configData.portfolioTitleText}</h1>

                            {portfolioPercentChange > 0 &&
                                <svg className="self-center" width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5.59995 2.56555C5.7924 2.23222 6.27352 2.23222 6.46597 2.56555L10.796 10.0654C10.9884 10.3987 10.7479 10.8154 10.363 10.8154H1.70294C1.31804 10.8154 1.07748 10.3987 1.26993 10.0654L5.59995 2.56555Z" fill="#0B1F42" />
                                </svg>
                            }
                            {portfolioPercentChange < 0 &&
                                <svg className="self-center" width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.46646 10.0653C6.27401 10.3986 5.79288 10.3986 5.60043 10.0653L1.27041 2.56549C1.07796 2.23216 1.31852 1.81549 1.70342 1.81549L10.3635 1.81549C10.7484 1.81549 10.9889 2.23216 10.7965 2.56549L6.46646 10.0653Z" fill="#0B1F42" />
                                </svg>
                            }
                            <h2 className="self-center text-sm ml-1 mr-6">{portfolioPercentChange.toFixed(1)}%</h2>
                            <h2 className='text-sm self-center mr-2'>{portfolioWorth.toFixed(1)}</h2>
                        </div>
                    </div>
                </div>
            </div>

            <div className="font-[Inter] bg-figma-black min-h-screen">
                <div className="md:mx-5 pt-24">
                    {/* Map over productData with products in portfolio first */}
                    <div className="grid lg:grid-cols-2 xl:grid-cols-3 max-w-96 lg:max-w-[62rem] xl:max-w-[78rem] mx-auto flex-col justify-center pb-24">
                        {[...productData]
                            .sort((a, b) => b.invested - a.invested)
                            .map((product) => {
                                const adjustedCost = Math.max(product.cost, 1);
                                const percentConversion = 100;
                                const percentChange: number = parseFloat(((adjustedCost / productHistory[round]?.filter(historicProduct => historicProduct.productName === product.productName)[0].cost - 1) * percentConversion).toFixed(1));
                                return (
                                    <div onClick={() => {
                                        setOpenedProduct(product.ID);
                                    }}
                                        key={product.ID}
                                        className={`${product.invested <= 0 && 'flex'} mt-4 w-[22rem] xs:w-[23rem] sm:min-w-96 mx-auto h-fit`}>
                                        <div className={`${product.invested > 0 ? '' : 'w-[17rem] sm:w-72'}`}>
                                            <div className={`rounded-xl ${product.invested > 0 ? `bg-figma-white text-figma-black` :
                                                'bg-figma-light-black text-figma-stone-40 border border-figma-stone-40'} pt-2 pb-1 flex`}>
                                                <img src={`riskScore/${product.invested > 0 ? 'risk' : 'risk_transparent'}${product.riskScore}.svg`} alt="NaN" className="ml-2 -mt-0.5" />
                                                <h2 className="text-base font-bold mx-3 grow"> {product.productName} </h2>
                                                {product.invested > 0 && <div className="self-center">
                                                    {percentChange > 0 &&
                                                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M5.59995 2.56555C5.7924 2.23222 6.27352 2.23222 6.46597 2.56555L10.796 10.0654C10.9884 10.3987 10.7479 10.8154 10.363 10.8154H1.70294C1.31804 10.8154 1.07748 10.3987 1.26993 10.0654L5.59995 2.56555Z" fill="#0CB43F" />
                                                        </svg>
                                                    }
                                                    {percentChange < 0 &&
                                                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M6.46646 10.0653C6.27401 10.3986 5.79288 10.3986 5.60043 10.0653L1.27041 2.56549C1.07796 2.23216 1.31852 1.81549 1.70342 1.81549L10.3635 1.81549C10.7484 1.81549 10.9889 2.23216 10.7965 2.56549L6.46646 10.0653Z" fill="#EB4C79" />
                                                        </svg>
                                                    }
                                                </div>
                                                }
                                                {product.invested > 0 && <h2 className="self-center text-sm font-bold mr-3">{percentChange}%</h2>}
                                                <h2 className={`text-lg font-bold ${product.invested > 0 ? 'mr-4' : '-mr-20'}`}>{Number(product.invested).toFixed(1)}</h2>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </div>
            {!delaydSellAlert && <div className="z-10 w-full flex justify-center fixed bottom-0 font-[Inter] font-bold bg-figma-stone md:pb-4">
                <div className="flex items-center justify-end">
                    <button className='flex rounded-full hover:scale-110 duration-200 text-white border-white border-2 py-2 px-4 m-2'
                        onClick={() => {
                            setInsufficientLiquidity(false);
                            setOpenedProduct(-1);
                            setShowPortfolio(false);
                            setRoundStart(true);
                            setRound(round + 1);
                            setPrevRoundLiquidity(liquidity);
                            setPortfolioRiskHistory([...portfolioRiskHistory, portfolioRisk]);
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
    const { liquidity,
        scenarios,
        setShowEarnings,
        setLiquidity,
        setShowSite,
        setNextRound,
        setShowHelp,
        configData,
        setShowPortfolio,
        setEconomySummary,
        productData,
        eventData,
        eventIndex,
        setProductData,
        rolledDices,
        setRolledDices
    } = useGameLoop();
    const { round, gameMode, setTotalScore, setEndGame } = useGame();
    let incomeSum = 0;

    const popInDelay = 0.5;
    let sumDelay = 1;

    if (liquidity === null) {
        return (
            <div className="bg-figma-black h-screen">
                <h1 className="text-center pt-36 lg:mt-56 text-white">Loading...</h1>
            </div>
        );
    }

    useEffect(() => {
        const investedItems = productData.filter(item => item.invested > 0);
        const newRolledDices = [...rolledDices];

        let needsUpdate = false;
        investedItems.forEach((_, index) => {
            if (!newRolledDices[index]) {
                newRolledDices[index] = Math.floor(Math.random() * 6);
                needsUpdate = true;
            }
        });

        if (needsUpdate) {
            setRolledDices(newRolledDices);
        }
    }, []);

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
                    <div className="bg-white rounded-md min-w-14 mr-6 my-1">
                        <p className="text-center px-2 text-figma-black font-bold text-xl">{liquidity.toFixed(1)}</p>
                    </div>
                </div>
            </div>

            <div className="relative z-0 h-screen flex flex-col justify-center custom-radial-gradient">
                <h1 className="mb-6 text-xl text-white text-center -mt-10">{configData.yourEarningsText} {round}. {configData.roundText}</h1>
                <div className="flex justify-center">
                    <div className="w-full max-w-[609px] min-w-80">
                        <div className="border border-white rounded-t-xl mx-8 bg-figma-black pb-6 pt-1">
                            {[...productData]
                                .filter(item => item.invested > 0)
                                .map((item, index) => {
                                    const event: any = eventData[eventIndex];
                                    let randomDice = rolledDices[index];
                                    const maxDiceIndex = 5;
                                    const totalIncome = (item.invested / item.cost) *
                                        (event[item.productName][1] + (event[item.productName][2] - event[item.productName][1] || 0) * (randomDice / maxDiceIndex));
                                    incomeSum += totalIncome;
                                    ++sumDelay;

                                    return (
                                        <div className="mt-2 mx-4 flex justify-between text-white text-base font-medium" key={item.productName}>
                                            <h3 className="my-auto flex-1 break-words text-lg grow">{item.productName}</h3>
                                            {item.diceThrow == "TRUE" && (
                                                <div className="size-10">
                                                    <RiveDice diceValue={randomDice + 1} diceColor={item.color} throwDelayIndex={index} />
                                                </div>
                                            )}
                                            <h3
                                                className="text-center w-12 my-auto text-lg font-bold pop-in"
                                                style={{ animationDelay: `${(index + 1) * popInDelay}s` }}
                                            >
                                                +{
                                                    ((item.invested / item.cost) *
                                                        (event[item.productName][1] + (event[item.productName][2] - event[item.productName][1] || 0) * (randomDice / maxDiceIndex))).toFixed(1)
                                                }
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
                                    +{incomeSum.toFixed(1)}
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
                            let addLiquidity = 0;

                            // calculating the total score at the end of the game
                            if (round >= scenarios[gameMode].scenarioLength) {
                                const event: any = eventData[eventIndex];
                                // Update productData
                                const updatedProductData = productData.map(item => {
                                    let costChange = Number(event[item.productName][0]);
                                    return {
                                        ...item,
                                        invested: Math.max(0, Number(item.invested) * costChange),
                                        cost: Math.max(1, Number(item.cost) * costChange),
                                    };
                                });
                                setProductData(updatedProductData);


                                let score = 0;
                                productData.map(item => score += item.invested);
                                setTotalScore((liquidity ?? 0) + score);

                                setEndGame(true);
                            }

                            setLiquidity((liquidity ?? 0) + addLiquidity);

                            setEconomySummary(false);

                            setLiquidity((prevLiquidity: number) => (prevLiquidity ?? 0) + incomeSum);
                            setShowSite(0);
                            setNextRound(true);
                            setShowEarnings(false);
                            setShowPortfolio(true);
                            setRolledDices([]);
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
    const { scenarios, setEventIndex, eventData,
        setRoundStart, setShowEarnings, setShowBankruptcy,
        productData, setShowEvent } = useGameLoop();

    const soloGame = scenarios[gameMode].random == "TRUE";

    useEffect(() => {
        let newEvent;
        if (soloGame) newEvent = Math.floor(Math.random() * eventData.length);
        else newEvent = (eventData as any[]).findIndex((item: events) => item.eventName === scenarios[gameMode].eventOrder[round - 1]);
        setEventIndex(newEvent);
        setShowEvent(true);
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

            <div className="fixed z-10 bottom-24 w-full">
                <button className="block mx-auto  hover:scale-110 duration-200" onClick={() => {
                    const diceRolls: number[] = [];
                    productData
                        .filter(item => item.invested > 0)
                        .map(() => {
                            diceRolls.push(Math.floor(Math.random() * 6)); // 0-5
                            //continue here
                            // create a global varible in which the dice rolls for the round are stored
                        });
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

function Bankruptcy() {

    const { gameMode, round } = useGame();
    const { scenarios, setShowHelp, eventData, eventIndex,
        liquidity, figmaColors, setShowBankruptcy, configData,
        rolledThisBancrupcy, setRolledThisBancrupcy, productData,
        setProductData, setShowEvent } = useGameLoop();

    const [rollingDices, SetRollingDices] = useState(false);
    const [bankruptItems, setBankruptItems] = useState<string[]>([]);
    const whiteDice = 8;

    useEffect(() => {
        if (!rolledThisBancrupcy) {
            const updatedBankruptCatergories: string[] = [];
            productData.map(item => {
                const randomDice = Math.floor(Math.random() * 18) + 1;
                const isBankrupt = item.minToPreventBankruptcy >= randomDice && item.minToPreventBankruptcy > 0;

                if (isBankrupt) {
                    setProductData(...[productData], productData[item.ID].invested = productData[item.ID].invested / 2);
                    updatedBankruptCatergories.push(item.productName);
                }
                return !isBankrupt;
            });
            setBankruptItems(updatedBankruptCatergories);
            setRolledThisBancrupcy(true);
        }
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
                        <h1 className="font-bold my-auto text-sm xs:text-lg mr-2">{configData.crisisNewsHeadlineText}</h1>
                    </div>
                    <div className="bg-white rounded-md min-w-14 mr-6 my-1">
                        <p className="text-center px-2 text-figma-black font-bold text-xl">{liquidity?.toFixed(1)}</p>
                    </div>
                </div>
            </div>
            {!rollingDices ?
                <>
                    <div className="mt-8 text-figma-black max-w-[39rem] mx-auto">
                        <div className="relative">
                            <img src={`events/${eventData[eventIndex].IMG}`}></img>
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
                    onClick={() => {
                        if (!rollingDices) SetRollingDices(true);
                        else {
                            setShowBankruptcy(false);
                            setShowEvent(false);
                        }
                    }}>

                    <svg className="my-auto" width="19" height="15" viewBox="0 0 19 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.86694 7.5H17.8669M17.8669 7.5L11.8669 1.5M17.8669 7.5L11.8669 13.5" stroke="#0B1F42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="mx-3 text-lg">{configData.crisisButton}</span>
                </button>
            </div>
        </>
    );
}

function News() {

    const { gameMode, round } = useGame();
    const { scenarios, setShowHelp, eventData, eventIndex,
        liquidity, figmaColors, setShowEvent, configData,
    } = useGameLoop();

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
                        <h1 className="font-bold my-auto text-sm xs:text-lg mr-2">{configData.newsHeadline}</h1>
                    </div>
                    <div className="bg-white rounded-md min-w-14 mr-6 my-1">
                        <p className="text-center px-2 text-figma-black font-bold text-xl">{liquidity?.toFixed(1)}</p>
                    </div>
                </div>
            </div>
            <div className="mt-8 text-figma-black max-w-[39rem] mx-auto">
                <div className="relative">
                    <img src={`events/${eventData[eventIndex].IMG}`}></img>
                </div>
                <h1 className="text-2xl font-bold mx-4 mt-7 leading-7">{eventData[eventIndex].eventName}</h1>
                <p className="text-lg mx-4 mt-3 leading-6">{eventData[eventIndex].eventText}</p>
            </div>

            <div className={`z-10 w-full flex justify-center fixed bottom-0 font-[Inter] font-medium md:pb-3 ${'bg-' + figmaColors[eventData[eventIndex].color]}`}>
                <button className='flex rounded-full hover:scale-110 duration-200 text-figma-black border-figma-black border py-2 px-6 m-3'
                    onClick={() => setShowEvent(false)}>

                    <svg className="my-auto" width="19" height="15" viewBox="0 0 19 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.86694 7.5H17.8669M17.8669 7.5L11.8669 1.5M17.8669 7.5L11.8669 13.5" stroke="#0B1F42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
        </>
    );
}

function GameLoop() {

    const { round, gameMode } = useGame();
    const {
        configData,
        setLiquidity,
        liquidity,
        productData,
        nextRound,
        scenarios,
        roundStart,
        earningsTutorial,
        portfolioTutorial,
        newsTutorial,
        showPortfolio,
        showEarnings,
        showHelp,
        showBankruptcy,
        showEvent,
    } = useGameLoop();

    const soloGame = scenarios[gameMode].random == "TRUE";

    useEffect(() => {
        if (configData) {
            setLiquidity(configData.startingMoney);
            // setLiquidity(9999);
        }
    }, []);


    if (!productData || liquidity === null) {
        return (
            <div className="bg-figma-black h-screen">
                <h1 className="text-center pt-36 lg:mt-56 text-white">Loading...</h1>
            </div>
        );
    }

    let content = null;
    if (roundStart && round <= scenarios[gameMode].scenarioLength) content = <NewRound />;
    else if (showHelp) content = <ShowHelp />;
    else if (showEvent && showBankruptcy) content = <Bankruptcy />;
    else if (portfolioTutorial) content = <PortfolioTutorial />;
    else if (showEarnings && earningsTutorial) content = <EarningsTutorial />;
    else if (showEarnings) content = <Earnings />;
    else if (nextRound && newsTutorial) content = <NewsTutorial />;
    else if (showEvent && soloGame) content = <News />;
    else if (nextRound && !soloGame) content = <NewEvent />;
    else if (showPortfolio) content = <Portfolio />;

    return content;
}

export default GameLoop;
