$('.language-python').each(function(i, obj) {
    $.getJSON('/example', {filename: $(obj).attr('id'),
    }, function(data) {
        $(obj).append(data.code)
    })
});

$.getScript("/static/js/prism.js");
