from django.conf.urls import url, include
from rest_framework import routers
from django.urls import path
from . import views
from django.contrib.auth import views as dviews
# from rest_framework.authtoken import views as rviews

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)
router.register(r'clipboards', views.ClipboardViewSet)

template_name = {'template_name': 'home.html'}

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('clipboards/', views.manageClipBoards),
    path('clipboards/<clip_id>/snippet/', views.manageSnippet),
    url(r'^api-auth/login/$', dviews.login, template_name, name='login'),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]