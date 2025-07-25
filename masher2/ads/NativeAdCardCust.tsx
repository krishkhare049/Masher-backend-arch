import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { InterstitialAd, AdEventType, TestIds, BannerAd, useForeground, BannerAdSize, NativeAd, NativeMediaAspectRatio, NativeAdChoicesPlacement, NativeAdView, NativeAsset, NativeAssetType, NativeMediaView } from 'react-native-google-mobile-ads';
import { Image } from 'expo-image';
import AppText from '../src/components/AppText';
import { getMediaViewSize } from '../src/utilities/getMediaSizeView';
import { useAppTheme } from '../src/ThemeContext';
import TabBarIcon from '../src/components/TabBarIcon';
export default function NativeAdCardCust() {
     const [nativeAd, setNativeAd] = useState<NativeAd>();

     const {colors} = useAppTheme();

     const mediaSize = getMediaViewSize('wide');

  useEffect(() => {
    NativeAd.createForAdRequest(TestIds.NATIVE, {
         aspectRatio: NativeMediaAspectRatio.LANDSCAPE,
          adChoicesPlacement: NativeAdChoicesPlacement.TOP_LEFT,
        
    })
      .then(setNativeAd)
      .catch(console.error);
  }, []);

  

  if (!nativeAd) {
    return null;
  }

//   return (
// <View style={{
//   padding: 5,
//   backgroundColor: 'whitesmoke',
//   borderRadius: 10,
//   margin: 5,
//   elevation: 1, 
// }}>

//   <NativeAdView nativeAd={nativeAd}>
//     <View style={{
//       flexDirection: 'row',
//       alignItems: 'center',
//       justifyContent: 'space-between',
//     }}>
//       {/* Icon + Headline */}
//       <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>

//         {/* Ad Attribution */}
//                 <Text style={styles.adAttribution}>Sponsored</Text> 
//                 {/* You can also use "Advertisement" or "Sponsored" */}

//         {/* {nativeAd.icon && (
//           <NativeAsset assetType={NativeAssetType.ICON}>
//             <Image
//               source={{ uri: nativeAd.icon.url }}
//               style={{ width: 40, height: 40, borderRadius: 5, marginRight: 10 }}
//             />
//           </NativeAsset>
//         )} */}

//         <NativeAsset assetType={NativeAssetType.HEADLINE}>
//           <Text style={{ fontSize: 14, fontWeight: '600', flexShrink: 1, }}>
//             {nativeAd.headline}
//           </Text>
//         </NativeAsset>
//       </View>

//       {/* CTA */}
//       <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
     
//           <Text style={{ color: 'white', fontSize: 12, backgroundColor: '#007aff',
//           paddingVertical: 6,
//           paddingHorizontal: 12,
//           borderRadius: 6, }}>
//             {nativeAd.callToAction}
//           </Text>
//       </NativeAsset>
//     </View>
//     {/* <NativeAsset assetType={NativeAssetType.BODY}>
     
//           <Text style={{ fontSize: 12,
//           paddingVertical: 6,
//           paddingHorizontal: 12,
//           borderRadius: 6, }}>
//             {nativeAd.body}
//           </Text>
//       </NativeAsset> */}
//       {/* <View style={{ width: 200, height: 200, justifyContent: 'center'}}> */}

//     <NativeMediaView style={{width: mediaSize.width, height: mediaSize.height, margin: 'auto'}}/>
//       {/* </View> */}
//   </NativeAdView>
// </View>
//   )
  return (
<View style={{
  padding: 5,
  backgroundColor: 'whitesmoke',
//   backgroundColor: 'royalblue',
  // borderWidth: 1, 
  // borderColor: 'violet',
  borderRadius: 20,
  margin: 5,
//   elevation: 5, 
}}>

  <NativeAdView nativeAd={nativeAd}>


    <View style={{
      flexDirection: 'row',
      // alignItems: 'center',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      // flexWrap: 'wrap',
    }}>
      
      {/* Icon + Headline */}
      <View style={{ alignItems: 'center', justifyContent: 'center', flexShrink: 1,   // 👈 Allow shrinking
    flexGrow: 0,     // 👈 Don't expand
    minWidth: 0, }}>

      {/* Ad Attribution */}
         <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center',  alignSelf: 'flex-start', // Position it in a corner or prominent location
         backgroundColor: '#ffffff', // Add a background to make it stand out
         padding: 5,
         borderRadius: 5,
         margin: 5,
         //  position: 'absolute'
         }}>
           <TabBarIcon name="bullhorn" size={12} color="#000000" />
                 <Text style={styles.adAttribution2}>Sponsored</Text> 
                 </View>
       
                {/* You can also use "Advertisement" or "Sponsored" */}

        {/* {nativeAd.icon && (
          <NativeAsset assetType={NativeAssetType.ICON}>
            <Image
              source={{ uri: nativeAd.icon.url }}
              style={{ width: 40, height: 40, borderRadius: 5, marginRight: 10 }}
            />
          </NativeAsset>
        )} */}

        <NativeAsset assetType={NativeAssetType.HEADLINE}>
          <Text style={{ fontSize: 13, fontWeight: '600', marginVertical: 5, color: '#000000', width: '100%', textAlign: 'center', paddingTop: 10,  }}>
           {nativeAd.headline}
          </Text>
        </NativeAsset>
      {/* CTA */}
      <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
     
          <Text style={{ color: '#000000', fontSize: 12, backgroundColor: '#FFFFFF',
          paddingVertical: 6,
          paddingHorizontal: 12,
          borderRadius: 6, marginVertical: 5, fontWeight: 'bold', elevation: 2 }}>
            {nativeAd.callToAction}
          </Text>
      </NativeAsset>
      <NativeAsset assetType={NativeAssetType.BODY}>
     
           <Text style={{ fontSize: 11, marginVertical: 5, color: '#000000', width: '100%', textAlign: 'center', paddingTop: 10, paddingHorizontal: 10 }}>
           {nativeAd.body}
          </Text>
      </NativeAsset>
      </View>

    {/* <NativeAsset assetType={NativeAssetType.BODY}>
     
     <Text style={{ fontSize: 12,
     paddingVertical: 6,
     paddingHorizontal: 12,
     borderRadius: 6, }}>
     {nativeAd.body}
     </Text>
     </NativeAsset> */}
      {/* <View style={{ width: 200, height: 200, justifyContent: 'center'}}> */}

    <NativeMediaView style={{width: mediaSize.width, height: mediaSize.height}}/>
     </View>
      {/* </View> */}
  </NativeAdView>
</View>
  )
}

const styles = StyleSheet.create({
      adAttribution: {
        fontSize: 12,
        color: '#888',
        fontWeight: 'bold',
        alignSelf: 'flex-end', // Position it in a corner or prominent location
        backgroundColor: '#e0e0e0', // Add a background to make it stand out
        paddingHorizontal: 5,
        borderRadius: 3,
        margin: 5,
    },
      adAttribution2: {
        fontSize: 11,
        color: '#000000',
        fontWeight: 'bold',
        // alignSelf: 'flex-start', // Position it in a corner or prominent location
        // backgroundColor: '#ffffff', // Add a background to make it stand out
        // paddingHorizontal: 5,
        // borderRadius: 3,
        // margin: 5,
        marginLeft: 5,
    },
})