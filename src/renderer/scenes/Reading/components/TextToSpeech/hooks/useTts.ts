import { useToggle } from "@mantine/hooks";
import { useContext, useEffect } from "react";
import { BookComponentContext } from "~/renderer/contexts";

// TODO use selection.modify("extend", "forward", "sentenceboundary") instead of the whole paragraphs
// https://developer.mozilla.org/en-US/docs/Web/API/Selection/modify#granularity
export const useTts = (
    selectedVoice: SpeechSynthesisVoice,
    selectedPitch = 1,
    selectedRate = 1
) => {
    const [ttsStatus, toggleTtsStatus] = useToggle(["standby", "speaking", "paused"]);

    const updateTtsState = () => {
        if (speechSynthesis.paused) {
            toggleTtsStatus("paused");
        }
        if (speechSynthesis.speaking && !speechSynthesis.paused) {
            toggleTtsStatus("speaking");
        }
        if (!speechSynthesis.speaking && !speechSynthesis.paused) {
            toggleTtsStatus("standby");
        }
    };

    const stopTts = () => {
        speechSynthesis.cancel();
        speechSynthesis.speak(new SpeechSynthesisUtterance(""));
        speechSynthesis.cancel();
        updateTtsState();
        resetTtsTarget();
    };

    const resumeTts = () => {
        speechSynthesis.resume();
        // Set manually, since state speaking is not reflected immediately by speechSynthesis.speaking
        toggleTtsStatus("speaking");
    };

    const pauseTts = () => {
        speechSynthesis.pause();
        // Set manually, since state pause is not reflected immediately by speechSynthesis.paused
        toggleTtsStatus("paused");
    };

    const { ttsTarget, resetTtsTarget, contextRef } = useContext(BookComponentContext);

    const getParentElement = (ancestorElem: HTMLElement, childElem: ParentNode) => {
        let parentElem = childElem;

        while (parentElem.parentNode !== ancestorElem) {
            parentElem = parentElem.parentNode;
        }

        return parentElem;
    };

    // TODO paragraphTts = (sentences: string[], nextElem: Element, selection: Selection)
    //      <...>
    //      paragraphTts(sentences.pop(), ...)
    const startTts = (text: string, nextElem: Element, selection: Selection) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.pitch = selectedPitch;
        utterance.rate = selectedRate;
        utterance.voice = selectedVoice;

        if (nextElem) {
            utterance.onend = () => {
                selectElem(nextElem, selection);
                startTts(nextElem.textContent, nextElem.nextElementSibling, selection);
            };
        } else utterance.onend = () => stopTts();

        speechSynthesis.speak(utterance);

        updateTtsState();
    };

    const selectElem = (elem: Element, selection: Selection) => {
        const range = document.createRange();
        range.selectNodeContents(elem);

        selection.removeAllRanges();
        selection.addRange(range);
    };

    useEffect(() => {
        if (ttsTarget?.startElement && contextRef) {
            const { startElement, startElementSelectedText } = ttsTarget;

            const startParentElem = getParentElement(
                contextRef.contentElem,
                startElement
            ) as HTMLElement;
            const startElementText = startParentElem.textContent;

            /** Transforms selected text
             * <p>Test 123 456</p>
             * from    |||
             * to      |||||||
             */
            const initText = [
                startElementSelectedText,
                ...startElementText.split(startElementSelectedText).slice(1),
            ].join("");
            const nextParentElem = startParentElem.nextElementSibling;

            const selection = contextRef.shadowRoot.getSelection() as Selection;
            selection.modify("extend", "forward", "paragraphboundary");

            stopTts();
            startTts(initText, nextParentElem, selection);
        }
    }, [ttsTarget]);

    return { ttsStatus, startTts, pauseTts, resumeTts, stopTts };
};
