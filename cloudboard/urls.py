from django.conf.urls import url, include
from rest_framework import routers
from django.urls import path
from . import views
# from rest_framework.authtoken import views as rviews

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    # url(r'^api-token-auth/', rviews.obtain_auth_token),
    path('test/', views.TestView),
    path('clipboards/', views.ManageClipBoards),
]