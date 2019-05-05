$(document).ready(function () {
    var path = window.location.href.split("=").pop();
    var categories = ["tech", "business", "lifestyle", "culture"];

    // banner control
    if (path == "technology") {
        $('.cat-banner, .top').css('background-color', '#63707d');
        $(".cat-banner h5").text("Code, technologies, industry news and whatever else you could want to geek on.");
    } else if (path == 'business') {
        $('.cat-banner, .top').css('background-color', '#923434');
        $(".cat-banner h5").text("Freelancing, runnning a start-up, and professional issues in software development.");
    } else if (path == 'lifestyle') {
        $('.cat-banner, .top').css('background-color', '#6543ce');
        $(".cat-banner h5").text("Health, fitness, and personal growth. Life is about more than code, afterall.");
    } else if (path == 'culture') {
        $('.cat-banner, .top').css('background-color', '#1f5f1d');
        $(".cat-banner h5").text("Music, fashion and whatever else from western culture that catches our eye.");
    } else if (path == 'all') {
        $('.cat-banner, .top').css('background-color', '#009e64');
    }

    // post display
    showCategoryPopularPosts();

    $('#showRecent').click(function () {
        hideCategoryPopularPosts();
        showCategoryRecentPosts();

    });

    $('#showPopular').click(function () {
        hideCategoryRecentPosts();
        showCategoryPopularPosts();
    });



    $('#loadMore').click(function () {
        x = 3;
        if ($('.categoryPopularPosts .post').css('display') === 'none') {
            size_li = $('.categoryRecentPosts .post').length;
            count = $('.categoryRecentPosts .post:visible').length;
            if (count < size_li) {
                $('.categoryRecentPosts .post:lt(' + count + x + ')').show();
            }
            count += 3;
            if (count > size_li) {
                $('#loadMore').hide();
            }
        } else {
            size_li = $('.categoryPopularPosts .post').length;
            count = $('.categoryPopularPosts .post:visible').length;
            if (count < size_li) {
                $('.categoryPopularPosts .post:lt(' + count + x + ')').show();
            }
            count += 3;
            if (count > size_li) {
                $('#loadMore').hide();
            }
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

    function showCategoryRecentPosts() {
        size_li = $('.categoryRecentPosts .post').length;
        x = 3;
        $('.categoryRecentPosts .post:lt(' + x + ')').show();
        if (size_li > 3) {
            $('#loadMore').show();
        }
    }

    function showCategoryPopularPosts() {
        size_li = $('.categoryPopularPosts .post').length;
        x = 3;
        $('.categoryPopularPosts .post:lt(' + x + ')').show();
        if (size_li > 3) {
            $('#loadMore').show();
        }
    }

    function hideCategoryRecentPosts() {
        $('.categoryRecentPosts .post').hide();
    }

    function hideCategoryPopularPosts() {
        $('.categoryPopularPosts .post').hide();
    }
});