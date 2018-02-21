from django.contrib import admin
from .models import Clipboards
from .models import Snippets

class ClipboardAdmin(admin.ModelAdmin):
    pass

admin.site.register(Clipboards, ClipboardAdmin)
admin.site.register(Snippets, ClipboardAdmin)


