# Generated by Django 4.2.1 on 2023-06-16 14:26

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("pipeman", "0011_alter_repository_defaul_branch_last_commit_and_more"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="repository",
            name="defaul_branch_last_commit",
        ),
        migrations.RemoveField(
            model_name="repository",
            name="last_tag_commit",
        ),
    ]