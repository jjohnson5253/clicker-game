import { useContext } from "react";
import { TelegramContext } from "../context/TelegramProvider";

export const useTelegram = () => useContext(TelegramContext);
