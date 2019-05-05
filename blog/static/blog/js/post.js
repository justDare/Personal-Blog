// textbox autogrow plugin
$.fn.autogrow = function(options) {

    $(this).each(function() {

        var $this = $(this),
            minHeight = $this.height(),
            lineHeight = $this.css('lineHeight');

        $(this).css('height', 'hidden');

        var duplicate = $('<div></div>').css({
            position: 'absolute',
            top: -10000,
            left: -10000,
            width: $(this).width(),
            fontSize: $this.css('fontSize'),
            fontFamily: $this.css('fontFamily'),
            lineHeight: $this.css('lineHeight'),
            resize: 'none',
            'word-wrap': 'break-word',
            'white-space': 'pre-wrap'
        }).appendTo(document.body);

        var update = function() {
            var val = this.value.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/&/g, '&amp;').replace(/\n/g, '<br/>');

            duplicate.html(val);
            $(this).css('height', Math.max(duplicate.height() + 20, minHeight));
        }

        $(this).change(update).keyup(update).keydown(update);

        update.apply(this);

    });

    return this;

}
// call to autogrow
$('.comments textarea').autogrow()

 // erase default value of text box
$(".comments textarea")
  .focus(function() {
        if (this.value === this.defaultValue) {
            this.value = '';
        }
  })
  .blur(function() {
        if (this.value === '') {
            this.value = this.defaultValue;
        }
});

$('#submit-comment').click(function() {
    var comment = $('.comments textarea').val();
    console.log(comment.length);

    if(comment == 'Write a comment...'){
        $('.error-default').slideDown("slow", function() {});
    // if comment is empty
    }else if(comment.trim() == '') {
        $('.error-empty').slideDown("slow", function() {});
        // empty comment from text area
        $('.comments textarea').val('Write a comment...');
    // if comment is valid -> post
    }else{
        var user_name = $('.user-comment-box').text();
        user_name = user_name.replace(':','');
        var post_title = $('.title').text();
        //test
        console.log(comment +"/"+ user_name +"/"+ post_title)
        // post comment ajax
        $.ajax({
            type: 'POST',
            url: '/postComment',
            headers: {
            "X-CSRFToken": csrftoken
            },
            data: {
                user_name: user_name,
                post_title: post_title,
                comment: comment,
            },
            success: function (data) {
            // Update the comment section
            console.log(data);
            // increase comment count
            var count = $('#comment-count').text();
            var count_int = parseInt(count, 10);
            count_int++;
            if (count_int == 1 ) {
                $('#comment-count').text(count_int + " comments")
            }else {
                $('#comment-count').text(count_int + " comments")
            }
            // format date for post
            var date_split = data.split(' ');
            console.log(date_split[0]);
            var calendar = date_split[0].split('-');
            var month = parseInt(calendar[1]);
            var day = calendar[2].replace('0', '');
            var year = calendar[0];
            time = date_split[1].split(':');
            date = formatDate(month,day,year,time );

            // append posted comment
            var new_div ='<blockquote class="blockquote"><div class="mb-0"><span style="color:#55b1df;padding-right: 10px;">'+user_name+'</span>'+comment+'</div><p class="comment-time">'+date+'</p></blockquote>';
            $('.comment-list').prepend(new_div);
            $('.blockquote').first().css('display', 'block');

            // empty comment from text area
            $('.comments textarea').val('Write a comment...');
            }
        });
        // slide error messages out
        var def = $('.error-default').css('display');
        if(def == 'block') {
            $('.error-default').slideUp("slow", function() {});
        }
        var def = $('.error-empty').css('display');
        if(def == 'block') {
            $('.error-empty').slideUp("slow", function() {});
        }
    } 
});

// date format workaround, easier when passing date directlyu to template
// possible better solutions?
function formatDate(m, d, y, time) {
    var monthNames = [
      "Jan.", "Feb.", "March",
      "Apr.", "May", "June", "July",
      "Aug.", "Sept.", "Oct.",
      "Nov.", "Dec."
    ];

    var pm = false;

    var h = parseInt(time[0]);

    if (h > 12) {
        hour = h - 12;
        pm = true;
    }

    time = hour + ":" + time[1];

    var month = monthNames[m-1];

    if(pm == true) {
        date = month + " " + d + ", " + y + ", " + time + " " + "p.m."; 
    }else {
        date = month + " " + d + ", " + y + ", " + time + " " + "a.m."; 
    }
  
    return date;
  }

  // comment display
  // post display
  size_li = $('.blockquote').length;
  x=20;
  $('.blockquote:lt('+x+')').show();
  $('#moreComments').click(function () {
      x= (x+20 <= size_li) ? x+20 : size_li;
      $('.blockquote:lt('+x+')').show();
       $('#less-comments').show();
      if(x == size_li){
          $('#moreComments').hide();
      }
  });
  $('#lessComments').click(function () {
      x=(x-20<0) ? 20 : 20-5;
      $('.blockquote').not(':lt('+x+')').hide();
      $('#moreComments').show();
       $('#lessComments').show();
      if(x == 20){
          $('#lessComments').hide();
      }
  });