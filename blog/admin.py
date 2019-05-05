from django.contrib import admin
from .models import Post, Comment, LikedBy, BlogUser
from django_summernote.admin import SummernoteModelAdmin

# Register your models here.

# custom models
admin.site.register(Comment)
admin.site.register(LikedBy)

# custom user class
admin.site.register(BlogUser)

class PostAdmin(SummernoteModelAdmin):
    summernote_fields = ('content',)


admin.site.register(Post, PostAdmin)
