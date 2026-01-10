import "../css/Body.css";
import {languages} from "../utilies/languages.js";
import React from "react";
import {clsx} from "clsx";
import {getFarewellText} from "../utilies/utils.js";
import { getRandomWord } from "../utilies/utils.js";
import ReactConfetti from "react-confetti";

export default function Body(){

    //state values
    const [currentWord,setCurrentWord]=React.useState(()=>getRandomWord());
    const [guess,setGuess]=React.useState([]);
    const [time,setTime]=React.useState(60);
    const [timeOut, setTimeOut] = React.useState(false);
    const [farewellMessage,setFarewellMessage]=React.useState(null);


    //derived values
    const wrongGuessLength=guess.filter(letter=>!currentWord.includes(letter)).length
    const isGameWon=currentWord.split("").every(letter=>guess.includes(letter))
    const isGameLost=wrongGuessLength>= languages.length - 1
    const isGameOver=isGameWon || isGameLost;
    const lastGuessedLetter=guess[guess.length-1];
    const numOfGuessesLeft=languages.length-1
    const isWrongGuess=guess.filter(letter=>!currentWord.includes(letter)) &&(wrongGuessLength > 0 && wrongGuessLength<languages.length)
    //const farewellMessage=isWrongGuess ? getFarewellText(languages[wrongGuessLength - 1].name): null;
    //const timeOut=time===0;

    //constant values
    const alphabet="abcdefghijklmnopqrstuvwxyz";

    const arrWord=currentWord.split("");
    const word=arrWord.map((items,index)=>{
        const shouldRevealLetter=isGameLost ||guess.includes(items);
        const letterClassName=clsx(
            isGameLost && !guess.includes(items) && "missed-letter"
        )
        return(
        <span key={index} className={letterClassName}>{shouldRevealLetter? items.toUpperCase():""}</span>
        )
})

React.useEffect(() => {
  if (isWrongGuess) {
    const message = getFarewellText(
      languages[wrongGuessLength - 1].name
    );
    setFarewellMessage(message);
  }
}, [wrongGuessLength, isWrongGuess]);

    const alphas=alphabet.split("").map((item)=>{

        const isGuessed=guess.includes(item)
        const isCorrect=isGuessed && currentWord.includes(item)
        const isWrong=isGuessed && !currentWord.includes(item)

        const className= clsx({
            correct: isCorrect,
            wrong:isWrong
        })

        return (<button 
            className={className} key={item} 
            onClick={()=>userGuess(item)} 
            value={item.toUpperCase()}
            disabled={isGameOver || timeOut}
            aria-disabled={guess.includes(item)}
            aria-label={`Letter ${item}`}
            >{item.toUpperCase()
            }</button>
    )})

    // React.useEffect(()=>{
    //     if(time===0) return;
    //     const id=setInterval(()=>{
    //         setTime(t=>t-1)
    //     },1000);
    //     return ()=> clearInterval(id);
    // },[time]);

React.useEffect(() => {
    if(isGameOver) return;
  const id = setInterval(() => {
    setTime(prev => {
      if (prev <= 1) {
        clearInterval(id);
        setTimeOut(true);  // <- triggers your "Game over!"
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(id);
}, [isGameOver]);

     const lang=languages.map((items, index)=>{
        const isLanguageLost=index < wrongGuessLength;

        const className=clsx("chip",isLanguageLost && "lost")
        return( 
        <span className={className} key={index} style={{backgroundColor:items.backgroundColor, color:items.color}} >{items.name}</span>
    )})

    function userGuess(letter){
        setGuess(prev=>
            prev.includes(letter)?prev:
            [...prev,letter])
        // console.log(guess)
    }
    function startNewGame(){
        setCurrentWord(()=>getRandomWord())
        setGuess([])
        setTime(60)
        setTimeOut(false)
    }

    const gameStatusClass=clsx("game-status",{
        won:isGameWon,
        lost:isGameLost,
        farewell: !isGameOver && wrongGuessLength>0
    })

    //console.log("time:", time, "timeOut:", timeOut);
    return(
        <main>
            {
                isGameWon &&
                <ReactConfetti
                    recycle={false}
                    numberOfPieces={2000}
                />

            }
        {isGameOver ? (<section aria-live="polite" role="status" className={gameStatusClass}>
                    {(isGameWon && !timeOut)? (
                        <>
                            <h2>You win!</h2>
                            <p>Well done! 🎉</p>
                        </>
                    ) :
                    (
                        <>
                            <h2>Game over!</h2>
                            <p>You lose! Better start learning Assembly 😭</p>
                        </>
                    ) 
                }
            </section>):isWrongGuess ?(
                        <section className={gameStatusClass}>
                        <p className={`${gameStatusClass}-message`}>{farewellMessage}</p>
                        </section>
                    ):null
        }
            <section className="container">
                    {lang}
            </section>
            <section className="timer-section">
               <h3 style={{color:time>=20?"#b37d09":"#f90000"}}>Time Remaining : {time}</h3> 
            </section>
            <section className="word">
                {word}
            </section>
            <section className="sr-only" aria-live="polite" role="status">
                <p>
                    {currentWord.includes(lastGuessedLetter)?`Correct !! The letter ${lastGuessedLetter} is in the word`:
                    `Sorry!! The letter ${lastGuessedLetter} is NOT there`}
                    You have {numOfGuessesLeft} attempts left!!
                </p>
                <p>Current Word: {
                currentWord.split("").map(
                    letter=>guess.includes(letter)?letter +".":"blank.").join("")}</p>
            </section>
            <section className="keyboard">
                {alphas}
            </section>
           { (isGameOver || timeOut) &&
           <section className="aftergame"> 
           { isGameLost? <p>The Correct Answer is : {currentWord.toUpperCase()}</p>:null
           }
           <button className="newgame" onClick={startNewGame}>New Game</button>
           </section>}
        </main>
    )
}