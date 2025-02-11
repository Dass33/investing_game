import { useEffect, useState } from "react";
import { useGame } from "./GameContext";
import { useGameLoop } from "./GameLoopContext";
import { LineChart } from "@mui/x-charts";

function EndScreen() {
    const { totalScore, setTotalScore, gameMode, portfolioRiskHistory } = useGame();
    const { productData, scenarios, liquidity, configData, portfolioRisk, riskHistory } = useGameLoop();
    const [showRisk, setShowRisk] = useState(false);
    const [showPlayAgain, setShowPlayAgain] = useState(false);
    const averageRisk = riskHistory.reduce((a, b) => a + b) / riskHistory.length
    const riskIndex = Math.ceil(Math.max(averageRisk - configData.baseRisk, 0) / configData.incrementRisk);
    const [lastRoundSell, setLastRoundSell] = useState(0);
    useEffect(() => {
        let score = 0;
        let roundSell = 0;
        productData.map(item => {
            score += item.invested + item.sellingNextRound;
            roundSell += item.sellingNextRound;
        });
        setTotalScore((liquidity ?? 0) + score);
        setLastRoundSell(roundSell);
    }, [productData]);

    const soloGame = (scenarios[gameMode].random === "TRUE");
    let content = (
        <>
            <div className="text-center text-figma-white bg-figma-black h-screen">
                <svg
                    className="h-screen w-full absolute pr-5 pl-7 py-8 z-0"
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="verticalLines" patternUnits="userSpaceOnUse" width="47" height="100%">
                            <path d="M0 0V100000%" stroke="#721C7A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#verticalLines)" />
                </svg>
                <div className="mx-auto max-w-[40rem]">
                    <div className="flex relative z-10 justify-center gap-8 pt-20 md:pt-24 lg:pt-28 mb-20">
                        <h1 className="text-2xl my-auto font-medium">{configData.scoreText}</h1>
                        <h1 className="text-6xl leading-[0.7] tracking-widest">{totalScore.toFixed(1)}</h1>
                    </div>
                    {productData.map(item => {
                        return (
                            <div className="relative z-10 mt-1 mx-3 pl-3 pr-6 flex text-figma-black text-base rounded font-bold bg-figma-white" key={item.ID}>

                                <h3 className="my-auto flex-1 break-words text-base text-left grow">{item.productName}</h3>
                                <h3 className="w-16 my-auto text-lg font-bold text-right">{item.invested.toFixed(1)}</h3>
                            </div>
                        );
                    })}
                    <div className="relative z-10 mt-1 mx-3 pl-3 pr-6 flex text-figma-black text-base rounded font-bold bg-figma-white">
                        <h3 className="my-auto flex-1 break-words text-base text-left grow">{configData.cashText}</h3>
                        <h3 className="w-16 my-auto text-lg font-bold text-right">{((liquidity || 0) + lastRoundSell).toFixed(1)}</h3>

                    </div>

                    <h1 className="text-lg font-medium mt-10 relative z-10 mx-2">{configData.endText}</h1>
                    <div className="z-10 w-full flex mt-4 justify-center font-[Inter] font-bold">
                        <button className='bg-figma-black relative z-10 bg flex rounded-full hover:scale-110 duration-200 text-white border-white border py-2 px-6 m-4'
                            onClick={() => setShowRisk(true)}>


                            <svg className="my-auto" width="19" height="15" viewBox="0 0 19 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.86694 7.5H17.8669M17.8669 7.5L11.8669 1.5M17.8669 7.5L11.8669 13.5" stroke="#FFFDFD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );

    if (showRisk) content =
        <>
            <div className="text-center text-figma-white bg-figma-black h-screen">
                <svg
                    className="h-screen w-full absolute pr-5 pl-7 py-8 z-0"
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="verticalLines" patternUnits="userSpaceOnUse" width="47" height="100%">
                            <path d="M0 0V100000%" stroke="#721C7A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#verticalLines)" />
                </svg>
                <div className="mx-auto max-w-[40rem]">
                    <div className="flex relative z-10 justify-center gap-8 pt-12 md:pt-24 lg:pt-28 mb-12">
                        <h1 className="text-2xl my-auto font-medium">{configData.riskHeadline}</h1>
                        <h1 className="text-6xl leading-[0.7] tracking-widest font-bold">{averageRisk.toFixed(1)}</h1>
                    </div>

                    <h1 className="text-2xl font-medium my-12 relative z-10 mx-7">{configData.investorType[riskIndex]}</h1>
                    <p className="text-lg font-medium mt-8 relative z-10 mx-7">{configData.investorTypeDescription[riskIndex]}</p>

                    <LineChart className="mx-auto mt-2"
                        xAxis={[
                            {
                                id: 'barCategories',
                                data: Array.from({ length: scenarios[gameMode].scenarioLength }, (_, index) => index + 1),
                                scaleType: 'band',
                                tickLabelStyle: {
                                    stroke: '#FFFFFF'
                                },
                                disableLine: true,
                                disableTicks: true,
                            }
                        ]}
                        series={[
                            {
                                data: [...portfolioRiskHistory, portfolioRisk],
                                curve: "linear",
                                color: "#FFFFFF"
                            },
                        ]}
                        yAxis={[
                            {
                                min: 0,
                                max: 7,
                            }
                        ]}
                        leftAxis={null}
                        width={300}
                        height={130}
                        margin={{
                            left: 0,
                            right: 0,
                            top: 5,
                            bottom: 20,
                        }}
                    />
                </div>
                <div className="z-10 w-full flex mt-4 justify-center font-[Inter] font-bold">
                    <button className='bg-figma-black relative z-10 bg flex rounded-full hover:scale-110 duration-200 text-white border-white border py-2 px-6 m-4'
                        onClick={() => setShowRisk(false)}>


                        <svg className="my-auto" width="19" height="15" viewBox="0 0 19 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.1331 7.5H1.1331 M1.1331 7.5L7.1331 1.5 M1.1331 7.5L7.1331 13.5" stroke="#FFFDFD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="ml-2">{configData.scoreText}</span>
                    </button>

                    {soloGame ?
                        <button className='bg-figma-black relative z-10 bg flex rounded-full hover:scale-110 duration-200 text-white border-white border py-2 px-6 m-4'
                            onClick={() => {
                                console.log("NHI");
                                const url = new URL(window.location.href);
                                url.searchParams.set('gameMode', '1');
                                window.location.replace(url.toString());
                            }}>


                            <span className="">{configData.buttonRestartText}</span>
                        </button>

                        :
                        <button className='bg-figma-black relative z-10 bg flex rounded-full hover:scale-110 duration-200 text-white border-white border py-2 px-6 m-4'
                            onClick={() => setShowPlayAgain(true)}>

                            <span className="mr-2">{configData.theEndText}</span>
                            <svg className="my-auto" width="19" height="15" viewBox="0 0 19 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.86694 7.5H17.8669M17.8669 7.5L11.8669 1.5M17.8669 7.5L11.8669 13.5" stroke="#FFFDFD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    }
                </div>
            </div>
        </>

    if (showPlayAgain && !soloGame) content =
        <>
            <div className="text-center text-figma-white bg-figma-black h-screen">
                <svg className="h-screen w-full absolute pr-5 pl-7 py-8 z-0"
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="verticalLines" patternUnits="userSpaceOnUse" width="47" height="100%">
                            <path d="M0 0V100000%" stroke="#721C7A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#verticalLines)" />
                </svg>
                <img src="end_screen_picture.svg" alt="placeholder" className="mx-auto pt-28 relative z-10"></img>

                <p className="text-2xl font-bold mt-8 relative z-10 mx-7">{configData.playAgainText}</p>

                <div className="max-w-[40rem] mx-auto">
                    <div className={`z-10 gap-4 flex mt-4 justify-center font-[Inter] font-bold text-sm ${soloGame ? "ml-6" : "ml-3"}`}>
                        <button className='bg-figma-black relative z-10 bg flex rounded-full hover:scale-110 duration-200 text-center text-white border-white border py-2 px-6 my-4'
                            onClick={() => {
                                setShowRisk(true);
                                setShowPlayAgain(false);
                            }}>


                            <svg className="my-auto" width="19" height="15" viewBox="0 0 19 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.1331 7.5H1.1331 M1.1331 7.5L7.1331 1.5 M1.1331 7.5L7.1331 13.5" stroke="#FFFDFD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="ml-2 mt-1">{configData.backText}</span>
                        </button>

                        <button className='bg-figma-black min-w-32 relative z-10 bg flex rounded-full hover:scale-110 duration-200 text-center text-white border-white border py-2 px-6 my-4'
                            onClick={() => {
                                console.log("NHI");
                                const url = new URL(window.location.href);
                                url.searchParams.set('gameMode', '1');
                                window.location.replace(url.toString());
                            }}>

                            <h1 className="text-md my-1">{configData.playAgainHeadline}</h1>
                        </button>
                    </div>

                    <h3 className="text-center text-[11px] relative z-10">{configData.copyright}</h3>
                </div>
            </div>
        </>
    return content;
}

export default EndScreen;
