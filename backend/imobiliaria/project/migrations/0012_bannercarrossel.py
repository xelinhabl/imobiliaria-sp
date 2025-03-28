# Generated by Django 5.1.7 on 2025-03-25 23:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0011_remove_agendamento_cpf_remove_agendamento_logradouro_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='BannerCarrossel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('titulo', models.CharField(blank=True, max_length=100, null=True)),
                ('descricao', models.TextField(blank=True, null=True)),
                ('imagem', models.FileField(upload_to='banners/')),
                ('ordem', models.PositiveIntegerField(default=0)),
                ('ativo', models.BooleanField(default=True)),
                ('data_criacao', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'verbose_name': 'Banner do Carrossel',
                'verbose_name_plural': 'Banners do Carrossel',
                'ordering': ['ordem'],
            },
        ),
    ]
