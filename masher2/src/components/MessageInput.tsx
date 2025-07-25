import { StyleSheet, Text, View } from "react-native";
import React, { memo, useEffect, useRef, useState } from "react";
import { Surface, TextInput } from "react-native-paper";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import PressableIcon from "./PressableIcon";
import { axiosInstance } from "../utilities/axiosInstance";
import fetchUserDataFromDatabase from "../database/fetchUserDataFromDatabase";
import { useSocket } from "../SocketProvider";
import TabBarIcon from "./TabBarIcon";
import { useAppTheme } from "../ThemeContext";

interface MessageInputProps {
  otherParticipantId: string;
}

const MessageInput = memo(
  ({ otherParticipantId }: MessageInputProps) => {
    const socket = useSocket();
    const username = useRef<string | null>(null);

    const [text, setText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [otherUserTyping, setOtherUserTyping] = useState<string | null>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const TypingHeight = useSharedValue(0);

    const { colors, isDark } = useAppTheme();
     const iconButtonStyle = { 
          backgroundColor: !isDark ? "whitesmoke" : "#444E60",
              padding: 12,
    borderRadius: 50,
        };

    useEffect(() => {
      fetchUserDataFromDatabase().then((res) => {
        username.current = res?.username ?? null;
      });
    }, []);

    const handleTyping = (input: string) => {
      setText(input);

      if (!isTyping) {
        setIsTyping(true);
        socket?.emit("userTyping", {
          sendToOtherUser: otherParticipantId,
          username: username.current,
        });
      }

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        socket?.emit("userStoppedTyping", {
          sendToOtherUser: otherParticipantId,
        });
      }, 2000);
    };

    useEffect(() => {
      socket?.on("displayTyping", (data: any) => {
        setOtherUserTyping(data.username);
      });

      socket?.on("hideTyping", () => {
        setOtherUserTyping(null);
      });

      return () => {
        socket?.off("displayTyping");
        socket?.off("hideTyping");
      };
    }, []);

    useEffect(() => {
      TypingHeight.value = withSpring(otherUserTyping ? 20 : 0, {
        duration: otherUserTyping ? 1000 : 500,
      });
    }, [otherUserTyping]);

    const sendMessage = () => {
      if (text === "") return;

      const message = text;
      setText("");

      axiosInstance
        .post(
          "/api/messages/addMessage",
          {
            message,
            // isGroup: false,
            recipients: [otherParticipantId],
          },
          { withCredentials: true }
        )
        .then((res) => {
          if (res.data === "message_added_successfully") {
            console.log("Message added");
          }
        })
        .catch((err) => console.error("Message send error:", err));
    };

    return (
      <View style={{backgroundColor: !isDark ? "#FFFFFF" : "#343A46" }}>
        {/* <Surface style={styles.surface} elevation={5}> */}
        <View style={[styles.surface, { backgroundColor: !isDark ? "#FFFFFF" : colors.background}]}>
          <TypingIndicator height={TypingHeight} username={otherUserTyping} isDark={isDark} />

          <View style={styles.inputContainer}>
            <PressableIcon
              iconName="multiTrackAudio"
              iconSize={25}
              rippleColor=""
              iconColor= { !isDark? "#193088": "#FFFFFF"}
              customStyle={iconButtonStyle}
              onClick={() => {}}
              disabled={false}
            />

            <TextInput
             style={[styles.inputBar, {backgroundColor: !isDark ? "whitesmoke" : "#444E60"}]}
              value={text}
              onChangeText={handleTyping}
              label={<Text style={[styles.placeholder, {color: isDark ? 'white' : 'gray'}]}>Your Message...</Text>}
              underlineStyle={{ display: "none" }}
              outlineStyle={styles.inputOutline}
              mode="outlined"
              cursorColor="royalblue"
              right={
                // text === "" ? (
                //   <TextInput.Icon
                //     icon="microphone"
                //     color="#193088"
                //     onPress={() =>
                //       console.log("Speak. I will convert speech to text")
                //     }
                //   />
                // ) : null
                text === "" ? (
                  <TextInput.Icon
                    icon={() => (
                      <TabBarIcon
                        name="smileO"
                      color={!isDark ? "#193088" : "#FFFFFF"}
                        size={25}
                      />
                    )}
                    color="#193088"
                    onPress={() =>
                      console.log("Show smile view.")
                    }
                  />
                ) : null
              }
            />

            <PressableIcon
              iconName="timer"
              // iconColor="#193088"
                 iconColor= { !isDark? "#193088": "#FFFFFF"}
              rippleColor=""
              iconSize={25}
              customStyle={iconButtonStyle}
              onClick={() => {}}
              disabled={false}
            />

            {/* <PressableIcon
            iconName="send"
            iconColor="white"
            rippleColor=""
            iconSize={25}
            customStyle={[
              styles.sendButton,
              { opacity: text === "" ? 0.8 : 1 },
            ]}
            onClick={sendMessage}
            disabled={text === ""}
          /> */}
            <PressableIcon
              iconName="send"
              iconColor="white"
              rippleColor=""
              iconSize={25}
              customStyle={{
                opacity: text === "" ? 0.8 : 1,
                backgroundColor: "#193088",
                padding: 10,
                borderRadius: 100,
              }}
              onClick={sendMessage}
              disabled={text === ""}
            />
          </View>
        </View>
      </View>
    );
  },
  (prev, next) => prev.otherParticipantId === next.otherParticipantId
);

export default MessageInput;

// 🔹 TypingIndicator Subcomponent
const TypingIndicator = ({
  height,
  username,
  isDark
}: {
  height: any;
  username: string | null;
  isDark: boolean;
}) => {
  if (!username) return null;

  return (
    <Animated.View style={[styles.typingIndicator, { height }]}>
      <Text style={[styles.typingText, {color: !isDark ? "#193088": '#FFFFFF'}]}>@{username} is typing...</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  surface: {
    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    // Android shadow
    elevation: 5,

    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "white",
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 1,
  },
  typingIndicator: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
  },
  typingText: {
    // color: "#193088",
    fontSize: 14,
    fontFamily: "Dosis_500Medium",
    marginLeft: 15,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: "100%",
  },
  iconButton: {
    backgroundColor: "whitesmoke",
    padding: 12,
    borderRadius: 50,
  },
  inputBar: {
    borderRadius: 45,
    // backgroundColor: "whitesmoke",
    width: "100%",
    maxWidth: 210,
    color: "#193088",
    fontSize: 16,
    marginBottom: 5,
    fontFamily: "Dosis_500Medium",
  },
  placeholder: {
    color: "gray",
    textAlign: "center",
  },
  inputOutline: {
    borderWidth: 0,
    borderRadius: 25,
    margin: 0,
    padding: 0,
  },
  emojiButton: {
    backgroundColor: "whitesmoke",
    padding: 10,
    borderTopRightRadius: 35,
    borderBottomRightRadius: 35,
  },
});
