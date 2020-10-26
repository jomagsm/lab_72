from rest_framework import serializers
from rest_framework.serializers import ModelSerializer, CharField

from webapp.models import Quote, Vote


class QuoteSerializer(ModelSerializer):
    status_display = CharField(max_length=20, source='get_status_display',
                               read_only=True)
    class Meta:
        model = Quote
        fields = '__all__'
        read_only_fields = ['text', 'author', 'email', 'rating', 'status']


class QuoteCreteSerializer(QuoteSerializer):
    class Meta(QuoteSerializer.Meta):
        read_only_fields = ['rating', 'status']


class QuoteUpdateSerializer(QuoteSerializer):
    class Meta(QuoteSerializer.Meta):
        read_only_fields = ['author', 'email', 'rating']


class CreateRatingSerializer(serializers.ModelSerializer):
    quote = QuoteSerializer(read_only=True)
    class Meta:
        model = Vote
        fields = ['quote', 'rating']

    # def create(self, validated_data):
    #     rating = Vote.objects.update_or_create(
    #         session_key=validated_data.get('session_key', None),
    #         quote=validated_data.get('quote', None),
    #         defaults={'rating': validated_data.get('rating')}
    #     )
    #     return rating

