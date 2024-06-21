import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import { Web3ModalProvider}  from './Web3ModalProvider';

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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Web3ModalProvider>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </Web3ModalProvider>
  </React.StrictMode>
)
