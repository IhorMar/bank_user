from django.contrib.auth.models import User
from django.core.management import BaseCommand, call_command


# quantity of number of specific data
num_categories = 20
num_news = 50
num_comments = 10

# User data for superuser
username = 'admin'
email = 'admin@example.com'
password = 'admin'


class Command(BaseCommand):
    help = 'Clears the database and generates fake data'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Clearing the database...'))

        # clear our db
        call_command('flush', '--noinput')

        create_admin_superuser(username, email, password)


# Creating superuser
def create_admin_superuser(username, email, password):
    if not User.objects.filter(username=username).exists():
        User.objects.create_superuser(username, email, password)
        print('Superuser created successfully!')
    else:
        print('Superuser already exists!')
