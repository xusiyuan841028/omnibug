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

function atou(str) {
    return decodeURIComponent(escape(window.atob(str)));
}

class ShoplazzaProvider extends BaseProvider {
    constructor() {
        super();
        this._key = "SHOPLAZZA";
        this._pattern = /https:\/\/(r|r1024|r-pre-release)\.shoplazza\.com\//;
        this._name = "Shoplazza Data";
        this._type = "marketing";
        this._keywords = ["Shoplazza", "Data"];
    }

    parsePostData(postData = "") {
        const data = JSON.parse(atou(new URLSearchParams(postData).get("data")));
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
        return params;
    }

    handleCustom(url, params) {
        let results = [];
        let event = params.get("event") || /* istanbul ignore next: fallback */ "other";

        let requestType = event;
        if (requestType === "$pageview") {
            requestType = "Page View";
        } else if (requestType === "web_vitals" || requestType === "timing") {
        // } else if (!requestType.startsWith("$")) {
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
                "key": "event",
                "name": "Event Data"
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
            "properties.c_id": {
                "name": "C Id",
                "group": "client"
            },
            "distinct_id": {
                "name": "Distinct Id",
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
                name: "Checkout Setting(properties.data)",
                "group": "checkout"
            }
        };
    }

    getPerformanceKeys() {
        return {
            "properties.lcp": {
                "name": "Largest Contentful Paint (LCP)(properties.lcp)",
                "group": "perf"
            },
            "properties.fid": {
                "name": "First Input Delay (FID)(properties.fid)",
                "group": "perf"
            },
            "properties.cls": {
                "name": "Cumulative Layout Shift (CLS)(properties.cls)",
                "group": "perf"
            },
            "properties.fcp": {
                "name": "First Contentful Paint (FCP)(properties.fcp)",
                "group": "perf"
            },
            "properties.ttfb": {
                "name": "Time to First Byte (TTFB)(properties.ttfb)",
                "group": "perf"
            },
        };
    }

    getTimingKeys() {
        return {
            "properties.first_contentful_paint": {
                "name": "First Contentful Paint (FCP)(properties.first_contentful_paint)",
                "group": "timing"
            },
            "properties.first": {
                "name": "First Screen Paint(FP)(properties.first)",
                "group": "timing"
            },
            "properties.redirect": {
                "name": "Redirect(properties.redirect)",
                "group": "timing"
            },
            "properties.request": {
                "name": "Request Time: From Connected to First Byte(properties.request)",
                "group": "timing"
            },
            "properties.response": {
                "name": "Response Time: From First Byte to Last Byte(properties.response)",
                "group": "timing"
            },
            "properties.onload": {
                "name": "Onload Time: From Fetch to Loaded(properties.onload)",
                "group": "timing"
            },
            "properties.domready": {
                "name": "DOM Ready(properties.domready)",
                "group": "timing"
            },
            "properties.dns": {
                "name": "DNS Time(properties.dns)",
                "group": "timing"
            },
            "properties.tcp": {
                "name": "TCP Time(properties.tcp)",
                "group": "timing"
            },
        };
    }

    getDOMElementKeys() {
        return {
            "properties.className": {
                "name": "Element Class(className)",
                "group": "dom"
            },
            "properties.$element_class_name": {
                "name": "Element Class($element_class_name)",
                "group": "dom"
            },
            "properties.$element_type": {
                "name": "Element Type($element_type)",
                "group": "dom"
            },
            "properties.$element_selector": {
                "name": "Element Selector($element_selector)",
                "group": "dom"
            },
            "properties.input_id": {
                "name": "Element Id(input_id)",
                "group": "dom"
            },
            "properties.name": {
                "name": "Element Name(name)",
                "group": "dom"
            },
            "properties.$element_name": {
                "name": "Element Name($element_name)",
                "group": "dom"
            },
            "properties.value": {
                "name": "Element Value(value)",
                "group": "dom"
            },
        };
    }

    getEventKeys() {
        return {
            "event": {
                "name": "Event Type",
                "group": "event"
            },
            "_track_id": {
                "name": "Track Id",
                "group": "event"
            },
        };
    }

    getProductKeys() {
        return {
        };
    }

    get keys() {
        return {
            ...this.getSDKKeys(),
            ...this.getEventKeys(),
            ...this.getEnvKeys(),
            ...this.getPerformanceKeys(),
            ...this.getTimingKeys(),
            ...this.getClientKeys(),
            ...this.getStoreKeys(),
            ...this.getThemeKeys(),
            ...this.getCheckoutKeys(),
            ...this.getProductKeys(),
            ...this.getDOMElementKeys(),
        };
    }
}
