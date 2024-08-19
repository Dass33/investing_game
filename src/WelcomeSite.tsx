import { useState, useEffect } from "react";
// import { getJsObjects } from "./fetchJson";

//index 0 is config, 1 events, 2 is products
// function getJson(index: number) {
//   const [instuctions, setInstructions] = useState<any>(null);
//
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const fetchedData = await getJsObjects();
//
//         if (fetchedData) setInstructions(fetchedData[index]);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setInstructions(null);
//       }
//     };
//     fetchData();
//   }, []);
//
//   if (instuctions) return instuctions;
// }

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
        <button className="block mt-28 mx-auto text-2xl lg:text-4xl border-black border-2 rounded-lg py-4 px-14 hover:scale-110 duration-200" onClick={() => props.setShowLandingSite(false)}>Spustit</button>
      </div>
    </>
  );
}

function InstructionSite(props: { setShowWelcomeSite: Function }) {
  // const instructions = getJson(1).howToPlay;
  return (
    <>
      <div className="text-center mt-36 lg:mt-56 ">
        <h1 className="text-4xl lg:text-8xl font-light ">Instrukce</h1>
        <p className="text-xl lg:text-3xl font-light ">ahoj</p>
      </div>
      <div className="lg:inline mx-auto">
        <button className="block mt-28 mx-auto text-2xl lg:text-4xl border-black border-2 rounded-lg py-4 px-14 hover:scale-110 duration-200" onClick={() => props.setShowWelcomeSite(false)}>Spustit</button>
      </div>
    </>
  );
}

function WelcomeSite(props: { setShowWelcomeSite: Function }) {
  const [showLandingSite, setShowLandingSite] = useState('true');
  return (
    <>
      {showLandingSite && <LandingSite setShowLandingSite={setShowLandingSite} />} {!showLandingSite && <InstructionSite setShowWelcomeSite={props.setShowWelcomeSite} />} </>
  );
}

export default WelcomeSite;
