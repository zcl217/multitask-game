import { gql } from '@apollo/client';

export const FETCH_HIGHSCORES_QUERY = gql`
  {
    user(order_by: {highscore: desc}, limit: 5) {
      highscore
      username
    }
  }
`;

export const FETCH_USERNAMES_QUERY = gql`
  {
    user {
      username
    }
  }
`;

export const FETCH_CURRENT_USER = gql`
    query FetchCurrentHighscore($userId: String!) {
      user(where: {user_id: {_eq: $userId}}) {
        username,
        highscore
      }
    }
`;
export const INSERT_NEW_USER_MUTATION = gql`
  mutation InsertUser($userId: String!, $email: String!) {
    insert_user_one(object: {user_id: $userId, email: $email}) {
      user_id
      email
    }
  }
`;

export const UPDATE_USERNAME_MUTATION = gql`
  mutation UpdateUsername($userId: String!, $newUsername: String!) {
    update_user(where: {user_id: {_eq: $userId}}, _set: {username: $newUsername}) {
      returning {
        username
      }
    }
  }
`;
export const UPDATE_USER_SCORE_MUTATION = gql`
  mutation UpdateScore($userId: String!, $highscore: Int!) {
    update_user(where: {user_id: {_eq: $userId}}, _set: {highscore: $highscore}) {
      returning {
        highscore
      }
    }
  }
`;