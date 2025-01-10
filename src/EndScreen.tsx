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
                    <h3 className="text-center text-[11px] relative z-10 mt-4">{configData.copryight}</h3>
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
                    </button>

                    <button className='bg-figma-black relative z-10 bg flex rounded-full hover:scale-110 duration-200 text-white border-white border py-2 px-6 m-4'
                        onClick={() => setShowPlayAgain(true)}>


                        <svg className="my-auto" width="19" height="15" viewBox="0 0 19 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.86694 7.5H17.8669M17.8669 7.5L11.8669 1.5M17.8669 7.5L11.8669 13.5" stroke="#FFFDFD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>
        </>

    if (showPlayAgain) content =
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
                <svg className="mx-auto pt-16 relative z-10"
                    width="359" height="261" viewBox="0 0 359 261" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.51855 242.404L26.1716 208.564L47.3319 104.345L85.5413 98.7771L122.82 17.2852L160.099 89.7221L174.866 59.7695L200.249 163.778L253.986 202.904L277.637 155.73L293.733 185.446L331.996 107.831L351.929 23.2427" stroke="#199CF9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M47.4734 193.321H11.1074V215.029H47.4734V193.321Z" fill="#FFFDFD" stroke="#0B1F42" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M47.4786 193.321H11.1074L17.6092 178.123H53.9752L47.4786 193.321Z" fill="#FF6130" stroke="#0B1F42" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M58.5634 203.963V185.292L53.977 178.123L47.4805 193.321V215.029L58.5634 203.963Z" fill="#FFFDFD" stroke="#0B1F42" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M42.757 202.779H36.6436V215.029H42.757V202.779Z" fill="#FF6130" stroke="#0B1F42" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M25.5541 196.657H11.1074V204.177H25.5541V196.657Z" fill="#FF6130" stroke="#0B1F42" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M74.1335 178.424C74.1335 185.512 68.3883 191.258 61.3 191.258H59.3592C53.9958 189.719 48.4688 184.283 48.4688 178.424C48.4665 172.906 54.3844 167.404 59.2705 165.591C59.2705 165.591 59.7296 165.591 61.3 165.591C68.3883 165.591 74.1335 171.336 74.1335 178.424Z" fill="#0B1F42" stroke="#0B1F42" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M59.3599 191.258C66.4476 191.258 72.1934 185.512 72.1934 178.424C72.1934 171.336 66.4476 165.591 59.3599 165.591C52.2721 165.591 46.5264 171.336 46.5264 178.424C46.5264 185.512 52.2721 191.258 59.3599 191.258Z" fill="#A3D7FD" stroke="#0B1F42" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M59.3591 186.057C60.9964 186.057 62.3237 184.711 62.3237 183.05C62.3237 181.39 60.9964 180.044 59.3591 180.044C57.7218 180.044 56.3945 181.39 56.3945 183.05C56.3945 184.711 57.7218 186.057 59.3591 186.057Z" fill="#0B1F42" stroke="#0B1F42" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M53.3896 176.186C53.3896 176.186 53.6708 177.592 54.65 177.592C55.6291 177.592 55.9224 176.186 55.9224 176.186" stroke="#0B1F42" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M62.418 176.186C62.418 176.186 62.6991 177.592 63.6783 177.592C64.6574 177.592 64.9507 176.186 64.9507 176.186" stroke="#0B1F42" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M154.383 48.5351C154.383 55.0971 149.065 60.4157 142.503 60.4157H140.706C135.741 58.9914 130.624 53.9589 130.624 48.5351C130.622 43.4269 136.1 38.3334 140.624 36.6545C140.624 36.6545 141.049 36.6545 142.503 36.6545C149.065 36.6545 154.383 41.9731 154.383 48.5351Z" fill="#0B1F42" stroke="#0B1F42" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M140.706 60.4157C147.267 60.4157 152.586 55.0966 152.586 48.5351C152.586 41.9737 147.267 36.6545 140.706 36.6545C134.144 36.6545 128.825 41.9737 128.825 48.5351C128.825 55.0966 134.144 60.4157 140.706 60.4157Z" fill="#AA4BB3" stroke="#0B1F42" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M143.201 47.1194L146.228 47.1411" stroke="#0B1F42" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M136.352 47.8222C136.646 47.8222 136.884 47.3389 136.884 46.7429C136.884 46.1468 136.646 45.6636 136.352 45.6636C136.058 45.6636 135.819 46.1468 135.819 46.7429C135.819 47.3389 136.058 47.8222 136.352 47.8222Z" fill="#0B1F42" stroke="#0B1F42" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M136.352 50.9514C136.352 50.9514 137.279 54.225 140.511 54.225C143.742 54.225 144.71 50.9514 144.71 50.9514" stroke="#0B1F42" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M269.415 222.228H226.123L236.061 215.453H279.353L269.415 222.228Z" fill="#FFFDFD" stroke="#0B1F42" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M225.944 222.228L221.768 234.325H273.788L269.333 222.228H225.944Z" fill="#FFD32A" stroke="#0B1F42" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M283.708 227.664L279.221 215.453L269.19 222.115L273.677 234.325L283.708 227.664Z" fill="#FF6130" stroke="#0B1F42" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M269.415 210.13H226.123L236.061 203.355H279.353L269.415 210.13Z" fill="#FFFDFD" stroke="#0B1F42" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M225.944 210.13L221.768 222.228H273.788L269.333 210.13H225.944Z" fill="#FFD32A" stroke="#0B1F42" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M283.708 215.566L279.221 203.355L269.19 210.017L273.677 222.228L283.708 215.566Z" fill="#FF6130" stroke="#0B1F42" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M269.415 198.032H226.123L236.061 191.258H279.353L269.415 198.032Z" fill="#FFFDFD" stroke="#0B1F42" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M225.944 198.032L221.768 210.13H273.788L269.333 198.032H225.944Z" fill="#FFD32A" stroke="#0B1F42" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M283.708 203.468L279.221 191.258L269.19 197.919L273.677 210.13L283.708 203.468Z" fill="#FF6130" stroke="#0B1F42" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M235.026 233.482H191.734L201.672 226.707H244.964L235.026 233.482Z" fill="#FFFDFD" stroke="#0B1F42" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M191.556 233.482L187.38 245.579H239.4L234.945 233.482H191.556Z" fill="#FFD32A" stroke="#0B1F42" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M249.32 238.917L244.834 226.707L234.803 233.369L239.289 245.579L249.32 238.917Z" fill="#FF6130" stroke="#0B1F42" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M228.138 245.327H209.205V247.525C209.205 248.653 210.137 249.788 211.999 250.65C215.706 252.372 221.702 252.381 225.385 250.669C227.234 249.81 228.151 248.683 228.136 247.552V245.328L228.138 245.327Z" fill="#FF6130" stroke="#0B1F42" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M228.138 245.385C228.155 242.959 223.929 240.973 218.701 240.951C213.473 240.929 209.222 242.877 209.205 245.303C209.188 247.73 213.414 249.715 218.642 249.737C223.87 249.76 228.122 247.811 228.138 245.385Z" fill="#FFD32A" stroke="#0B1F42" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M228.138 243.093H209.205V245.291C209.205 246.419 210.137 247.554 211.999 248.416C215.706 250.138 221.702 250.147 225.385 248.435C227.234 247.576 228.151 246.448 228.136 245.318V243.094L228.138 243.093Z" fill="#FF6130" stroke="#0B1F42" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M228.138 243.151C228.155 240.725 223.929 238.739 218.701 238.717C213.473 238.695 209.222 240.643 209.205 243.069C209.188 245.495 213.414 247.481 218.642 247.503C223.87 247.525 228.122 245.577 228.138 243.151Z" fill="#FFD32A" stroke="#0B1F42" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M214.986 253.072H196.053V255.271C196.053 256.398 196.985 257.533 198.846 258.395C202.553 260.117 208.55 260.126 212.233 258.415C214.082 257.555 214.999 256.428 214.984 255.297V253.074L214.986 253.072Z" fill="#FF6130" stroke="#0B1F42" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M214.986 253.131C215.003 250.704 210.777 248.719 205.549 248.696C200.321 248.674 196.069 250.622 196.053 253.049C196.036 255.475 200.262 257.46 205.49 257.483C210.718 257.505 214.969 255.557 214.986 253.131Z" fill="#FFD32A" stroke="#0B1F42" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M269.387 181.632C269.387 188.712 263.648 194.451 256.568 194.451H254.63C249.273 192.914 243.752 187.484 243.752 181.632C243.75 176.121 249.661 170.625 254.541 168.813C254.541 168.813 255 168.813 256.568 168.813C263.648 168.813 269.387 174.552 269.387 181.632Z" fill="#0B1F42" stroke="#0B1F42" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M254.63 194.451C261.71 194.451 267.449 188.712 267.449 181.632C267.449 174.553 261.71 168.813 254.63 168.813C247.551 168.813 241.812 174.553 241.812 181.632C241.812 188.712 247.551 194.451 254.63 194.451Z" fill="#FFD32A" stroke="#0B1F42" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M249.931 184.177C249.931 184.177 250.932 187.71 254.418 187.71C257.905 187.71 258.949 184.177 258.949 184.177" stroke="#0B1F42" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M248.667 179.397C248.667 179.397 248.948 180.801 249.926 180.801C250.904 180.801 251.197 179.397 251.197 179.397" stroke="#0B1F42" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M257.686 179.397C257.686 179.397 257.966 180.801 258.944 180.801C259.922 180.801 260.215 179.397 260.215 179.397" stroke="#0B1F42" stroke-linecap="round" stroke-linejoin="round" />
                    <rect x="260.216" y="41.4924" width="72.2771" height="48.4239" rx="4" fill="#EB4C79" stroke="#0B1F42" stroke-linecap="round" stroke-linejoin="round" />
                    <rect x="286.137" y="1.41064" width="72.2771" height="48.4239" rx="4" fill="#02A3A4" stroke="#0B1F42" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M265.24 72.4872L274.812 70.0943L277.654 73.8333L283.337 70.0943L293.656 75.4784L301.583 63.6633L305.621 70.0943L310.257 68.0006L314.594 72.4872L319.081 68.898L325.662 79.2175" stroke="#0B1F42" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M326.709 75.4038L325.811 79.367L321.399 78.2452" stroke="#0B1F42" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M296.354 7.25269L300.24 13.9828H292.468L296.354 7.25269Z" fill="#FFFDFD" stroke="#FFFDFD" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M270.23 54.3215L266.344 47.5914L274.116 47.5914L270.23 54.3215Z" fill="#0B1F42" stroke="#0B1F42" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M292.855 40.7613L302.538 38.7931L307.286 34.8567L312.593 24.2503L315.386 30.2642L318.645 26.7652L325.534 43.0575L332.982 23.2662L334.937 25.8905L340.989 12.1131L344.713 16.5962L349.741 7.95801" stroke="#FFFDFD" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M346.018 9.16822L349.742 7.91138L350.946 11.8029" stroke="#FFFDFD" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M339.011 49.835C339.011 56.1522 333.89 61.2725 327.573 61.2725H325.843C321.064 59.9013 316.138 55.0565 316.138 49.835C316.136 44.9173 321.41 40.0137 325.764 38.3975C325.764 38.3975 326.174 38.3975 327.573 38.3975C333.89 38.3975 339.011 43.5177 339.011 49.835Z" fill="#0B1F42" stroke="#0B1F42" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M325.844 61.2725C332.161 61.2725 337.281 56.1517 337.281 49.835C337.281 43.5182 332.161 38.3975 325.844 38.3975C319.527 38.3975 314.406 43.5182 314.406 49.835C314.406 56.1517 319.527 61.2725 325.844 61.2725Z" fill="#FFFDFD" stroke="#0B1F42" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M321.652 49.0942C321.935 49.0942 322.165 48.629 322.165 48.0552C322.165 47.4813 321.935 47.0161 321.652 47.0161C321.369 47.0161 321.14 47.4813 321.14 48.0552C321.14 48.629 321.369 49.0942 321.652 49.0942Z" fill="#0B1F42" stroke="#0B1F42" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M329.698 49.0942C329.981 49.0942 330.21 48.629 330.21 48.0552C330.21 47.4813 329.981 47.0161 329.698 47.0161C329.415 47.0161 329.186 47.4813 329.186 48.0552C329.186 48.629 329.415 49.0942 329.698 49.0942Z" fill="#0B1F42" stroke="#0B1F42" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M325.844 56.5629C327.303 56.5629 328.486 55.3632 328.486 53.8833C328.486 52.4033 327.303 51.2036 325.844 51.2036C324.385 51.2036 323.202 52.4033 323.202 53.8833C323.202 55.3632 324.385 56.5629 325.844 56.5629Z" fill="#0B1F42" stroke="#0B1F42" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M105.979 79.2174C105.979 85.6425 100.772 90.8502 94.3465 90.8502H92.5873C87.7257 89.4556 82.7158 84.5281 82.7158 79.2174C82.7138 74.2158 88.078 69.2286 92.5069 67.5847C92.5069 67.5847 92.923 67.5847 94.3465 67.5847C100.772 67.5847 105.979 72.7924 105.979 79.2174Z" fill="#0B1F42" stroke="#0B1F42" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M92.5878 90.8502C99.0124 90.8502 104.221 85.642 104.221 79.2174C104.221 72.7929 99.0124 67.5847 92.5878 67.5847C86.1632 67.5847 80.9551 72.7929 80.9551 79.2174C80.9551 85.642 86.1632 90.8502 92.5878 90.8502Z" fill="#EB4C79" stroke="#0B1F42" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M95.0703 77.6731L98.5479 77.3569" stroke="#0B1F42" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M89.542 77.6731L86.0644 77.3569" stroke="#0B1F42" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M88.3242 81.5273C88.3242 81.5273 89.2327 84.7327 92.3968 84.7327C95.5609 84.7327 96.5085 81.5273 96.5085 81.5273" stroke="#0B1F42" stroke-linecap="round" stroke-linejoin="round" /> </svg>

                <div className="mx-auto max-w-[40rem]">
                    <div className="flex relative z-10 justify-center gap-8 pt-4 mb-12">
                        {!soloGame && <h1 className="text-3xl my-auto font-bold">{configData.playAgainHeadline}</h1>}
                    </div>

                    {soloGame && <div>
                        <p className="text-3xl font-bold mt-10 relative z-10 mx-7">{configData.buttonRestartText}</p>
                    </div>}
                    <div className="z-10 w-full flex mt-4 justify-center font-[Inter] font-bold">
                        <button className='relative z-10 bg flex rounded-full hover:scale-110 duration-200 text-white py-2 px-4 m-2'
                            onClick={() => window.location.replace(window.location.href)}>  {/*temporary way to restart the game*/}


                            <svg className="" width="76" height="60" viewBox="0 0 19 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.86694 7.5H17.8669M17.8669 7.5L11.8669 1.5M17.8669 7.5L11.8669 13.5" stroke="#FFFDFD" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>
                    {!soloGame && <p className="text-2xl font-bold mt-8 relative z-10 mx-7">{configData.playAgainText}</p>}

                    <h3 className="text-center text-[11px] relative z-10">{configData.copryight}</h3>
                </div>
            </div>
        </>
    return content;
}

export default EndScreen;
