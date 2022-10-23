import { Err, Ok, Result } from '@hqoss/monads';
import axios from 'axios';
import { array, guard, object, string } from 'decoders';
import settings from '../config/settings';
import {
  Article,
  articleDecoder,
  ArticleForEditor,
  ArticlesFilters,
  FeedFilters,
  MultipleArticles,
  multipleArticlesDecoder,
} from '../types/article';
import { Comment, commentDecoder } from '../types/comment';
import { GenericErrors, genericErrorsDecoder } from '../types/error';
import { objectToQueryString } from '../types/object';
import { Profile, profileDecoder } from '../types/profile';
import { User, userDecoder, UserForRegistration, UserSettings } from '../types/user';

axios.defaults.baseURL = settings.baseApiUrl;

// The constant finalFilters is declared after it is used. Make sure it's declared first but keep the
// blank line between declaration and return statement.
// When you are done, move components/Header/Footer.tsx to where it belongs: under components/Footer/.
// Then if necessary update any imports to the new path.
// When that is completed go to the file ArticlePage.tsx and follow the instructions at the top of that file.
export async function getArticles(filters: ArticlesFilters = {}): Promise<MultipleArticles> {
  const finalFilters: ArticlesFilters = {
    limit: 10,
    offset: 0,
    ...filters,
  };

  return guard(multipleArticlesDecoder)((await axios.get(`articles?${objectToQueryString(finalFilters)}`)).data);
}

export async function getTags(): Promise<{ tags: string[] }> {
  return guard(object({ tags: array(string) }))((await axios.get('tags')).data);
}

export async function login(email: string, password: string): Promise<Result<User, GenericErrors>> {
  try {
    const { data } = await axios.post('users/login', { user: { email, password } });

    return Ok(guard(object({ user: userDecoder }))(data).user);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function getUser(): Promise<User> {
  const { data } = await axios.get('user');
  return guard(object({ user: userDecoder }))(data).user;
}

export async function favoriteArticle(slug: string): Promise<Article> {
  return guard(object({ article: articleDecoder }))((await axios.post(`articles/${slug}/favorite`)).data).article;
}

export async function unfavoriteArticle(slug: string): Promise<Article> {
  return guard(object({ article: articleDecoder }))((await axios.delete(`articles/${slug}/favorite`)).data).article;
}

export async function updateSettings(user: UserSettings): Promise<Result<User, GenericErrors>> {
  try {
    const { data } = await axios.put('user', user);

    return Ok(guard(object({ user: userDecoder }))(data).user);
  } catch ({ data }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function signUp(user: UserForRegistration): Promise<Result<User, GenericErrors>> {
  try {
    const { data } = await axios.post('users', { user });

    return Ok(guard(object({ user: userDecoder }))(data).user);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

// You made it here! Now see the function below this one, getArticle, continue there.
export async function createArticle(article: ArticleForEditor): Promise<Result<Article, GenericErrors>> {
  try {
    const { data } = await axios.post('articles', { article });

    return Ok(guard(object({ article: articleDecoder }))(data).article);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

// getArticle is missing a parameter. Within the parentheses, add "slug" followed by ": " followed by string.
// Then update all the places calling this function to include a slug. Fortunately they all have
// a slug readily available. When that is done, go to the definition of getArticles in this file.
export async function getArticle(slug: string): Promise<Article> {
  const { data } = await axios.get(`articles/${slug}`);
  return guard(object({ article: articleDecoder }))(data).article;
}

export async function updateArticle(slug: string, article: ArticleForEditor): Promise<Result<Article, GenericErrors>> {
  try {
    const { data } = await axios.put(`articles/${slug}`, { article });

    return Ok(guard(object({ article: articleDecoder }))(data).article);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function getProfile(username: string): Promise<Profile> {
  const { data } = await axios.get(`profiles/${username}`);
  return guard(object({ profile: profileDecoder }))(data).profile;
}

export async function followUser(username: string): Promise<Profile> {
  const { data } = await axios.post(`profiles/${username}/follow`);
  return guard(object({ profile: profileDecoder }))(data).profile;
}

export async function unfollowUser(username: string): Promise<Profile> {
  const { data } = await axios.delete(`profiles/${username}/follow`);
  return guard(object({ profile: profileDecoder }))(data).profile;
}

export async function getFeed(filters: FeedFilters = {}): Promise<MultipleArticles> {
  const finalFilters: ArticlesFilters = {
    limit: 10,
    offset: 0,
    ...filters,
  };
  return guard(multipleArticlesDecoder)((await axios.get(`articles/feed?${objectToQueryString(finalFilters)}`)).data);
}

export async function getArticleComments(slug: string): Promise<Comment[]> {
  const { data } = await axios.get(`articles/${slug}/comments`);
  return guard(object({ comments: array(commentDecoder) }))(data).comments;
}

export async function deleteComment(slug: string, commentId: number): Promise<void> {
  await axios.delete(`articles/${slug}/comments/${commentId}`);
}

export async function createComment(slug: string, body: string): Promise<Comment> {
  const { data } = await axios.post(`articles/${slug}/comments`, { comment: { body } });
  return guard(object({ comment: commentDecoder }))(data).comment;
}

export async function deleteArticle(slug: string): Promise<void> {
  await axios.delete(`articles/${slug}`);
}
