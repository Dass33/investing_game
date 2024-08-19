import { useState, useEffect } from "react";
import { getJsObjects } from "./fetchJson";

interface config {
  imgages: string;
  startingMoney: number; startingProducts: Array<string>;
  luckLowerBound: number;
  luckUpperBound: number;
  roundsAmount: number;
  howToPlay: string;
}

function useJson(index: number) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await getJsObjects();
        if (fetchedData) setData(fetchedData[index]);
      } catch (error) {
        console.error('Error fetching data:', error);
        setData(null);
      }
    };
    fetchData();
  }, [index]);

  return data;
}

function LandingSite(props: { setShowLandingSite: Function }) {
  return (
    <>
      <div className="text-center mt-36 lg:mt-56 ">
        <h1 className="text-5xl lg:text-[12rem] font-bold font-mono leading-[0.7]">Investiční</h1>
        <h1 className="text-4xl lg:text-8xl font-light ">Hra</h1>
      </div>
      <div className="lg:inline mx-auto">
        <img src="../src/assets/react.svg" alt="cartoon bull" className="h-44 block lg:pl-20 lg:inline mx-auto lg:float-start text-center  my-20 lg:my-0 lg:mb-40"></img>
        <img src="../src/assets/react.svg" alt="cartoon bull" className="h-44 hidden lg:pr-20 lg:inline lg:float-right text-center lg:mb-40"></img>
        <button className="block mt-28 mx-auto text-2xl lg:text-4xl border-black border-2 rounded-lg py-4 px-14 hover:scale-110 duration-200"
          onClick={() => props.setShowLandingSite(false)}>Spustit</button>
      </div>
    </>
  );
}

function InstructionSite(props: { setShowWelcomeSite: Function }) {
  const instructionsData: config = useJson(0);

  if (!instructionsData) {
    return <h1 className="text-center mt-36 lg:mt-56 ">Loading...</h1>;
  }

  return (
    <>
      <div className="text-center mt-24 lg:mt-56 ">
        <h1 className="text-5xl mb-8 lg:text-8xl">Instrukce</h1>
        <p className="text-xl lg:text-3xl font-light px-6"
          dangerouslySetInnerHTML={{
            __html: instructionsData.howToPlay,
          }}
        ></p>
      </div>
      <div className="absolute bottom-8 w-full">
        <button className="block mx-auto rounded-lg py-4 -py-8 px-14 hover:scale-110 duration-200" onClick={() => props.setShowWelcomeSite(false)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 5 24 14" strokeWidth={1.5} stroke="currentColor" className="w-32">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
          </svg>
        </button>
      </div>
    </>
  );
}

function WelcomeSite(props: { setShowWelcomeSite: Function }) {
  const [showLandingSite, setShowLandingSite] = useState(true);

  return (
    <>
      {showLandingSite && <LandingSite setShowLandingSite={setShowLandingSite} />}
      {!showLandingSite && <InstructionSite setShowWelcomeSite={props.setShowWelcomeSite} />}
    </>
  );
}

export default WelcomeSite;
