import React, { memo, useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import TabBarIcon from "./TabBarIcon";
import { Image } from "expo-image";
import addPathToProfileImages from "../utilities/addPathToProfileImages";
import { useAppTheme } from "../ThemeContext";
// import formatTime from "../utilities/formatDate";

type MessageProps = {
  item: any;
  selected: boolean;
  onClick: () => void;
  onLongPress: () => void;
  onPressParticipantProfileImg: () => void;
  isMessMenuVisible: boolean

};


const GroupMessage = memo(
  ({ item, selected, onClick, onLongPress, onPressParticipantProfileImg, isMessMenuVisible }: MessageProps) => {

    const {colors} = useAppTheme()
    // console.log("GroupMessage item:", item.showAvatar);
    const isSender = item.isSender;

    // console.log("item: ", item);

    // const containerStyle = useMemo(() => {
    //   const baseStyle = [
    //     styles.baseBubble,
    //     isSender ? styles.sender : styles.receiver,
    //   ];
    //   if (selected) baseStyle.push(styles.selected);
    //   return baseStyle;
    // }, [isSender, selected]);

    const containerStyle = useMemo(() => {
      return [
        styles.baseBubble,
        isSender ? styles.sender : styles.receiver,
        selected && styles.selected,
      ].filter(Boolean);
    }, [isSender, selected]);

    // const timeComponent = useMemo(() => {
    //   return (
    //     <Text style={[styles.time, styles.mediumText]}>
    //       {formatTime(item.createdAt)}
    //     </Text>
    //   );
    // }, [item.createdAt]);

    return (
      // <Pressable
      //   android_ripple={null}
      //   // android_ripple={{color: 'white', borderless: false}}
      //   onLongPress={onLongPress}
      //   onPress={onClick}
      //   // style={styles.container}
      //   style={[containerStyle, styles.container]}
      // >
      //   <Text style={[styles.text, styles.mediumText]}>{item.content}</Text>

      //   <View
      //     style={{
      //       flexDirection: "row",
      //       justifyContent: isSender ? "flex-end" : "flex-start",
      //       alignItems: "center",
      //       marginTop: 4,
      //     }}
      //   >
      //     {isSender && (
      //       <View style={{ marginRight: 5 }}>
      //         <TabBarIcon name="check" size={15} color="gray" />
      //       </View>
      //     )}
      //     {/* {timeComponent} */}
      //     <Text style={[styles.time, styles.mediumText]}>
      //       {item.formattedDate}</Text>
      //   </View>
      // </Pressable>
      <>
        {!isSender ? (
          <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 5 }}>
             {
               item.showAvatar && (
           <Pressable onPress={onPressParticipantProfileImg}>
{/*           
                      <Image
                        style={styles.participantsProfileImg}
                        source={{
                          uri: addPathToProfileImages(
                            item.sender.profileImgFilename
                          ),
                        }}
                        placeholder={require("../../assets/icons/skeletonLoadingPlaceholder.gif")}
                        placeholderContentFit="cover"
                        contentFit="cover"
                        /> */}


                            
                            {item.sender.profileImgFilename !== "default_profile_image" ? (
                              <Image
                              style={styles.participantsProfileImg}
                              source={{
                                uri: addPathToProfileImages(item.sender.profileImgFilename),
                              }}
                              placeholder={require("../../assets/icons/skeletonLoadingPlaceholder.gif")}
                              placeholderContentFit="cover"
                              contentFit="cover"
                              />
                            ) : (
                              <View style={{marginLeft: 10}}>
                              <TabBarIcon name="defaultProfileIcon" size={45} color={colors.background} />
                              </View>
                            )}


                        </Pressable>
                          )}

          <Pressable
            android_ripple={null}
            // android_ripple={{color: 'white', borderless: false}}
            onLongPress={onLongPress}
            onPress={onClick}
            // style={styles.container}
            style={[containerStyle, styles.container]}
            >
            <Text style={[styles.text, styles.mediumText]}>{item.content}</Text>
            {/* <Text style={[styles.text, styles.mediumText]}>{item.sender.fullName}</Text> */}

            <View
              style={{
                flexDirection: "row",
                justifyContent: isSender ? "flex-end" : "flex-start",
                alignItems: "center",
                marginTop: 4,
              }}
              >
              {isSender && (
                <View style={{ marginRight: 5 }}>
                  <TabBarIcon name="check" size={15} color="gray" />
                </View>
              )}
              {/* {timeComponent} */}
              <Text style={[styles.time, styles.mediumText]}>
                {item.formattedDate}
              </Text>
            </View>
          </Pressable>
          </View>
        ) : (
          <Pressable
            android_ripple={null}
            // android_ripple={{color: 'white', borderless: false}}
            onLongPress={onLongPress}
            onPress={onClick}
            // style={styles.container}
            style={[containerStyle, styles.container, {marginVertical: 5 }]}
          >
            <Text style={[styles.text, styles.mediumText]}>{item.content}</Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: isSender ? "flex-end" : "flex-start",
                alignItems: "center",
                marginTop: 4,
              }}
            >
              {isSender && (
                <View style={{ marginRight: 5 }}>
                  <TabBarIcon name="check" size={15} color="gray" />
                </View>
              )}
              {/* {timeComponent} */}
              <Text style={[styles.time, styles.mediumText]}>
                {item.formattedDate}
              </Text>
            </View>
          </Pressable>
        )}
      </>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.item.messageId === nextProps.item.messageId &&
      prevProps.item.content === nextProps.item.content &&
      // prevProps.item.formattedDate === nextProps.item.formattedDate &&
      prevProps.selected === nextProps.selected &&
      prevProps.isMessMenuVisible === nextProps.isMessMenuVisible
    );
  }
);

export default GroupMessage;

const styles = StyleSheet.create({
  baseBubble: {
    borderRadius: 40,
    overflow: "hidden",
    margin: 0,
    marginHorizontal: 5,
  },
  sender: {
    backgroundColor: "#f7d992",
    alignSelf: "flex-end",
    borderBottomRightRadius: 0,
  },
  receiver: {
    backgroundColor: "#F7F7F7",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 0,
  },
  selected: {
    backgroundColor: "#ff4a40",
    // alignSelf: "flex-end",
    // borderBottomRightRadius: 0,
    // alignSelf: "flex-start", // or "flex-end" based on your requirement
    // borderBottomLeftRadius: 0, // or borderBottomRightRadius based on your requirement
  },
  container: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    maxWidth: "70%",
    minWidth: 50,
  },
  text: {
    fontSize: 16,
    color: "black",
  },
  time: {
    fontSize: 12,
    color: "#666",
  },
  regularText: { fontFamily: "Dosis_400Regular" },
  mediumText: { fontFamily: "Dosis_500Medium" },
  participantsProfileImg: {
    width: 45,
    height: 45,
    borderRadius: 45,
    borderWidth: 2,
    marginLeft: 10,
    // borderStyle: 'dotted',
    borderColor: 'whitesmoke'
  },
});
