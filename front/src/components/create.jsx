import { useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useRef } from 'react'
import '../App.css'

export const Create = (data) => {
    const { count } = data

    const type = useRef()
    const protein = useRef()
    const group = useRef()
    const queryClient = useQueryClient()

    const create = async () => {
        const body = {
            type: type.current.value,
            rh_factor: protein.current.value,
            group: group.current.value
        }

        if (Object.values(body).findIndex(res => res === "") < 0) {
            await axios.post("http://localhost:3000/register", body)
                .then(() => {
                    alert("Novo registro criado")
                    queryClient.invalidateQueries([count + "csv"])

                })
                .catch(() => alert("Erro ao criar novo registro"))
            return
        }

        alert("Você precisa preencher os campos")

    }

    return (
        <div>
            <span className='container-cards'>
                <label>
                    <p>Tipo sanguíneo:</p>
                    <input type="text" ref={type} />
                </label>
                <label>
                    <p>Proteína do sangue:</p>
                    <input type="text" ref={protein} />
                </label>
                <label>
                    <p>Grupo sanguíneo:</p>
                    <input type="text" ref={group} />
                </label>

            </span>
            <button
                onClick={() => create()}
            >
                Salvar</button>

        </div>
    )
}
