import { Dimensions, PixelRatio } from 'react-native';

// Convert DP to PX
const dpToPx = (dp: number) => PixelRatio.getPixelSizeForLayoutSize(dp);

// Convert PX to DP
const pxToDp = (px: number) => px / PixelRatio.get();

export function getMediaViewSize(
  scale: 'square' | 'wide' = 'square'
): { width: number; height: number } {
  const screenWidth = Dimensions.get('window').width;

  // Target 35% of screen width but not less than 120dp
  const minSizeDp = 150;
  const idealWidth = screenWidth * 0.35;

  let widthDp = pxToDp(idealWidth);
  if (widthDp < minSizeDp) widthDp = minSizeDp;

  let width = widthDp;
  let height = scale === 'wide' ? widthDp * 0.5625 : widthDp; // 16:9 or square

  return {
    width,
    height,
  };
}