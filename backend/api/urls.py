from django.urls import path
from . import views


# Routes de l'API REST pour les catégories et les tâches
urlpatterns = [
    path("categories/", views.category_list_create, name="category-list-create"),
    path("categories/<int:pk>/", views.category_detail, name="category-detail"),
    path("tasks/", views.task_list_create, name="task-list-create"),
    path("tasks/<int:pk>/", views.task_detail, name="task-detail"),
]
