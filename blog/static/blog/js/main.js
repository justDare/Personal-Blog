 // CSRF TOKEN
 function getCookie(name) {
   var cookieValue = null;
   if (document.cookie && document.cookie !== '') {
     var cookies = document.cookie.split(';');
     for (var i = 0; i < cookies.length; i++) {
       var cookie = jQuery.trim(cookies[i]);
       // Does this cookie string begin with the name we want?
       if (cookie.substring(0, name.length + 1) === (name + '=')) {
         cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
         break;
       }
     }
   }
   return cookieValue;
 }
 var csrftoken = getCookie('csrftoken');

 $(document).ready(function () {
   // initialize AOS
   AOS.init({
     duration: 1000,
     once: true
   })

   // nav control
   var path = window.location.href.split("/").pop();

   var menu = ["", "about"];

   var nav_target = $('nav li a[href="/' + path + '"]');
   nav_target.addClass('active');

   for (i = 0; i < menu.length; i++) {
     if (path != menu[i]) {
       nav_target = $('nav li a[href="/' + menu[i] + '"]');
       nav_target.removeClass('active');
     }

   }

   // nav-feed indicator
   $('.nav-feed .underbar:first').css('width', '100%');
 });

 var win_size = window.matchMedia("(max-width: 1200px)")
 // Call listener function at run time
 watchWindow(win_size)
 // Attach listener function on state changes
 win_size.addListener(watchWindow)

 function watchWindow(x) {
   var target;
   // If media query matches
   if (x.matches) {
     /*
     target = $('#main-left');
     target.removeClass('col-lg-7');
     target.toggleClass('col-lg-6');
     target = $('#main-right');
     target.removeClass('col-lg-5');
     target.toggleClass('col-lg-6');
     */
   } else {
     /*
     target = $('#main-left');
     $(target).attr("class", "col-lg-4 col-md-6");
     target = $('#main-right');
     $(target).attr("class", "about-us col-lg-4 col-md-12");
     */
   }
 }

 function mobileMenuChange(x) {
   x.classList.toggle("change");
 }

 // like indicator
 $('.heart').click(function () {
   var target = $(this)
   $(target).toggleClass('is_animating');

   if ($(target).hasClass('heart-clicked')) {
     // dislike AJAX 
     $.ajax({
       type: 'POST',
       url: '/dislike',
       headers: {
         "X-CSRFToken": csrftoken
       },
       data: {
         post_id: $(target).attr('id'),
         user_name: $('#user').text(),
       },
       success: function (data) {
         // Update the likes amount
         $(target).next().text(data + ' likes');
       }
     });
   } else {
     // like AJAX 
     $.ajax({
       type: 'POST',
       url: '/like',
       headers: {
         "X-CSRFToken": csrftoken
       },
       data: {
         post_id: $(target).attr('id'),
         user_name: $('#user').text(),
       },
       success: function (data) {
         // Update the likes amount
         $(target).next().text(data + ' likes');
       }
     });
   }
   $(target).toggleClass('heart-clicked');
 });



 // category img hover 
 $(".category-block").hover(function () {
   $('.grow', this).css('transform', 'scale(1.1)')
 }, function () {
   $('.grow', this).css('transform', 'scale(1.0)')
 });

 $('.nav-feed li').click(function () {
   var selected = $(this);
   $('.underbar', selected).css('width', '100%');

   $('.nav-feed li').not(this).each(function (index) {
     $('.underbar', this).css('width', '0');
   });
 });

 showPopularPosts();

 // Post display
 $('#showRecent').click(function () {
   hidePopularPosts();
   showRecentPosts();
 });

 $('#showPopular').click(function () {
   hideRecentPosts();
   showPopularPosts();
 });

 // Recent posts
 function showRecentPosts() {
   size_li = $('.recentPosts .post').length;
   x = 3;
   $('.recentPosts .post:lt(' + x + ')').show();
 }

 function hideRecentPosts() {
   $('.recentPosts .post').hide();
 }

 // Popular posts
 function showPopularPosts() {
   size_li = $('.popularPosts .post').length;
   x = 3;
   $('.popularPosts .post:lt(' + x + ')').show();
 }

 function hidePopularPosts() {
   $('.popularPosts .post').hide();
 }