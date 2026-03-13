import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import {AuthProvider, useAuth} from "@/context/AuthContext" 
import { ThemeProviderCustom } from '@/context/ThemeContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { CartProvider } from '@/context/CartContext';

import { ThemedText } from '@/components/ui/themed-text';
import { ThemedView } from '@/components/ui/themed-view';

export const unstable_settings = {
  anchor: '(tabs)',
};

function InnerLayout() {
  const colorScheme = useColorScheme();
  const {isInitializing} = useAuth();
  const backgroundColor = useThemeColor({}, "background")

  if(isInitializing){
    return(
      <SafeAreaView edges={["top", "left", "right"]} style={{flex: 1, backgroundColor}}>
        <ThemedView style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
          <ThemedText>Loading...</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={{flex: 1, backgroundColor}}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaView>
  );
};

export default function RootLayout() {
  return(
    <ThemeProviderCustom>
      <SafeAreaProvider>
        <CartProvider>
          <AuthProvider> 
            <InnerLayout />
          </AuthProvider>
        </CartProvider>
      </SafeAreaProvider>
    </ThemeProviderCustom>
  )
}
