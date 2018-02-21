from django.contrib import admin
from .models import Clipboard
from .models import Snippet

class ClipboardAdmin(admin.ModelAdmin):
    pass

admin.site.register(Clipboard, ClipboardAdmin)
admin.site.register(Snippet, ClipboardAdmin)


