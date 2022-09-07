import { useState, useEffect } from "react";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  const [isAuth, setIsAuth] = useState(false);
  useEffect(() => {
    if (window.location.pathname === "/") {
      const userInput = window.prompt("Enter your Secrect Key");
      if (userInput === "test") {
        setIsAuth(true);
      } else {
        window.close();
      }
    } else {
      setIsAuth(true);
    }
  }, []);

  return <> {isAuth && <Component {...pageProps} />}</>;
}

export default MyApp;
