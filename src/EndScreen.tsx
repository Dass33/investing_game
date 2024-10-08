function EndScreen(props: { setShowWelcomeSite: Function, setEndGame: Function, totalScore: number }) {
    return (
        <>
            <div className="text-center mt-36 lg:mt-56 ">
                <h1 className="text-5xl lg:text-[12rem] font-bold font-mono leading-[0.7]">{props.totalScore}</h1>
                <h1 className="text-4xl lg:text-8xl font-light ">Je tvé skóre.</h1>
            </div>
            <div className="lg:inline mx-auto">
                <img src="react.svg" alt="cartoon bull" className="h-44 block lg:pl-20 lg:inline mx-auto lg:float-start text-center  my-20 lg:my-0 lg:mb-40"></img>
                <img src="react.svg" alt="cartoon bull" className="h-44 hidden lg:pr-20 lg:inline lg:float-right text-center lg:mb-40"></img>
                <button className="block mt-28 mx-auto text-2xl lg:text-4xl border-black border-2 rounded-lg py-4 px-14 hover:scale-110 duration-200" onClick={() => {
                    // props.setShowWelcomeSite(true);
                    //props.setEndGame(false);
                    window.location.replace(window.location.href); // temporary way to restart the game
                }}>Hrát znovu</button>
            </div>
        </>
    );
}

export default EndScreen;
