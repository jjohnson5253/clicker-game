// TelegramProvider
import { createContext, useEffect, useMemo, useState } from "react";

export const TelegramContext = createContext({});

export const TelegramProvider = (children) => {
  const [webApp, setWebApp] = useState(null);

  useEffect(() => {
    const app = window.Telegram?.WebApp;
    if (app) {
      app.ready();
      setWebApp(app);
    }
  }, []);

  const value = useMemo(() => {
    return webApp
      ? {
          webApp,
          unsafeData: webApp.initDataUnsafe,
          user: webApp.initDataUnsafe.user,
        }
      : {};
  }, [webApp]);

  return <TelegramContext.Provider value={value}>{children}</TelegramContext.Provider>;
};
