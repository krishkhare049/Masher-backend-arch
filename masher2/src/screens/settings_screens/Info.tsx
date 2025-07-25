import {
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Divider, List } from "react-native-paper";
import { Image } from "expo-image";
import { useAppTheme } from "../../ThemeContext";
import AppText from "../../components/AppText";
export default function Info() {
  const { isDark, colors } = useAppTheme();
  return (
    <>
      {/* Native Header */}
      {/* <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="About App" />
      </Appbar.Header> */}
      <ScrollView style={[styles.container, { backgroundColor: isDark ? '#343A46' : '#ffffff' }]}>
        {/* App Header Section */}
        <View style={styles.header}>
          <Image
            source={require("../../../assets/icons/masherlogo2.png")}
            style={styles.logo}
            placeholder={require("../../../assets/icons/skeletonLoadingPlaceholder.gif")}
            placeholderContentFit="cover"
            contentFit="cover"
          />
          <AppText style={[styles.appName, { color: colors.text }]}>Masher</AppText>
          <AppText style={[styles.tagline, { color: colors.text }]}>Fast. Secure. Reliable.</AppText>
        </View>
        <Divider />
        {/* About the App */}
        <List.Section>
          <List.Subheader style={[styles.boldText, { color: colors.text }]}>About the App</List.Subheader>
          <AppText style={[styles.description, { color: colors.text }]}>Masher is a real-time messaging app designed for privacy and speed. Connect with your friends securely, share media, and enjoy seamless conversations.</AppText>
        </List.Section>
        <Divider />
        {/* App Features */}
        <List.Section>
          <List.Subheader style={[styles.boldText, { color: colors.text }]}>Features</List.Subheader>
          <List.Item
            title="Self destructing messages"
            titleStyle={[styles.mediumText, { color: colors.text }]}
            left={(props) => <List.Icon {...props} icon="delete-variant" color={colors.text} />}
          />
          <Divider />
          <List.Item
            title="End-to-End Encryption"
            titleStyle={[styles.mediumText, { color: colors.text }]}
            left={(props) => <List.Icon {...props} icon="shield-lock" color={colors.text} />}
          />
          <Divider />
          <List.Item
            title="Lightning-Fast Messaging"
            titleStyle={[styles.mediumText, { color: colors.text }]}
            left={(props) => <List.Icon {...props} icon="flash" color={colors.text} />}
          />
          <Divider />
          <List.Item
            title="Media Sharing"
            titleStyle={[styles.mediumText, { color: colors.text }]}
            left={(props) => <List.Icon {...props} icon="image" color={colors.text} />}
          />
          <Divider />
          <List.Item
            title="Group Chats & Voice Notes"
            titleStyle={[styles.mediumText, { color: colors.text }]}
            left={(props) => <List.Icon {...props} icon="account-group" color={colors.text} />}
          />
        </List.Section>
        <Divider />
        {/* Privacy & Legal */}
        <List.Section>
          <List.Subheader style={[styles.boldText, { color: colors.text }]}>Privacy & Legal</List.Subheader>
          <List.Item
            title="Privacy Policy"
            titleStyle={[styles.mediumText, { color: colors.text }]}
            left={(props) => <List.Icon {...props} icon="shield-lock" color={colors.text} />}
            onPress={() => Linking.openURL("https://masher.vercel.app/privacypol")}
          />
          <Divider />
          <List.Item
            title="Terms of Service"
            titleStyle={[styles.mediumText, { color: colors.text }]}
            left={(props) => <List.Icon {...props} icon="file-document" color={colors.text} />}
            onPress={() => Linking.openURL("https://masher.vercel.app/terms")}
          />
        </List.Section>
        <Divider />
        {/* Developer Information */}
        <List.Section>
          <List.Subheader style={[styles.boldText, { color: colors.text }]}>Developer Info</List.Subheader>
          <View style={[styles.developer, { backgroundColor: isDark ? "#222831" : "#f5f5f5" }]}>
            <Image
              source={require("../../../assets/icons/krishkhare.jpg")}
              style={styles.devImage}
              placeholder={require("../../../assets/icons/skeletonLoadingPlaceholder.gif")}
              placeholderContentFit="cover"
              contentFit="cover"
            />
            <AppText style={[styles.devName, { color: colors.text }]}>Krish Khare</AppText>
            <AppText style={[styles.devRole, { color: colors.text }]}>Founder & Lead Developer</AppText>
            <AppText style={[styles.description, { color: colors.text }]}>Young tech founder and software developer building innovative solutions</AppText>
            <List.Section>
              <List.Item
                title="website"
                titleStyle={[styles.mediumText, { color: colors.text }]}
                borderless={true}
                style={{ borderRadius: 10, backgroundColor: !isDark ? "gainsboro": "#343A46", margin: 5 }}
                left={(props) => (
                  <List.Icon {...props} icon="web" color={colors.text} />
                )}
                onPress={() => Linking.openURL("https://khareindustries.vercel.app")}
              />
              <List.Item
                title="github"
                titleStyle={[styles.mediumText, { color: colors.text }]}
                borderless={true}
                style={{ borderRadius: 10, backgroundColor: !isDark ? "gainsboro": "#343A46", margin: 5 }}
                left={(props) => (
                  <List.Icon {...props} icon="github" color={colors.text} />
                )}
                onPress={() => Linking.openURL("https://github.com/krishkhare049")}
              />
              <List.Item
                title="linkedin"
                titleStyle={[styles.mediumText, { color: colors.text }]}
                borderless={true}
                style={{ borderRadius: 10,  backgroundColor: !isDark ? "gainsboro": "#343A46", margin: 5 }}
                left={(props) => (
                  <List.Icon {...props} icon="linkedin" color={colors.text} />
                )}
                onPress={() => Linking.openURL("https://linkedin.com/in/krishkhare")}
              />
            </List.Section>
          </View>
        </List.Section>
        <Divider />
        {/* Contact & Support */}
        <List.Section>
          <List.Subheader style={[styles.boldText, { color: colors.text }]}>Contact & Support</List.Subheader>
          <List.Item
            title="Email: khareindustriesinc@gmail.com"
            titleStyle={[styles.mediumText, { color: colors.text }]}
            left={(props) => <List.Icon {...props} icon="email" color={colors.text} />}
          />
          <List.Item
            title="Address: Jhansi, India"
            titleStyle={[styles.mediumText, { color: colors.text }]}
            left={(props) => <List.Icon {...props} icon="map-marker" color={colors.text} />}
          />
        </List.Section>
        <Divider />
        {/* App Version */}
        <List.Section>
          <List.Subheader style={[styles.boldText, { color: colors.text }]}>App Version</List.Subheader>
          <List.Item
            title="Version: 1.0.0"
            titleStyle={[styles.mediumText, { color: colors.text }]}
            left={(props) => <List.Icon {...props} icon="information" color={colors.text} />}
          />
        </List.Section>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: { alignItems: "center", marginVertical: 20 },
  logo: { width: 100, height: 100, marginBottom: 10, borderRadius: 20 },
  appName: { color: "#000000", fontFamily: "Dosis_700Bold" },
  tagline: { color: "#000000", fontFamily: "Dosis_400Regular" },
  description: {
    paddingHorizontal: 20,
    marginVertical: 10,
    textAlign: "center",
    fontFamily: "Dosis_500Medium",
  },
  developer: {
    alignItems: "center",
    marginVertical: 20,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
  },
  devImage: { width: 80, height: 80, borderRadius: 40, marginBottom: 10 },
  devName: { color: "#000000", fontFamily: "Dosis_700Bold" },
  devRole: {
    color: "#000000",
    marginBottom: 10,
    fontFamily: "Dosis_400Regular",
  },
  regularText: { fontFamily: "Dosis_400Regular" },
  boldText: { fontFamily: "Dosis_700Bold" },
  mediumText: { fontFamily: "Dosis_500Medium" },
});
