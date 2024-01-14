import { makeSuccess } from "./common/io.mjs";

console.info("[utilityProcess] was created");

process.parentPort.once("message", ({ data, ports }) => {
    console.info("[utilityProcess] request received");

    console.info("[utilityProcess] response sent");
    process.parentPort.postMessage({
        // message: _.upperCase("success"),
        message: makeSuccess(),
    });
});