// utils/playMessageSound.ts
import { useAudioPlayer } from 'expo-audio';

const audioSource = require('../../assets/sounds/message.mp3');

export async function playMessageSound() {
  try {
    // const { sound } = await Audio.Sound.createAsync(
    //   require("../sounds/notification-pretty-good.mp3") // ✅ Adjust path
    // );

    // await sound.playAsync();

     const player = useAudioPlayer(audioSource);
player.seekTo(0);
          player.play();

    // ✅ Auto-unload sound after it finishes
    // sound.setOnPlaybackStatusUpdate((status) => {
    //   if (status.didJustFinish) {
    //     sound.unloadAsync();
    //   }
    // });
  } catch (error) {
    console.log("❌ Error playing message sound:", error);
  }
}
