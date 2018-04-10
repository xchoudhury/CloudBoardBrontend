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


# Borrowed from https://stackoverflow.com/questions/28036404/django-rest-framework-upload-image-the-submitted-data-was-not-a-file
class Base64ImageField(serializers.ImageField):
    """
    A Django REST framework field for handling image-uploads through raw post data.
    It uses base64 for encoding and decoding the contents of the file.

    Heavily based on
    https://github.com/tomchristie/django-rest-framework/pull/1268

    Updated for Django REST framework 3.
    """

    def to_internal_value(self, data):
        from django.core.files.base import ContentFile
        import base64
        import six
        import uuid

        # Check if this is a base64 string
        if isinstance(data, six.string_types):
            # Check if the base64 string is in the "data:" format
            if 'data:' in data and ';base64,' in data:
                # Break out the header from the base64 content
                header, data = data.split(';base64,')

            # Try to decode the file. Return validation error if it fails.
            try:
                decoded_file = base64.b64decode(data)
            except TypeError:
                self.fail('invalid_image')

            # Generate file name:
            file_name = str(uuid.uuid4())[:12] # 12 characters are more than enough.
            # Get the file name extension:
            file_extension = self.get_file_extension(file_name, decoded_file)

            complete_file_name = "%s.%s" % (file_name, file_extension, )

            data = ContentFile(decoded_file, name=complete_file_name)

        return super(Base64ImageField, self).to_internal_value(data)

    def get_file_extension(self, file_name, decoded_file):
        import imghdr

        extension = imghdr.what(file_name, decoded_file)
        extension = "jpg" if extension == "jpeg" else extension

        return extension


# class ImageSerializer(serializers.ModelSerializer):
#     image = Base64ImageField(
#         max_length=None, use_url=True,
#     )

#     class Meta:
#         model = image
#         fields = ("id", 'image', 'owner', 'time_created', )

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