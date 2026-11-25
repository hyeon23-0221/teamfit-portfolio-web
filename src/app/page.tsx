'use client';

import React, { useState } from 'react';
import { Tabs, ActiveTab } from '@/components/Tabs';
import { TeamBuilder } from '@/components/team-builder/TeamBuilder';
import { PortfolioView } from '@/components/portfolio/PortfolioView';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('team-builder');

  return (
    <div className="max-w-3xl mx-auto">
      <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'team-builder' ? (
        <TeamBuilder />
      ) : (
        <PortfolioView />
      )}
    </div>
  );
}
