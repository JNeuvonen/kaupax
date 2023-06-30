import { TEXT_GREY } from "@/utils/constants";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useRouter } from "next/router";
import * as React from "react";
import { PageTabItem } from "./Pages/Kilpailutukset/tabItems";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ paddingTop: "24px" }}>{children}</Box>}
    </div>
  );
}

export function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function TabsWrapper({
  defaultValue,
  tabPanels,
}: {
  defaultValue: number;
  tabPanels: PageTabItem[];
}) {
  const [value, setValue] = React.useState(defaultValue);
  const router = useRouter();

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
        >
          {tabPanels.map((panel, index) => {
            return (
              <Tab
                onClick={() => router.push(panel.href)}
                label={panel.label}
                {...a11yProps(index)}
                sx={{
                  textTransform: "capitalize",
                  color: TEXT_GREY,
                  opacity: value !== index ? 0.5 : 1,
                }}
                key={index}
              />
            );
          })}
        </Tabs>
      </Box>
      {tabPanels.map((panel, index) => {
        return (
          <TabPanel value={value} index={index} key={index}>
            {panel.component()}
          </TabPanel>
        );
      })}
    </Box>
  );
}
