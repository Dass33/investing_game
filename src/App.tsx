import { useState, useEffect } from "react";
import WelcomeSite from "./WelcomeSite"
import { getJsObjects } from "./fetchJson";
import GameLoop from "./GameLoop";

function getJson() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await getJsObjects();
        if (fetchedData) setData(fetchedData[0]);
      } catch (error) {
        console.error('Error fetching data:', error);
        setData(null);
      }
    };
    fetchData();
  }, []);

  if (data) return data;
  // else console.error('No data fetched');
}


function App() {
  const [showWelcomeSite, setShowWelcomeSite] = useState(true);
  const [endGame, setEndGame] = useState(false);

  //prompr user if they want to exit the site => loose game progress
  // window.addEventListener('beforeunload', function(e) {
  //   if (!showWelcomeSite) e.preventDefault();
  // });
  return (
    <>
      {showWelcomeSite && <WelcomeSite setShowWelcomeSite={setShowWelcomeSite} />}
      {!showWelcomeSite && <GameLoop isLoopRunnig={showWelcomeSite} SetEndGame={setEndGame} />}
      {/*endGame && <EndScreen />*/}
    </>
  )
}

export default App
