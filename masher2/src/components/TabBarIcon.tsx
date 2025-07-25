import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Entypo from "@expo/vector-icons/Entypo";
import { FontAwesome5, FontAwesome6, Fontisto, Octicons } from "@expo/vector-icons";
import { memo } from "react";
import { useAppTheme } from "../ThemeContext";


// export default function TabBarIcon({
  const TabBarIcon = memo(
    ({ color, name, size }: { color: string; name: string; size: number }) => {
    const {colors, isDark} = useAppTheme();
    switch (name) {
      case "home":
        return (
          <MaterialCommunityIcons name="home-flood" size={size} color={color} />
        );
      // break;
      case "notifications":
        return (
          <Ionicons name="notifications-sharp" size={size} color={color} />
        );
      case "user":
        return (
          <MaterialCommunityIcons
            name="face-man-profile"
            size={size}
            color={color}
          />
        );
      case "notes":
        return <MaterialIcons name="notes" size={size} color={color} />;
      case "search":
        return <Feather name="search" size={size} color={color} />;
      case "searchOutline":
        return <FontAwesome name="search" size={size} color={color} />;
      case "chats":
        // return <MaterialCommunityIcons name="chat" size={size} color={color} />;
        return <Ionicons name="chatbubbles" size={size} color={color} />;
      case "chatsOutline":
        return (
          <Ionicons name="chatbubbles-outline" size={size} color={color} />
        );
      case "arrowLeft":
        return <AntDesign name="arrowleft" size={size} color={color} />;
      case "pencil":
        return <MaterialIcons name="edit" size={size} color={color} />;
      case "payments":
        return <MaterialIcons name="payments" size={size} color={color} />;
      case "privacy":
        return (
          <MaterialIcons
            name="private-connectivity"
            size={size}
            color={color}
          />
        );
      case "right":
        return <AntDesign name="right" size={size} color={color} />;
      case "settings":
        return (
          <MaterialIcons name="settings-suggest" size={size} color={color} />
        );
      case "logout":
        return <MaterialIcons name="logout" size={size} color={color} />;
      case "send":
        return <FontAwesome name="send" size={size} color={color} />;
      case "smileO":
        return <FontAwesome name="smile-o" size={size} color={color} />;
      case "mic":
        return <Ionicons name="mic" size={size} color={color} />;
      case "check":
        return (
          <MaterialCommunityIcons name="check" size={size} color={color} />
        );
      case "checkAll":
        return (
          <MaterialCommunityIcons name="check-all" size={size} color={color} />
        );
      case "defaultProfileIcon":
        // return <FontAwesome name="user-circle" size={size} color={color} />;
        return (
          <MaterialCommunityIcons
            name="account-circle"
            size={size}
            color={!isDark ? color: "#8794A9"}
          />
        );
      case "userOutline":
        return (
          <MaterialCommunityIcons
            name="account-circle-outline"
            size={size}
            color={color}
          />
        );
      case "uploadProfileIcon":
        return (
          <MaterialCommunityIcons
            name="image-edit-outline"
            size={size}
            color={color}
          />
        );
      case "delete":
        return <MaterialIcons name="delete" size={size} color={color} />;
      case "cancel":
        return <MaterialIcons name="cancel" size={size} color={color} />;
      case "cross":
        return <Entypo name="cross" size={size} color={color} />;
      case "theme":
        return (
          <MaterialCommunityIcons
            name="theme-light-dark"
            size={size}
            color={color}
          />
        );
      case "security":
        return (
          <MaterialCommunityIcons name="security" size={size} color={color} />
        );
      case "customerservice":
        return <AntDesign name="customerservice" size={size} color={color} />;
      case "password":
        return <MaterialIcons name="password" size={size} color={color} />;
      case "edit":
        return <AntDesign name="edit" size={size} color={color} />;
      case "leafMaple":
        return (
          <MaterialCommunityIcons name="leaf-maple" size={size} color={color} />
        );
      case "infocirlceo":
        return <AntDesign name="infocirlceo" size={size} color={color} />;
      case "multiTrackAudio":
        return (
          <MaterialIcons name="multitrack-audio" size={size} color={color} />
        );
      case "circle":
        return <FontAwesome name="circle" size={size} color={color} />;
      case "history":
        return (
          <MaterialCommunityIcons name="history" size={size} color={color} />
        );
      case "blocked":
        return <MaterialIcons name="block" size={size} color={color} />;
      case "share":
        return (
          <MaterialCommunityIcons name="share" size={size} color={color} />
        );
      case "defaultGroupIcon":
        return <MaterialIcons name="groups" size={size} color={color} />;
      case "moreHorizontal":
        return <Feather name="more-horizontal" size={size} color={color} />;
      case "imageOutline":
        return <Ionicons name="image-outline" size={size} color={color} />;
      case "pin":
        return <Entypo name="pin" size={size} color={color} />;
      case "pinOff":
        return (
          <MaterialCommunityIcons name="pin-off" size={size} color={color} />
        );
      case "date":
        return <Fontisto name="date" size={size} color={color} />;
      case "messageCircle":
        return <Feather name="message-circle" size={size} color={color} />;
      case "addToList":
        return <Entypo name="add-to-list" size={size} color={color} />;
      case "timer":
        return <Ionicons name="timer" size={size} color={color} />;
      case "shield":
        return <FontAwesome name="shield" size={size} color={color} />;
      case "groupAdd":
        return <MaterialIcons name="group-add" size={size} color={color} />;
      case "book":
        return <FontAwesome5 name="book" size={size} color={color} />;
      case "userPen":
        return <FontAwesome6 name="user-pen" size={size} color={color} />;
      case "font":
        return <MaterialCommunityIcons name="format-text-variant-outline" size={size} color={color} />;
      case "colorPalette":
        return <Ionicons name="color-palette-outline" size={size} color={color} />;
      case "bullhorn":
        return <FontAwesome5 name="bullhorn" size={size} color={color} />;

      // break;

      default:
        // break;
        return null;
    }
  },
  (prevProps, nextProps) => {
    return (
      prevProps.name === nextProps.name &&
      prevProps.color === nextProps.color &&
      prevProps.size === nextProps.size
    );
  }
);

export default TabBarIcon;
