// // WalletContext.js
// "use client"
// import { createContext, useContext, useState } from "react";

// const WalletContext = createContext();

// export const useWallet = () => useContext(WalletContext);

// export const WalletProvider = ({ children }) => {
//   const [wallet, setWallet] = useState(0);

//   return (
//     <WalletContext.Provider value={{ wallet, setWallet }}>
//       {children}
//     </WalletContext.Provider>
//   );
// };
