import React, { useState } from "react";
import { Box, Button, CloseButton, ScrollArea, Stack, Tabs, Text } from "@mantine/core";
import { type ToOptions, useNavigate, useParams } from "@tanstack/react-router";
import { IconCirclePlus, type Icon } from "@tabler/icons-react";

import context from "~/renderer/ipc/fileOperations";
import { BookKey, BookStateOpened, bookStore, useOpenedBooks } from "~/renderer/stores";
import { useHistory, useIsMobile } from "~/renderer/hooks";
import { Bottom, SegmentedTabList } from "./components";
import classes from "./Sidebar.module.css";

type Params = ToOptions["params"] & { bookKey?: BookKey };
export type NavParams = {
    to: ToOptions["to"];
    params?: Params;
};

export type SidebarTab = {
    /** Must match the `useHistory`'s `currentPath` for default value to work */
    id: string;
    name: string;
    navParams: NavParams;
    Icon?: Icon;
    canBeClosed?: boolean;
};
export type SidebarInnerTab = {
    tabHeading: string;
    tabs: SidebarTab[];
};

export type SidebarMarkup = {
    name: string;
    Icon: Icon;
    innerTabs: SidebarInnerTab[];
    Component?: (...args: any[]) => React.ReactNode;
    componentProps?: object;
}[];

const desktopProps = { variant: "outline" };
const mobileProps = { variant: "pills" };

// TODO use another router (<Outlet/>) to render Sidebar tabs' content
// TODO tab panel scrollarea
export const Sidebar = ({
    getMarkup,
    topSection,
    onChangeTab,
    children,
}: {
    getMarkup: (openedBookRecords: BookStateOpened[]) => SidebarMarkup;
    topSection?: React.ReactNode;
    onChangeTab: () => void;
    children?: React.ReactNode;
}) => {
    const isMobile = useIsMobile();
    const navigate = useNavigate();
    const { currentPath } = useHistory();
    const params: Params = useParams({ strict: false });

    const openedBooks = useOpenedBooks();

    const markup = getMarkup(openedBooks);

    const closeBook = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, tab: SidebarTab) => {
        e.stopPropagation();

        if ("bookKey" in tab.navParams?.params) {
            const tabBookKey = tab.navParams.params.bookKey;
            bookStore.closeBook(tabBookKey);

            const isTabCurrentlyOpen = params.bookKey === tabBookKey;
            if (isTabCurrentlyOpen) {
                const isPreviousTabAvaliable = markup.some(({ innerTabs }) =>
                    innerTabs.some(({ tabs }) =>
                        tabs.some((tab) => tab.id === previousInnerTab && tab.id !== activeInnerTab)
                    )
                );

                const homeTab = markup[0].innerTabs[0].tabs[0].id;
                const nextTo = isPreviousTabAvaliable ? previousInnerTab : homeTab;

                navigate({ to: nextTo });
                setActiveInnerTab(nextTo);
            }
        }
    };

    const [previousInnerTab, setPreviousInnerTab] = useState<string | null>(null);
    const [activeInnerTab, setActiveInnerTab] = useState(decodeURIComponent(currentPath));

    const changeTab = (id: string, innerTab: SidebarInnerTab) => {
        if (id === activeInnerTab) return;

        const { navParams } = innerTab.tabs.find((tab) => tab.id === id);
        navigate(navParams);
        setPreviousInnerTab(activeInnerTab);
        setActiveInnerTab(id);

        onChangeTab();
    };

    return (
        <>
            <Tabs
                variant="pills"
                classNames={{
                    tab: classes.outerTab,
                    panel: classes.outerPanel,
                }}
                orientation="horizontal"
                defaultValue={markup[0]?.name}
            >
                {(topSection || markup.length > 1) && (
                    <Stack h={48} mr="sm" justify="center">
                        {topSection}
                        {markup.length > 1 && <SegmentedTabList markup={markup} />}
                    </Stack>
                )}

                {markup.map((outerTab) => (
                    <Tabs.Panel key={outerTab.name} value={outerTab.name}>
                        {outerTab.Component && (
                            <Box px="md" pl={0} py="sm">
                                <outerTab.Component {...outerTab.componentProps} />
                            </Box>
                        )}
                        {outerTab.innerTabs
                            .filter((innerTab) => innerTab.tabs.length)
                            .map((innerTab) => (
                                <Tabs
                                    key={innerTab.tabHeading}
                                    classNames={{
                                        root: classes.root,
                                        list: classes.list,
                                        tab: classes.tab,
                                        tabLabel: classes.tabLabel,
                                        tabSection: classes.tabSection,
                                    }}
                                    value={activeInnerTab}
                                    onChange={(value) => changeTab(value, innerTab)}
                                    {...(isMobile ? mobileProps : desktopProps)}
                                >
                                    <Stack p={0} m={0} gap={0} h="100%">
                                        <Tabs.List>
                                            <Text className={classes.tabHeading} c="dimmed">
                                                {innerTab.tabHeading}
                                            </Text>

                                            {innerTab.tabs.map((tab) => (
                                                <Tabs.Tab
                                                    component="div"
                                                    key={tab.id}
                                                    value={tab.id}
                                                    role="link"
                                                    leftSection={
                                                        tab.Icon && (
                                                            <tab.Icon className={classes.icon} />
                                                        )
                                                    }
                                                    rightSection={
                                                        tab.canBeClosed && (
                                                            <CloseButton
                                                                size="sm"
                                                                onClick={(e) => closeBook(e, tab)}
                                                            />
                                                        )
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
            <Bottom>{children}</Bottom>
        </>
    );
};
