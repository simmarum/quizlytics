from rest_framework import permissions

from rest_framework.permissions import AllowAny


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners (user_id) of an object to edit it.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the snippet.
        return obj.user_id == request.user


class IsLoggedInUserOrAdmin(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        return obj == request.user or request.user.is_staff


class IsAdminUser(permissions.BasePermission):

    def has_permission(self, request, view):
        return request.user and request.user.is_staff

    def has_object_permission(self, request, view, obj):
        return request.user and request.user.is_staff


def get_permissions_login(cls):
    permission_classes = []
    if cls.action == 'create':
        permission_classes = [AllowAny]
    elif cls.action in ['list', 'retrieve', 'update', 'partial_update']:
        permission_classes = [IsLoggedInUserOrAdmin]
    elif cls.action in ['destroy']:
        permission_classes = [IsAdminUser]
    return [permission() for permission in permission_classes]


def get_permissions_admin(cls):
    permission_classes = []
    if cls.action == 'list':
        permission_classes = [AllowAny]
    elif cls.action in ['create', 'retrieve', 'update', 'partial_update', 'destroy']:
        permission_classes = [IsAdminUser]
    return [permission() for permission in permission_classes]


def get_permissions_owner(cls):
    permission_classes = []
    if cls.action == 'list':
        permission_classes = [AllowAny]
    elif cls.action in ['create', 'retrieve', 'update', 'partial_update', 'destroy']:
        permission_classes = [IsLoggedInUserOrAdmin]
    return [permission() for permission in permission_classes]
