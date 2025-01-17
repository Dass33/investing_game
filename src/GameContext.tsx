import React, { useState, createContext, useContext } from "react";

interface GameState {
    showWelcomeSite: boolean,
    setShowWelcomeSite: Function,
    endGame: boolean,
    setEndGame: Function,
    round: number,
    setRound: Function,
    totalScore: number,
    setTotalScore: Function,
    gameMode: number,
    setGameMode: Function,
    showLandingSite: boolean,
    setShowLandingSite: Function,
    portfolioRiskHistory: number[],
    setPortfolioRiskHistory: Function
}

const GameContext = createContext<GameState | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [showWelcomeSite, setShowWelcomeSite] = useState(true);
    const [endGame, setEndGame] = useState(false);
    const [round, setRound] = useState(1);
    const [totalScore, setTotalScore] = useState(0);
    const [gameMode, setGameMode] = useState(0);
    const [showLandingSite, setShowLandingSite] = useState(true);
    const [portfolioRiskHistory, setPortfolioRiskHistory] = useState([]);

    return (
        <GameContext.Provider value={{
            showWelcomeSite, setShowWelcomeSite,
            endGame, setEndGame,
            round, setRound,
            totalScore, setTotalScore,
            gameMode, setGameMode,
            showLandingSite, setShowLandingSite,
            portfolioRiskHistory, setPortfolioRiskHistory
        }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};
