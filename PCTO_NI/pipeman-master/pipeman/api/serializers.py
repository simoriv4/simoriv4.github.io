from rest_framework import routers, serializers, viewsets

from pipeman.models import Repository

class RepositorySerializer(serializers.ModelSerializer):
    parents = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='gitlab_pid',
    )
    
    class Meta:
        model = Repository
        fields ="__all__" 
        