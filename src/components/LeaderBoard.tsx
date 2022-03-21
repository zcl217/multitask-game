import { gql, useQuery } from '@apollo/client';
import { useState } from 'react';
// import { FETCH_HIGHSCORES_QUERY } from '../queries/queries';

// const FETCH_HIGHSCORES_QUERY = gql`
//   query FetchHighscores {
//     user(order_by: {highscore: desc}, limit: 5) {
//       highscore
//       username
//     }
//   }
// `;

const FETCH_HIGHSCORES_QUERY = gql`
  query FetchHighscores {
    user {
      highscore
      username
    }
  }
`;

const Leaderboard = () => {

  const { loading, error, data } = useQuery(FETCH_HIGHSCORES_QUERY);
  const [hasError, setHasError] = useState(false);

  // const { data, loading, error } = useQuery(FETCH_HIGHSCORES_QUERY, {
  //   onCompleted: () => {console.log(data)},
  //   onError: (e) => { setHasError(true); console.log(e) },
  // });

  return (
    <div>
    </div>

  );
}

export default Leaderboard;
