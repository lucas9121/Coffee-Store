import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';
import { useThemeMode } from '@/context/ThemeContext';


export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const {themeMode} = useThemeMode();

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const phoneScheme = useRNColorScheme() ?? "light";

  const finalPhoneScheme = hasHydrated ? phoneScheme : "light";

  if(themeMode === "light") return "light";
  if(themeMode === "dark") return "dark";
  return finalPhoneScheme
}
