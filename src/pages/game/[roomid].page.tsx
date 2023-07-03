import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { userAtom } from 'src/atoms/user';
import { Loading } from 'src/components/Loading/Loading';
import InfoPanel from 'src/components/game/Infopanel';
import { BasicHeader } from 'src/pages/@components/BasicHeader/BasicHeader';
import { apiClient } from 'src/utils/apiClient';
import styles from './roomid.module.css';

const Home = () => {
  const [user] = useAtom(userAtom);
  const router = useRouter();
  const [board, setBoard] = useState<number[][]>([]);
  const [turn, setTurn] = useState<number>(0);
  const { roomid } = router.query;

  const fetchBoard = async () => {
    if (typeof roomid !== 'string') return;
    const room = await apiClient.rooms.post({ body: { roomid } });
    if (board !== null) setBoard(room.body?.board ?? []);
  };

  const outRoom = async () => {
    if (!user) return;
    const { roomid } = router.query;
    if (typeof roomid !== 'string') return;
    await apiClient.rooms.useronrooms.$delete({ body: { roomid } });
  };

  const clickCell = async (x: number, y: number) => {
    if (typeof roomid !== 'string') return;
    await apiClient.rooms.board.post({ body: { x, y, roomid } });
    await fetchBoard();
  };

  const fetchTurn = async () => {
    if (typeof roomid !== 'string') return;
    const turn = await apiClient.turn.$get({ query: { roomid } });
    setTurn(turn);
  };

  useEffect(() => {
    const getboard = setInterval(fetchBoard, 500);
    const getturn = setInterval(fetchTurn, 500);
    return () => {
      clearInterval(getboard);
      clearInterval(getturn);
    };
  });

  if (!user) return <Loading visible />;

  return (
    <>
      <BasicHeader user={user} />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div className={styles.board}>
          {board.map((row, y) =>
            row.map((color, x) => (
              <div className={styles.cell} key={`${x}_${y}`} onClick={() => clickCell(x, y)}>
                {color > 0 && (
                  <div
                    className={styles.disc}
                    style={{ backgroundColor: color === 1 ? '#444' : '#fff' }}
                  />
                )}
                {color === -1 && (
                  <div className={styles.disc} style={{ backgroundColor: '#e1ff00' }} />
                )}
              </div>
            ))
          )}
        </div>
        <button className={styles.btn} onClick={outRoom}>
          やめる
        </button>
      </div>
      <InfoPanel />
      <p>{turn}ターン目</p>
    </>
  );
};

export default Home;
