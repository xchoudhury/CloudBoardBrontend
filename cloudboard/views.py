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
from .serializers import ClipboardSerializer, SnippetSerializer

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

class ClipboardViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows clipboards to be viewed or edited.
    """
    queryset = Clipboard.objects.all()
    serializer_class = ClipboardSerializer


def getClipboard(request):
    user_clipboards = Clipboard.objects.filter(owner=request.user)
    serializer = ClipboardSerializer(user_clipboards, many=True)
    return Response(serializer.data)

def createClipboard(request):
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

def updateClipboard(request):
    try:
        user_clipboard = Clipboard.objects.get(owner=request.user, id=request.data.get('id'))
    except Clipboard.DoesNotExist:
        error = {
            'id' : ["Does not exist or user is not owner"]
        }
        return Response(error, status=status.HTTP_404_NOT_FOUND)

    user_clipboard = ClipboardSerializer(user_clipboard, data=request.data, partial=True)
    if user_clipboard.is_valid():
        user_clipboard.save()
        return Response(user_clipboard.data, status=status.HTTP_201_CREATED)
    return Response(user_clipboard.errors, status=status.HTTP_400_BAD_REQUEST)

def deleteClipboard(request):
    try:
        user_clipboard = Clipboard.objects.get(owner=request.user, id=request.data.get('id'))
    except Clipboard.DoesNotExist:
        error = {
            'id' : ["Does not exist or user is not owner"]
        }
        return Response(error, status=status.HTTP_404_NOT_FOUND)
    user_clipboard.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
    
@api_view(['GET', 'POST', 'DELETE', 'PUT'])
@authentication_classes((SessionAuthentication, BasicAuthentication))
@permission_classes((IsAuthenticated,))
def manageClipBoards(request):
    if request.method == 'GET':
       return getClipboard(request)      
    elif request.method == 'POST':
        return createClipboard(request)
    elif request.method == 'PUT':
        return updateClipboard(request)
    elif request.method == 'DELETE':
        return deleteClipboard(request)
    return Response(status=status.HTTP_400_BAD_REQUEST)


def getSnippet(request, clip_id):
    try:
        clipboard = Clipboard.objects.get(id=clip_id, owner=request.user)
    except Clipboard.DoesNotExist:
        return Response({'clip_id': ['Clipboard does not exist or user is not owner']},\
                status=status.HTTP_404_NOT_FOUND)

    try:
        snippet = Snippet.objects.get(id=request.GET.get('snip_id'), parent_clipboard=clip_id, owner=request.user)
    except Snippet.DoesNotExist:
        error = {
            'snip_id': ['Snippet does not exist or user is not owner']
        }
        return Response(error, status=status.HTTP_404_NOT_FOUND)
    
    serializer = SnippetSerializer(snippet)
    return Response(serializer.data)


def createSnippet(request, clip_id):
    data = {
        'owner': request.user.pk,
        'parent_clipboard': clip_id,
        'text': request.data.get('text'),
        'image': request.data.get('image')
    }
    serializer = SnippetSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def updateSnippet(request, clip_id):
    try:
        user_clipboard = Clipboard.objects.get(owner=request.user, id=clip_id)
    except Clipboard.DoesNotExist:
        error = {
            'clip_id' : ["Does not exist or user is not owner"]
        }
        return Response(error, status=status.HTTP_404_NOT_FOUND)
    
    try:
        snippet = Snippet.objects.get(id=request.data.get('snip_id'), parent_clipboard=clip_id, owner=request.user)
    except Snippet.DoesNotExist:
        error = {
            'snip_id': ['Snippet does not exist or user is not owner']
        }
        return Response(error, status=status.HTTP_404_NOT_FOUND)

    snippet_serializer = SnippetSerializer(snippet, data=request.data, partial=True)
    if snippet_serializer.is_valid():
        snippet_serializer.save()
        return Response(snippet_serializer.data, status=status.HTTP_201_CREATED)
    return Response(snippet_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def deleteSnippet(request, clip_id):
    try:
        snippet = Snippet.objects.get(owner=request.user, id=request.data.get('snip_id'), parent_clipboard=clip_id)
    except Snippet.DoesNotExist:
        error = {
            'id' : ["Snippet does not exist or user is not owner"]
        }
        return Response(error, status=status.HTTP_404_NOT_FOUND)
    snippet.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST', 'DELETE', 'PUT'])
@authentication_classes((SessionAuthentication, BasicAuthentication))
@permission_classes((IsAuthenticated,))
def manageSnippet(request, clip_id):
    if request.method == 'GET':
        return getSnippet(request, clip_id)
    if request.method == 'POST':
        return createSnippet(request, clip_id)
    if request.method == 'PUT':
        return updateSnippet(request, clip_id)
    if request.method == 'DELETE':
        return deleteSnippet(request, clip_id)
