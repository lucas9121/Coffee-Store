import { Tabs } from 'expo-router';
import React from 'react';
import { useAuth } from "../../context/AuthContext"


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
          title: 'Home'
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: accountType === "worker" ? "Orders" : "Order"
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings"
        }} 
      />
    </Tabs>
  );
}
