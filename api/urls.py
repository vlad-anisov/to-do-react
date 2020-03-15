from django.urls import path
from . import views

urlpatterns = [
    path('', views.apiOverview, name='apiOverview'),
    path('task-list/', views.taskList, name='taskList'),
    path('task-detail/<int:pk>/', views.taskDetail, name='taskDetail'),
    path('task-create/', views.taskCreate, name='taskCreate'),
    path('task-update/<int:pk>/', views.taskUpdate, name='taskUpdate'),
    path('task-delete/<int:pk>/', views.taskDelete, name='taskDelete'),
] 