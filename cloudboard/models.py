from django.db import models
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)

class Clipboard(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=16)
    snippet_ids = ArrayField(models.IntegerField(), max_length=10, null=True)

class Snippet(models.Model):
    parent_clipboard = models.ForeignKey(
        'Clipboard',
        on_delete=models.CASCADE,
    )
    text = models.TextField()
    image = models.ImageField()
