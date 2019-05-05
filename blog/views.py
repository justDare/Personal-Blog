from django.shortcuts import render, redirect
from django.http import HttpResponse
from .models import Post, Comment, LikedBy, BlogUser
from django.contrib.auth.models import User
from django.db.models import F
from django.contrib.auth import login, authenticate, logout
from django.contrib.sites.shortcuts import get_current_site
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.template.loader import render_to_string
from .tokens import account_activation_token
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.core.mail import EmailMessage, send_mail
from .forms import SignUpForm, CommentForm
from django.utils import timezone
from django.conf import settings

# Create your views here.


def home(request):
    posts = Post.objects.filter(visible=True) 
    posts = posts.order_by('-date_posted')
    postsSortedByLikes = posts.order_by('-likes')
    context = {
        'posts': posts,
        'popularPosts': postsSortedByLikes,
        'users': User.objects.filter(is_staff=True),
        'page': 'home'
    }

    if (request.user.is_authenticated):
        current_user = request.user
        context['user_likes'] = LikedBy.objects.filter(
            user=current_user, liked=True).values('post')

    return render(request, 'blog/home.html', context)


def about(request):
    context = {
        'posts': Post.objects.filter(visible=True) ,
        'users': User.objects.filter(is_staff=True)
    }
    return render(request, 'blog/about.html', context)


def post(request):
    if request.method == 'GET':
        post_id = request.GET.get('post_id')
        post = Post.objects.get(id=post_id)
        comments = Comment.objects.filter(post=post).order_by('-id')
        default = "Write a comment..."
        comment_form = CommentForm(initial={'content': default})

        current_user = request.user

        if not post_id:
            return render(request, 'blog/404.html', context)
        else:
            context = {
                'users': User.objects.filter(is_staff=True),
                'this_post': Post.objects.get(id=post_id),
                'comments': comments,
                'comment_form': comment_form,
            }
            if (request.user.is_authenticated):
                current_user = request.user
                context['user_likes'] = LikedBy.objects.filter(
                    user=current_user, liked=True).values('post')
            return render(request, 'blog/post.html', context)

    elif request.method == 'POST':
        post_id = request.GET.get('post_id')
        post = Post.objects.get(id=post_id)
        comments = Comment.objects.filter(post=post).order_by('-id')
        comment_form = CommentForm(request.POST or None)
        if comment_form.is_valid():
            content = request.POST.get('content')
            comment = Comment.objects.create(
                post=post, user=request.user, content=content)
            comment.save()
        else:
            comment_form = CommentForm()
        context = {
            'users': User.objects.filter(is_staff=True),
            'this_post': Post.objects.get(id=post_id),
            'comments': comments,
            'comment_form': comment_form,
        }

        if (request.user.is_authenticated):
            current_user = request.user
            context['user_likes'] = LikedBy.objects.filter(
                user=current_user, liked=True).values(post)

        return render(request, 'blog/post.html', context)


def category(request):
    if request.method == 'GET':
        category = request.GET.get('category')
        if category == 'all':
            posts = Post.objects.filter(visible=True) 
            postsSortedByLikes = posts.order_by('-likes')
            posts = posts.order_by('-date_posted')
            context = {
                'users': User.objects.filter(is_staff=True),
                'posts': posts,
                'popularPosts': postsSortedByLikes,
                'category': category
            }
            return render(request, 'blog/category.html', context)
        else:
            posts = Post.objects.filter(category=category)
            postsSortedByLikes = posts.order_by('-likes')
            posts = posts.order_by('-date_posted')
            context = {
                'users': User.objects.filter(is_staff=True),
                'posts': posts,
                'popularPosts': postsSortedByLikes,
                'category': category
            }
            return render(request, 'blog/category.html', context)


def profile(request):
    if request.method == 'GET':
        user_id = request.GET.get('profile')
        posts = Post.objects.filter(visible=True) 
        posts = posts.order_by('-date_posted')
        postsSortedByLikes = posts.order_by('-likes')
        if not user_id:
            return render(request, 'blog/404.html')
        else:
            context = {
                'users': User.objects.filter(is_staff=True),
                'posts': posts,
                'popularPosts': postsSortedByLikes
            }
        return render(request, 'blog/profile.html', context)


def signup(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.is_active = False
            user.save()

            subject = "Sign up form recieved"
            current_site = get_current_site(request)
            subject = 'Activate your blog account.'

            message = render_to_string('blog/acc_active_email.html', {
                'user': user,
                'domain': current_site.domain,
                'uid': urlsafe_base64_encode(force_bytes(user.pk)),
                'token': account_activation_token.make_token(user),
            })
            to_email = [form.cleaned_data.get('email')]
            from_email = settings.DEFAULT_FROM_EMAIL
            '''
            email = EmailMessage(
                mail_subject, message, to=[to_email]
            )
            email.send()
            '''
            send_mail(subject, message, from_email,
                      to_email, fail_silently=True)
            return render(request, 'blog/confirmation_sent.html')
    else:
        form = SignUpForm()
    return render(request, 'blog/sign-up.html', {'form': form})


def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(data=request.POST)
        if form.is_valid():
            # log in user
            username = request.POST['username']
            password = request.POST['password']
            user = authenticate(username=username, password=password)
            login(request, user)
            return redirect('/')
    else:
        form = AuthenticationForm()
    # return HttpResponse('dang')
    return render(request, 'blog/login.html', {'form': form})


def logout_view(request):
    logout(request)
    return redirect('/')


def activation_success(request):
    return render(request, 'blog/activation_success.html')


def activation_fail(request):
    return render(request, 'blog/activation_fail.html')


def confirmation_sent(request):
    return render(request, 'blog/confirmation_sent.html')


def activate(request, uidb64, token):
    try:
        uid = force_text(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except(TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None
    if user is not None and account_activation_token.check_token(user, token):
        user.is_active = True
        user.save()
        new_subscriber = BlogUser.objects.create(
            user=user, subscribed=True)
        new_subscriber.save()
        login(request, user)
        return render(request, 'blog/activation_success.html')
    else:
        return render(request, 'blog/activation_fail.html')


def like(request):
    if request.method == 'POST':
        post_id = request.POST['post_id']
        user_name = request.POST['user_name']
        post = Post.objects.get(id=post_id)
        if(user_name):
            user = User.objects.get(username=user_name)
            try:
                user_post = LikedBy.objects.get(post=post, user=user)
                user_post.liked = True
                user_post.save()

            except LikedBy.DoesNotExist:
                user_post = LikedBy.objects.create(
                    post=post, user=user, liked=True)

        post.likes = F('likes') + 1
        post.save()
        post = Post.objects.get(id=post_id)
        update = post.likes

        return HttpResponse(update)
    else:
        return HttpResponse('dang')


def dislike(request):
    if request.method == 'POST':
        post_id = request.POST['post_id']
        user_name = request.POST['user_name']
        post = Post.objects.get(id=post_id)
        if(user_name):
            user = User.objects.get(username=user_name)
            try:
                user_post = LikedBy.objects.get(post=post, user=user)
                user_post.liked = False
                user_post.save()

            except LikedBy.DoesNotExist:
                user_post = LikedBy.objects.create(
                    post=post, user=user, liked=False)

        post.likes = F('likes') - 1
        post.save()
        post = Post.objects.get(id=post_id)
        update = post.likes

        return HttpResponse(update)
    else:
        return HttpResponse('dang')

# save comment to database


def postComment(request):
    if request.method == 'POST':
        user_name = request.POST['user_name']
        post_title = request.POST['post_title']
        comment = request.POST['comment']

        post = Post.objects.get(title=post_title)
        user = User.objects.get(username=user_name)

        new_comment = Comment.objects.create(
            post=post, user=request.user, content=comment)
        new_comment.save()

        time = timezone.localtime(timezone.now())
        formatedDate = time.strftime("%Y-%m-%d %H:%M:%S")

    return HttpResponse(time)

# subscribe a user


def subscribe(request):

    return HttpResponse("maybe")
