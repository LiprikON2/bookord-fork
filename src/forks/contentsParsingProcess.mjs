// @ts-check
// JSDoc docs: https://stackoverflow.com/a/42898969/10744339

import { parseContent } from "./common/io.mjs";

console.info("[contentsParsingProcess] was created");

process.parentPort.once(
    "message",
    /**
     * @param {Object} param
     * @param {Object} param.data
     * @param {string} param.data.filePath
     * @param {number} param.data.initSectionIndex
     * @param {Electron.MessagePortMain[]} param.ports
     */
    async ({ data, ports }) => {
        console.info("[contentsParsingProcess] request received");

        const { filePath, initSectionIndex } = data;

        console.time("[parseContents time]");
        const { initContent, unparsedSections } = await parseContent(filePath, initSectionIndex);

        console.info("[contentsParsingProcess] response sent");
        process.parentPort.postMessage(initContent);

        console.log("[parseContents time]: init content");
        console.timeLog("[parseContents time]");

        // await mapInGroups(
        //     unparsedSections,
        //     async (/** @type {any} */ unparsedSection, /** @type {number} */ index) => {
        //         const isUnparsed = initContent.sections[index].content === null;

        //         const content = unparsedSection.toHtmlObjects();
        //         console.log(isUnparsed, "unparsedSection", unparsedSection.id, content.length);
        //         const parsedSection = isUnparsed
        //             ? { ...initContent.sections[index], content }
        //             : initContent.sections[index];

        //         process.parentPort.postMessage(parsedSection);
        //         return parsedSection;
        //     },
        //     4
        // );

        unparsedSections.forEach(
            (/** @type {any} */ unparsedSection, /** @type {number} */ index) => {
                const isUnparsed = initContent.sections[index].content === null;

                const content = unparsedSection.toHtmlObjects();
                const parsedSection = isUnparsed
                    ? { ...initContent.sections[index], content }
                    : initContent.sections[index];

                process.parentPort.postMessage(parsedSection);
                return parsedSection;
            }
        );
        console.log("[parseContents time]: content");
        console.timeEnd("[parseContents time]");
    }
);
