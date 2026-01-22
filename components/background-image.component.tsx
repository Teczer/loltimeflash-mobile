import { LinearGradient } from 'expo-linear-gradient';
import { memo } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';

import { DEFAULT_SPLASH } from '@/assets/champions';
import { useBackgroundImage } from '@/stores/background.store';

interface IBackgroundImageProps {
  children: React.ReactNode;
}

/**
 * Background wrapper with gradient overlay
 * Uses static local champion splash arts for instant loading
 */
const BackgroundImageComponent = (props: IBackgroundImageProps) => {
  const { children } = props;
  const imageSource = useBackgroundImage() || DEFAULT_SPLASH;

  return (
    <ImageBackground
      source={imageSource}
      style={styles.container}
    >
      {/* Gradient overlay - mimics web's radial-gradient */}
      <LinearGradient
        colors={[
          'rgba(12, 59, 106, 0.3)',
          'rgba(3, 16, 30, 0.75)',
          'rgba(3, 16, 30, 0.80)',
          'rgba(3, 16, 30, 1)',
        ]}
        locations={[0, 0.2, 0.4, 0.7]}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Content */}
      <View style={styles.content}>
        {children}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export const BackgroundImage = memo(BackgroundImageComponent);
