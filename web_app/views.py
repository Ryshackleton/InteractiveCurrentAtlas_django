from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request, 'index.html')

def user(request):
    return render(request,'user.html')

def maps_google(request):
    return render(request, 'maps_google.html')

def maps_leaflet(request):
    return render(request, 'maps_leaflet.html')
