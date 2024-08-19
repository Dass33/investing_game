import { useState, useEffect } from "react";
import { getJsObjects } from "./fetchJson";

//index 0 is config, 1 events, 2 is products
function getJson(index: number) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await getJsObjects();
        console.log(await getJsObjects());
        if (fetchedData) setData(fetchedData[index]);
      } catch (error) {
        console.error('Error fetching data:', error);
        setData(null);
      }
    };
    fetchData();
  }, []);

  if (data) return data;
}

function GameLoop(param: { isLoopRunnig: boolean, SetEndGame: Function }) {
  const productData = getJson(2);
  return (
    <>
      {/*continue here, add elements, checks...*/}
      <h1>{productData[2].productName}</h1>
      <h1>{param.isLoopRunnig}</h1>
    </>
  );
}

export default GameLoop;
