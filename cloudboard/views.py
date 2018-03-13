from django.shortcuts import render
from django.contrib.auth.models import User, Group
from rest_framework import viewsets, status
from .serializers import UserSerializer, GroupSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, BasicAuthentication 
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from .models import Clipboard, Snippet
from .serializers import ClipboardSerializer

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

@api_view(['GET'])
def TestView(request):
    test_data = {
        "testInt" : 4,
        "testStr" : "hi mom",
        "testList" : [1,2,3.14, "four"]
        }

    return Response(test_data)

@api_view(['GET', 'POST', 'DELETE'])
@authentication_classes((SessionAuthentication, BasicAuthentication))
@permission_classes((IsAuthenticated,))
def ManageClipBoards(request):
    if request.method == 'GET':
        user_clipboards = Clipboard.objects.filter(owner=request.user)
        serializer = ClipboardSerializer(user_clipboards, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        data = {
            'owner': request.user.pk,
            'name': request.data.get('name'),
        }

        serializer = ClipboardSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        try:
            user_clipboard = Clipboard.objects.get(owner=request.user, id=request.data.get('id'))
        except Clipboard.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        user_clipboard.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    return Response(status=status.HTTP_400_BAD_REQUEST)
