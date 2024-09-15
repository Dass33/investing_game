import { useState, useEffect } from "react";
import { getJsObjects } from "./fetchJson";
import { useGame } from "./GameContext";

interface scenarios {
    baseGame: string;
    random: string;
    scenarioName: string;
    menuText: string;
    eventOrder: string[];
    scenarioLength: number;
    howToPlay: string;
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
        return <h1 className="text-center mt-36 lg:mt-56 ">Loading...</h1>;
    }
    return (
        <div className="bg-figma-black h-screen relative text-white">
            <svg className="h-full w-full absolute px-11 py-8 z-0" width="331" height="614" viewBox="0 0 331 614" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 0.808472V612.894" stroke="#721C7A" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M48.0264 0.808472V612.894" stroke="#721C7A" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M95.0518 0.808472V612.894" stroke="#721C7A" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M142.078 0.808472V612.894" stroke="#721C7A" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M189.104 0.808472V612.894" stroke="#721C7A" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M236.13 0.808472V612.894" stroke="#721C7A" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M283.157 0.808472V612.894" stroke="#721C7A" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M330.183 0.808472V612.894" stroke="#721C7A" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <img src="investing_game/cover.svg" alt="placeholder" className="mx-auto pt-28 relative z-10"></img>
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

    if (!scenariosData) {
        return <h1 className="text-center mt-36 lg:mt-56 ">Loading...</h1>;
    }

    return (
        <>
            <div className="text-center mt-24 lg:mt-56 ">
                <h1 className="text-5xl mb-8 lg:text-8xl">Instrukce</h1>
                <p className="text-xl lg:text-3xl font-light px-6"
                    dangerouslySetInnerHTML={{
                        __html: scenariosData[gameMode].howToPlay,
                    }}
                ></p>
            </div>
            <div className="absolute bottom-8 w-full">
                <button className="block mx-auto rounded-lg py-4 -py-8 px-14 hover:scale-110 duration-200" onClick={() => setShowWelcomeSite(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 5 24 14" strokeWidth={1.5} stroke="currentColor" className="w-32">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                    </svg>
                </button>
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
