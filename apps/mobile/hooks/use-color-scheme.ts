import {useColorScheme as useRNColorScheme} from "react-native";
import { useThemeMode } from "@/context/ThemeContext";

export function useColorScheme() {
  const phoneScheme = useRNColorScheme() ?? "light";
  const {themeMode} = useThemeMode();

  if(themeMode === "light") return "light";
  if(themeMode === "dark") return "dark";

  return phoneScheme; //system
}