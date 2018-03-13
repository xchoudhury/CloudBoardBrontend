from django.contrib.auth.models import User, Group
from rest_framework import serializers
from .models import Clipboard


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
        fields = ('id', 'owner', 'name', 'snippet_ids')

        def create(self, validated_data):
            return Clipboard.objects.create(**validated_data)

        def update(self, instance, validated_data):
            instance.owner = validated_data.get('owner', instance.owner)
            instance.name = validated_data.get('name', instance.name)
            instance.snippet_ids = validated_data.get('snippet_ids', instance.snippet_ids)
            instance.save()
            return instance

