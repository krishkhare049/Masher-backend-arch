import { ScrollView, StyleSheet, View } from "react-native";
import React from "react";
import { List } from "react-native-paper";
import { useAppTheme } from "../../ThemeContext";
import AppText from "../../components/AppText";

export default function FAQ() {
  const { isDark, colors } = useAppTheme();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: isDark ? '#343A46' : '#fff' }}>
      <AppText
        style={{ fontSize: 20, margin: 10, color: colors.text }}
      >
        FAQ (Frequently asked questions)
      </AppText>

      <View>
        <List.AccordionGroup>
          <List.Accordion
            // expanded={true}
            style={{ padding: 10, backgroundColor: isDark ? '#343A46' : "#ffffff" }}
            titleStyle={{ color: colors.text }}
            left={() => <List.Icon icon="chat" color={colors.primary} />}
            title="How do we store your conversations ?"
            id="1"
          >
            {/* <List.Item title="Item 1" /> */}
            <List.Section style={{ backgroundColor: colors.primary }}>
              <AppText
                style={{
                  fontFamily: "Dosis_500Medium",
                  textAlign: "center",
                  backgroundColor: isDark ? "#222831" : "whitesmoke",
                  padding: 10,
                  fontSize: 16,
                  color: isDark ? '#fff' : colors.text,
                }}
              >
                When you send message to anyone, we encrypts it and stores it in
                our servers, but we don't store your messages permanently. Once
                your messages is received by recipients we delete them
                immediately. Hence no one can see your conversations not even
                us.
              </AppText>
            </List.Section>
          </List.Accordion>
          <List.Accordion
            // expanded={true}
            style={{ padding: 10, backgroundColor: isDark ? '#343A46' : "#ffffff" }}
            titleStyle={{ color: colors.text }}
            left={() => <List.Icon icon="security" color={colors.primary} />}
            title="Are my messages end-to-end encrypted ?"
            id="2"
          >
            {/* <List.Item title="Item 1" /> */}
            <List.Section style={{ backgroundColor: colors.primary }}>
              <AppText
                style={{
                  fontFamily: "Dosis_500Medium",
                  textAlign: "center",
                  backgroundColor: isDark ? "#222831" : "whitesmoke",
                  padding: 10,
                  fontSize: 16,
                  color: isDark ? '#fff' : colors.text,
                }}
              >
                Yes, your messages are end to end encrypted. And your passwords are hashed. Therefore, you are secure.
              </AppText>
            </List.Section>
          </List.Accordion>
          <List.Accordion
            // expanded={true}
            style={{ padding: 10, backgroundColor: isDark ? '#343A46' : "#ffffff"  }}
            titleStyle={{ color: colors.text }}
            left={() => <List.Icon icon="history" color={colors.primary} />}
            title="Do we store your chat history permanently ?"
            id="3"
          >
            {/* <List.Item title="Item 1" /> */}
            <List.Section style={{ backgroundColor: colors.primary }}>
              <AppText
                style={{
                  fontFamily: "Dosis_500Medium",
                  textAlign: "center",
                  backgroundColor: isDark ? "#222831" : "whitesmoke",
                  padding: 10,
                  fontSize: 16,
                  color: isDark ? '#fff' : colors.text,
                }}
              >
                No, we delete your messages from our servers as soon as your friends/recipients receives them.
              </AppText>
            </List.Section>
          </List.Accordion>
          <List.Accordion
            // expanded={true}
            style={{ padding: 10, backgroundColor: isDark ? '#343A46' : "#ffffff"  }}
            titleStyle={{ color: colors.text }}
            left={() => <List.Icon icon="delete" color={colors.primary} />}
            title="What happens if I delete a message ?"
            id="4"
          >
            {/* <List.Item title="Item 1" /> */}
            <List.Section style={{ backgroundColor: colors.primary }}>
              <AppText
                style={{
                  fontFamily: "Dosis_500Medium",
                  textAlign: "center",
                  backgroundColor: isDark ? "#222831" : "whitesmoke",
                  padding: 10,
                  fontSize: 16,
                  color: isDark ? '#fff' : colors.text,
                }}
              >
                Then the message will be deleted and the receiver won't receive any notification regarding message deletion. Ha ha ha!
              </AppText>
            </List.Section>
          </List.Accordion>

        </List.AccordionGroup>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
