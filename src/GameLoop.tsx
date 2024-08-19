import { useState, useEffect } from "react";
import { getJsObjects } from "./fetchJson";

interface config {
  imgages: string;
  startingMoney: number;
  startingProducts: Array<string>;
  luckLowerBound: number;
  luckUpperBound: number;
  roundsAmount: number;
  howToPlay: string;
}

interface products {
  baseGame: string;
  advancedGame: string;
  productName: string;
  productDescription: string;
  cost: number;
  minHoldingTime: number;
  timeToSell: number;
  fixedIncome: number;
  diceMultiplier: number;
  minDiceForProfit: number;
  IMG: string;
}

// Index 0 is config, 1 events, 2 is products
function useJson(index: number) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await getJsObjects();
        if (fetchedData) {
          setData(fetchedData[index]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setData(null);
      }
    };
    fetchData();
  }, [index]);

  return data;
}

function findCurrentProduct(item: string, portfolioItems: string[], productData: products[]) {
  const productIndex = productData.findIndex(product => product.productName === item);
  const count = portfolioItems.filter(product => product === item).length;
  console.log(portfolioItems);

  return [productIndex, count];
}

function TopBar({ liquidity, year }: { liquidity: number | null, year: number }) {
  if (liquidity === null) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="absolute top-0 py-1 text-3xl w-full bg-black/90 text-white">
      <p className="float-left px-2">{year}</p>
      <p className="float-right px-2">{liquidity}$</p>
    </div>
  );
}

function Portfolio({ portfolioItems, productData }: { portfolioItems: string[] | null, productData: products[] }) {
  const uniqueItems = Array.from(new Set(portfolioItems));

  return (
    <>
      <div className="mt-16">
        <h1 className="text-4xl text-center">Your Portfolio</h1>
        <hr className="w-64 mx-auto bg-black h-0.5 mt-1"></hr>
      </div>
      {uniqueItems?.map((item: string) => {
        const [currentProduct, count] = findCurrentProduct(item, portfolioItems!, productData);
        if (currentProduct !== -1 && count) {
          return (
            <div className="mt-8 mx-6" key={item}>
              <h2 className="text-3xl">{productData[currentProduct].productName}</h2>
              <div className="mt-2">
                <button className="border-black border-solid border-2 p-1 px-3 text-3xl rounded-full">
                  Sell | {count}
                </button>
                <span className="float-right text-3xl mt-2">${productData[currentProduct].cost}</span>
                <span className="float-right mr-3 text-3xl mt-2">+${productData[currentProduct].fixedIncome}</span>
              </div>
              <hr className="w-full mx-auto bg-black h-0.5 mt-3"></hr>
            </div>
          );
        }
        return null;
      })}
    </>
  );
}

function GameLoop({ SetEndGame }: { SetEndGame: Function }) {
  const configData: config = useJson(0);
  const productData: products[] = useJson(2);
  const [year] = useState(new Date().getFullYear());
  const [liquidity, setLiquidity] = useState<number | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<Array<string> | null>(null);

  useEffect(() => {
    if (configData) {
      setLiquidity(configData.startingMoney);
      setPortfolioItems(configData.startingProducts);
      // setPortfolioItems((prevItmes) => [...(prevItmes || []), 'Akcie']);
    }
  }, [configData]);

  if (!productData || liquidity === null) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <TopBar liquidity={liquidity} year={year} />
      <Portfolio portfolioItems={portfolioItems} productData={productData} />
    </>
  );
}

export default GameLoop;
