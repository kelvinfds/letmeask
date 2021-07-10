import { useHistory } from 'react-router-dom'
import { FormEvent } from 'react'

import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleIconImg from '../assets/images/google-icon.svg'

import { Button } from '../Components/Button'
import { useAuth } from '../hooks/useAuth'
import { database } from '../services/firebase'

import '../styles/auth.scss'
import { useState } from 'react'


export function Home() {
    const [roomCode, setRoomCode] = useState('');
    const history = useHistory();
    const { user, signWithGoogle } = useAuth()

    async function handleCreateRoom() {
        if (!user) {
            await signWithGoogle()
        }

        history.push('/rooms/new')
    }

    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault();

        if (roomCode === '') {
            return;
        }

        const roomRef = await database.ref(`rooms/${roomCode}`).get();

        if (!roomRef.exists()) {
            alert('A sala que você está tentando acessar não existe ou está indisponível.');
            return;
        }

        if (roomRef.val().endedAt) {
            alert('A sala que você está tentando acessar não está mais disponivel.');
            return;
        }

        history.push(`/rooms/${roomCode}`);

    }

    return (
        <div id="page-auth" >
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiencia em tempo real!</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Logotipo da Letmeask" />
                    <button onClick={handleCreateRoom} className="create-room">
                        <img src={googleIconImg} alt="Logotipo do google" />
                        Crie sua sala com Google
                    </button>
                    <div className="separator"> ou entre em uma sala</div>
                    <form onSubmit={handleJoinRoom}>
                        <input
                            type="text"
                            placeholder="Digite o código da sala"
                            onChange={event => setRoomCode(event.target.value)}
                            value={roomCode}
                        />
                        <Button type="submit">
                            Entrar na sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    )
}