from django.db import models
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField

class Clipboard(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=16)
    last_modified = models.DateTimeField(null=True)

    def __str__(self):
        return self.name

class Snippet(models.Model):
    parent_clipboard = models.ForeignKey(
        Clipboard,
        on_delete=models.CASCADE,
    )
    owner = models.ForeignKey(User, on_delete=models.CASCADE, default=None)
    text = models.TextField(null=True)
    image = models.URLField(null=True, blank=True)
    file = models.FileField(null=True)
