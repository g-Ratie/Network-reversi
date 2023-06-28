import type { RoomModel } from '$/commonTypesWithClient/models';
import { useEffect, useState } from 'react';
import { apiClient } from 'src/utils/apiClient';
import styles from './gameListModal.module.css';

const GameListModal = () => {
  const [roomDatas, setRoomDatas] = useState<RoomModel[]>();
  const [show, setShow] = useState(false);

  const fetchRooms = async () => {
    const rooms = await apiClient.rooms.roomlist.$get();
    setRoomDatas(rooms);
  };
  useEffect(() => {
    const getRooms = setInterval(fetchRooms, 500);
    return () => {
      clearInterval(getRooms);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (!roomDatas) return <p>loading</p>;
  if (show)
    return (
      <>
        <div className={styles.overlay}>
          <div className={styles.content}>
            <h3>ルームリスト</h3>
            <ul>
              {roomDatas.map((roomData) => (
                <li key={roomData.id}>{roomData.id}</li>
              ))}
            </ul>
            <button onClick={() => setShow(false)}>close</button>
          </div>
        </div>
      </>
    );
  else {
    return <button onClick={() => setShow(true)}>Click</button>;
  }
};

export default GameListModal;
