# Generated by Django 2.1.5 on 2020-10-20 07:24

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('games', '0005_diray_mailbox'),
    ]

    operations = [
        migrations.CreateModel(
            name='DirayImage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('img', models.ImageField(blank=True, help_text='日记图片', null=True, upload_to='MengShang', verbose_name='图片')),
            ],
            options={
                'verbose_name': '萌上日记,图片库',
                'verbose_name_plural': '萌上日记,图片库',
            },
        ),
        migrations.AlterModelOptions(
            name='diray',
            options={'ordering': ('-date',), 'verbose_name': '萌上日记,日记库', 'verbose_name_plural': '萌上日记,日记库'},
        ),
        migrations.AlterModelOptions(
            name='mailbox',
            options={'ordering': ('-date',), 'verbose_name': '萌上日记,信箱', 'verbose_name_plural': '萌上日记,信箱'},
        ),
        migrations.RemoveField(
            model_name='diray',
            name='img',
        ),
        migrations.AddField(
            model_name='dirayimage',
            name='diray',
            field=models.ForeignKey(help_text='日记图片', on_delete=django.db.models.deletion.CASCADE, to='games.Diray', verbose_name='日记图片'),
        ),
    ]
