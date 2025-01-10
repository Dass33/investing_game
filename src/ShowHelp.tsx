import { useGame } from "./GameContext";
import { useGameLoop } from "./GameLoopContext";
import React, { useState } from "react";

export function ShowHelp() {
    const { gameMode } = useGame();
    const { figmaColors, scenarios, setShowHelp, configData, productData } = useGameLoop();
    const [activeTab, setActiveTab] = useState(0);

    const tabContent: React.ReactNode[] = [
        (
            <>
                <h2 className="text-lg mb-2 text-figma-black font-bold text-center">{configData.helpHowToPlayText}</h2>
                <div className="relative z-0 mx-5 text-figma-black">
                    <img className="h-36 mx-auto" src={scenarios[gameMode].IMG}></img>
                    <p className="mt-4 text-center text-lg font-medium min-h-16 mb-8">{scenarios[gameMode].howToPlay}</p>
                </div>

                <img className="h-36 mx-auto" src={scenarios[gameMode].IMG2}></img>
                <p className="mt-4 text-center mx-5 text-lg font-medium min-h-16 mb-8">{scenarios[gameMode].howToPlay2}</p>

                <img className="h-36 mx-auto" src={configData.earningsTutorial_IMG}></img>
                <p className="mt-4 text-center mx-5 text-lg font-medium min-h-16 mb-8" >{configData.earningsTutorialText}</p>

                <img className="h-36 mx-auto" src={configData.newsTutorial_IMG}></img>
                <p className="mt-4 text-center mx-5 text-lg font-medium min-h-16" >{configData.newsTutorialText}</p>

                <img className="h-36 mx-auto" src={configData.portfolioTutorial_IMG}></img>
                <p className="mt-4 text-center mx-5 text-lg font-medium min-h-16 mb-8" >{configData.newsTutorialText2}</p>
                <p className="mt-4 text-center mx-5 text-lg font-medium min-h-16 mb-8" >{configData.riskTutorialText}</p>
            </>
        ),
        (
            productData.map((item) => {
                return (
                    <>
                        <div className="relative z-0 mt-1 mx-3 pl-3 pr-6 text-figma-black mb-10" key={item.ID}>
                            <h3 className={`text-lg rounded-lg font-bold pl-4 py-1 bg-${figmaColors[item.color]}`}>{item.productName}</h3>
                            <p className="mt-4 text-base font-medium min-h-14 mb-1">{item.productDescription}</p>
                        </div>
                    </>
                );
            })
        ),
        (
            <div className="mx-3 ">
                <p className="pt-2 font-bold">{configData.helpTipHeadline1}</p>
                <p className="text-base font-medium min-h-14 mt-3 mb-2">{configData.helpTipText1}</p>

                <p className="pt-2 font-bold">{configData.helpTipHeadline2}</p>
                <p className="text-base font-medium min-h-14 mt-3 mb-2">{configData.helpTipText2}</p>

                <p className="pt-2 font-bold">{configData.helpTipHeadline3}</p>
                <p className="text-base font-medium min-h-14 mt-3 mb-2">{configData.helpTipText3}</p>

                <p className="pt-2 font-bold">{configData.helpTipHeadline4}</p>
                <p className="text-base font-medium min-h-14 mt-3 mb-2">{configData.helpTipText4}</p>
            </div>
        ),
        (

            <div className="relative z-0 mx-5 text-figma-black">
                <p className="mt-1 text-center text-lg font-medium min-h-10 mb-2">{configData.autor0}</p>
                <p className="mt-1 text-center text-lg font-medium min-h-10 mb-2">{configData.autor1}</p>
                <p className="mt-1 text-center text-lg font-medium min-h-10 mb-2">{configData.autor2}</p>
                <p className="mt-1 text-center text-lg font-medium min-h-10 mb-2">{configData.autor3}</p>
                <p className="mt-1 text-center text-lg font-medium min-h-10 mb-2">{configData.autor4}</p>
                <p className="mt-1 text-center text-lg font-medium min-h-10 mb-2">{configData.autor5}</p>
            </div>
        )
    ];

    return (
        <div className="bg-figma-white min-h-screen">
            <div className="z-10 fixed top-0 pt-1 text-figma-black text-xl w-full font-[Inter] bg-figma-stone-40">
                <div className="flex">
                    <button onClick={() => setShowHelp(false)}>
                        <svg className="w-14 my-auto" width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="15.8669" cy="15.5" r="10.5" stroke="#0B1F42" />
                            <path d="M13.1711 12.8945C13.1711 12.8945 13.0495 10.1379 15.952 10.1379C15.952 10.1379 18.5634 10.1379 18.5635 12.8945C18.5635 15.5788 15.8428 15.5304 15.8428 18.1294" stroke="#0B1F42" strokeLinecap="round" />
                            <path d="M15.9026 20.5477V20.8621" stroke="#0B1F42" strokeLinecap="round" />
                        </svg>
                    </button>
                    <div className="grow flex items-center justify-center pr-4">
                        <h1 className="font-bold text-lg mt-0.5">{configData.helpHeadlineText}</h1>
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
                {Object.keys(tabContent).map((tab, index) => (
                    <button key={tab} className={`text-base font-bold text-figma-black mt-1 px-4 w-1/4 pt-1 pb-1 ${activeTab === index
                        ? 'bg-figma-white rounded-t-lg'
                        : 'bg-figma-stone-40'}`}
                        onClick={() => setActiveTab(index)} >
                        {configData.helpTabsName[index]}
                    </button>
                ))}
            </div>
            <div className="mt-12 pt-12 pb-16 max-w-[40rem] mx-auto md:mt-16">
                {tabContent[activeTab]}
            </div>
        </div >
    );
}
