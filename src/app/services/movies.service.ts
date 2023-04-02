import { httpService } from './http.service';
import {
  IMovie,
  IMovieDraft,
  IMoviePaginated,
  IMovieWithComments,
  IVoteMoviePayload,
} from 'app/types/IMovies';
import { IError } from 'app/types/IError';
import { AxiosResponse } from 'axios';
import { IVote } from 'app/types/IVote';
import { IViews } from 'app/types/IViews';

class MoviesService {
  async GetMovies(page = 1, limit = 10, search?: string, genres?: string) {
    return await httpService.request<IMoviePaginated | IError>({
      url: `/api/movies?page=${page}&limit=${limit}&search=${search}&genres=${genres}`,
      method: 'GET',
    });
  }

  async GetSingleMovie(payload: string) {
    return await httpService.request<IMovieWithComments | IError>({
      url: `/api/movies/${payload}`,
      method: 'GET',
    });
  }

  async CreateMovie(payload: IMovieDraft) {
    return await httpService.request<AxiosResponse<IMovie, IError>>({
      url: '/api/movies',
      method: 'POST',
      data: payload,
    });
  }

  async VoteMovie(payload: IVoteMoviePayload) {
    return await httpService.request<AxiosResponse<IVote, IError>>({
      url: `/api/votes?movieId=${payload.movieId}&userId=${payload.userId}&button=${payload.button}`,
      method: 'PUT',
    });
  }

  async IncrementMovieViews(payload: string) {
    return await httpService.request<AxiosResponse<IViews, IError>>({
      url: `/api/views/${payload}`,
      method: 'PUT',
    });
  }
}

export const moviesService = new MoviesService();
