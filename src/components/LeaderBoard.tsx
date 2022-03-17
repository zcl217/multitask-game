import { gql, useQuery, useSubscription } from '@apollo/client';
import { useState } from 'react';
import { FETCH_HIGHSCORES_QUERY } from '../queries/queries';

// const FETCH_HIGHSCORES_QUERY = gql`{
//   user(order_by: {highscore: desc}, limit: 5) {
//     highscore
//     username
//   }
// }`

const Leaderboard = () => {

  const [hasError, setHasError] = useState(false);

  const { data, loading } = useQuery(FETCH_HIGHSCORES_QUERY, {
    onCompleted: () => {console.log(data)},
    onError: (e) => { setHasError(true); console.log(e) },
  });

  return (
    <div>
    </div>

  );
}

export default Leaderboard;
