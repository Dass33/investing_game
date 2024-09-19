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
    timeToSell: number;
    sellingForLastRounds: number;
    diceValues: number[];
}

function EndScreen() {
    const { totalScore, gameMode } = useGame();
    const { portfolioItems, figmaColors, scenarios, liquidity } = useGameLoop();
    const groupedItems = portfolioItems.reduce((acc: { [key: string]: products[] }, item) => {
        if (!acc[item.productName]) {
            acc[item.productName] = [];
        }
        acc[item.productName].push(item);
        return acc;
    }, {});

    const soloGame = (scenarios[gameMode].random === "TRUE");
    return (
        <>
            <div className="text-center text-figma-white bg-figma-black h-screen">
                <svg
                    className="h-screen w-full absolute pr-5 pl-7 py-8 z-0"
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <pattern id="verticalLines" patternUnits="userSpaceOnUse" width="47" height="100%">
                            <path d="M0 0V800%" stroke="#721C7A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#verticalLines)" />
                </svg>
                <div className="mx-auto max-w-[40rem]">
                    <div className="flex relative z-10 justify-center gap-8 pt-20 md:pt-24 lg:pt-28 mb-20">
                        <h1 className="text-2xl my-auto font-medium">SKÓRE</h1>
                        <h1 className="text-6xl leading-[0.7] tracking-widest">{totalScore}</h1>
                    </div>
                    {Object.entries(groupedItems).map(([productName, items]) => {
                        let value = 0;
                        items.forEach(item => value += Number(item.cost));

                        return (
                            <div className={`relative z-10 mt-1 mx-3 pl-3 pr-6 flex text-figma-black text-base rounded font-bold bg-${figmaColors[items[0].color]}`} key={productName}>

                                <h3 className="my-auto flex-1 break-words text-base text-left grow">{productName}</h3>
                                <h3 className="w-16 my-auto text-lg font-bold text-right">{value}</h3>
                            </div>
                        );
                    })}
                    <div className="relative z-10 mt-1 mx-3 pl-3 pr-6 flex text-figma-black text-base rounded font-bold bg-figma-lime">

                        <h3 className="my-auto flex-1 break-words text-base text-left grow">Hotovost</h3>
                        <h3 className="w-16 my-auto text-lg font-bold text-right">{liquidity}</h3>
                    </div>

                    <h1 className="text-lg font-medium mt-10 relative z-10">Gratulujeme. Nějaká větička na závěr.</h1>
                    {soloGame && <div className="z-10 w-full flex mt-8 justify-center font-[Inter] font-bold">
                        <button className='bg-figma-black relative z-10 bg flex rounded-full hover:scale-110 duration-200 text-white border-white border py-2 px-4 m-2'
                            onClick={() => window.location.replace(window.location.href)}>  {/*temporary way to restart the game*/}


                            <svg className="my-auto" width="19" height="15" viewBox="0 0 19 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.86694 7.5H17.8669M17.8669 7.5L11.8669 1.5M17.8669 7.5L11.8669 13.5" stroke="#FFFDFD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="mx-3 text-lg">Hrát znovu</span>
                        </button>
                    </div>}
                    <h3 className="text-center text-[11px] relative z-10 mt-4">2024 Skoala</h3>
                </div>
            </div>
        </>
    );
}

export default EndScreen;
