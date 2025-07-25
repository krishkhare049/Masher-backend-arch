

// import React, {
//   createContext,
//   useState,
//   useContext,
//   useEffect,
//   useMemo,
//   ReactNode,
// } from 'react';
// import { MD3LightTheme } from 'react-native-paper';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// type Colors = {
//   primary: string;
//   background: string;
//   text: string;
// };

// type ThemeContextType = {
//   theme: any;
//   colors: Colors;
//   updateColors: (newColors: Partial<Colors>) => void;
// };

// const defaultColors: Colors = {
//   primary: '#4CAF50',
//   background: '#ffffff',
//   text: '#000000',
// };

// const ThemeContext = createContext<ThemeContextType>({
//   theme: MD3LightTheme,
//   colors: defaultColors,
//   updateColors: () => {},
// });

// export const ThemeProvider = ({ children }: { children: ReactNode }) => {
//   const [colors, setColors] = useState<Colors>(defaultColors);

//   useEffect(() => {
//     (async () => {
//       const saved = await AsyncStorage.getItem('custom-theme');
//       if (saved) {
//         setColors(JSON.parse(saved));
//       }
//     })();
//   }, []);

//   const updateColors = async (newColors: Partial<Colors>) => {
//     const merged = { ...colors, ...newColors };
//     setColors(merged);
//     await AsyncStorage.setItem('custom-theme', JSON.stringify(merged));
//   };

//   const theme = useMemo(() => {
//     return {
//       ...MD3LightTheme,
//       colors: {
//         ...MD3LightTheme.colors,
//         ...colors,
//       },
//     };
//   }, [colors]);

//   const contextValue = useMemo(
//     () => ({
//       theme,
//       colors,
//       updateColors,
//     }),
//     [theme, colors]
//   );

//   return (
//     <ThemeContext.Provider value={contextValue}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// export const useAppTheme = () => useContext(ThemeContext);

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
  ReactNode,
} from 'react';
import {
  MD3LightTheme,
  MD3DarkTheme,
  MD3Theme,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Font from 'expo-font';

type Colors = {
  primary: string;
  background: string;
  text: string;
};

type FontSettings = {
  fontFamily: string;
  fontSize: number;
};

type ThemeContextType = {
  theme: MD3Theme;
  colors: Colors;
  isDark: boolean;
  fontFamily: string;
  fontSize: number;
  toggleThemeMode: () => void;
  updateColors: (newColors: Partial<Colors>) => void;
  updateFontSettings: (settings: Partial<FontSettings>) => void;
  resetToDefaultTheme: () => void;
};

// 🎨 Default Light Theme (Customizable)
const defaultLightColors: Colors = {
  primary: '#4169E1',
  // background: '#ffffff',
  background: '#fdbe00',
  text: '#000000',
};

// 🌑 Fixed Dark Theme (Non-Customizable)
const fixedDarkColors: Colors = {
  primary: '#B1B9C8',
  background: '#222831',
  text: '#ffffff',
};

const defaultFontSettings: FontSettings = {
  fontFamily: 'Dosis_400Regular',
  fontSize: 16,
};

const ThemeContext = createContext<ThemeContextType>({
  theme: MD3LightTheme,
  colors: defaultLightColors,
  isDark: false,
  fontFamily: defaultFontSettings.fontFamily,
  fontSize: defaultFontSettings.fontSize,
  toggleThemeMode: () => {},
  updateColors: () => {},
  updateFontSettings: () => {},
   resetToDefaultTheme: ()=> {}
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [lightColors, setLightColors] = useState<Colors>(defaultLightColors);
  const [isDark, setIsDark] = useState(false);
  const [fontSettings, setFontSettings] = useState<FontSettings>(defaultFontSettings);


  const resetToDefaultTheme = async () => {
  await AsyncStorage.multiRemove([
    'custom-theme',
    'custom-font-settings',
    'theme-mode',
  ]);

  // Reset in-memory states
  setIsDark(false);
  setLightColors(defaultLightColors);
  setFontSettings(defaultFontSettings);
};

  // Load downloaded fonts on app startup
  const loadDownloadedFonts = async () => {
    try {
      const fontsDir = `${FileSystem.documentDirectory}fonts/`;
      const dirInfo = await FileSystem.getInfoAsync(fontsDir);
      
      if (!dirInfo.exists) return;
      
      const fontFiles = await FileSystem.readDirectoryAsync(fontsDir);
      const fontMap: { [key: string]: string } = {};
      
      // Group fonts by base name and use the first file for each family
      const fontGroups: { [key: string]: string[] } = {};
      
      fontFiles.forEach(file => {
        if (file.endsWith('.ttf') || file.endsWith('.woff2')) {
          const fontName = file.replace('.ttf', '').replace('.woff2', '');
          const baseName = fontName.split('_')[0];
          if (!fontGroups[baseName]) {
            fontGroups[baseName] = [];
          }
          fontGroups[baseName].push(file);
        }
      });
      
      // Use the first file for each font family
      Object.entries(fontGroups).forEach(([baseName, files]) => {
        if (files.length > 0) {
          fontMap[baseName] = `${fontsDir}${files[0]}`;
        }
      });
      
      if (Object.keys(fontMap).length > 0) {
        await Font.loadAsync(fontMap);
        console.log('✅ Loaded downloaded fonts on startup:', Object.keys(fontMap));
      }
    } catch (error) {
      console.log('Error loading downloaded fonts on startup:', error);
    }
  };

  useEffect(() => {
    (async () => {
      const savedColors = await AsyncStorage.getItem('custom-theme');
      const savedMode = await AsyncStorage.getItem('theme-mode');
      const savedFontSettings = await AsyncStorage.getItem('custom-font-settings');

      if (savedColors) setLightColors(JSON.parse(savedColors));
      if (savedMode) {
        setIsDark(savedMode === 'dark');
      } else {
        const system = Appearance.getColorScheme();
        setIsDark(system === 'dark');
      }
      if (savedFontSettings) setFontSettings(JSON.parse(savedFontSettings));
      
      // Load downloaded fonts
      await loadDownloadedFonts();
    })();
  }, []);

//   const findKeys = async () => {
//   const existing =  await AsyncStorage.getAllKeys();
// console.log("Current keys in storage:", existing);
//   }
//   findKeys()

  // ✅ Only update colors in light mode
  const updateColors = async (newColors: Partial<Colors>) => {
    if (isDark) return;
    const merged = { ...lightColors, ...newColors };
    setLightColors(merged);
    await AsyncStorage.setItem('custom-theme', JSON.stringify(merged));
  };

  const updateFontSettings = async (settings: Partial<FontSettings>) => {
    console.log('🔧 Updating font settings:', settings);
    const merged = { ...fontSettings, ...settings };
    console.log('🔧 New font settings:', merged);
    setFontSettings(merged);
    await AsyncStorage.setItem('custom-font-settings', JSON.stringify(merged));
    console.log('🔧 Font settings saved to AsyncStorage');
  };

  const toggleThemeMode = async () => {
    const next = !isDark;
    setIsDark(next);
    await AsyncStorage.setItem('theme-mode', next ? 'dark' : 'light');
  };

  const activeColors = isDark ? fixedDarkColors : lightColors;

  const theme = useMemo(() => {
    const base = isDark ? MD3DarkTheme : MD3LightTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        ...activeColors,
      },
    };
  }, [isDark, lightColors]);

  const contextValue = useMemo(
    () => ({
      theme,
      colors: activeColors,
      isDark,
      fontFamily: fontSettings.fontFamily,
      fontSize: fontSettings.fontSize,
      toggleThemeMode,
      updateColors,
      updateFontSettings,
       resetToDefaultTheme,
    }),
    [theme, activeColors, isDark, fontSettings]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(ThemeContext);
