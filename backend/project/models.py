from django.db import models
from users.models import CustomUser


class Client(models.Model):
    company_name = models.CharField(max_length=255)
    industry = models.CharField(max_length=100)
    contact_person = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=30)
    notes = models.TextField(blank=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="clients")

    def __str__(self):
        return self.company_name


class Project(models.Model):
    STATUS_CHOICES = [
        ('active', 'Aktywny'),
        ('completed', 'Ukończony'),
        ('paused', 'Wstrzymany'),
    ]

    manager = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="projects")
    name = models.CharField(max_length=255)
    description = models.TextField()
    client = models.ForeignKey(Client, on_delete=models.SET_NULL, related_name="projects", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=9, choices=STATUS_CHOICES, default='active')
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    collabolators = models.ManyToManyField(CustomUser, related_name="collaborated_projects", blank=True)

    def __str__(self):
        return self.name


class Task(models.Model):
    STATUS_CHOICES = [
        ('to_do', 'Do zrobienia'),
        ('in_progress', 'W trakcie'),
        ('completed', 'Ukończony'),
    ]
    PRIORITY_CHOICES = [
        ('low', 'Niski'),
        ('medium', 'Średni'),
        ('high', 'Wysoki'),
    ]

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="tasks")
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="tasks", null=True, blank=True)
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=11, choices=STATUS_CHOICES, default='to_do')
    due_date = models.DateField()
    priority = models.CharField(max_length=6, choices=PRIORITY_CHOICES, default='medium')
    created_at = models.DateTimeField(auto_now_add=True)
    parent_task = models.ForeignKey('self', on_delete=models.CASCADE, related_name="subtasks", blank=True, null=True)

    def __str__(self):
        return self.title


class TimeLog(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="timelog")
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
