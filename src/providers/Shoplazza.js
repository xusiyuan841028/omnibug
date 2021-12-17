/**
 * Shoplazza 神策数据
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

class ShoplazzaProvider extends BaseProvider {
    constructor() {
        super();
        this._key = "SHOPLAZZA";
        this._pattern = /https:\/\/(r|r1024|r-pre-release)\.shoplazza\.com\//;
        this._name = "Shoplazza Data";
        this._type = "marketing";
        this._keywords = ["Shoplazza", "Data"];
        console.log("build shoplazza data");
    }

    parsePostData(postData = "") {
        const data = JSON.parse(atob(new URLSearchParams(postData).get("data")));
        const params = [];

        function parseObject(value, prefix = "") {
            Object.entries(value).forEach(entry => {
                const key = prefix ? `${prefix}.${entry[0]}` : entry[0];
                if (isPlainObject(entry[1])) {
                    parseObject(entry[1], key);
                } else {
                    params.push([key, entry[1].toString()]);
                }
            });
        }
        parseObject(data);
        this.currentEvent = data.event;

        console.log("origin data", data);
        console.log("formatted data", params);
        return params;
    }

    /**
     * Retrieve the column mappings for default columns (account, event type)
     *
     * @return {{}}
     */
    get columnMapping()
    {
        return {
            "account":      "distinct_id",
            "requestType":  "requestType"
        };
    }

    /**
     * Retrieve the group names & order
     *
     * @returns {*[]}
     */
    get groups()
    {
        return [
            {
                "key": "general",
                "name": "General"
            },
            {
                "key": "lib",
                "name": "SDK Info"
            },
            {
                "key": "env",
                "name": "Environment",
            },
            {
                "key": "perf",
                "name": "Performance",
            },
            {
                "key": "timing",
                "name": "Timing",
            },
            {
                "key": "client",
                "name": "Client"
            },
            {
                "key": "store",
                "name": "Store"
            },
            {
                "key": "theme",
                "name": "Theme"
            },
            {
                "key": "dom",
                "name": "DOM Element"
            },
            {
                "key": "custom",
                "name": "Event Data"
            },
            {
                "key": "products",
                "name": "Products"
            },
            {
                "key": "checkout",
                "name": "Checkout"
            },
            
        ];
    }

    getSDKKeys() {
        return {
            "lib.$lib": {
                "name": "Type",
                "group": "lib"
            },
            "lib.$lib_method": {
                "name": "Method",
                "group": "lib"
            },
            "lib.$lib_version": {
                "name": "Version",
                "group": "lib"
            },
            "project": {
                "name": "Project",
                "group": "lib"
            }
        };
    }

    getStoreKeys() {
        return {
            "store_id": {
                "name": "Store Id",
                "group": "store"
            },

        };
    }

    getClientKeys() {
        return {
            "properties.client_id": {
                "name": "Client Id",
                "group": "client"
            },
            "properties.session_id": {
                "name": "Session Id",
                "group": "client"
            },
            "properties.client": {
                "name": "Client Type",
                "group": "client"
            },
            "properties.connection_type": {
                "name": "Connection Type",
                "group": "client"
            },
            "properties.downlink": {
                "name": "Connection Downlink",
                "group": "client"
            },
            "properties.rtt": {
                "name": "Round-trip Time (RTT)",
                "group": "client"
            },
            "properties.is_new_client": {
                "name": "New Client",
                "group": "client"
            },
            "properties.login_customer_id": {
                "name": "Login Customer Id",
                "group": "client"
            },
            "properties.user_agent": {
                "name": "Browser User Agent",
                "group": "client"
            },
            "properties.$screen_width": {
                "name": "Screen Width",
                "group": "client"
            },
            "properties.$screen_height": {
                "name": "Screen Height",
                "group": "client"
            }
        };
    }

    getEnvKeys() {
        return {
            "properties.platform": {
                "name": "Platform",
                "group": "env"
            },
            "properties.env_tag": {
                "name": "AB Testing Tag",
                "group": "env"
            },

        };

    }

    getThemeKeys() {
        return {
            "properties.theme_name": {
                "name": "Theme Name",
                "group": "theme"

            },
            "properties.theme_version": {
                "name": "Theme Version",
                "group": "theme"

            },
            "properties.template_type": {

                "name": "Template Type",
                "group": "theme"
            },
            "properties.template_name": {
                "name": "Template Name",
                "group": "theme"
            },
        };
    }

    getCheckoutKeys() {
        return {
            "properties.order_id": {
                "name": "Order Id",
                "group": "checkout"
            },
            "properties.checkout_page_type": {
                "name": "Checkout Type",
                "group": "checkout"
            },
            "properties.checkout_step": {
                "name": "Current Step",
                "group": "checkout"
            },
            "properties.payment_method": {
                name: "Payment Method",
                "group": "checkout"
            },
            "properties.payment_channel": {
                name: "Payment Channel",
                "group": "checkout"
            },
            "properties.currency": {
                name: "Currency",
                "group": "checkout"
            },
            "properties.total": {
                name: "Total Price",
                "group": "checkout"
            },
            "properties.data": {
                name: "Checkout Setting",
                "group": "checkout"
            }
        };
    }

    getPerformanceKeys() {
        return {
            "properties.lcp": {
                "name": "Largest Contentful Paint (LCP)",
                "group": "perf"
            },
            "properties.fid": {
                "name": "First Input Delay (FID)",
                "group": "perf"
            },
            "properties.cls": {
                "name": "Cumulative Layout Shift (CLS)",
                "group": "perf"
            },
            "properties.fcp": {
                "name": "First Contentful Paint (FCP)",
                "group": "perf"
            },
            "properties.ttfb": {
                "name": "Time to First Byte (TTFB)",
                "group": "perf"
            },
        };
    }

    getTimingKeys() {
        return {
            "properties.first_contentful_paint": {
                "name": "First Contentful Paint (FCP)",
                "group": "timing"
            },
            "properties.first": {
                "name": "First Screen Paint",
                "group": "timing"
            },
            
            "properties.redirect": {
                "name": "Redirect",
                "group": "timing"
            },
            "properties.request": {
                "name": "Request Time: From Connected to First Byte",
                "group": "timing"
            },
            "properties.response": {
                "name": "Response Time: From First Byte to Last Byte",
                "group": "timing"
            },
            "properties.onload": {
                "name": "Onload Time: From Fetch to Loaded",
                "group": "timing"
            },
            "properties.domready": {
                "name": "DOM Ready",
                "group": "timing"
            },
            "properties.dns": {
                "name": "DNS Time",
                "group": "timing"
            },
            "properties.tcp": {
                "name": "TCP Time",
                "group": "timing"
            },
        };
    }

    getDOMElementKeys() {
        return {
            "properties.className": {
                "name": "Element Class",
                "group": "dom"
            },
            "properties.input_id": {
                "name": "Element Id",
                "group": "dom"
            },
            "properties.name": {
                "name": "Element Name",
                "group": "dom"
            },
            "properties.value": {
                "name": "Element Value",
                "group": "dom"
            },
        };
    }

    get keys() {
        console.log("current event", this.currentEvent);
        return {
            ...this.getSDKKeys(),
            ...this.getEnvKeys(),
            ...this.getPerformanceKeys(),
            ...this.getTimingKeys(),
            ...this.getClientKeys(),
            ...this.getStoreKeys(),
            ...this.getThemeKeys(),
            ...this.getCheckoutKeys(),
            ...this.getDOMElementKeys(),
        };
    }

    handleCustom(url, params) {
        let results = [];
        let event = params.get("event") || /* istanbul ignore next: fallback */ "other";

        let requestType = event;
        if (requestType === "$pageview") {
            requestType = "Page View";
        } else if (!requestType.startsWith("$")) {
            requestType = event.toLowerCase();
            requestType = requestType.split("_").map(word => {
                return word.charAt(0).toUpperCase() + word.slice(1);
            }).join(" ");
        }

        results.push({
            "key": "requestType",
            "value": requestType,
            "hidden": true
        });
        return results;
    }
}
