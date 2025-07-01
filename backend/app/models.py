from django.contrib.auth.models import AbstractUser, UserManager as DefaultUserManager
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager


class UserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        if not username:
            raise ValueError('The Username field must be set')

        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(username, email, password, **extra_fields)

class User(AbstractUser):

    objects = UserManager()

    def __str__(self):
        return self.username

class User_details(models.Model):
    username = models.CharField(max_length=255)
    height = models.IntegerField()
    weight = models.IntegerField()
    age = models.IntegerField()
    gender = models.CharField(max_length=255)
    bmi = models.DecimalField(decimal_places=2 , max_digits=1000)
    bmr = models.DecimalField(decimal_places=2 , max_digits=1000)
    food_type = models.CharField(max_length=255)

class WorkoutPlan(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()

class WorkoutSchedule(models.Model):
    plan = models.ForeignKey(WorkoutPlan, related_name='schedule', on_delete=models.CASCADE)
    day = models.IntegerField()
    workout = models.CharField(max_length=255)

class Exercise(models.Model):
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=50)
    equipment = models.CharField(max_length=255)
    muscle_group = models.CharField(max_length=50)
    image_url = models.TextField(null=True, blank=True)  # Add this line
  # e.g. 'chest', 'triceps', etc.

