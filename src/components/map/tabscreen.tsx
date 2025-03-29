import React, { useState } from 'react';

import TabButtons, { type TabButtonType } from './tab-button';

export enum CustomTab {
  TabVenues,
  TabGames,
}

export default function TabScreen() {
  const [selectedTab, setSelectedTab] = useState<CustomTab>(
    CustomTab.TabVenues
  );
  const buttons: TabButtonType[] = [{ title: 'Venues' }, { title: 'Games' }];
  return (
    <TabButtons
      buttons={buttons}
      selectedTab={selectedTab}
      setSelectedTab={setSelectedTab}
    />
  );
}
