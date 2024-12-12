from rest_framework import serializers
from .models import Project, Task
from django.contrib.auth.models import User



class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'


class TaskSerializer(serializers.ModelSerializer):
    assigned_to = serializers.CharField(source='assigned_to.username', read_only=True)
    assigned_to = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=True)
  
    project = serializers.CharField(source='project.title', read_only=True)
    project = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all(), required=True)
    
    class Meta:
        model = Task
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True) 

    class Meta:
        model = User
        fields = ['id', 'username', 'is_staff', 'is_superuser', 'tasks']  