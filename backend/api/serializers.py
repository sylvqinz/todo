from rest_framework import serializers
from .models import Category, Task


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]


class TaskSerializer(serializers.ModelSerializer):
    # En lecture : on renvoie l'objet catégorie complet (id + name)
    category = CategorySerializer(read_only=True)
    # En écriture : on accepte l'id de la catégorie pour associer la tâche
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source="category", write_only=True
    )

    class Meta:
        model = Task
        fields = ["id", "description", "is_completed", "created_at", "category", "category_id"]
        read_only_fields = ["created_at"]
