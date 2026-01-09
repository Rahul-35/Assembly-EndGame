
import Body from './components/Body'
import Header from './components/Header'
import React from "react";
import clsx from 'clsx';

function App() {
  const [dark,setDark]=React.useState(true);

  React.useEffect(() => {
    document.body.className = clsx({
      dark: dark,
      light: !dark,
    });
  }, [dark]);


    
  return (
    <>
    <Header isDark={dark} setIsDark={setDark} />
    <Body/>
    </>
  )
}

export default App
