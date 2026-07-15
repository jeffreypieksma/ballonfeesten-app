import { ThemedText, type ThemedTextProps } from '@/components/themed-text';
import { useCountUp } from '@/hooks/use-count-up';

type PointsCounterProps = {
  value: number;
  suffix?: string;
} & Pick<ThemedTextProps, 'type' | 'themeColor' | 'style'>;

export function PointsCounter({ value, suffix = '', type = 'smallBold', themeColor, style }: PointsCounterProps) {
  const displayValue = useCountUp(value);

  return (
    <ThemedText type={type} themeColor={themeColor} style={[{ fontVariant: ['tabular-nums'] }, style]}>
      {displayValue}
      {suffix}
    </ThemedText>
  );
}
