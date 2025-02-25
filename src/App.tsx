import WelcomeSite from "./WelcomeSite"
import GameLoop from "./GameLoop";
import EndScreen from "./EndScreen";
import { useGame } from "./GameContext";
import { GameLoopProvider } from "./GameLoopContext";


function App() {
    const { showWelcomeSite, endGame } = useGame();



    return (
        <div className="select-none">
            <GameLoopProvider>
                {showWelcomeSite && <WelcomeSite />}
                {!showWelcomeSite && !endGame && <GameLoop />}
                {endGame && <EndScreen />}
            </GameLoopProvider>
        </div>
    )
}

export default App
