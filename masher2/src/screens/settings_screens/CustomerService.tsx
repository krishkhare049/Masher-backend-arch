import { Linking, ScrollView, StyleSheet, View } from "react-native";
import React from "react";
import { Appbar, Button, Divider, List } from "react-native-paper";
import { Image } from "expo-image";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../MainComponent";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useAppTheme } from "../../ThemeContext";
import AppText from "../../components/AppText";

type CustomerServiceProps = NativeStackScreenProps<
  RootStackParamList,
  "CustomerService"
>;

export default function CustomerService({ navigation }: CustomerServiceProps) {
  const { isDark, colors } = useAppTheme();
  return (
    <>
      <ScrollView style={[styles.container, { backgroundColor: isDark ? '#343A46' : '#FFFFFF' }]}>
        {/* Header Section */}
        <View style={styles.header}>
          <Image
            source={require("../../../assets/icons/masherlogo2.png")}
            style={styles.logo}
            placeholder={require("../../../assets/icons/skeletonLoadingPlaceholder.gif")}
            placeholderContentFit="cover"
            contentFit="cover"
          />
          <AppText style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>We're Here to Help</AppText>
          <AppText style={[styles.subtitle, { color: isDark ? '#B1B9C8' : '#777' }]}>Get assistance 24/7 with any issue</AppText>
        </View>

        {/* Contact Options */}
        <List.Section>
          <List.Subheader style={styles.boldText}>Contact Us</List.Subheader>

          <List.Item
            title="Email Support"
            titleStyle={{ fontFamily: "Dosis_600SemiBold" }}
            // description="support@khareindustries.com"
            description="khareindustriesinc@gmail.com"
            descriptionStyle={styles.regularText}
            left={() => <List.Icon icon="email" />}
            onPress={() =>
              // Linking.openURL("mailto:support@khareindustries.com")
              Linking.openURL("mailto:khareindustriesinc@gmail.com")
            }
            style={{ paddingLeft: 10 }}
          />
          <Divider />
          <List.Item
            title="Call Support"
            titleStyle={{ fontFamily: "Dosis_600SemiBold" }}
            description="+91 8081998420"
            descriptionStyle={styles.regularText}
            left={() => <List.Icon icon="phone" />}
            onPress={() => Linking.openURL("tel:+918081998420")}
            style={{ paddingLeft: 10 }}
          />
          <Divider />
          {/* <List.Item
          title="💬 WhatsApp Support"
          description="Chat with us"
          // left={() => <List.Icon icon="whatsapp" />}
          onPress={() => Linking.openURL("https://wa.me/919876543210")}
        /> */}
        </List.Section>

        {/* FAQs Section */}
        <List.Section>
          <List.Subheader style={styles.boldText}>FAQs</List.Subheader>
          <List.Item
            title="View Frequently Asked Questions"
            titleStyle={{ fontFamily: "Dosis_600SemiBold" }}
            left={() => <List.Icon icon="help-circle-outline" />}
            onPress={() => navigation.navigate("FAQ")}
            style={{ paddingLeft: 10 }}
          />
        </List.Section>

        {/* Live Chat Support */}
        <List.Section>
          <List.Subheader style={styles.boldText}>Live Chat</List.Subheader>
          <AppText style={[styles.description, { color: isDark ? '#fff' : '#000' }]}>Get instant help from our support team through live chat.</AppText>
          <Button
            mode="contained"
            style={[styles.button, { backgroundColor: isDark ? '#007bff' : 'royalblue' }]}
            onPress={() => navigation.navigate("LiveChat")}
          >
            <AppText style={[styles.boldText, {color: '#fff'}]}>Start Live Chat</AppText>
          </Button>
        </List.Section>

        {/* Social Media */}
        <List.Section>
          <List.Subheader style={styles.boldText}>
            Connect With Us
          </List.Subheader>
          <List.Item
            title="X (formerly Twitter)"
            // left={() => <List.Icon icon="twitter" />}
            left={() => <FontAwesome6 name="x-twitter" size={24} color={colors.text} />}
            onPress={() => Linking.openURL("https://x.com/MasherKi")}
            style={{ paddingLeft: 10 }}
          />
          <Divider />
          <List.Item
            title="Instagram"
            left={() => <List.Icon icon="instagram" />}
            onPress={() => Linking.openURL("https://www.instagram.com/khareindustries/")}
            style={{ paddingLeft: 10 }}
          />
          <Divider />
          <List.Item
            title="LinkedIn"
            left={() => <List.Icon icon="linkedin" />}
            onPress={() => Linking.openURL("https://www.linkedin.com/company/masherbykhareindustries")}
            style={{ paddingLeft: 10 }}
          />
        </List.Section>

        {/* Business Hours */}
        <List.Section>
          <List.Subheader style={styles.boldText}>
            Business Hours
          </List.Subheader>
          <AppText style={[styles.description, { color: isDark ? '#fff' : '#000' }]}>Monday - Friday: 9:00 AM - 6:00 PM{"\n"}Saturday - Sunday: 10:00 AM - 4:00 PM</AppText>
        </List.Section>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: { alignItems: "center", marginVertical: 20 },
  logo: { width: 100, height: 100, marginBottom: 10, borderRadius: 20 },
  title: { marginBottom: 5, fontFamily: "Dosis_700Bold" },
  subtitle: { color: "#777", fontFamily: "Dosis_400Regular" },
  description: {
    paddingHorizontal: 20,
    marginBottom: 10,
    textAlign: "center",
    fontFamily: "Dosis_600SemiBold",
  },
  button: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "royalblue",
  },
  regularText: { fontFamily: "Dosis_400Regular" },
  boldText: { fontFamily: "Dosis_700Bold" },
  mediumText: { fontFamily: "Dosis_500Medium" },
});
