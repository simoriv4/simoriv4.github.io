# Generated by Django 4.2.1 on 2023-06-12 09:39

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("pipeman", "0006_alter_repository_gitlab_pid"),
    ]

    operations = [
        migrations.AlterField(
            model_name="repository",
            name="project_name",
            field=models.CharField(default="", max_length=255),
        ),
    ]
