from django.urls import path, re_path

from . import views

urlpatterns = [
    path('', views.home, name='blog-home'),
    path('about', views.about, name='blog-about'),
    path('post', views.post, name='blog-post'),
    path('category', views.category, name='blog-category'),
    path('profile', views.profile, name='blog-profile'),
    path('sign-up', views.signup, name='blog-sign-up'),
    path('login', views.login_view, name='blog-login'),
    path('logout', views.logout_view, name='blog-logout'),
    re_path(r'^activate/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',
            views.activate, name='activate'),
    path('activation_success', views.activation_success, name='blog-activation_success'),
    path('activation_fail', views.activation_fail, name='blog-activation_fail'),
    path('confirmation_sent', views.confirmation_sent, name='blog-confirmation_sent'),
    path('like', views.like),
    path('dislike', views.dislike),
    path('postComment', views.postComment),
    path('subscribe', views.subscribe)
]
