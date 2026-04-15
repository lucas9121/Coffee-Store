import { useAuth } from "@/context/AuthContext";
import { useThemeMode } from "@/context/ThemeContext";
import { GuestSettingsContent } from "@/components/guest-settings-content";
import { UserSettingsContent } from "@/components/user-settings-content";
import { WorkerSettingsContent } from "@/components/worker-settings-content";
import { useThemeColor } from "@/hooks/use-theme-color";



export default function SettingsScreen() {
  const { themeMode, setThemeMode } = useThemeMode();
  const {accountType, accessToken} = useAuth();
  const borderColor = useThemeColor({}, "border")

  if(accountType === "user"){
    return (
      <UserSettingsContent 
        accessToken={accessToken}
        borderColor={borderColor}
      />
    )
  }

  if(accountType === "worker"){
    return (
      <WorkerSettingsContent 
        accessToken={accessToken}
        borderColor={borderColor}
      />
    )
  }

  return <GuestSettingsContent />

}