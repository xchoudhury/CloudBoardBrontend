from django.contrib import admin
from .models import Clipboard
from .models import Snippet

class ClipboardAdmin(admin.ModelAdmin):
    list_display = ('owner', 'name')
    pass

class SnippetAdmin(admin.ModelAdmin):
    list_display = ('parent_clipboard', 'text')
    pass
admin.site.register(Clipboard, ClipboardAdmin)
admin.site.register(Snippet, SnippetAdmin)


