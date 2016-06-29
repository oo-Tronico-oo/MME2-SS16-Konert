/** Dieses Modul repräsentiert das clientseitige Video-Model
 *
 * @author Lisa Bitterling, Christoph Kozielski, Nico Nauendorf
 *
 * @type {Model}
 */

/* requireJS module definition */
define(['backbone'],
        function (Backbone) {

            var urlRegex = /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/;

            var VideoModel = Backbone.Model.extend({
                idAttribute: "_id",
                urlRoot: '/videos',
                length: "length",
                defaults: {
                    description: '',
                    timestamp: new Date(),
                    playcount: 0,
                    ranking: 0,
                    src: undefined,
                    title: undefined,
                    length: undefined
                },
                initialize: function () {
                    // after constructor code
                },
                validate: function (attr) {
                    var erText = "\n";
                    if (!attr.title) erText += "- Title is required\n";
                    if (!attr.src) erText += "- src must be set!\n";
                    if (attr.scr && !urlRegex.test(attr.scr)) erText += "- src is not a valid URL!\n";
                    if (!attr.length) erText += "- length must be set!\n";
                    if (attr.length && !attr.length<0) erText += "- length cant't be smaller than 0!\n";

                    if (erText !== "\n") return erText;
                }
            });

            return VideoModel;
        }
);