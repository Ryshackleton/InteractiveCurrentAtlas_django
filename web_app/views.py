from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponseRedirect
from .forms import LoginForm, CreateAccountForm


def index(request):
    return render(request, 'index.html')


def error_page(request,message):
    return render(request,'error.html', {'message': message})


def create_account(request):
    if request.method == 'POST':
        form = CreateAccountForm(request.POST)
        if form.is_valid():
            u = form.cleaned_data['username']

            # check for existing usernames
            if User.objects.filter(username=u).exists():
                return error_page(request, message="Username already exists!")

            # check for users with the same email
            e = form.cleaned_data['useremail']
            if User.objects.filter(email=e).exists():
                return error_page(request, message="User email already exists!")

            # check that passwords match
            p = form.cleaned_data['password']
            pconfirm = form.cleaned_data['passwordconfirm']
            if p != pconfirm:
                return error_page(request, message="Passwords do not match")
            # if we've passed all checks, create user
            else:
                newU = User.objects.create_user(username=u,email=e,password=p)
                newU.first_name = form.cleaned_data['userfirst']
                newU.last_name = form.cleaned_data['userlast']
                newU.save()
                return HttpResponseRedirect('/user/')
    else:
        form = CreateAccountForm()
        return render(request, 'createaccount.html', {'form': form })
    return render(request,'error.html', {'message': "Unknown error"})


def user(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            u = form.cleaned_data['username']
            p = form.cleaned_data['password']
            usr = authenticate(username=u, password=p)
            if usr is not None:
                if usr.is_active:
                    login(request,usr)
                    return HttpResponseRedirect('/maps_leaflet/')
                else:
                    return render(request,'error.html', {'message': "Unknown error"})
            else:
                return render(request,'error.html', {'message': "Incorrect Password!"})
    else:
        form = LoginForm()
        return render(request,'user.html', {'form': form})
    return HttpResponseRedirect('/maps_leaflet/')
    # return render(request,'user.html')


def maps_google(request):
    return render(request, 'maps_google.html')


def maps_leaflet(request):
    return render(request, 'maps_leaflet.html')


def logout_request(request):
    logout(request)
    return HttpResponseRedirect('/')

