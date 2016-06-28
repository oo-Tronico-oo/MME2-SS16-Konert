/** Dieses Modul repräsentiert das clientseitige Video-Collection
 *
 * @author Lisa Bitterling, Christoph Kozielski, Nico Nauendorf
 *
 * @type {Collection}
 */

/* requireJS module definition */
define(['backbone', 'videoModel'],
        function (Backbone, VideoModel) {

            var VideoCollection = Backbone.Collection.extend({
                model: VideoModel,
                url: '/videos',
                initialize: function () {
                    // after constructor code
                }
            });

            return VideoCollection;
        }
);