import { SxProps, Tab, Tabs, Theme } from "@mui/material";
import { useState } from "react";

export type CustomTabs = { [name: string]: { content: JSX.Element } };

export interface CustomTabsProps {
  tabs: CustomTabs;
  initialTab?: string;
  tabsSxProp?: SxProps<Theme> | undefined;
}

const CustomTabs = ({ tabs, initialTab, tabsSxProp }: CustomTabsProps) => {
  const [tab, setTab] = useState<string>(initialTab ?? Object.keys(tabs)[0]);
  return (
    <>
      <Tabs
        value={tab}
        onChange={(_, newValue) => setTab(newValue)}
        aria-label="tabs"
        centered
        sx={tabsSxProp}
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

export const CustomScrollableTabs = ({
  tabs,
  initialTab,
  tabsSxProp,
}: CustomTabsProps) => {
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
        sx={tabsSxProp}
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
