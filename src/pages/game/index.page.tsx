import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { userAtom } from 'src/atoms/user';
import { Loading } from 'src/components/Loading/Loading';
import { BasicHeader } from 'src/pages/@components/BasicHeader/BasicHeader';
import { apiClient } from 'src/utils/apiClient';
import styles from './index.module.css';

const Home = () => {
  const [user] = useAtom(userAtom);
  const router = useRouter();

  const createRoom = async () => {
    const room = await apiClient.rooms.$get();
    router.push(`/game/${room.id}`);
  };

  if (!user) return <Loading visible />;

  return (
    <>
      <BasicHeader user={user} />
      <div className={styles.box}>
        <button className={styles.btn} onClick={createRoom}>
          部屋を作る
        </button>
        <button className={styles.btn}>部屋を探す</button>
        <button className={styles.btn}>続きから</button>
      </div>
    </>
  );
};

export default Home;
