import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { userAtom } from 'src/atoms/user';
import { Loading } from 'src/components/Loading/Loading';
import GameListModal from 'src/components/game/gameListModal';
import { BasicHeader } from 'src/pages/@components/BasicHeader/BasicHeader';
import { apiClient } from 'src/utils/apiClient';
import styles from './index.module.css';

const Home = () => {
  const [user] = useAtom(userAtom);
  const router = useRouter();

  const createRoom = async () => {
    if (!user) return;
    const room = await apiClient.rooms.$get();
    console.log(new Date());
    await apiClient.rooms.useronrooms.$post({ body: { roomid: room.id, firebaseid: user.id } });
    router.push(`/game/${room.id}`);
  };

  if (!user) return <Loading visible />;

  return (
    <>
      <BasicHeader user={user} />
      <div className={styles.box}>
        <button className={styles.btn} onClick={createRoom}>
          部屋作る
        </button>
        <GameListModal />
        <button className={styles.btn}>続きから</button>
      </div>
    </>
  );
};

export default Home;
