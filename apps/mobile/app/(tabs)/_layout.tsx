import { Tabs } from 'expo-router';
import React from 'react';
import { useAuth } from "../../context/AuthContext"
import { Ionicons } from "@expo/vector-icons";


export default function TabLayout() {
  const {accountType} = useAuth()
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({color, size}) => (
            <Ionicons name="home-outline" size={size} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: accountType === "worker" ? "Orders" : "Order",
          tabBarIcon: ({color, size}) => (
            <Ionicons name={accountType === "worker" ? "clipboard-outline" : 'cafe-outline'} size={size} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({color, size}) => (
            <Ionicons name='settings-outline' size={size} color={color} />
          )
        }} 
      />
    </Tabs>
  );
}
