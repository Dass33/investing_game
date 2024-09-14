import WelcomeSite from "./WelcomeSite"
import GameLoop from "./GameLoop";
import EndScreen from "./EndScreen";
import { useGame } from "./GameContext";
import { GameLoopProvider } from "./GameLoopContext";


function App() {
    const { showWelcomeSite, endGame } = useGame();



    //prompt user if they want to exit the site => loose game progress
    window.addEventListener('beforeunload', function(e) {
        if (!showWelcomeSite) e.preventDefault();
    });
    return (
        <>
            {showWelcomeSite && <WelcomeSite />}
            <GameLoopProvider>
                {!showWelcomeSite && !endGame && <GameLoop />}
            </GameLoopProvider>
            {endGame && <EndScreen />}
        </>
    )
}

export default App
