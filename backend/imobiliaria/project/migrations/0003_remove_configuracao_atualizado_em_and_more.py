# Generated by Django 5.1.7 on 2025-03-14 15:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0002_configuracao'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='configuracao',
            name='atualizado_em',
        ),
        migrations.RemoveField(
            model_name='configuracao',
            name='logo_header',
        ),
        migrations.AddField(
            model_name='configuracao',
            name='logo',
            field=models.ImageField(blank=True, null=True, upload_to='logos/'),
        ),
        migrations.AddField(
            model_name='configuracao',
            name='logo_url',
            field=models.URLField(default='http://localhost:8000/static/img/logo_sem_fundo.png'),
        ),
    ]
