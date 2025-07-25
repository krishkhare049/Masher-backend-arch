import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Button, Dialog, Portal } from "react-native-paper";
import TabBarIcon from "./TabBarIcon";

interface DeleteMessageConfirmationDialogProps {
  //   askMessVisible: boolean;
  hideAskDeleteMessDialog: () => void;
  deleteMessage: () => void;
  selectedMessageIdsLength: number;
  onCancel: () => void;
}

// export default function DeleteMessageConfirmationDialog({ askMessVisible, hideAskDeleteMessDialog, deleteMessage, selectedMessageIdsLength, onCancel}: DeleteMessageConfirmationDialogProps) {
// export default function DeleteMessageConfirmationDialog({ hideAskDeleteMessDialog, deleteMessage, selectedMessageIdsLength, onCancel}: DeleteMessageConfirmationDialogProps) {
function DeleteMessageConfirmationDialog({
  hideAskDeleteMessDialog,
  deleteMessage,
  selectedMessageIdsLength,
  onCancel,
}: DeleteMessageConfirmationDialogProps) {
  return (
    <Portal>
      <Dialog
        //   visible={askMessVisible}
        visible={true}
        onDismiss={hideAskDeleteMessDialog}
        style={{ backgroundColor: "#FFFFFF", borderRadius: 20 }}
      >
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <TabBarIcon name="delete" color="#000000" size={30} />
        </View>

        <Dialog.Title
          style={{
            fontFamily: "Dosis_700Bold",
            color: "#000000",
            textAlign: "center",
          }}
        >
          Delete Message
        </Dialog.Title>
        <Dialog.Content>
          <Text
            style={{
              fontFamily: "Dosis_400Regular",
              color: "#000000",
              textAlign: "center",
              fontSize: 17,
            }}
          >
            Are you sure!.
          </Text>
          <Text
            style={{
              fontFamily: "Dosis_400Regular",
              color: "#000000",
              textAlign: "center",
              fontSize: 17,
            }}
          >
            {/* {selectedMessageIds.length > 1 */}
            {selectedMessageIdsLength > 1
              ? "These messages"
              : "This message"}{" "}
            will be deleted permanently...
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            style={{ backgroundColor: "white", borderRadius: 10 }}
            onPress={() => {
              // console.log("Cancel");
              // handleHideMessageMenu();
              onCancel();
            }}
          >
            <Text style={{ color: "#000000" }}>Cancel</Text>
          </Button>
          <Button
            style={{ backgroundColor: "red", borderRadius: 10 }}
            onPress={deleteMessage}
          >
            <Text style={{ color: "#FFFFFF" }}>Unsend!</Text>
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

export default React.memo(
  DeleteMessageConfirmationDialog,
  (prevProps, nextProps) => {
    return (
      prevProps.hideAskDeleteMessDialog === nextProps.hideAskDeleteMessDialog &&
      prevProps.deleteMessage === nextProps.deleteMessage &&
      prevProps.selectedMessageIdsLength ===
        nextProps.selectedMessageIdsLength &&
      prevProps.onCancel === nextProps.onCancel
    );
  }
);

const styles = StyleSheet.create({});
