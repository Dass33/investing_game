import { useState } from "react";
import WelcomeSite from "./WelcomeSite"
import GameLoop from "./GameLoop";
import EndScreen from "./EndScreen";



function App() {
  const [showWelcomeSite, setShowWelcomeSite] = useState(true);
  const [endGame, setEndGame] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear());
  const [totalScore, setTotalScore] = useState(0);

  //prompt user if they want to exit the site => loose game progress
  window.addEventListener('beforeunload', function(e) {
    if (!showWelcomeSite) e.preventDefault();
  });
  return (
    <>
      {showWelcomeSite && <WelcomeSite setShowWelcomeSite={setShowWelcomeSite} />}
      {!showWelcomeSite && !endGame && <GameLoop SetEndGame={setEndGame} year={year} setYear={setYear} setTotalScore={setTotalScore} />}
      {endGame && <EndScreen setShowWelcomeSite={setShowWelcomeSite} setEndGame={setEndGame} totalScore={totalScore} />}
    </>
  )
}

export default App
