import { StyleSheet, Text, TextProps, View } from 'react-native';

import { cn } from '@/lib/utils';

interface ITitleTextProps extends TextProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'gold';
  strokeColor?: string;
  strokeWidth?: number;
}

const sizeClasses = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-3xl',
  xl: 'text-4xl',
};

const variantClasses = {
  default: 'text-foreground',
  gold: 'text-border',
};

// 8 directions for stroke effect (like web's multiple shadows)
const getStrokeOffsets = (width: number) => [
  { x: width, y: 0 },      // right
  { x: -width, y: 0 },     // left
  { x: 0, y: width },      // bottom
  { x: 0, y: -width },     // top
  { x: width, y: width },   // bottom-right
  { x: -width, y: -width }, // top-left
  { x: width, y: -width },  // top-right
  { x: -width, y: width },  // bottom-left
];

export const TitleText = (props: ITitleTextProps) => {
  const {
    children,
    size = 'lg',
    variant = 'default',
    strokeColor = 'rgba(0, 0, 0, 0.9)',
    strokeWidth = 2,
    className,
    style,
    ...rest
  } = props;

  const textClassName = cn(
    'font-sans-bold',
    sizeClasses[size],
    variantClasses[variant],
    className
  );

  const strokeOffsets = getStrokeOffsets(strokeWidth);

  return (
    <View style={styles.container}>
      {/* Stroke layers (8 shadows) */}
      {strokeOffsets.map((offset, index) => (
        <Text
          key={index}
          className={textClassName}
          style={[
            styles.strokeText,
            {
              textShadowColor: strokeColor,
              textShadowOffset: { width: offset.x, height: offset.y },
              textShadowRadius: 1,
            },
            style,
          ]}
          {...rest}
        >
          {children}
        </Text>
      ))}
      
      {/* Main text on top */}
      <Text
        className={textClassName}
        style={style}
        {...rest}
      >
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  strokeText: {
    position: 'absolute',
  },
});
