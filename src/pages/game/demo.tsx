import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { userAtom } from 'src/atoms/user';
import { Loading } from 'src/components/Loading/Loading';
import { BasicHeader } from 'src/pages/@components/BasicHeader/BasicHeader';
import { apiClient } from 'src/utils/apiClient';
import { returnNull } from 'src/utils/returnNull';
import styles from './roomid.module.css';

const Home = () => {
  const [user] = useAtom(userAtom);
  const router = useRouter();
  const [board, setBoard] = useState<number[][]>([]);
  const [turn, setTurn] = useState<number>(0);
  const fetchBoard = async () => {
    const board = await apiClient.rooms.$get().catch(returnNull);
    if (board !== null) setBoard(board.board);
  };

  const clickCell = async (x: number, y: number) => {
    await apiClient.rooms.board.post({ body: { x, y } });
    await fetchBoard();
    console.log('click', x, y);
  };

  const fetchTurn = async () => {
    const turn = await apiClient.turn.$get();
    if (turn !== null) setTurn(turn);
  };
  const { id } = router.query;

  useEffect(() => {
    const getboard = setInterval(fetchBoard, 500);
    const getturn = setInterval(fetchTurn, 500);
    return () => {
      clearInterval(getboard);
      clearInterval(getturn);
    };
  }, []);

  if (!board || !user) return <Loading visible />;

  return (
    <>
      <BasicHeader user={user} />
      <p>roomid:{id}</p>
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
      <p>{turn === 1 ? '黒' : '白'}のターン</p>
    </>
  );
};

export default Home;
