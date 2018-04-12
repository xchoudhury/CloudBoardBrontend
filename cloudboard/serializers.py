from django.contrib.auth.models import User, Group
from rest_framework import serializers
from .models import Clipboard, Snippet
from datetime import datetime

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'groups')


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')


class ClipboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clipboard
        fields = ('id', 'owner', 'name', 'last_modified')

        def create(self, validated_data):
            return Clipboard.objects.create(**validated_data)

        def update(self, instance, validated_data):
            instance.owner = validated_data.get('owner', instance.owner)
            instance.name = validated_data.get('name', instance.name)
            instance.last_modified = validated_data.get('last_modified', instance.last_modified)
            instance.save()
            return instance

class SnippetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Snippet
        fields = ('id', 'parent_clipboard', 'owner', 'text', 'image', 'file')

        def create(self, validated_data):
            return Snippet.objects.create(**validated_data)

        def update(self, instance, validated_data):
            instance.parent_clipboard = validated_data.get('parent_clipboard', instance.parent_clipboard)
            instance.owner = validated_data.get('owner', instance.owner)
            instance.text = validated_data.get('text', instance.text)
            instance.image = validated_data.get('image', instance.image)
            instance.file = validated_data.get('file', instance.file)
            instance.save()
            return instance