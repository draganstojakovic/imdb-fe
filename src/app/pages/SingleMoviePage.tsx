import { useParams } from 'react-router-dom';
import useAuthGuard from 'app/hooks/useAuthGuard';
import useMovies from 'app/hooks/useMovies';
import useComments from 'app/hooks/useComments';
import { Container, Box } from '@mui/material';
import { MovieDetailsComponent } from 'app/components/MovieDetailsComponent';
import { CommentDetailsComponent } from 'app/components/CommentDetailsComponent';
import { MessageComponent } from 'app/components/MessageComponent';
import { useEffect, useContext } from 'react';
import { UserContext } from 'app/context/UserContext';
import { MovieParamsContext } from 'app/context/MovieParamsContext';
import { LoadMoreComponent } from 'app/components/LoadMoreComponent';
import { PostCommentComponent } from 'app/components/PostCommentComponent';
import { isObjOfType, isPrimitiveType } from 'app/utils/typeCheckers';
import { IMovie, IMovieStrippedDown } from 'app/types/IMovies';
import { IUser } from 'app/types/IUser';
import { ICommentPaginated } from 'app/types/IComment';
import { EventContext } from 'app/context/EventContext';
import { ListMoviesComponent } from 'app/components/ListMoviesComponent';
import useGetRelatedMovies from 'app/hooks/useGetRelatedMovies';
import { DynamicShadow } from 'app/components/DynamicShadowComponent';

export const SingleMoviePage = () => {
  useAuthGuard(true);
  const { id } = useParams();

  const { getSingleMovie } = useMovies();
  const { getComments } = useComments();

  const {
    reloadCommentsEvent,
    setReloadCommentsEvent,
    loadMoreCommentsEvent: commentLimit,
    setLoadMoreCommentsEvent,
  } = useContext(EventContext);
  const { user } = useContext(UserContext);
  const { search, setSearch, genres, setGenres, setPage } =
    useContext(MovieParamsContext);

  const { data: movie, refetch: reloadSingleMovie } = getSingleMovie(
    id as string
  );
  const { data: commentsPaginated, refetch: refetchComments } = getComments(
    id as string,
    commentLimit
  );

  const { data: relatedMovies } = useGetRelatedMovies(movie, id);

  useEffect(() => {
    if (search.length > 0) setSearch('');
    if (genres.length > 0) setGenres('');

    return () => {
      setLoadMoreCommentsEvent(5);
      setPage(1);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    reloadSingleMovie();
    refetchComments();
  }, [id]);

  useEffect(() => {
    refetchComments();
  }, [commentLimit]);

  useEffect(() => {
    if (reloadCommentsEvent) {
      refetchComments();
      setReloadCommentsEvent(false);
    }
  }, [reloadCommentsEvent]);

  return (
    <Container component="main" maxWidth="xl">
      <Box
        sx={{
          marginTop: 8,
          marginBottom: 5,
        }}
      >
        {isObjOfType<IMovieStrippedDown[]>(relatedMovies) && (
          <ListMoviesComponent
            movies={relatedMovies}
            caption="Related movies:"
          />
        )}
        {isObjOfType<IMovie>(movie) && isObjOfType<IUser>(user) && (
          <DynamicShadow objectId={movie.id}>
            <MovieDetailsComponent
              movieId={movie.id}
              authUser={user}
              title={movie.title}
              description={movie.description}
              coverImage={movie.coverImage}
              genres={movie.genres}
              likes={movie.likes}
              dislikes={movie.dislikes}
              views={movie.views}
              multiView={false}
              trunctate={undefined}
              showMovieDesc={undefined}
              checkIfDescShow={undefined}
            />
          </DynamicShadow>
        )}
        {isObjOfType<IUser>(user) && isPrimitiveType(id, 'string') && (
          <DynamicShadow objectId={'comment'}>
            <PostCommentComponent userId={user.id} movieId={id} />
          </DynamicShadow>
        )}
        {isObjOfType<ICommentPaginated>(commentsPaginated) &&
        commentsPaginated.comments.length > 0 ? (
          commentsPaginated.comments.map(
            (comment) =>
              isObjOfType<IUser>(user) &&
              isObjOfType<IMovie>(movie) && (
                <DynamicShadow key={comment._id} objectId={comment._id}>
                  <CommentDetailsComponent
                    comment={comment}
                    authUserId={user?.id}
                    movieId={movie?.id}
                  />
                </DynamicShadow>
              )
          )
        ) : (
          <MessageComponent message="Be first to comment" />
        )}
        {isObjOfType<ICommentPaginated>(commentsPaginated) &&
          commentsPaginated.remainingComments !== 0 && (
            <LoadMoreComponent
              loadMore={setLoadMoreCommentsEvent}
              commentLimit={commentLimit}
            />
          )}
      </Box>
    </Container>
  );
};
