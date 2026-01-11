
import Body from './components/Body'
import Header from './components/Header'
import React from "react";
import clsx from 'clsx';

function App() {
  const [dark,setDark]=React.useState(true);
  const [gameStarted, setGameStarted] = React.useState(false);

  React.useEffect(() => {
    document.body.className = clsx({
      dark: dark,
      light: !dark,
    });
  }, [dark]);


    
  return (
    <>
   {gameStarted && (
        <Header isDark={dark} setIsDark={setDark} />
      )}
    <Body  gameStarted={gameStarted}
        setGameStarted={setGameStarted}/>
    </>
  )
}

export default App
