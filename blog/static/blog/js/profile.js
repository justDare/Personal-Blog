// post display
$('#loadMore').click(function () {
    x = (x + 5 <= size_li) ? x + 5 : size_li;
    $('.post:lt(' + x + ')').show();
    $('#showLess').show();
    if (x == size_li) {
        $('#loadMore').hide();
    }
});
$('#showLess').click(function () {
    x = (x - 5 < 0) ? 3 : x - 5;
    $('.post').not(':lt(' + x + ')').hide();
    $('#loadMore').show();
    $('#showLess').show();
    if (x == 3) {
        $('#showLess').hide();
    }
});

// top color match
$('.top').copyCSS('.profile-banner', ['background-color']);