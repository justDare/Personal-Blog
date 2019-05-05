from django.contrib import admin
from .models import Post, Comment, LikedBy
from django_summernote.admin import SummernoteModelAdmin

# Register your models here.

admin.site.register(Comment)
admin.site.register(LikedBy)


class PostAdmin(SummernoteModelAdmin):
    summernote_fields = ('content',)


admin.site.register(Post, PostAdmin)
