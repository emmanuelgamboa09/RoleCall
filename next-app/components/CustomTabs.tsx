import { Tab, Tabs } from "@mui/material";
import { useState } from "react";

export type CustomTabs = { [name: string]: { content: JSX.Element } };

export interface CustomTabsProps {
  tabs: CustomTabs;
  initialTab?: string;
}

const CustomTabs = ({ tabs, initialTab }: CustomTabsProps) => {
  const [tab, setTab] = useState<string>(initialTab ?? Object.keys(tabs)[0]);
  return (
    <>
      <Tabs
        value={tab}
        onChange={(_, newValue) => setTab(newValue)}
        aria-label="tabs"
        centered
      >
        {Object.keys(tabs).map((name) => {
          return (
            <Tab key={name} label={name} value={name} data-testid={name} />
          );
        })}
      </Tabs>
      {tab in tabs && tabs[tab].content}
    </>
  );
};

export const CustomScrollableTabs = ({ tabs, initialTab }: CustomTabsProps) => {
  const [tab, setTab] = useState<string>(initialTab ?? Object.keys(tabs)[0]);

  return (
    <>
      <Tabs
        value={tab}
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
        onChange={(_, newValue) => setTab(newValue)}
        aria-label="tabs"
      >
        {Object.keys(tabs).map((name) => {
          return (
            <Tab key={name} label={name} value={name} data-testid={name} />
          );
        })}
      </Tabs>
      {tab in tabs && tabs[tab].content}
    </>
  );
};

export default CustomTabs;
