import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";

export type ClassroomTabs = { [name: string]: { content: JSX.Element } };

export interface ClassroomTabsProps {
  tabs: ClassroomTabs;
  initialTab?: string;
}

const ClassroomTabs = ({ tabs, initialTab }: ClassroomTabsProps) => {
  const [tab, setTab] = useState<string>(initialTab ?? Object.keys(tabs)[0]);

  return (
    <>
      <Tabs
        value={tab}
        onChange={(_, newValue) => setTab(newValue)}
        aria-label="classroom tabs"
        centered
      >
        {Object.keys(tabs).map((name) => {
          return <Tab key={name} label={name} value={name} />;
        })}
      </Tabs>
      {tab in tabs && tabs[tab].content}
    </>
  );
};

export default ClassroomTabs;
