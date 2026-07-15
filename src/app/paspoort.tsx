import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BalloonDetailSheet } from '@/components/balloons/balloon-detail-sheet';
import { ErrorBanner } from '@/components/home/error-banner';
import { PassportIdentity } from '@/components/passport/passport-identity';
import { PassportNextGoal } from '@/components/passport/passport-next-goal';
import { PassportSkeleton } from '@/components/passport/passport-skeleton';
import { PassportLockedSlot, PassportStampCard } from '@/components/passport/passport-stamp-card';
import { PassportStats } from '@/components/passport/passport-stats';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { usePassport, type PassportState } from '@/hooks/use-passport';
import { useTheme } from '@/hooks/use-theme';
import type { Balloon } from '@/lib/balloons';
import { triggerHaptic } from '@/lib/haptics';
import { homeMockData } from '@/mocks/home-mock-data';

export default function PaspoortScreen() {
  const insets = useSafeAreaInsets();
  const passport = usePassport();

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.three }]}>
        <ThemedText type="hero" themeColor="primary">
          Ballonpaspoort
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Jouw verzameling van 2026
        </ThemedText>
      </View>

      {passport.status === 'loading' && <PassportSkeleton />}

      {passport.status === 'error' && (
        <View style={styles.errorWrap}>
          <ErrorBanner message="Je paspoort kon niet worden geladen." onRetry={passport.retry} />
        </View>
      )}

      {passport.status === 'ready' && (
        <PassportReady
          passport={passport}
          bottomInset={insets.bottom + BottomTabInset + Spacing.six}
        />
      )}
    </ThemedView>
  );
}

function chunkInPairs<T>(items: T[]): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    rows.push(items.slice(i, i + 2));
  }
  return rows;
}

function PassportReady({
  passport,
  bottomInset,
}: {
  passport: Extract<PassportState, { status: 'ready' }>;
  bottomInset: number;
}) {
  const theme = useTheme();
  const [selectedBalloon, setSelectedBalloon] = useState<Balloon | null>(null);
  const { stamps, locked, totalPoints, found, total } = passport;

  const handlePressStamp = (balloon: Balloon) => {
    triggerHaptic('light');
    setSelectedBalloon(balloon);
  };

  return (
    <>
      <ScrollView
        style={styles.list}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: bottomInset }]}>
        <PassportIdentity nickname={homeMockData.nickname} />
        <PassportStats found={found} total={total} totalPoints={totalPoints} />

        {stamps.length > 0 ? (
          <View style={styles.grid}>
            {chunkInPairs(stamps).map((row, rowIndex) => (
              <View key={rowIndex} style={styles.gridRow}>
                {row.map((stamp, colIndex) => (
                  <PassportStampCard
                    key={stamp.balloon.id}
                    balloon={stamp.balloon}
                    spottedAt={stamp.spottedAt}
                    index={rowIndex * 2 + colIndex}
                    onPress={handlePressStamp}
                  />
                ))}
                {row.length === 1 && <View style={styles.gridFiller} />}
              </View>
            ))}
          </View>
        ) : (
          <ThemedText type="small" themeColor="textSecondary" style={styles.empty}>
            Nog geen stempels — spot je eerste ballon in de Bingo!
          </ThemedText>
        )}

        {locked.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <View style={[styles.accentBar, { backgroundColor: theme.primary }]} />
              <ThemedText type="smallBold" style={styles.sectionTitle} accessibilityRole="header">
                Nog te spotten
              </ThemedText>
            </View>
            <View style={styles.grid}>
              {chunkInPairs(locked).map((row, rowIndex) => (
                <View key={rowIndex} style={styles.gridRow}>
                  {row.map((balloon) => (
                    <PassportLockedSlot key={balloon.id} balloon={balloon} />
                  ))}
                  {row.length === 1 && <View style={styles.gridFiller} />}
                </View>
              ))}
            </View>
          </>
        )}

        <PassportNextGoal remaining={locked.length} onGoToBingo={() => router.push('/bingo')} />
      </ScrollView>

      {selectedBalloon && (
        <BalloonDetailSheet
          balloon={selectedBalloon}
          spotted
          onGoToBingo={() => {
            setSelectedBalloon(null);
            router.push('/bingo');
          }}
          onClose={() => setSelectedBalloon(null)}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.two,
    gap: 2,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  errorWrap: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  list: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    gap: Spacing.three,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  grid: {
    gap: Spacing.three,
  },
  gridRow: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  gridFiller: {
    flex: 1,
  },
  empty: {
    textAlign: 'center',
    paddingVertical: Spacing.four,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  accentBar: {
    width: 4,
    height: 18,
    borderRadius: Radius.pill,
  },
  sectionTitle: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
