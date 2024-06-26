import { createTheme } from "@mantine/core";

import "./theme.css";
import button from "./components/Button.module.css";
import tabs from "./components/Tabs.module.css";
import modal from "./components/Modal.module.css";
import input from "./components/Input.module.css";
import switchInput from "./components/Switch.module.css";
import checkboxInput from "./components/Checkbox.module.css";
import passwordInput from "./components/PasswordInput.module.css";
import scrollArea from "./components/ScrollArea.module.css";
import select from "./components/Select.module.css";
import slider from "./components/Slider.module.css";

export const baseTheme = createTheme({
    fontFamily:
        'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;',
    headings: {
        fontFamily: undefined,
        fontWeight: undefined,
        sizes: {
            h1: { fontSize: "2.125rem", lineHeight: "1.3", fontWeight: undefined },
            h2: { fontSize: "1.625rem", lineHeight: "1.35", fontWeight: undefined },
            h3: { fontSize: "1.375rem", lineHeight: "1.4", fontWeight: undefined },
            h4: { fontSize: "1.125rem", lineHeight: "1.45", fontWeight: undefined },
            h5: { fontSize: "1rem", lineHeight: "1.5", fontWeight: undefined },
            h6: { fontSize: "0.875rem", lineHeight: "1.5", fontWeight: undefined },
        },
    },
    defaultRadius: "md",

    primaryColor: "orange",
    primaryShade: {
        light: 6,
        dark: 8,
    },
    colors: {
        dark: [
            "#A6A7AB", // --mantine-color-dark-0
            "#909296", // --mantine-color-dark-1
            "#5C5F66", // --mantine-color-dark-2
            "#2d2c2c", // --mantine-color-dark-3
            "#292828", // --mantine-color-dark-4
            "#242424", // --mantine-color-dark-5
            "#202020", // --mantine-color-dark-6
            "#1a1a1a", // --mantine-color-dark-7
            "#191919", // --mantine-color-dark-8
            "#101113", // --mantine-color-dark-9
        ],
    },

    /** Class added to the elements that have focus styles, for example, `Button` or `ActionIcon`.
     *  Overrides `theme.focusRing` property.
     */
    focusClassName: undefined,

    components: {
        Group: {
            defaultProps: {
                gap: "xs",
            },
        },
        Stack: {
            defaultProps: {
                gap: "xs",
            },
        },
        Button: {
            classNames: {
                root: button.root,
            },
        },
        ActionIcon: {
            classNames: {
                root: button.root,
            },
        },
        Tabs: {
            defaultProps: {
                variant: "outline",
                orientation: "vertical",
                radius: "md",
            },

            classNames: {
                root: tabs.root,
                list: tabs.list,
                tab: tabs.tab,
                panel: tabs.panel,
                tabSection: tabs.tabSection,
            },
        },
        Slider: {
            classNames: {
                thumb: slider.thumb,
            },
        },
        Container: {
            defaultProps: {
                p: "lg",
                h: "100%",
            },
        },
        ScrollArea: {
            classNames: {
                viewport: scrollArea.viewport,
            },
        },
        Modal: {
            classNames: {
                content: modal.content,
            },

            defaultProps: {
                size: "55rem",
                yOffset: "8dvh",
            },
        },
        PasswordInput: {
            classNames: {
                root: passwordInput.root,
            },
        },
        Input: {
            classNames: {
                input: input.input,
                wrapper: input.wrapper,
            },
        },
        Switch: {
            classNames: {
                input: switchInput.input,
                track: switchInput.track,
            },
        },
        Checkbox: {
            classNames: {
                root: checkboxInput.root,
                input: checkboxInput.input,
            },
        },
        Select: {
            classNames: {
                section: select.section,
            },
        },
    },
});
