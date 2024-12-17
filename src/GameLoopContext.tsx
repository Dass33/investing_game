import { useEffect, useState, useRef, createContext, MutableRefObject, useContext } from "react";
import { getJsObjects } from "./fetchJson";

interface config {
    imgages: string;
    startingMoney: number;
    startingProducts: Array<string>;
    luckLowerBound: number;
    luckUpperBound: number;
    roundsAmount: number;
    portfolioTutorialText: string;
    portfolioTutorial_IMG: string;
    earningsTutorialText: string;
    earningsTutorial_IMG: string;
    newsTutorialText: string;
    newsTutorial_IMG: string;
    copryight: string;
    crisisHeadlineText: string;
    crisisBankruptcyText: string;
    crisisNoBankruptcyText: string;
    buttonPlayText: string;
    buttonRestartText: string;
    buttonStartText: string;
    buttonEarningsText: string;
    buttonNewsText: string;
    buttonPortfolioText: string;
    buttonEndRoundText: string;
    portfolioTitleText: string;
    endRoundText: string;
    endRound_IMG: string;
    reallySell_1_Text: string;
    reallySell_2_Text: string;
    reallySell_IMG: string;
    noBudgetText: string;
    noBudget_IMG: string;
    buttonYesText: string;
    buttonNoText: string;
    scoreText: string;
    endText: string;
    cashText: string;
    campaignInstructionText: string;
    campaignInstructionText2: string;
    campaignInstruction_IMG: string;
    buySellNewsText: string;
    earningsText: string;
    earningsColonText: string;
    sellPortfolioText: string;
    earningsTutorailPromptText: string;
    crisisNewsHeadlineText: string;
    earningsSumText: string;
    helpHeadlineText: string;
    helpHowToPlayText: string;
    roundText: string;
    roundsText: string;
    yourEarningsText: string;
    sellInRoundsText: string;
    endGame: string;
    helpTabsName: string[];
    helpGoalText: string;
    helpTipHeadline1: string;
    helpTipText1: string;
    toSell: string;
    toBuy: string;
    riskHeadline: string;
    investorType: string[];
    investorTypeDescription: string[];
    baseRisk: number;
    incrementRisk: number;
    crisisButton: string;
    newsHeadline: string;
    earningsProperty: string;
    securityProperty: string;
    liquidityProperty: string;
}
interface events {
    baseGame: string;
    advancedGame: string;
    eventName: string;
    eventText: string;
    eventValue: number;
    IMG: string;
    color: number;
    bankrouptcy: string;
}

interface products {
    incomeChanges: string;
    productName: string;
    riskScore: number;
    productDescription: string;
    color: number;
    cost: number;
    fixedIncome: number;
    minToPreventBankruptcy: number;
    timeToSell: number;
    sellingForLastRounds: number;
    diceValues: number[];
    autoSellIn: number;
    invested: number;
    ID: number;
    potentialEarnings: number;
    security: number;
    liquidity: number;
}

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
    nextRound: boolean,
    setNextRound: Function,
    eventIndex: number,
    setEventIndex: Function,
    economySummary: boolean,
    setEconomySummary: Function,
    isInitialized: MutableRefObject<boolean>,
    figmaColors: string[],
    roundStart: boolean,
    setRoundStart: Function,
    earningsTutorial: boolean,
    setEarningsTutorial: Function,
    newsTutorial: boolean,
    setNewsTutorial: Function,
    portfolioTutorial: boolean,
    setPortfolioTutorial: Function,
    showPortfolio: boolean,
    setShowPortfolio: Function,
    showEarnings: boolean,
    setShowEarnings: Function,
    economyHistory: number[],
    setEconomyHistory: Function,
    startingProductData: products[],
    showHelp: boolean,
    setShowHelp: Function,
    showBankruptcy: boolean,
    setShowBankruptcy: Function,
    showEvent: boolean,
    setShowEvent: Function,
    setProductHistory: Function,
    productHistory: [products[]],
    rolledThisBancrupcy: boolean,
    setRolledThisBancrupcy: Function,
    prevRoundLiquidity: number | null,
    setPrevRoundLiquidity: Function,
    portfolioRisk: number,
    setPortfolioRisk: Function,
    rolledDices: number[],
    setRolledDices: Function,
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
    const hideTutorial = localStorage.getItem("tutorial") == "false";

    const [configData] = useJson(0);
    const [eventData] = useJson(1);
    const [scenarios] = useJson(3);
    const [productData, setProductData] = useJson(2);
    const [startingProductData] = useJson(2);
    const [showSite, setShowSite] = useState(0);
    const numberOfSites = 1;
    const [liquidity, setLiquidity] = useState<number | null>(() => configData?.startingMoney || 0);
    const [nextRound, setNextRound] = useState(false);
    const [eventIndex, setEventIndex] = useState<number>(0);
    const [economySummary, setEconomySummary] = useState(false);
    const isInitialized = useRef(false);
    const figmaColors = ['figma-honey', 'figma-winter', 'figma-berries', 'figma-lavender', 'figma-pool', 'figma-teal', 'figma-pale', 'figma-indigo-40']
    const [roundStart, setRoundStart] = useState(true);
    const [earningsTutorial, setEarningsTutorial] = useState(hideTutorial ? false : true);
    const [newsTutorial, setNewsTutorial] = useState(hideTutorial ? false : true);
    const [portfolioTutorial, setPortfolioTutorial] = useState(hideTutorial ? false : true);
    const [showPortfolio, setShowPortfolio] = useState(false);
    const [showEarnings, setShowEarnings] = useState(true);
    const [economyHistory, setEconomyHistory] = useState<number[]>([]);
    const [productHistory, setProductHistory] = useState<[products[]]>([[]]);
    const [showHelp, setShowHelp] = useState(false);
    const [showBankruptcy, setShowBankruptcy] = useState(false);
    const [showEvent, setShowEvent] = useState(false);
    const [rolledThisBancrupcy, setRolledThisBancrupcy] = useState(false);
    const [prevRoundLiquidity, setPrevRoundLiquidity] = useState<number | null>(() => configData?.startingMoney || 0);
    const [portfolioRisk, setPortfolioRisk] = useState(1);
    const [rolledDices, setRolledDices] = useState<number[]>([]);

    return (
        <GameLoopContext.Provider value={{
            configData,
            eventData,
            scenarios,
            productData, setProductData,
            showSite, setShowSite,
            numberOfSites,
            liquidity, setLiquidity,
            nextRound, setNextRound,
            eventIndex, setEventIndex,
            economySummary, setEconomySummary,
            isInitialized,
            figmaColors,
            roundStart, setRoundStart,
            earningsTutorial, setEarningsTutorial,
            newsTutorial, setNewsTutorial,
            portfolioTutorial, setPortfolioTutorial,
            showEarnings, setShowEarnings,
            showPortfolio, setShowPortfolio,
            setEconomyHistory, economyHistory,
            startingProductData,
            showHelp, setShowHelp,
            showBankruptcy, setShowBankruptcy,
            productHistory, setProductHistory,
            rolledThisBancrupcy, setRolledThisBancrupcy,
            prevRoundLiquidity, setPrevRoundLiquidity,
            portfolioRisk, setPortfolioRisk,
            showEvent, setShowEvent,
            rolledDices, setRolledDices,
        }}>
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
