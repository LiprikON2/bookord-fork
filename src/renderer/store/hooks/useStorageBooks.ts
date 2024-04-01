import { useEffect, useState } from "react";
import { reaction } from "mobx";

import { bookStore } from "..";

// ref: https://github.com/mobxjs/mobx/discussions/3737#discussioncomment-6548377
export const useStorageBooks = () => {
    const [inStorageBookRecords, setInStorageBookRecords] = useState(() =>
        bookStore.getBookStateInStorage()
    );
    // This did not work, even link did not help https://stackoverflow.com/a/64771774/10744339
    // const [openedBookRecords, setOpenedBookRecords] = useState(() => bookStore.getBookStateOpened());

    /* Syncs mobx store to react state without the need for observable in components */
    useEffect(() => {
        const unsub1 = reaction(
            () => bookStore.getBookStateInStorage(),
            (inStorageBookRecords) => setInStorageBookRecords(inStorageBookRecords)
        );
        // const unsub2 = reaction(
        //     () => bookStore.getBookStateOpened(),
        //     (openedBookRecords) => setOpenedBookRecords(openedBookRecords)
        // );

        return () => {
            unsub1();
            // unsub2();
        };
    }, []);

    const isBookStorageEmpty = !inStorageBookRecords.length;

    return { isBookStorageEmpty, inStorageBookRecords };
};
