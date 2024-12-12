from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, TaskViewSet,RegisterView,CreateProjectView,CreateTaskView,CurrentUserView,UsersView

router = DefaultRouter()
router.register(r'projects', ProjectViewSet)
router.register(r'tasks', TaskViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # path('projects/', ProjectViewSet.as_view(), name='projects'),
    path('create_project/', CreateProjectView.as_view(), name='create_project'),
    path('add_tasks/', CreateTaskView.as_view(), name='create_task'),
    path('profile/', CurrentUserView.as_view(), name='profile'),
    path('users/', UsersView.as_view(), name='users'),
    
    path('register/', RegisterView.as_view(), name='register'),

]
