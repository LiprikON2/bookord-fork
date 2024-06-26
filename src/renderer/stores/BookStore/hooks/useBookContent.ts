import { useEffect, useState } from "react";
import { reaction } from "mobx";

import { BookKey } from "../BookStore";
import { bookStore } from "../store";

// TODO closing this tab while the book content is being streamed results in an infinite loop of errors
// https://i.imgur.com/TTrm2fl.png
export const useBookContent = (bookKey: BookKey, initSectionIndex?: number) => {
    const [content, setContent] = useState(() => bookStore.getBookContent(bookKey));
    const [contentState, setContentState] = useState(() => bookStore.getBookContentState(bookKey));

    useEffect(() => {
        if (initSectionIndex !== undefined) bookStore.openBook(bookKey, initSectionIndex);
    }, []);

    useEffect(() => {
        const unsub1 = reaction(
            () => bookStore.getBookContentState(bookKey),
            (contentState) => {
                setContent(bookStore.getBookContent(bookKey));
                setContentState(contentState);
            },
            { fireImmediately: true }
        );

        return () => {
            unsub1();
        };
    }, [bookKey]);

    return {
        content,
        contentState,
    };
};
