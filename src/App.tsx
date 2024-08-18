import { useState } from "react";
import WelcomeSite from "./WelcomeSite"
import GameLoop from "./GameLoop";
import EndScreen from "./EndScreen";



function App() {
  const [showWelcomeSite, setShowWelcomeSite] = useState(true);
  const [endGame, setEndGame] = useState(false);

  //prompr user if they want to exit the site => loose game progress
  window.addEventListener('beforeunload', function(e) {
    if (!showWelcomeSite) e.preventDefault();
  });
  return (
    <>
      {showWelcomeSite && <WelcomeSite setShowWelcomeSite={setShowWelcomeSite} />}
      {!showWelcomeSite && <GameLoop isLoopRunnig={showWelcomeSite} SetEndGame={setEndGame} />}
      {endGame && <EndScreen setShowWelcomeSite={setShowWelcomeSite} />}
    </>
  )
}

export default App
