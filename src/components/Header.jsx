import "../css/Header.css"
export default function Header({ isDark, setIsDark }){
 return(
        <header>
            <button className="light-dark" onClick={() => setIsDark(prev => !prev)} >
                {isDark ? "☀️" : "🌙"}
            </button>
            <h1 style={{color:isDark?"#F9F4DA":"#000"}}>Assembly: Endgame</h1>
            <p style={{color:isDark?"#8E8E8E":"#402f2fff"}}>Guess the word within 8 attempts to keep the
                programming world safe from Assembly!</p>
        </header>
    )
}