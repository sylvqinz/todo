from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Category, Task
from .serializers import CategorySerializer, TaskSerializer
from django.http import JsonResponse

def health_check(request):
    """Une vue simple qui renvoie un statut de succès."""
    return JsonResponse({"status": "ok", "message": "API is healthy"})

# GET  /api/categories/ : liste toutes les catégories
# POST /api/categories/ : crée une nouvelle catégorie
@api_view(["GET", "POST"])
def category_list_create(request):
    if request.method == "GET":
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

    # POST : création d'une catégorie avec validation
    serializer = CategorySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# DELETE /api/categories/<pk>/ : suppression d'une catégorie (et de ses tâches via CASCADE)
@api_view(["DELETE"])
def category_detail(request, pk):
    try:
        category = Category.objects.get(pk=pk)
    except Category.DoesNotExist:
        return Response(
            {"detail": "Catégorie introuvable."},
            status=status.HTTP_404_NOT_FOUND,
        )
    category.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


# GET  /api/tasks/           : liste toutes les tâches (filtre optionnel par ?category_id=X)
# POST /api/tasks/           : crée une nouvelle tâche associée à une catégorie existante
@api_view(["GET", "POST"])
def task_list_create(request):
    if request.method == "GET":
        tasks = Task.objects.all()
        # Filtrage optionnel par catégorie via le paramètre de requête
        category_id = request.query_params.get("category_id")
        if category_id is not None:
            tasks = tasks.filter(category_id=category_id)
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

    # POST : création d'une tâche avec validation
    serializer = TaskSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# GET    /api/tasks/<pk>/ : récupère une tâche
# PATCH  /api/tasks/<pk>/ : mise à jour partielle (ex: is_completed)
# DELETE /api/tasks/<pk>/ : suppression d'une tâche
@api_view(["GET", "PATCH", "DELETE"])
def task_detail(request, pk):
    try:
        task = Task.objects.get(pk=pk)
    except Task.DoesNotExist:
        return Response(
            {"detail": "Tâche introuvable."},
            status=status.HTTP_404_NOT_FOUND,
        )

    if request.method == "GET":
        serializer = TaskSerializer(task)
        return Response(serializer.data)

    if request.method == "PATCH":
        serializer = TaskSerializer(task, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # DELETE
    task.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
