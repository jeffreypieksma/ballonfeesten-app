import { router } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BingoHeroCard } from '@/components/home/bingo-hero-card';
import { ConfettiBurst } from '@/components/home/confetti-burst';
import { DevStateSwitcher } from '@/components/home/dev-state-switcher';
import { ErrorBanner } from '@/components/home/error-banner';
import { EventStatusCard } from '@/components/home/event-status-card';
import { FeaturedBalloonCard } from '@/components/home/featured-balloon-card';
import { HomeHeader } from '@/components/home/home-header';
import { HomeSkeleton } from '@/components/home/home-skeletons';
import { LevelProgressCard } from '@/components/home/level-progress-card';
import { NoProgramNotice } from '@/components/home/no-program-notice';
import { OfflineBanner } from '@/components/home/offline-banner';
import { PassportPreview } from '@/components/home/passport-preview';
import { RecommendedMissionCard } from '@/components/home/recommended-mission-card';
import { SectionHeader } from '@/components/home/section-header';
import { SponsorMissionCard } from '@/components/home/sponsor-mission-card';
import { UpcomingProgramCard } from '@/components/home/upcoming-program-card';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useBingoSummary } from '@/hooks/use-bingo';
import { useHomeScreenState } from '@/hooks/use-home-screen-state';
import { useProfile } from '@/hooks/use-profile';
import { mockDataByState } from '@/mocks/home-mock-data';

export default function HomeScreen() {
  const { state, setState } = useHomeScreenState();
  const insets = useSafeAreaInsets();
  const bingoSummary = useBingoSummary();
  const profileState = useProfile();
  const data = mockDataByState[state];
  // In the production scenario the hero shows real stored bingo progress;
  // other dev scenarios keep their mock values so the state switcher still works.
  const bingoProgress = state === 'active' && bingoSummary ? bingoSummary : data.bingo;
  const nickname =
    profileState.status === 'ready' && profileState.profile ? profileState.profile.nickname : data.nickname;

  const devSwitcherOffset = insets.bottom + BottomTabInset + Spacing.two;

  if (state === 'loading') {
    return <HomeSkeleton />;
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + BottomTabInset + Spacing.six },
        ]}>
        <HomeHeader
          nickname={nickname}
          levelName={data.level.levelName}
          eventStatus={data.eventStatus}
          onPressProfile={() => router.push('/programma')}
        />

        {state === 'offline' && <OfflineBanner />}
        {state === 'error' && <ErrorBanner onRetry={() => setState('active')} />}

        <BingoHeroCard
          progress={bingoProgress}
          isNewUser={state === 'new'}
          onPressStart={() => router.push('/bingo')}
        />

        {state === 'noProgram' ? (
          <NoProgramNotice />
        ) : (
          <EventStatusCard status={data.eventStatus} onPressMore={() => router.push('/programma')} />
        )}

        <RecommendedMissionCard mission={data.recommendedMission} onPress={() => router.push('/bingo')} />

        <SectionHeader title="Jouw ballonpaspoort" actionLabel="Bekijk mijn paspoort" onPressAction={() => router.push('/paspoort')} />
        <PassportPreview
          lastStamp={data.lastStamp}
          collection={data.collection}
          justStamped={state === 'rowCompleted'}
          onPress={() => router.push('/paspoort')}
        />

        {data.program.length > 0 && (
          <>
            <SectionHeader
              title="Vandaag op het programma"
              actionLabel="Bekijk volledig programma"
              onPressAction={() => router.push('/programma')}
            />
            <UpcomingProgramCard items={data.program} onPressItem={() => router.push('/programma')} />
          </>
        )}

        <LevelProgressCard level={data.level} isNewBadge={state === 'rowCompleted'} />

        <FeaturedBalloonCard balloon={data.featuredBalloon} onPress={() => router.push('/ballonnen')} />

        <SponsorMissionCard sponsor={data.sponsor} />
      </ScrollView>

      {state === 'rowCompleted' && <ConfettiBurst />}

      {__DEV__ && (
        <DevStateSwitcher current={state} onSelect={setState} bottomOffset={devSwitcherOffset} />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.three,
    gap: Spacing.four,
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
  },
});
