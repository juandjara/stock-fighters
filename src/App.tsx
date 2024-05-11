import { useEffect, useRef, useState } from "react";
import { IRefPhaserGame, PhaserGame } from "./game/PhaserGame";
import { AVATARS, fxs, voices } from "./game/consts";
import { Game } from "./game/scenes/Game";

function App() {
  //  References to the PhaserGame component (game and scene are exposed)
  const phaserRef = useRef<IRefPhaserGame | null>(null);

  // Event emitted from the PhaserGame component
  const currentScene = (scene: Phaser.Scene) => {
    const gameScene = scene as Game;
    if (gameScene.scene.key === 'Game') {
      gameScene.data.set('p1', gameData.player1)
      gameScene.data.set('p2', gameData.player2)
      gameScene.setup()
    }
  };

  const [ready, setReady] = useState(false)
  const [gameData, setGameData] = useState({
    player1: {
      avatar: 0,
      fx: fxs[0],
      voice: voices[0],
    },
    player2: {
      avatar: 0,
      fx: fxs[0],
      voice: voices[0],
    },
  })

  if (!ready) {
    return (
      <main className="selection-menu-wrapper">
        <h1>Choose your fighter</h1>
        <button
          onClick={() => setReady(true)}
          className="start-button"
        >
          START
        </button>
        <p>You need a keyboard to play this game</p>
        <div className="selection-menu">
          <div className="player1">
            <h2>Player 1</h2>
            <p>Moves with W, A, S, D</p>
            <PlayerSelector
              data={gameData.player1}
              setData={(data) => setGameData({ ...gameData, player1: data })}
            />
          </div>
          <div className="player2">
            <h2>Player 2</h2>
            <p>Moves with Arrow keys</p>
            <PlayerSelector
              data={gameData.player2}
              setData={(data) => setGameData({ ...gameData, player2: data })}
            />
          </div>
        </div>
      </main>
    )
  }

  return (
    <main>
      <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
    </main>
  );
}

export type PlayerData = {
  avatar: number
  fx: string
  voice: string
}

function PlayerSelector({ data, setData }: { data: PlayerData, setData: (data: PlayerData) => void }) {
  const [avatar, setAvatar] = useState(data.avatar)
  const [voice, setVoice] = useState(data.voice)
  const [fx, setFx] = useState(data.fx)

  useEffect(() => {
    setData({ avatar, voice, fx })
    // eslint-disable-next-line
  }, [avatar, voice, fx])

  function playEffect(prefix: string, file: string) {
    const audio = new Audio(`/assets/audio/${prefix}/${file}`)
    audio.play()
  }

  return (
    <>
      <div className="avatar-grid">
        {AVATARS.map((a, index) => (
          <button
            key={index}
            onClick={() => setAvatar(index)}
            className={index === avatar ? 'avatar avatar-selected' : 'avatar'}
          >
            <img height={160} width={160} src={`/assets/img/pjs/${a}`} alt=""/>
          </button>
        ))}
      </div>
      <div className="select-wrapper">
        <label>Attack Audio Effect</label>
        <select value={fx} onChange={(ev) => setFx(ev.target.value)}>
          {fxs.map((fx, index) => (
            <option key={fx} value={fx}>Sword {index + 1}</option>
          ))}
        </select>
        <button onClick={() => playEffect('choque_espadas', fx)}>Play</button>
      </div>
      <div className="select-wrapper">
        <label>Character Voice</label>
        <select value={voice} onChange={(ev) => setVoice(ev.target.value)}>
          {voices.map((voice, index) => (
            <option key={voice} value={voice}>Voice {index + 1}</option>
          ))}
        </select>
        <button onClick={() => playEffect('pjs', voice)}>Play</button>
      </div>
    </>
  )
}

export default App;

