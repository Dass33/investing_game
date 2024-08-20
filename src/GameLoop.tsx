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

  return [productIndex, count];
}

function Portfolio({ portfolioItems, productData, setItemsToSell, itemsToSell }: { portfolioItems: string[] | null, productData: products[], setItemsToSell: Function, itemsToSell: string[] | null }) {
  const uniqueItems = Array.from(new Set(portfolioItems));

  return (
    <>
      <div className="mt-16">
        <h1 className="text-4xl text-center">Vaše portfolio</h1>
        <hr className="w-64 mx-auto bg-black h-0.5 mt-1"></hr>
      </div>
      {uniqueItems?.map((item: string) => {
        const [currentProductIndex, initialCount] = findCurrentProduct(item, portfolioItems!, productData);
        const [count, setCount] = useState(initialCount);
        const [amountToSell, setAmountToSell] = useState(0);

        if (currentProductIndex !== -1 && initialCount) {
          const currentProduct = productData[currentProductIndex];
          const isTimeToSellValid = currentProduct.timeToSell > -1;

          return (
            <div className="mt-8 mx-6" key={item}>
              <h2 className="text-3xl">
                {currentProduct.productName} <span className="float-right">{count}</span>
              </h2>
              <div className="mt-2 flex items-center justify-between">
                {/* Left side: Sell text and buttons */}
                <div className="flex items-center space-x-2">
                  <span className="text-3xl">Sell</span>
                  <button
                    className={`size-12 border-solid border-2 text-3xl rounded-lg flex items-center justify-center 
          ${isTimeToSellValid ? 'border-black text-black hover:bg-gray-200' : 'border-gray-400 text-gray-400 hover:cursor-not-allowed'}`}
                    onClick={() => {
                      if (isTimeToSellValid && count > 0) {
                        setItemsToSell((previousItems: string) => [...(previousItems || []), item]);

                        setCount(count - 1);
                        setAmountToSell(amountToSell + 1);
                      }
                    }}
                    disabled={!isTimeToSellValid}
                  >
                    +
                  </button>
                  <span className="text-2xl">{amountToSell}</span>
                  <button
                    className={`size-12 border-solid border-2 text-3xl rounded-lg flex items-center justify-center 
          ${isTimeToSellValid ? 'border-black text-black hover:bg-gray-200' : 'border-gray-400 text-gray-400 hover:cursor-not-allowed'}`}
                    onClick={() => {
                      if (isTimeToSellValid && amountToSell > 0) {
                        const indexToSell = itemsToSell?.findIndex(toSellItem => toSellItem === item);

                        if (indexToSell !== -1) {
                          const newItemsToSell = [...itemsToSell!];
                          newItemsToSell.splice(indexToSell!, 1); setItemsToSell(newItemsToSell);
                        }

                        setCount(count + 1);
                        setAmountToSell(amountToSell - 1);
                      }
                    }}
                    disabled={!isTimeToSellValid}
                  >
                    -
                  </button>
                </div>

                <div className="flex space-x-3 text-3xl">
                  <span>+${currentProduct.fixedIncome}</span>
                  <span>${currentProduct.cost}</span>
                </div>
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

function StockExchange({ portfolioItems, productData, setItemsToSell, itemsToSell }: { portfolioItems: string[] | null, productData: products[], setItemsToSell: Function, itemsToSell: string[] | null }) {
  return (
    <>
      <div className="mt-16">
        <h1 className="text-4xl text-center">Stock Exchange</h1>
        <hr className="w-64 mx-auto bg-black h-0.5 mt-1"></hr>
      </div>
      {productData.map((item: products) => {

        return (
          <div className="mt-8 mx-6" key={item.productName}>
            <h2 className="text-3xl"> {item.productName} </h2>
          </div>

        );
      })}
    </>
  );
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

function NavigationArrows({ showSite, setShowSite }: { showSite: number, setShowSite: Function }) {

  return (
    <div className="fixed flex justify-center items-center w-full bottom-12 space-x-3">
      <button className={`inline rounded-lg hover:scale-110 duration-200 ${showSite <= 0 ? 'text-black/60' : 'text-black'}`}
        onClick={() => setShowSite(showSite - 1)} disabled={showSite <= 0}>

        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 5 24 14" strokeWidth={1.5} stroke="currentColor" className="w-20">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
      </button>
      <button className="inline rounded-lg hover:scale-110 duration-200" onClick={() => setShowSite(showSite + 1)}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 5 24 14" strokeWidth={1.5} stroke="currentColor" className="w-20">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
      </button>
    </div>
  );
}

function GameLoop({ SetEndGame }: { SetEndGame: Function }) {
  const configData: config = useJson(0);
  const productData: products[] = useJson(2);
  const [year] = useState(new Date().getFullYear());
  const [showSite, setShowSite] = useState(0);
  const [liquidity, setLiquidity] = useState<number | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<Array<string> | null>(null);
  const [itemsToSell, setItemsToSell] = useState<Array<string> | null>(null);

  useEffect(() => {
    if (configData) {
      setLiquidity(configData.startingMoney);
      setPortfolioItems(configData.startingProducts);
      // testing code
      // setPortfolioItems((prevItmes) => [...(prevItmes || []), 'Akcie', 'Zlato', 'Podnikání']);
    }
  }, [configData]);

  if (!productData || liquidity === null) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <TopBar liquidity={liquidity} year={year} />
      <NavigationArrows showSite={showSite} setShowSite={setShowSite} />
      {showSite === 0 && <Portfolio portfolioItems={portfolioItems} productData={productData} setItemsToSell={setItemsToSell} itemsToSell={itemsToSell} />}
      {showSite === 1 && <StockExchange portfolioItems={portfolioItems} productData={productData} setItemsToSell={setItemsToSell} itemsToSell={itemsToSell} />}
    </>
  );
}

export default GameLoop;
