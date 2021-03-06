# Generated by Django 2.2.7 on 2019-12-12 19:55

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('quiz', '0004_auto_20191211_2332'),
    ]

    operations = [
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('uid', models.IntegerField()),
                ('version', models.IntegerField()),
                ('title', models.CharField(max_length=100)),
            ],
            options={
                'unique_together': {('id', 'version')},
            },
        ),
        migrations.CreateModel(
            name='QuestionAnswer',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('answer_number', models.IntegerField()),
                ('answer_text', models.CharField(max_length=500)),
                ('question_id', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='quiz.Question')),
            ],
        ),
    ]
