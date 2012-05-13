/* var window;
var document;
var jQuery;
var Glimt;
*/

function main() {
    "use strict";

    window.Glimt = function (target_element) {

        var g = {};
        g.target_element = target_element;

        g.formatDate = function (d) {
            var curr_day = d.getDate(),
                curr_month = d.getMonth() + 1,
                curr_year = d.getFullYear();
            if (curr_day < 10) {
                curr_day = "0" + curr_day;
            }
            if (curr_month < 10) {
                curr_month = "0" + curr_month;
            }
            return curr_year + "-" + curr_month + "-" + curr_day;
        };

        g.extractTimeOfDay = function (dateStr) {
            var date = new Date(dateStr),
                hours = date.getHours(),
                minutes = date.getMinutes();
            if (hours < 10) {
                hours = "0" + hours;
            }
            if (minutes < 10) {
                minutes = "0" + minutes;
            }
            return hours + ":" + minutes;
        };

        g.getHostname = function (str) {
            var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
            return str.match(re)[1].toString();
        };

        g.replaceAll = function (source, stringToFind, stringToReplace){
            var temp = source;
            var index = temp.indexOf(stringToFind);
            while(index != -1){
                temp = temp.replace(stringToFind,stringToReplace);
                index = temp.indexOf(stringToFind);
            }
            return temp;
        };

        g.getEventsAsJSON = function (params) {
            var dataUrl = "http://www.glimt.com/api/v1/event/search/jsonp?",
                key,
                html = '<div style="' +
                    'font-size: 1.2em;background:#EDEDED;padding: 5px;width: 100%;border-bottom: grey;' +
                    '">' +
                    'Dagens arrangementer på ' + GLIMT.keywords + '</div>\n',
                i;
                html = html + '<div style="padding: 4px;">\n';
            if (params !== undefined) {
                for (key in params) {
                    if (params[key] !== undefined) {
                        dataUrl = dataUrl + key + "=" + params[key] + "&";
                    }
                }
            }
            dataUrl = dataUrl + "jsonp=?";

            jQuery.getJSON(dataUrl, function (json) {
                for (i = 0; i < json.length; i = i + 1) {
                    var event = json[i];
                    html = html + '<span class="glimt_timeofday">' + g.extractTimeOfDay(event.startTime) + " </span>";
                    html = html + '<span class="glimt_title">';
                    html = html + '<a href="' + event.sourceURL + '">' + event.title + '</a></span>';
                    html = html + '<p id="glimt_descr_' + i + '">' + event.description.substring(0, 200);
                    var long_description = event.description; // g.replaceAll(event.description,"\n","<br />\n");

                    html = html + '<a id="glimt_descr_' + i + '_link" href="javascript:jQuery(\'#glimt_descr_' + i + '\').html(\'' + long_description + '\');">...</a></p>\n';

                    // html = html + "<p><a href="' + event.sourceURL + '">
                }
                document.glimt_json_data = json;

                html = html + "</div>\n";
                jQuery("#" + g.target_element).html(html);

                for (i = 0; i < json.length; i = i + 1) {
                    event = json[i];
                    jQuery("#glimt_descr_" + i + "_link_zzz").click( function() {
                        jQuery("#glimt_descr_" + i).html(event.description);
                    });
                }
            });

        };

        g.displayEvents = function () {
            jQuery(document).ready(function () {

                var today = new Date(),
                    tomorrow = new Date(),
                    params;
                tomorrow.setDate(today.getDate() + 1);
                params = { from: g.formatDate(today),
                           to: g.formatDate(tomorrow),
                           keyword: GLIMT.keywords };

                var width  = GLIMT.width || "300px";
                var height = GLIMT.height || "300px";

                jQuery("#" + g.target_element).css({
                    "width": width,
                    "height": height,
                    "overflow-y": "auto",
                    "border": "1px solid grey",
                    "position": "relative",
                    "padding": "0"
                });
                g.getEventsAsJSON(params);

                jQuery("#glimt_header").css({
                    "width": "100%",
                    "padding": "3px",
                    "background": "#f0f0ff"
                });

            });
        };

        return g;
    };
    var glimt = new Glimt("glimt-event-widget");
    glimt.displayEvents();
}

function scriptLoadHandler() {
    "use strict";
    jQuery = window.jQuery.noConflict(true);
    main();
}

if (window.jQuery === undefined || window.jQuery.fn.jquery !== '1.4.2') {
    var script_tag = document.createElement('script');
    script_tag.setAttribute("type", "text/javascript");
    script_tag.setAttribute("src",
                            "http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js");
    if (script_tag.readyState) {
        script_tag.onreadystatechange = function () { // For old versions of IE
            "use strict";
            if (this.readyState === 'complete' || this.readyState === 'loaded') {
                scriptLoadHandler();
            }
        };
    } else { // Other browsers
        "use strict";
        script_tag.onload = scriptLoadHandler;
    }
    (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
} else {
    jQuery = window.jQuery;
}

