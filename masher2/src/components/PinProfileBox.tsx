import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'
import TabBarIcon from './TabBarIcon'
import { useAppTheme } from '../ThemeContext';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../MainComponent';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { setCurrentConversationId, setCurrentOtherParticipantId } from '../messageScreenStatesSlice';
import { useDispatch } from 'react-redux';

export default function PinProfileBox() {
    const dispatch = useDispatch();
           const { colors, isDark } = useAppTheme();
        const android_ripple = {
        color: !isDark ? "whitesmoke": "#282C35",
      };
      const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList, "Profile">>();
  return (
     <View style={[styles.container, { backgroundColor: !isDark ? "whitesmoke": colors.background }]}>
        <View style={{alignSelf: "flex-end"}}>

        <TabBarIcon name="pin" size={20} color={colors.text} />
        </View>
      <Image
        source={require('../../assets/icons/work-in-progress.png')} // Add a fun mascot/image
        style={styles.image}
        contentFit='contain'
      />

      <Text style={[styles.title, { color: colors.text, fontFamily: 'Dosis_700Bold' }]}>
        🎉 Masher is Evolving!
      </Text>
      <Text style={[styles.description, { color: colors.text, fontFamily: 'Dosis_400Regular' }]}>
        We're actively building the next version with more exciting features and personalization options.
      </Text>
      <Text style={[styles.description, { color: colors.text, fontFamily: 'Dosis_400Regular' }]}>
        Version v 1.1 is coming this August, and we can't wait to share it with you!
      </Text>
      <Text style={[styles.description, { color: colors.text, fontFamily: 'Dosis_500Medium' }]}>
        ✨ Got an idea or feedback? Message us at @Masher
      </Text>
      <Button
        mode="contained"
        style={styles.button}
        onPress={() => {
          // Optional: Replace this with your support chat screen or link
          // navigation.navigate('Search', { initialQuery: '@MasherApp' });

           dispatch(setCurrentConversationId('find_through_page_using_otherParticipant'));
                      dispatch(setCurrentOtherParticipantId('68735af969495f56826de5f1'));

           navigation.navigate("MessagingScreen", {
              conversationId: "find_through_page_using_otherParticipant",
              otherParticipantId: "68735af969495f56826de5f1",
              otherParticipantName: "Masher",
              isGroup: false,
              imageUrl: "uploads/profile-images/68735af969495f56826de5f1-168b582b-089d-426e-bffd-205e0246cef5.jpeg",
            });
        }}
      >
        Message Us
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
      container: {
    padding: 20,
    alignItems: 'center',
    // flex: 1,
    justifyContent: 'center',
    margin: 40,
    borderRadius: 30,
  },
  title: {
    fontSize: 22,
    marginVertical: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 30,
  },
  button: {
    marginTop: 20,
    borderRadius: 10,
  },
})