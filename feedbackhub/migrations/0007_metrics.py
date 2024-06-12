# Generated by Django 5.0.2 on 2024-06-12 13:05

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("feedbackhub", "0006_alter_feedback_description"),
    ]

    operations = [
        migrations.CreateModel(
            name="Metrics",
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
                ("description", models.TextField()),
                (
                    "company",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="metrics",
                        to="feedbackhub.company",
                    ),
                ),
            ],
        ),
    ]