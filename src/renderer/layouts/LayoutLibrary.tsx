import React from "react";
import { Outlet } from "@tanstack/react-router";

import { AddBooksButton, AppShell, LayoutMarkup } from "~/renderer/scenes";
import { getHomeMarkup } from "./sharedLayoutMarkup";
import { useStorageBooks } from "../stores";
import { BookViewStoreContextProvider } from "../contexts";

const libraryLayoutMarkup: LayoutMarkup = {
    showFilterMenu: true,
    getAppShellProps: (openedNavbar, openedAside) => ({
        navbar: { width: 200, breakpoint: "sm", collapsed: { mobile: !openedNavbar } },
        aside: { width: 200, breakpoint: "sm", collapsed: { mobile: true, desktop: true } },
    }),

    getNavbarMarkup: (openedBookRecords) => [getHomeMarkup(openedBookRecords)],
    navbarTopSection: <AddBooksButton />,
    getAsideMarkup: () => [],
    asideTopSection: null,
    scrollArea: true,
    mainBoxProps: { p: "md" },
};

export const LayoutLibrary = () => {
    const { metaBookRecords } = useStorageBooks();

    return (
        <AppShell layoutMarkup={libraryLayoutMarkup}>
            <BookViewStoreContextProvider metaBookRecords={metaBookRecords}>
                <Outlet />
            </BookViewStoreContextProvider>
        </AppShell>
    );
};
