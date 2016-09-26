from django.db import models
from django.contrib.auth.models import User


# testing user functionality
class TestModel(models.Model):
    user = models.ForeignKey(User)