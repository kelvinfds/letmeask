import { useParams, useHistory } from 'react-router-dom'

import logoImg from '../../assets/images/logo.svg';
import deleteImg from '../../assets/images/delete.svg'

import { Button } from '../../Components/Button'
import { RoomCode } from '../../Components/RoomCode'
import { Question } from '../../Components/Question'

//import { useAuth } from '../../hooks/useAuth';
import { useRoom } from '../../hooks/useRoom';

import '../../styles/room.scss';
import { database } from '../../services/firebase';




type RoomParams = {
    id: string;
}

export function AdminRoom() {
    // const { user } = useAuth();
    const params = useParams<RoomParams>();
    const roomId = params.id
    const history = useHistory();

    const { questions, title } = useRoom(roomId)

    async function handleEndRoom() {
        if (window.confirm('Tem certeza que deseja encerrar a sala de perguntas?')) {
            await database.ref(`rooms/${roomId}`).update({
                endedAt: new Date(),
            })
            history.push('/')
        }
    }

    async function handleDeleteQuestion(questionId: string) {
        if (window.confirm('Tem certeza que deseja excluir esta pergunta?')) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={roomId} />
                        <Button
                            isOutlined
                            onClick={handleEndRoom}
                        >Encerrar Sala</Button>
                    </div>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala: {title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div>

                <div className="question-list">
                    {questions.map(question => {
                        return (
                            <Question
                                key={question.id}
                                content={question.content}
                                author={question.author}
                            >
                                <button
                                    type="button"
                                    onClick={() => handleDeleteQuestion(question.id)}
                                >
                                    <img src={deleteImg} alt="Deletar pergunta" />
                                </button>
                            </Question>
                        );
                    })}
                </div>
            </main>
        </div>

    );
}