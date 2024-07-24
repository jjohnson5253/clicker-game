import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import { MetaMaskProvider } from "@metamask/sdk-react";
import { TelegramProvider } from "./context/TelegramProvider.jsx";

// 2. Call `extendTheme` and pass your custom values
const theme = extendTheme({
  components: {
    Progress: {
      baseStyle: {
        filledTrack: {
          bg: "#00ADE0",
        },
      },
    },
  },
  colors: {
    brand: {
      100: "#00ADE0",
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <TelegramProvider>
      <MetaMaskProvider
        debug={false}
        sdkOptions={{
          logging: {
            developerMode: false,
          },
          checkInstallationImmediately: false, // This will automatically connect to MetaMask on page load
          i18nOptions: {
            enabled: true,
          },
          dappMetadata: {
            name: "Clicker Game",
            url: window.location.protocol + "//" + window.location.host,
          },
        }}
      >
        {" "}
        <ChakraProvider theme={theme}>
          <App />
        </ChakraProvider>
      </MetaMaskProvider>
    </TelegramProvider>
  </React.StrictMode>
);
