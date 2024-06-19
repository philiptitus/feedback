from django.test import TestCase
from django.contrib.auth import get_user_model
from feedbackhub.models import Company, Category, Feedback, Notification, Metrics

User = get_user_model()

class ModelTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='user@test.com', password='testpass123')
        self.company = Company.objects.create(name='Test Company', email='company@test.com', website_url='http://test.com', administrator=self.user)
        self.category = Category.objects.create(name='TestCategory')
        self.feedback = Feedback.objects.create(company=self.company, user=self.user, title='Test Feedback', description='Test Description', category=self.category, rating=5)
        self.notification = Notification.objects.create(feedback=self.feedback, user=self.user, message='Test Notification')
        self.metrics = Metrics.objects.create(company=self.company, description='Test Metrics')

    def test_custom_user_creation(self):
        self.assertEqual(self.user.username, 'testuser')

    def test_company_creation(self):
        self.assertEqual(self.company.name, 'Test Company')

    def test_category_creation(self):
        self.assertEqual(self.category.name, 'TestCategory')

    def test_feedback_creation(self):
        self.assertEqual(self.feedback.title, 'Test Feedback')
        self.assertEqual(self.feedback.rating, 5)

    def test_notification_creation(self):
        self.assertEqual(self.notification.message, 'Test Notification')

    def test_metrics_creation(self):
        self.assertEqual(self.metrics.description, 'Test Metrics')
