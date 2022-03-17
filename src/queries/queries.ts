import { gql } from '@apollo/client';

export const FETCH_HIGHSCORES_QUERY = gql`{
    user(order_by: {highscore: desc}, limit: 5) {
      highscore
      username
    }
}`;

export const ADD_NEW_USER_MUTATION = ``;
export const UPDATE_USER_SCORE_MUTATION = ``;