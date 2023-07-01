import type { RoomModel } from '$/commonTypesWithClient/models';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { userAtom } from 'src/atoms/user';
import { apiClient } from 'src/utils/apiClient';
import styles from './gameListModal.module.css';

const GameListModal = () => {
  const [roomDatas, setRoomDatas] = useState<RoomModel[]>();
  const [show, setShow] = useState(false);
  const [user] = useAtom(userAtom);
  const router = useRouter();

  const fetchRooms = async () => {
    const rooms = await apiClient.rooms.roomlist.$get();
    setRoomDatas(rooms);
  };
  const joinRoom = async (roomid: string) => {
    if (!user) return;
    const joinroom = await apiClient.rooms.roomlist.$post({ body: { roomid } });
    await apiClient.rooms.useronrooms.$post({ body: { roomid: joinroom.id, firebaseid: user.id } });
    router.push(`/game/${roomid}`);
  };

  useEffect(() => {
    const getRooms = setInterval(fetchRooms, 500);
    return () => {
      clearInterval(getRooms);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (!roomDatas)
    return (
      <button className={styles.btn} onClick={() => setShow(true)}>
        部屋探す
      </button>
    );
  if (show)
    return (
      <>
        <div className={styles.overlay}>
          <div className={styles.content}>
            <h3>ルームリスト</h3>
            <span onClick={() => setShow(false)} className={styles.square_btn} />
            <ul>
              {roomDatas.map((roomData) => (
                <li key={roomData.id} onClick={() => joinRoom(roomData.id)}>
                  {roomData.id}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </>
    );
  else {
    return (
      <button className={styles.btn} onClick={() => setShow(true)}>
        部屋探す
      </button>
    );
  }
};

export default GameListModal;
