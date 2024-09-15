import { useEffect, useState, useRef, createContext, MutableRefObject, useContext } from "react";
import { getJsObjects } from "./fetchJson";

interface config {
    imgages: string;
    startingMoney: number;
    startingProducts: Array<string>;
    luckLowerBound: number;
    luckUpperBound: number;
    roundsAmount: number;
    howToPlay: string;
}
interface events {
    baseGame: string;
    advancedGame: string;
    eventName: string;
    eventText: string;
    eventValue: number;
    IMG: string;
}

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

interface scenarios {
    baseGame: string;
    random: string;
    scenarioName: string;
    menuText: string;
    scenarioLength: number;
    howToPlay: string;
    eventOrder: string[];
}
interface GameLoopState {
    configData: config,
    eventData: events[],
    scenarios: scenarios[],
    productData: products[],
    setProductData: Function,
    showSite: number,
    setShowSite: Function,
    numberOfSites: number,
    liquidity: number | null,
    setLiquidity: Function,
    portfolioItems: products[],
    setPortfolioItems: Function,
    newPortfolioItems: products[],
    setNewPortfolioItems: Function,
    oldPortfolioItems: products[],
    setOldPortfolioItems: Function,
    nextRound: boolean,
    setNextRound: Function,
    portfolioItemCount: { [key: string]: number },
    setPortfolioItemCount: Function,
    eventIndex: number,
    setEventIndex: Function,
    economySummary: boolean,
    setEconomySummary: Function,
    isInitialized: MutableRefObject<boolean>,
    figmaColors: string[]
}

const GameLoopContext = createContext<GameLoopState | undefined>(undefined);

// Index 0 is config, 1 events, 2 is products, 3 is scenanrios
function useJson(index: number) {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedData = await getJsObjects();
                if (fetchedData) {
                    setData(fetchedData[index]);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setData(null);
            }
        };
        fetchData();
    }, [index]);

    return [data, setData];
}

export const GameLoopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [configData] = useJson(0);
    const [eventData] = useJson(1);
    const [scenarios] = useJson(3);
    const [productData, setProductData] = useJson(2);
    const [showSite, setShowSite] = useState(0);
    const numberOfSites = 1;
    const [liquidity, setLiquidity] = useState<number | null>(() => configData?.startingMoney || 0);
    const [portfolioItems, setPortfolioItems] = useState<products[]>([]);
    const [newPortfolioItems, setNewPortfolioItems] = useState<products[]>([]);
    const [oldPortfolioItems, setOldPortfolioItems] = useState<products[]>([]);
    const [nextRound, setNextRound] = useState(false);
    const [portfolioItemCount, setPortfolioItemCount] = useState<{ [key: string]: number }>({});
    const [eventIndex, setEventIndex] = useState<number>(0);
    const [economySummary, setEconomySummary] = useState(false);
    const isInitialized = useRef(false);
    const figmaColors = ['figma-honey', 'figma-carrots', 'figma-berries', 'figma-rose', 'figma-lavender', 'figma-pool', 'figma-teal', 'figma-lime', 'figma-forest']

    return (
        <GameLoopContext.Provider value={{ configData, eventData, scenarios, productData, setProductData, showSite, setShowSite, numberOfSites, liquidity, setLiquidity, portfolioItems, setPortfolioItems, newPortfolioItems, setNewPortfolioItems, oldPortfolioItems, setOldPortfolioItems, nextRound, setNextRound, portfolioItemCount, setPortfolioItemCount, eventIndex, setEventIndex, economySummary, setEconomySummary, isInitialized, figmaColors }}>
            {children}
        </GameLoopContext.Provider>
    );
};

export const useGameLoop = () => {
    const context = useContext(GameLoopContext);
    if (!context) {
        throw new Error('useGameLoop must be used within a GameProvider');
    }
    return context;
}
