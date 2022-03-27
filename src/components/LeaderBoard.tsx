import { useQuery } from '@apollo/client';
import { orderBy } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { FETCH_HIGHSCORES_QUERY } from '../queries/queries';

interface LeaderboardProps {
  isLeaderboardOpen: boolean
}

const Leaderboard: React.FC<LeaderboardProps> = (props) => {
  const { isLeaderboardOpen } = props;
  // TODO: error handling
  const { loading, error, data, refetch } = useQuery(FETCH_HIGHSCORES_QUERY, {
    onError: (e) => { console.log(e); },
  });

  // update the leaderboard when the module opens
  useEffect(() => {
    if (!isLeaderboardOpen) return;
    refetch();
  }, [isLeaderboardOpen]);

  const leaderboardUsers = useMemo(() => {
    if (loading || !data || !data.user) return [];
    const sortedUsers = orderBy(data.user, 'highscore', 'desc');
    return sortedUsers.slice(0, 5);
  }, [data]);


  return (
    <div className="flex flex-col h-4/5">
      <h1 className="my-8 font-bold" >Leaderboard </h1>
      {!loading &&
        <div className="flex justify-around flex-grow w-full">
          <table className="w-[600px] lg:w-[800px]">
            <tbody>
              {leaderboardUsers.map((user: any, i: number) => (
                <tr key={i}>
                  <td> {i + 1}. </td>
                  <td> {user.username} </td>
                  <td> {user.highscore} </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }
    </div>
  )
}

export default Leaderboard;
