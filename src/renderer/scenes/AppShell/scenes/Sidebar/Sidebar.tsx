import React from "react";
import { Box, Button, Stack, Tabs, Text, rem } from "@mantine/core";
import { type ToOptions, useNavigate } from "@tanstack/react-router";
import { IconCirclePlus, type Icon } from "@tabler/icons-react";

import { useIsMobile } from "~/renderer/hooks/useIsMobile";
import { useHistory } from "~/renderer/hooks";
import context from "~/renderer/ipc/bookGridContextApi";
import { Bottom, SegmentedTabList } from "./components";
import classes from "./Sidebar.module.css";

export type SidebarMarkup = {
    name: string;
    Icon: Icon;
    innerTabs: {
        tabHeading: string;
        tabs: {
            name: string;
            to: ToOptions["to"];
            Icon?: Icon;
            canBeClosed?: boolean;
        }[];
    }[];
}[];

const desktopProps = { variant: "outline" };
const mobileProps = { variant: "pills" };

const Sidebar = ({ markup, close }: { markup: SidebarMarkup; close: () => void }) => {
    const isMobile = useIsMobile();
    const navigate = useNavigate();
    const { currentPath } = useHistory();

    const openFileDialog = async () => {
        const distinctFileCount = await context.openFileDialog();
    };

    const changeTab = (to: ToOptions["to"]) => {
        navigate({ to });
        close();
    };

    return (
        <Tabs
            variant="pills"
            classNames={{
                tab: classes.outerTab,
                panel: classes.outerPanel,
            }}
            orientation="horizontal"
            defaultValue={markup[0]?.name}
        >
            <Stack h={48} mr="sm" justify="center">
                {markup.length > 1 ? (
                    <SegmentedTabList markup={markup} />
                ) : (
                    <Button
                        onClick={openFileDialog}
                        leftSection={<IconCirclePlus className={classes.icon} />}
                        variant="outline"
                        mx="xs"
                    >
                        Add books
                    </Button>
                )}
                {/* {markup.length > 1 && <SegmentedTabList markup={markup} />} */}
                {/* <SegmentedTabList
                    markup={markup}
                    style={{ visibility: markup.length > 1 ? "visible" : "hidden" }}
                /> */}
                {/* <Tabs.List>
                    {markup.map((outerTab) => (
                        <Tabs.Tab
                            key={outerTab.name}
                            value={outerTab.name}
                            leftSection={<outerTab.Icon className={classes.icon} />}
                        />
                    ))}
                </Tabs.List> */}
            </Stack>

            {markup.map((outerTab) => (
                <Tabs.Panel key={outerTab.name} value={outerTab.name}>
                    {outerTab.innerTabs.map((innerTab) => (
                        <Tabs
                            key={innerTab.tabHeading}
                            classNames={{ root: classes.root, list: classes.list }}
                            defaultValue={currentPath}
                            keepMounted={true}
                            onChange={changeTab}
                            {...(isMobile ? mobileProps : desktopProps)}
                        >
                            <Stack p={0} m={0} gap={0} h="100%">
                                <Tabs.List>
                                    <Text className={classes.tabHeading} c="dimmed">
                                        {innerTab.tabHeading}
                                    </Text>

                                    {innerTab.tabs.map((tab) => (
                                        <Tabs.Tab
                                            key={tab.to}
                                            value={tab.to}
                                            role="link"
                                            leftSection={
                                                tab.Icon && <tab.Icon className={classes.icon} />
                                            }
                                        >
                                            {tab.name}
                                        </Tabs.Tab>
                                    ))}
                                </Tabs.List>
                            </Stack>
                        </Tabs>
                    ))}
                </Tabs.Panel>
            ))}
        </Tabs>
    );
};

Sidebar.Bottom = Bottom;

export { Sidebar };
