import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { userAtom } from 'src/atoms/user';
import InfoPanel from 'src/components/game/Infopanel';
import { Loading } from 'src/components/Loading/Loading';
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
    console.log('fetchBoard', roomid);
    const room = await apiClient.rooms.post({ body: { roomid } });
    if (board !== null) setBoard(room.body?.board ?? []);
  };

  const clickCell = async (x: number, y: number) => {
    if (typeof roomid !== 'string') return;
    await apiClient.rooms.board.post({ body: { x, y, roomid } });
    await fetchBoard();
    console.log('click', x, y);
  };

  const fetchTurn = async () => {
    const turn = await apiClient.turn.$get();
    if (turn !== null) setTurn(turn);
  };

  useEffect(() => {
    const getboard = setInterval(fetchBoard, 500);
    const getturn = setInterval(fetchTurn, 500);
    return () => {
      clearInterval(getboard);
      clearInterval(getturn);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!user) return <Loading visible />;

  return (
    <>
      <BasicHeader user={user} />
      <p>roomid:{roomid}</p>
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
        <InfoPanel />
      </div>
      <p>{turn === 1 ? '黒' : '白'}のターン</p>
    </>
  );
};

export default Home;
