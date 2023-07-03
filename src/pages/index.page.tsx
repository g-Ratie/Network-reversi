import type { UserOnRoomModel } from '$/commonTypesWithClient/models';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { userAtom } from 'src/atoms/user';
import { Loading } from 'src/components/Loading/Loading';
import GameListModal from 'src/components/game/gameListModal';
import { BasicHeader } from 'src/pages/@components/BasicHeader/BasicHeader';
import { apiClient } from 'src/utils/apiClient';
import styles from './index.module.css';

const Home = () => {
  const [user] = useAtom(userAtom);
  const [latestUserOnRoom, setLatestUserOnRoom] = useState<UserOnRoomModel | null>(null);
  const router = useRouter();

  const fetchLatestUserOnRoom = async () => {
    if (typeof user?.id !== 'string') return;
    const latestUserOnRoomdata = await apiClient.rooms.useronrooms.$get();
    if (latestUserOnRoomdata !== null) setLatestUserOnRoom(latestUserOnRoomdata);
  };

  const createRoom = async () => {
    if (!user) return;
    const room = await apiClient.rooms.$get();
    await apiClient.rooms.useronrooms.$post({ body: { roomid: room.id, firebaseid: user.id } });
    router.push(`/game/${room.id}`);
  };

  useEffect(() => {
    const getboard = setInterval(fetchLatestUserOnRoom, 500);
    return () => {
      clearInterval(getboard);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!user) return <Loading visible />;
  if (latestUserOnRoom !== null && latestUserOnRoom?.out === null) {
    return (
      <>
        <BasicHeader user={user} />
        <div className={styles.box}>
          <button
            className={styles.btn}
            onClick={() => router.push(`/game/${latestUserOnRoom.roomId}`)}
          >
            続きから
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <BasicHeader user={user} />
      <div className={styles.box}>
        <button className={styles.btn} onClick={createRoom}>
          部屋作る
        </button>
        <GameListModal />
      </div>
    </>
  );
};

export default Home;
