import { useAuth } from "@/context/AuthContext";
import { GuestSettingsContent } from "@/components/guest-settings-content";
import { UserSettingsContent } from "@/components/user-settings-content";
import { WorkerSettingsContent } from "@/components/worker-settings-content";
import { useThemeColor } from "@/hooks/use-theme-color";
import { AppHeader } from "@/components/app-header";



export default function SettingsScreen() {
  const {accountType, accessToken} = useAuth();
  const borderColor = useThemeColor({}, "border")

  if(accountType === "user"){
    return (
      <>
        <AppHeader subtitle="Account Settings" />
        <UserSettingsContent 
          accessToken={accessToken}
          borderColor={borderColor}
        />
      </>
    )
  }

  if(accountType === "worker"){
    return (
      <>
        <AppHeader subtitle="Account Settings" />
        <WorkerSettingsContent 
          accessToken={accessToken}
          borderColor={borderColor}
        />
      </>
    )
  }

  return <GuestSettingsContent />

}