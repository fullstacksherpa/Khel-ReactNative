import React from 'react';

import { useGameVenue } from '@/lib/games-venues-store';

import TabButtons, { type TabButtonType } from './tab-button';

export enum CustomTab {
  TabVenues,
  TabGames,
}

export default function TabScreen() {
  const currentSelection = useGameVenue.use.currentSelection();
  const setCurrentSelection = useGameVenue.use.setCurrentSelection();
  const buttons: TabButtonType[] = [{ title: 'Venues' }, { title: 'Games' }];
  const selectedTab =
    currentSelection === 'venues' ? CustomTab.TabVenues : CustomTab.TabGames;

  const handleTabPress = (index: number) => {
    const selection = index === 0 ? 'venues' : 'games';
    setCurrentSelection(selection);
  };
  //TODO: remove later
  console.log(currentSelection);
  return (
    <TabButtons
      buttons={buttons}
      selectedTab={selectedTab}
      setSelectedTab={handleTabPress}
    />
  );
}
