from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import CustomUser, Company, Category, Feedback, Notification
from .serializers import *

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView




class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
       def validate(self, attrs: dict[str, any]) -> dict[str, str]:
        data = super().validate(attrs)
        serializer = UserSerializerWithToken(self.user).data

        for k, v in serializer.items():
            data[k] = v

        

        return data
    

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer



from django.core.exceptions import ObjectDoesNotExist

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.contrib.auth.password_validation import validate_password
from django.db import IntegrityError
from .models import CustomUser
from .serializers import CustomUserSerializer
from .utils import send_normal_email  # Assuming you have a utility function to send emails

class RegisterUser(APIView):

    def post(self, request):
        data = request.data

        print("Data received from the form:", data)

        # Check if user type is provided
        user_type = data.get('user_type')
        if user_type not in ['admin', 'normal_user']:
            return Response({'detail': 'Invalid user type.'}, status=status.HTTP_400_BAD_REQUEST)

        # Define required fields based on user type
        fields_to_check = ['first_name', 'last_name', 'email', 'password']

        # Check if all required fields are present
        for field in fields_to_check:
            if field not in data:
                return Response({'detail': f'Missing {field} field.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check password length
        if len(data['password']) < 8:
            content = {'detail': 'Password must be at least 8 characters long.'}
            return Response(content, status=status.HTTP_400_BAD_REQUEST)

        # Check password for username and email
        if data['password'].lower() in [data['first_name'].lower(), data['email'].lower()]:
            content = {'detail': 'Password cannot contain username or email.'}
            return Response(content, status=status.HTTP_400_BAD_REQUEST)

        # Validate email format
        try:
            validate_email(data['email'])
        except ValidationError:
            return Response({'detail': 'Invalid email address.'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate password strength
        try:
            validate_password(data['password'])
        except ValidationError as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        # Create user
        try:
            user = CustomUser.objects.create_user(
                username=data['email'],
                email=data['email'],
                first_name=data['first_name'],
                last_name=data['last_name'],
                password=data['password'],
                is_admin=(user_type == 'admin'),
                is_normal_user=(user_type == 'normal_user')
            )

            email_subject = "Welcome to FeedbackHub"
            email_message = "Hello {},\n\nWelcome to FeedbackHub! Your account has been created successfully.".format(user.first_name)
            to_email = user.email
            email_data = {
                'email_body': email_message,
                'email_subject': email_subject,
                'to_email': to_email
            }
            send_normal_email(email_data)
        except IntegrityError:
            message = {'detail': 'User with this email already exists.'}
            return Response(message, status=status.HTTP_400_BAD_REQUEST)

        serializer = CustomUserSerializer(user, many=False)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

from rest_framework import viewsets, permissions, status



class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer


class IsCompanyAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow company admins to edit or delete company instances.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the company admin
        return obj.administrator == request.user









from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from .models import Company
from .serializers import CompanySerializer

class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsCompanyAdminOrReadOnly]

    def perform_create(self, serializer):
        data = serializer.validated_data
        user = self.request.user
        print(data)
        # Check if the user is already an administrator of another company
        if Company.objects.filter(administrator=user).exists():
            raise ValidationError({"detail": "You are already an administrator of another software on our platform. Please make a new account to create a new software."})
        
        # Check for duplicate name, email, and website_url
        if Company.objects.filter(name=data['name']).exists():
            raise ValidationError({"detail": "A company with this name already exists."})
        if Company.objects.filter(email=data['email']).exists():
            raise ValidationError({"detail": "A company with this email already exists."})
        if Company.objects.filter(website_url=data['website_url']).exists():
            raise ValidationError({"detail": "A company with this website URL already exists."})
 
        # Automatically set the administrator field to the request user
        serializer.save(administrator=user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except serializers.ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)








class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Feedback
from .serializers import FeedbackSerializer
from .utils import send_normal_email  # Import the utility function for sending emails

class IsCompanyAdminToUpdate(permissions.BasePermission):
    """
    Custom permission to only allow company admins to update feedback instances.
    """
    def has_object_permission(self, request, view, obj):
        # Write permissions are only allowed to the company admin
        return obj.company.administrator == request.user

class IsNormalUserToCreate(permissions.BasePermission):
    """
    Custom permission to only allow normal users to create feedback instances.
    """
    def has_permission(self, request, view):
        # Write permissions are only allowed to normal users
        return request.user.is_normal_user

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Feedback, Notification
from .serializers import FeedbackSerializer
from .utils import send_normal_email

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Feedback, Notification
from .serializers import FeedbackSerializer
from .utils import send_normal_email

class FeedbackViewSet(viewsets.ModelViewSet):
    serializer_class = FeedbackSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.is_normal_user:
            # Return feedbacks created by the normal user, ordered by creation date in descending order
            return Feedback.objects.filter(user=user).order_by('-created_at')

        if user.is_admin:
            # Get feedbacks for the company where the user is an admin and mark them as read
            feedbacks = Feedback.objects.filter(company__administrator=user).order_by('-created_at')
            new_feedbacks = feedbacks.filter(status="new")

            for feedback in new_feedbacks:
                # Mark feedback as read
                feedback.status = 'read'
                feedback.save()

                # Inform the owner of the feedback through email and a notification
                user_email = feedback.user.email
                subject = "Feedback Checked by Administrator"
                message = f"Your feedback titled '{feedback.title}' has been checked by the administrator."

                # send_normal_email({
                #     'email_body': message,
                #     'email_subject': subject,
                #     'to_email': user_email
                # })

                Notification.objects.create(
                    feedback=feedback,
                    user=feedback.user,
                    message=message
                )

            return feedbacks

        # By default return an empty queryset (or handle other user roles if any)
        return Feedback.objects.none()

    def perform_create(self, serializer):
        feedback = serializer.save(user=self.request.user)
        admin_email = feedback.company.administrator.email
        subject = "New Feedback Submission"
        message = f"A new feedback has been submitted. Title: {feedback.title}"
        
        # send_normal_email({
        #     'email_body': message,
        #     'email_subject': subject,
        #     'to_email': admin_email
        # })

        Notification.objects.create(
            feedback=feedback,
            user=feedback.company.administrator,
            message=message
        )

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        
        allowed_fields = ['status']
        if not all(field in request.data.keys() for field in allowed_fields):
            return Response({'detail': 'You can only update the status field.'}, status=status.HTTP_400_BAD_REQUEST)

        if serializer.is_valid():
            serializer.save()

            # Notify the user who created the feedback
            user_email = instance.user.email
            subject = "Feedback Status Updated"
            user_message = f"The status of your feedback '{instance.title}' has been updated to {instance.status}."
            
            # send_normal_email({
            #     'email_body': user_message,
            #     'email_subject': subject,
            #     'to_email': user_email
            # })

            Notification.objects.create(
                feedback=instance,
                user=instance.user,
                message=user_message
            )

            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_destroy(self, instance):
        admin_email = instance.company.administrator.email
        subject = "Feedback Deleted"
        message = f"The feedback '{instance.title}' has been deleted."
        
        # send_normal_email({
        #     'email_body': message,
        #     'email_subject': subject,
        #     'to_email': admin_email
        # })

        Notification.objects.create(
            feedback=instance,
            user=instance.company.administrator,
            message=message
        )

        instance.delete()
 



from rest_framework import viewsets, permissions
from .models import Notification, Metrics, Feedback, Company
from .serializers import NotificationSerializer, MetricsSerializer
from django.db.models import Avg, Count

from rest_framework import viewsets, permissions
from .models import Notification, Metrics, Feedback, Company
from .serializers import NotificationSerializer, MetricsSerializer
from django.db.models import Avg, Count

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer

    def get_queryset(self):
        user = self.request.user

        # Fetch unread notifications for the user, ordered by creation date (latest first)
        notifications = Notification.objects.filter(user=user, is_read=False).order_by('-created_at')

        return notifications

    def list(self, request, *args, **kwargs):
        response = super(NotificationViewSet, self).list(request, *args, **kwargs)

        # After fetching the notifications, mark them as read
        user = self.request.user
        Notification.objects.filter(user=user, is_read=False).update(is_read=True)

        return response

class MetricsViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = MetricsSerializer

    def get_queryset(self):
        user = self.request.user

        if user.is_admin and user.has_company:
            company = Company.objects.get(administrator=user)
            feedbacks = Feedback.objects.filter(company=company)

            if feedbacks.count() > 5:
                # Delete existing metrics if any
                Metrics.objects.filter(company=company).delete()

                categories = feedbacks.values('category__name').annotate(avg_rating=Avg('rating')).filter(avg_rating__isnull=False)

                if categories:
                    sorted_categories = sorted(categories, key=lambda x: x['avg_rating'], reverse=True)
                    best_categories = sorted_categories[:3]
                    worst_categories = sorted_categories[-3:]

                    best_categories_names = [category["category__name"] for category in best_categories]
                    best_categories_avg = [category["avg_rating"] for category in best_categories]
                    best_description = (
                        f"Your top performing aspects are: {best_categories_names[0]} ({best_categories_avg[0]:.2f}), "
                        f"{best_categories_names[1]} ({best_categories_avg[1]:.2f}), and {best_categories_names[2]} ({best_categories_avg[2]:.2f}). "
                        f"Keep up the good work in these areas."
                    )
                    Metrics.objects.create(company=company, description=best_description)

                    worst_categories_names = [category["category__name"] for category in worst_categories]
                    worst_categories_avg = [category["avg_rating"] for category in worst_categories]
                    worst_description = (
                        f"Your lowest performing aspects are: {worst_categories_names[0]} ({worst_categories_avg[0]:.2f}), "
                        f"{worst_categories_names[1]} ({worst_categories_avg[1]:.2f}), and {worst_categories_names[2]} ({worst_categories_avg[2]:.2f}). "
                        f"These areas need immediate attention."
                    )
                    Metrics.objects.create(company=company, description=worst_description)

                total_feedbacks = feedbacks.count()
                feedbacks_description = (
                    f"Your total feedbacks are currently {total_feedbacks}. "
                 
                )
                Metrics.objects.create(company=company, description=feedbacks_description)

                avg_rating = feedbacks.aggregate(Avg('rating'))['rating__avg']
                avg_rating_description = (
                    f"Your average website rating is {avg_rating:.2f}. "
)
                Metrics.objects.create(company=company, description=avg_rating_description)

                sentiment = 'happy' if avg_rating >= 3 else 'dissapointed'
                sentiment_description = (
                    f"Most people are {sentiment} with your software based on the average rating of {avg_rating:.2f}. "
 )
                Metrics.objects.create(company=company, description=sentiment_description)

            return Metrics.objects.filter(company=company)
        return Metrics.objects.none()
