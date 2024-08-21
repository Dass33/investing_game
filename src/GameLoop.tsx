import { useState, useEffect, useRef } from "react";
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

function Portfolio({ portfolioItems, setNewPortfolioItems, newPortfolioItems, productData, liquidity, setLiquidity, oldPortfolioItems }:
  {
    portfolioItems: string[] | null, setNewPortfolioItems: Function, newPortfolioItems: string[] | null, productData: products[],
    liquidity: number, setLiquidity: Function, oldPortfolioItems: string[] | null
  }) {
  const uniquePortfolioItems = Array.from(new Set(portfolioItems));

  const productsInPortfolio = productData.filter(product => uniquePortfolioItems.includes(product.productName));
  const productsNotInPortfolio = productData.filter(product => !uniquePortfolioItems.includes(product.productName));

  const combinedProductList = [...productsInPortfolio, ...productsNotInPortfolio];


  return (
    <>
      <div className="mt-16">
        <h1 className="text-4xl text-center">Vaše portfolio</h1>
        <hr className="w-64 mx-auto bg-black h-0.5 mt-1"></hr>
      </div>
      {combinedProductList.map((product) => {
        const initialCount = portfolioItems!.filter(item => item === product.productName).length;
        const oldInitialCount = oldPortfolioItems ? oldPortfolioItems.filter((item: string) => item === product.productName).length
          : initialCount;
        const [count, setCount] = useState(initialCount);
        const [amountToSell, setAmountToSell] = useState(0);

        const isTimeToSellValid = product.timeToSell > -1;

        return (
          <div className="mt-8 mx-6" key={product.productName}>
            <h2 className="text-3xl">
              {product.productName}
              <span className="float-right">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </span>
            </h2>
            <div className="mt-2 flex items-center justify-between">

              <div className="flex items-center space-x-2">
                <button
                  className={`size-12 border-solid border-2 text-3xl rounded-lg flex items-center justify-center 
                    ${(isTimeToSellValid || count > oldInitialCount) && count > 0 ? 'border-black text-black' : 'border-black/30 text-black/30 hover:cursor-not-allowed'}`}
                  onClick={() => {
                    if ((isTimeToSellValid || count > oldInitialCount) && count > 0) {
                      const indexToSell = newPortfolioItems?.findIndex((toSellItem: string) => toSellItem === product.productName);

                      if (indexToSell !== -1 && newPortfolioItems) {
                        const updatedPortfolioItems = [...newPortfolioItems];
                        updatedPortfolioItems.splice(indexToSell!, 1);
                        setNewPortfolioItems(updatedPortfolioItems);
                      }

                      setCount(count - 1);
                      setAmountToSell(amountToSell + 1);
                      setLiquidity(liquidity + Number(product.cost));
                    }
                  }}
                >
                  -
                </button>
                <span className="text-2xl">{count}</span>
                <button
                  className={`size-12 border-solid border-2 text-3xl rounded-lg flex items-center justify-center
                    ${liquidity < product.cost ? 'border-black/30 text-black/30' : 'border-black text-black'}`}

                  onClick={() => {
                    if (liquidity >= Number(product.cost)) {
                      setNewPortfolioItems((previousItems: string[]) => [...previousItems, product.productName]);

                      setCount(count + 1);
                      setAmountToSell(amountToSell - 1);
                      setLiquidity(liquidity - Number(product.cost));
                    }
                  }}
                >
                  +
                </button>
              </div>

              <div className="flex space-x-3 text-3xl">
                <span>+${product.fixedIncome}</span>
                <span>${product.cost}</span>
              </div>
            </div>
            <hr className="w-full mx-auto bg-black h-0.5 mt-3"></hr>
          </div>
        );
      })}
    </>
  );
}

function ChangeSummary({ portfolioItems, productData, newPortfolioItems }: { portfolioItems: string[] | null, productData: products[], newPortfolioItems: string[] | null }) {
  let combinedItems = portfolioItems;
  if (newPortfolioItems !== null) combinedItems = portfolioItems?.concat(newPortfolioItems)!;
  const uniqueCombinedItems = Array.from(new Set(combinedItems));

  const uniqueCombinedProducts = productData.filter(product => uniqueCombinedItems.includes(product.productName));

  return (
    <>
      <div className="mt-16">
        <h1 className="text-4xl text-center">Shrnutí:</h1>
        <hr className="w-64 mx-auto bg-black h-0.5 mt-1"></hr>
      </div>
      {uniqueCombinedProducts.map((item: products) => {

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
    <div className="fixed top-0 py-1 text-3xl w-full bg-black/90 text-white">
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
  const [newPortfolioItems, setNewPortfolioItems] = useState<Array<string> | null>(null);
  const [oldPortfolioItems, setOldPortfolioItmes] = useState<Array<string> | null>(null);

  const isInitialized = useRef(false);

  useEffect(() => {
    if (configData) {
      setLiquidity(configData.startingMoney);
      setPortfolioItems(configData.startingProducts);
      setNewPortfolioItems(configData.startingProducts);
      if (isInitialized!) {
        setOldPortfolioItmes(configData.startingProducts);
        isInitialized.current = true;
      }
    }
  }, [configData]);

  useEffect(() => {
    setPortfolioItems(newPortfolioItems);
  }, [showSite, portfolioItems]);

  if (!productData || liquidity === null) {
    return <h1>Loading...</h1>;
  }

  //doufejme ze nebudou lidi hrat na silvestra
  if ((year - new Date().getFullYear()) > configData.roundsAmount) SetEndGame(true);

  return (
    <>
      <TopBar liquidity={liquidity} year={year} />
      <NavigationArrows showSite={showSite} setShowSite={setShowSite} />
      {showSite === 0 && <Portfolio portfolioItems={portfolioItems} setNewPortfolioItems={setNewPortfolioItems} newPortfolioItems={newPortfolioItems}
        productData={productData} liquidity={liquidity} setLiquidity={setLiquidity} oldPortfolioItems={oldPortfolioItems} />}
      {showSite === 1 && <ChangeSummary portfolioItems={portfolioItems} productData={productData} newPortfolioItems={newPortfolioItems} />}
    </>
  );
}

export default GameLoop;
