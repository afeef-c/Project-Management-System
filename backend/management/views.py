from rest_framework import generics, viewsets, permissions, status as Status
from rest_framework.views import APIView
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from .models import Project, Task
from .serializers import UserSerializer,ProjectSerializer, TaskSerializer
from django.contrib.auth.models import User


from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Task
from .serializers import TaskSerializer




class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]  # Allow anyone to access this endpoint

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        if username is None or password is None:
            return Response(
                {'error': 'Please provide both username and password'},
                status=Status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(username=username).exists():
            return Response(
                {'error': 'Username already exists'},
                status=Status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.create_user(username=username, password=password)
        user.save()

        return Response(
            {'message': 'User created successfully'},
            status=Status.HTTP_201_CREATED
        )

# User Detail View (Optional)
class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class CurrentUserView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user


class UsersView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    






class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Project.objects.all()
        # if self.request.user.is_staff:
        #     return Project.objects.all()
        # return Project.objects.filter(tasks__assigned_to=self.request.user).distinct()


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Project.objects.all()
        # Uncomment the following logic if specific access control is needed:
        # if self.request.user.is_staff:
        #     return Project.objects.all()
        # return Project.objects.filter(tasks__assigned_to=self.request.user).distinct()

    def update(self, request, *args, **kwargs):
        
        instance = self.get_object()
        # Add any custom permission or validation logic here
        serializer = self.get_serializer(instance, data=request.data, partial=False)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        """
        Override the partial_update method to handle partial updates.
        """
        instance = self.get_object()
        # Add any custom permission or validation logic here
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        """
        Override the destroy method to handle delete operations.
        """
        instance = self.get_object()
        # Add any custom permission or validation logic here
        self.perform_destroy(instance)
        return Response({"detail": "Project deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

    def perform_update(self, serializer):
        """
        Customize the update behavior if needed.
        """
        serializer.save()

    def perform_destroy(self, instance):
        """
        Customize the delete behavior if needed.
        """
        instance.delete()



class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Task.objects.all()
        return Task.objects.filter(assigned_to=self.request.user)

    def update(self, request, *args, **kwargs):
        

        instance = self.get_object()
        if not request.user.is_staff and instance.assigned_to != request.user:
            return Response(
                {"detail": "You are not allowed to update this task."},
                status=status.HTTP_403_FORBIDDEN
            )

        return super().update(request, *args, **kwargs)
    
        def destroy(self, request, *args, **kwargs):
            
            instance = self.get_object()
            # Add any custom permission or validation logic here
            self.perform_destroy(instance)
            return Response({"detail": "Task deleted successfully."}, status=status.HTTP_204_NO_CONTENT)


    def partial_update(self, request, *args, **kwargs):
        
        instance = self.get_object()
        if not request.user.is_staff and instance.assigned_to != request.user:
            return Response(
                {"detail": "You are not allowed to update this task."},
                status=status.HTTP_403_FORBIDDEN
            )

        return super().partial_update(request, *args, **kwargs)

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """
        Custom action to update the status of a task.
        """
        task = self.get_object()
        status = request.data.get("status")
        if status not in [choice[0] for choice in Task.STATUS_CHOICES]:
            return Response(
                {"detail": "Invalid status."},
                status=status.HTTP_400_BAD_REQUEST
            )

        task.status = status
        task.save()
        serializer = self.get_serializer(task)
        return Response(serializer.data)



class CreateProjectView(APIView):
    permission_classes = [permissions.IsAuthenticated]  # Ensure only authenticated users can create projects

    def post(self, request, *args, **kwargs):
        title = request.data.get('title')
        description = request.data.get('description')
        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')
        status = request.data.get('status', 'planned')  # Default status is 'planned'

        # Validate required fields
        if not title or not description or not start_date or not end_date:
            return Response(
                {'error': 'Title, description, start_date, and end_date are required'},
                status=Status.HTTP_400_BAD_REQUEST
            )

        # Validate date range
        if start_date >= end_date:
            return Response(
                {'error': 'start_date must be earlier than end_date'},
                status=Status.HTTP_400_BAD_REQUEST
            )

        # Create project
        project = Project.objects.create(
            title=title,
            description=description,
            start_date=start_date,
            end_date=end_date,
            status=status
        )
        return Response(
            {'message': 'Project created successfully', 'project_id': project.id},
            status=Status.HTTP_201_CREATED
        )



class CreateTaskView(APIView):
    permission_classes = [permissions.IsAuthenticated]  # Ensure only authenticated users can create tasks

    def post(self, request, *args, **kwargs):
        title = request.data.get('title')
        description = request.data.get('description')
        assigned_to_id = request.data.get('assigned_to')
        status = request.data.get('status', 'to-do')  # Default status is 'to-do'
        priority = request.data.get('priority', 'medium')  # Default priority is 'medium'
        project_id = request.data.get('project')

        # Validate required fields
        if not title or not description or not assigned_to_id or not project_id:
            return Response(
                {'error': 'Title, description, assigned_to, and project are required'},
                status=Status.HTTP_400_BAD_REQUEST
            )

        # Validate assigned user and project existence
        try:
            assigned_to = User.objects.get(id=assigned_to_id)
        except User.DoesNotExist:
            return Response({'error': 'Assigned user does not exist'}, status=Status.HTTP_400_BAD_REQUEST)

        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return Response({'error': 'Project does not exist'}, status=Status.HTTP_400_BAD_REQUEST)

        # Create task
        task = Task.objects.create(
            title=title,
            description=description,
            assigned_to=assigned_to,
            status=status,
            priority=priority,
            project=project
        )
        return Response(
            {'message': 'Task created successfully', 'task_id': task.id},
            status=Status.HTTP_201_CREATED
        )

