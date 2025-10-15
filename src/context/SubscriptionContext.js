"use client";
import { createContext, useState, useEffect } from "react";

export const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    const savedSub = localStorage.getItem("subscription");
    if (savedSub) setSubscription(JSON.parse(savedSub));
  }, []);

  const saveSubscription = (subData) => {
    localStorage.setItem("subscription", JSON.stringify(subData));
    setSubscription(subData);
  };

  return (
    <SubscriptionContext.Provider value={{ subscription, saveSubscription }}>
      {children}
    </SubscriptionContext.Provider>
  );
};
