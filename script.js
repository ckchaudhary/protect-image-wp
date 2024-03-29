var jq = jQuery.noConflict();
jq(document).ready(function($){
    setTimeout(pp_cover, 200);
});

function pp_cover() {
    var images = jq('img.protectimage_wp');

    for (var i = 0; i < images.length; ++i) {
        var item = images[i];
        var itemPos = pp_get_position(item);
        var parentPos = {
            left : 0,
            top : 0
        };

        var offsetParent = item.offsetParent;

        if (offsetParent != null) {
            if (offsetParent.tagName.toLowerCase() != 'body') {

                // IE
                if (offsetParent.currentStyle) {
                    while (offsetParent != null && offsetParent.currentStyle.position != 'relative' && offsetParent.currentStyle.styleFloat == 'none' && offsetParent.tagName.toLowerCase() != 'body' && offsetParent.tagName.toLowerCase() != 'html')
                    offsetParent = offsetParent.OffsetParent;

                    // for IE 6-8
                    if (offsetParent != null && offsetParent.styleFloat != 'none')
                        while (offsetParent != null && offsetParent.currentStyle.position != 'relative' && offsetParent.tagName.toLowerCase() != 'body' && offsetParent.tagName.toLowerCase() != 'html')
                        offsetParent = offsetParent.parentNode;
                }

                if (offsetParent != null) {
                    parentPos = pp_get_position(offsetParent);
                }
            }
            var itemSize = [item.offsetWidth, item.offsetHeight];

            var cover = item.ppCover;
            if (cover == null) {
                var cover = document.createElement('img');
                jq(cover).attr( 'src', PIWP_.overlay_image );
                jq(cover).addClass( 'pp_cover' );
                jq(cover).addClass( 'imagenumber-'+i );
                jq(cover).css({
                    'position':'absolute',
                    'border':'none',
                    'max-width':'100%',
                    'max-height':'100%',
                    'margin':0,
                    'padding':0,
                    'background':'none'
                });
                item.parentNode.appendChild(cover);
                item.ppCover = cover;
            }

            jq(cover).width(item.offsetWidth);
            jq(cover).height(item.offsetHeight);

            jq(cover).css({
                'left':itemPos.left - parentPos.left + "px",
                'top':itemPos.top - parentPos.top + "px"
            });

        }
    }
    
};

function pp_get_position2(element) {
    var l = 0;
    var t = 0;
    while (element) {
        l += (element.offsetLeft - element.scrollLeft);
        t += (element.offsetTop - element.scrollTop);
        element = element.offsetParent
    }

    return {
        left : Math.round(l),
        top : Math.round(t)
    };
}

function pp_get_position1(element) {
    var rect = element.getBoundingClientRect();

    var body = document.body;
    var html = document.documentElement;

    var scrollTop = window.pageYOffset || html.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || html.scrollLeft || body.scrollLeft;

    var clientTop = html.clientTop || body.clientTop || 0;
    var clientLeft = html.clientLeft || body.clientLeft || 0;

    var top = rect.top + scrollTop - clientTop;
    var left = rect.left + scrollLeft - clientLeft;

    return {
        top : Math.round(top),
        left : Math.round(left)
    };
}

function pp_get_position(element) {
    if (element.getBoundingClientRect) {
        return pp_get_position1(element)
    } else {
        // for older browser
        return pp_get_position2(element);
    }
}