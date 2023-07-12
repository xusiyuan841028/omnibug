/**
 * BitKeep 神策数据
 *
 * @class
 * @extends BaseProvider
 */

function getTag(value) {
    if (value == null) {
        return value === undefined ? "[object Undefined]" : "[object Null]";
    }
    return toString.call(value);
}

function isObjectLike(value) {
    return typeof value === "object" && value !== null;
}

function isPlainObject(value) {
    if (!isObjectLike(value) || getTag(value) != "[object Object]") {
        return false;
    }
    if (Object.getPrototypeOf(value) === null) {
        return true;
    }
    let proto = value;
    while (Object.getPrototypeOf(proto) !== null) {
        proto = Object.getPrototypeOf(proto);
    }
    return Object.getPrototypeOf(value) === proto;
}

function atou(str) {
    return decodeURIComponent(escape(window.atob(str)));
}

class BitKeepProvider extends BaseProvider {
    constructor() {
        super();
        this._key = "bitKeep";
        this._pattern = /https:\/\/ta\.bitkeep\.buzz:8993\//;
        this._name = "BitKeep Data";
        this._type = "marketing";
        this._keywords = ["BitKeep", "Data"];
    }

    parsePostData(postData = "") {
        // eslint-disable-next-line no-debugger
        debugger;
        const data = JSON.parse(atou(new URLSearchParams(postData).get("data")));
        const params = [];

        function parseObject(value, prefix = "") {
            Object.entries(value).forEach((entry) => {
                const key = prefix ? `${prefix}.${entry[0]}` : entry[0];
                if (key === "data") {
                    entry[1].forEach((item) => parseObject(item, key));
                } else if (isPlainObject(entry[1])) {
                    parseObject(entry[1], key);
                } else {
                    params.push([key, entry[1].toString()]);
                }
            });
        }
        parseObject(data);
        this.currentEvent = data.event;
        return params;
    }

    handleCustom(url, params) {
        let results = [];
        let event = params.get("data.#event_name") || /* istanbul ignore next: fallback */ "Unknown";

        let requestType = event;
        if (requestType === "$pageview") {
            requestType = "Page View";
        } else if (requestType === "web_vitals" || requestType === "timing") {
            // } else if (!requestType.startsWith("$")) {
            requestType = event.toLowerCase();
            requestType = requestType
                .split("_")
                .map((word) => {
                    return word.charAt(0).toUpperCase() + word.slice(1);
                })
                .join(" ");
        }

        results.push({
            key: "requestType",
            value: requestType,
            hidden: true,
        });
        return results;
    }

    /**
     * Retrieve the column mappings for default columns (account, event type)
     *
     * @return {{}}
     */
    get columnMapping() {
        return {
            account: "data.#distinct_id",
            requestType: "requestType",
        };
    }

    /**
     * Retrieve the group names & order
     *
     * @returns {*[]}
     */
    get groups() {
        return [
            {
                key: "event",
                name: "Event Data",
            },
            {
                key: "device",
                name: "Device",
            },
            {
                key: "lib",
                name: "SDK Info",
            },
            // {
            // key: "env",
            // name: "Environment",
            // },
            // {
            // key: "perf",
            // name: "Performance",
            // },
            // {
            // key: "timing",
            // name: "Timing",
            // },
            // {
            // key: "client",
            // name: "Client",
            // },
            // {
            // key: "store",
            // name: "Store",
            // },
            // {
            // key: "theme",
            // name: "Theme",
            // },
            // {
            // key: "dom",
            // name: "DOM Element",
            // },
            // {
            // key: "products",
            // name: "Products",
            // },
            // {
            // key: "checkout",
            // name: "Checkout",
            // },
        ];
    }

    getSDKKeys() {
        return {
            "data.properties.#lib": {
                name: "Type",
                group: "lib",
            },
            "data.properties.#lib_version": {
                name: "Version",
                group: "lib",
            },
        };
    }

    getDOMElementKeys() {
        return {
            "properties.className": {
                name: "Element Class(className)",
                group: "dom",
            },
            "properties.$element_class_name": {
                name: "Element Class($element_class_name)",
                group: "dom",
            },
            "properties.$element_type": {
                name: "Element Type($element_type)",
                group: "dom",
            },
            "properties.$element_selector": {
                name: "Element Selector($element_selector)",
                group: "dom",
            },
            "properties.input_id": {
                name: "Element Id(input_id)",
                group: "dom",
            },
            "properties.name": {
                name: "Element Name(name)",
                group: "dom",
            },
            "properties.$element_name": {
                name: "Element Name($element_name)",
                group: "dom",
            },
            "properties.value": {
                name: "Element Value(value)",
                group: "dom",
            },
        };
    }

    getEventKeys() {
        return {
            "data.#event_name": {
                name: "Event Name",
                group: "event",
            },
            "data.#type": {
                name: "Event Type",
                group: "event",
            },
        };
    }

    getProductKeys() {
        return {};
    }

    get keys() {
        return {
            ...this.getEventKeys(),
            ...this.getSDKKeys(),
        };
    }
}
