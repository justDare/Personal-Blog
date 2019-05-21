from django.contrib import admin
from .models import Post, Comment, LikedBy, BlogUser
from django_summernote.admin import SummernoteModelAdmin
from django.conf import settings
from django.contrib.sites.shortcuts import get_current_site
from django.contrib.auth.models import User

# email functionality
from django.core.mail import EmailMessage, send_mail
from django.template.loader import render_to_string
from django.shortcuts import render, redirect
from django.http import HttpResponseRedirect
from django.template import loader

# custom models
admin.site.register(Comment)
admin.site.register(LikedBy)

# custom user class
admin.site.register(BlogUser)

# custom post admin page
class PostAdmin(SummernoteModelAdmin):
    summernote_fields = ('content',)
    change_form_template = "entities/post_change_form.html"

    # mass emal feature
    def response_change(self, request, obj):
        if "_email-subscribers" in request.POST:
            thisPost = obj
            subject = "This Week's Post at DareToProgram - " + thisPost.title
            current_site = get_current_site(request)
            from_email = settings.DEFAULT_FROM_EMAIL

            for blogUser in BlogUser.objects.filter(subscribed=True):
                user = blogUser.user
                to_email = [user.email]
                message = loader.render_to_string('blog/new_post_email.html', {
                    'user': user,
                    'domain': current_site.domain + "/post?post_id=" + str(thisPost.id) ,
                })
                send_mail(subject, message, from_email,
                        to_email, fail_silently=True, html_message=message)
                        
            self.message_user(request, "Email successfully sent to subscribers!")
            return HttpResponseRedirect(".")
        return super().response_cq

admin.site.register(Post, PostAdmin)


