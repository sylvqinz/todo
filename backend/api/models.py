from django.db import models


class Category(models.Model):
    # Nom unique et obligatoire pour chaque catégorie
    name = models.CharField(max_length=255, unique=True, blank=False)

    class Meta:
        verbose_name_plural = "categories"

    def __str__(self):
        return self.name


class Task(models.Model):
    description = models.TextField(blank=False)
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    # Suppression en cascade : si une catégorie est supprimée, ses tâches le sont aussi
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name="tasks"
    )

    def __str__(self):
        return self.description[:50]
