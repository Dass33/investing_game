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
            <GameLoopProvider>
                {showWelcomeSite && <WelcomeSite />}
                {!showWelcomeSite && !endGame && <GameLoop />}
                {endGame && <EndScreen />}
            </GameLoopProvider>
        </>
    )
}

export default App
