from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='timelog',
            name='start_time',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]