# Generated by Django 4.2.1 on 2023-05-30 07:28

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("pipeman", "0002_alter_repository_parents"),
    ]

    operations = [
        migrations.CreateModel(
            name="Settings",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("gitlab_host", models.CharField(max_length=255)),
                ("gitlab_token", models.CharField(max_length=255)),
            ],
        ),
    ]
