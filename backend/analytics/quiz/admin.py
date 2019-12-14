from django.contrib import admin
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User, UserProfile, Question, QuestionAnswer, City, MailSend


class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name', 'date_joined')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser')}),

    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2'),
        }),
    )
    readonly_fields = ("email", "date_joined", "password")
    list_display = ('id', 'email', 'first_name', 'last_name', 'is_staff')
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)
    inlines = (UserProfileInline, )


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('uid', 'id', 'version', 'active', 'title')
    search_fields = ('title', 'uid', 'id')
    list_filter = ('active',)
    ordering = ('uid',)


@admin.register(QuestionAnswer)
class QuestionAnswerAdmin(admin.ModelAdmin):
    list_display = ('id', 'question_id', 'answer_number', 'answer_text')
    search_fields = ('answer_text',)
    list_filter = ('answer_number',)
    ordering = ('question_id',)


@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)
    ordering = ('name',)


@admin.register(MailSend)
class MailSendAdmin(admin.ModelAdmin):
    readonly_fields = ("to_email", "subject", "message")
    list_display = ('to_email', 'subject', 'message')
    search_fields = ('subject', 'to_email')
    ordering = ('to_email',)
