from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser
from django.db import models

# Custom User Model
class CustomUser(AbstractUser):
    is_admin = models.BooleanField(default=False)
    is_normal_user = models.BooleanField(default=True)


    def __str__(self):
        return self.username
    
    @property
    def has_company(self):
        return Company.objects.filter(administrator=self).exists()

# Company Model

class Company(models.Model):
    name = models.CharField(max_length=255, unique=True)
    email = models.EmailField(unique=True)
    website_url = models.URLField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    administrator = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='administered_companies', blank = True, null=True)

    def __str__(self):
        return self.name
# Category Model
class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

# Feedback Model
class Feedback(models.Model):
    STATUS_CHOICES = [
        ('new', 'New'),
        ('read', 'Read'),
        ('finished', 'Finished'),
    ]

    company = models.ForeignKey(Company, on_delete=models.CASCADE, blank=True, null=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, blank=True, null=True)
    title = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)], blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.title} - {self.company.name}'

# Notification Model
class Notification(models.Model):
    feedback = models.ForeignKey(Feedback, on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f'Notification for {self.user.username}'





# Metrics Model
class Metrics(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='metrics')
    description = models.TextField()

    def __str__(self):
        return f'Metrics for {self.company.name}'