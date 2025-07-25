import { Linking, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Divider, List } from 'react-native-paper'

export default function LiveChat() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={[styles.mediumText, {fontSize: 18}]}>This functionality is currently under development!</Text>
      <Text style={[styles.boldText, {fontSize: 20, marginTop: 10}]}>For any queries:-</Text>

         {/* Contact Options */}
        <List.Section>
          {/* <List.Subheader style={styles.boldText}>Contact Us</List.Subheader> */}

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

    </View>
  )
}

const styles = StyleSheet.create({
  button: { marginHorizontal: 20, marginBottom: 20, backgroundColor: 'royalblue' },
  regularText: { fontFamily: "Dosis_400Regular" },
  boldText: { fontFamily: "Dosis_700Bold" },
  mediumText: { fontFamily: "Dosis_500Medium" },
})