import { useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useRef } from 'react'


export const Edit = (data) => {
    const typeRef = useRef()
    const protein = useRef()
    const groupRef = useRef()

    const { group, rh_factor, type, id, count } = data.data
    const queryClient = useQueryClient()

    const saveEdit = async () => {

        const body = {
            id,
            type: typeRef.current.value,
            rh_factor: protein.current.value,
            group: groupRef.current.value
        }


        await axios.post("http://localhost:3000/edit", body)
            .then(() => {
                alert("Registro editado")
                queryClient.invalidateQueries([count + "csv"])
            })
            .catch(() => alert("Erro ao editar registro"))
    }

    return (
        <div>
            <span className='container-cards'>
                <label>
                    <p>Tipo sanguineo:</p>
                    <input type="text" defaultValue={type} ref={typeRef} />
                </label>
                <label>
                    <p>Proteína do sangue:</p>
                    <input type="text" defaultValue={rh_factor} ref={protein} />
                </label>
                <label>
                    <p>Gruopo sanguíneo:</p>
                    <input type="text" defaultValue={group} ref={groupRef} />
                </label>

            </span>
            <button
                onClick={() => saveEdit()}
            >
                Salvar</button>

        </div>
    )
}
