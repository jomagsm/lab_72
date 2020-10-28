from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from api.permission import QuotePermissions
from api.serializers import QuoteCreteSerializer, QuoteUpdateSerializer, QuoteSerializer, CreateRatingSerializer
from webapp.models import Quote, Vote


class QuoteViewSet(ModelViewSet):
    permission_classes = [QuotePermissions]

    def get_queryset(self):
        if self.request.method == 'GET' and not self.request.user.has_perm('webapp.quote_view'):
            return Quote.get_moderated()
        return Quote.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return QuoteCreteSerializer
        elif self.request.method == 'PUT':
            return QuoteUpdateSerializer
        return QuoteSerializer


class AddRatingView(APIView):
    # def get_session_id(self, request):
    #     if not self.request.session.session_key:
    #         self.request.session.save()
    #     session = self.request.session
    #     return session.session_key

    def get(self, request, pk=None):
        print(request.session.session_key)
        if not request.session.session_key:
            self.request.session.save()
        session = self.request.session.session_key
        quote = get_object_or_404(Quote.objects.all(), pk=pk)
        vote = Vote.objects.all().filter(session_key=session, quote_id=pk)
        if len(vote) > 0:
            if vote[0].rating == -1:
                vote[0].rating = 1
                quote.rating = quote.rating + 1
                vote[0].save()
        else:
            vote = Vote.objects.create(session_key=session, quote_id=pk, rating=1)
            quote.rating = quote.rating + 1
        quote.save()
        slr = QuoteSerializer(quote)
        return Response({"rating": quote.rating})


class DeleteRatingView(APIView):
    def get(self, request, pk=None):
        if not self.request.session.session_key:
            self.request.session.save()
        session = self.request.session.session_key
        quote = get_object_or_404(Quote.objects.all(), pk=pk)
        vote = Vote.objects.all().filter(session_key=session, quote_id=pk)
        print(vote)
        if len(vote) > 0:
            if vote[0].rating == 1:
                vote[0].rating = -1
                quote.rating = quote.rating - 1
                vote[0].save()
        else:
            print('dffddfdfdfdfdfsdfsdfdsfds')
            vote = Vote.objects.create(session_key=session, quote_id=pk, rating=-1)
            print(vote.rating)
            quote.rating = quote.rating - 1
        quote.save()
        slr = QuoteSerializer(quote)
        return Response({"rating":quote.rating})

# class RemoveFavoritesView(APIView):
#     permission_classes = [IsAuthenticated]
#
#     @method_decorator(ensure_csrf_cookie)
#     def delete(self, request, pk=None):
#         favorites = get_object_or_404(Favorites, photo_id=pk)
#         favorites.delete()
#         return Response({'pk': pk})


        # print(session)
        # print(self.request)
    # def post(self, request):
    #     serializer = CreateRatingSerializer(data=request.data)
    #     print(serializer)
    #     if serializer.is_valid():
    #         # serializer(session_key=self.get_session_id(request))
    #         print(serializer)
    #         serializer.save(session_key=self.get_session_id(request))
    #         return Response(status=201)
    #     else:
    #         return Response(status=400)


