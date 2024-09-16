import { useState, useEffect } from "react";
import { getJsObjects } from "./fetchJson";
import { useGame } from "./GameContext";

interface scenarios {
    baseGame: string;
    random: string;
    scenarioName: string;
    menuText: string;
    scenarioLength: number;
    howToPlay: string;
    howToPlay2: string;
    IMG: string;
    IMG2: string;
    eventOrder: string[];
}

function useJson(index: number) {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedData = await getJsObjects();
                if (fetchedData) setData(fetchedData[index]);
            } catch (error) {
                console.error('Error fetching data:', error);
                setData(null);
            }
        };
        fetchData();
    }, [index]);

    return data;
}

function LandingSite(props: { setShowLandingSite: Function }) {
    const scenariosData: scenarios[] = useJson(3);
    const { setGameMode } = useGame();
    if (!scenariosData) {
        return (
            <div className="bg-figma-black h-screen">
                <h1 className="text-center pt-36 lg:mt-56 text-white">Loading...</h1>
            </div>
        );
    }
    return (
        <div className="bg-figma-black h-screen relative text-white">
            <svg className="h-full w-full absolute px-11 py-8 z-0" width="331" height="614" viewBox="0 0 331 614" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 0.808472V612.894" stroke="#721C7A" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M48.0264 0.808472V612.894" stroke="#721C7A" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M95.0518 0.808472V612.894" stroke="#721C7A" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M142.078 0.808472V612.894" stroke="#721C7A" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M189.104 0.808472V612.894" stroke="#721C7A" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M236.13 0.808472V612.894" stroke="#721C7A" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M283.157 0.808472V612.894" stroke="#721C7A" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M330.183 0.808472V612.894" stroke="#721C7A" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <img src="cover.svg" alt="placeholder" className="mx-auto pt-28 relative z-10"></img>
            <div className="relative z-10">
                <select
                    className="block mx-auto text-lg lg:text-2xl bg-figma-black border-figma-white border rounded-lg py-4 px-6 hover:scale-110 duration-200 mt-16"
                    onChange={(e) => setGameMode(e.target.value)}
                >
                    {scenariosData.map((scenario, index) => (
                        <option key={index} value={index}>{scenario.scenarioName}</option>
                    ))}
                </select>

                <button className="block mt-12 mx-auto text-3xl bg-figma-black lg:text-4xl border-white border rounded-full py-2 px-7 font-bold hover:scale-110 duration-200"
                    onClick={() => props.setShowLandingSite(false)}>Hrát</button>
            </div>
            <h3 className="text-center text-[11px] relative z-10 mt-8">2024 Skoala</h3>
        </div>
    );
}

function InstructionSite() {
    const scenariosData: scenarios[] = useJson(3);
    const { gameMode, setShowWelcomeSite } = useGame();
    const [pageOne, setPageOne] = useState(true);

    if (!scenariosData) {
        return (
            <div className="bg-figma-black h-screen">
                <h1 className="text-center pt-36 lg:mt-56 text-white">Loading...</h1>
            </div>
        );
    }

    if (pageOne) return (
        <div className="bg-figma-black h-screen text-white">
            <img src={`${scenariosData[gameMode].IMG}`} alt="placeholder" className="mx-auto pt-16 relative z-10"></img>
            <p className="text-center pt-8 lg:mt-56 text-xl lg:text-3xl font-light px-6">{scenariosData[gameMode].howToPlay}</p>
            <div className="absolute bottom-10 w-full">
                <button className="block mx-auto rounded-lg py-4 -py-8 px-14 hover:scale-110 duration-200" onClick={() => setPageOne(false)}>
                    <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.875488" y="0.952637" width="39" height="39" rx="19.5" fill="#0B1F42" />
                        <rect x="0.875488" y="0.952637" width="39" height="39" rx="19.5" stroke="white" />
                        <path d="M12.3755 20.4526H28.3755M28.3755 20.4526L22.3755 14.4526M28.3755 20.4526L22.3755 26.4526" stroke="#FFFDFD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
        </div>
    );
    else return (
        <>
            <div className="bg-figma-black h-screen text-white">
                <img src={`${scenariosData[gameMode].IMG2}`} alt="placeholder" className="mx-auto pt-16 relative z-10"></img>
                <p className="text-center pt-8 lg:mt-56 text-xl lg:text-3xl font-light px-6">{scenariosData[gameMode].howToPlay2}</p>
                <div className="absolute bottom-14 w-full">
                    <button className="mx-auto border border-white rounded-full flex pl-6 pr-10" onClick={() => setShowWelcomeSite(false)}>
                        <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.3755 20.4526H28.3755M28.3755 20.4526L22.3755 14.4526M28.3755 20.4526L22.3755 26.4526" stroke="#FFFDFD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="my-auto">Začít investovat</span>
                    </button>
                </div>
            </div>
        </>
    );

}

function WelcomeSite() {
    const [showLandingSite, setShowLandingSite] = useState(true);

    return (
        <>
            {showLandingSite && <LandingSite setShowLandingSite={setShowLandingSite} />}
            {!showLandingSite && <InstructionSite />}
        </>
    );
}

export default WelcomeSite;
