from django.db import models

<<<<<<< HEAD
class Task(models.Model):
    title = models.CharField(max_length=255)
    start_date = models.DateField(auto_now_add=True)
    end_date = models.DateField()
    completed = models.BooleanField(default=False)
    completed_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.title
=======
# Create your models here.
>>>>>>> be34c43 (CRash Restart)
