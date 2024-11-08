import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useRef, useState } from 'react'
import './App.css'
import { Create } from './components'
import { Edit } from './components/edit'

function App() {
  const [count, setCount] = useState(5)
  const [search, setSearch] = useState('random')
  const [view, setView] = useState('view')
  const [edit, setEdit] = useState()

  const [filter, setFilter] = useState("type")
  const [value, setValue] = useState("")



  const queryClient = useQueryClient()

  const typed = useRef()


  const getData = async () => {
    const { data } = await axios.get(`http://localhost:3000/${search}?size=${count}&key=${filter}&value=${value}`)

    return data
  }


  const { data, isFetching, refetch } = useQuery({
    queryFn: () => getData(),
    queryKey: [count + search]
  })


  const fields = data && data.length > 0 ? Object.keys(data[0]).filter(res => !res.includes("id")) : null

  const writeFile = async () => {
    const { data } = await axios.post(`http://localhost:3000/random?size=${count}`)

    return data
  }

  const { mutateAsync } = useMutation({
    mutationFn: () => writeFile(),
    onSuccess: () => alert("documento criado com sucesso")
  })


  const deleteCsv = async (id) => {
    await axios.delete(`http://localhost:3000/delete?id=${id}`)
      .then(() => {
        queryClient.invalidateQueries([count + search])
      })
      .catch(() => {
        alert("Erro ao deletar")
      })
  }




  return (
    <div>

      <div className='controller'>
        <label htmlFor="" className='wrap' >
          <p>Origem</p>
          <select
            name=""
            id=""
            onChange={async (e) => {
              await axios.get(`http://localhost:3000/csv?key=${filter}&value=${value}`)
                .then(res => {
                  const { data } = res
                  if (data.length === 0) {
                    e.preventDefault()
                    alert("Arquivo csv não criado ainda")
                  }
                  setSearch(e.target.value)
                  setView("view")

                }
                )
                .catch(() => {
                  alert("Arquivo csv não criado ou não encontrado")
                })
            }}
            className='wrap'
          >
            <option value="random">random</option>
            <option value="csv">csv</option>
          </select>
        </label>
        {
          search === "random" &&
          <button
            className='write-csv wrap'
            onClick={() => mutateAsync()}
          >
            Gravar dados
          </button>
        }
        {
          search === "csv" && view === "view" &&
          <>
            {
              fields &&
              <label htmlFor="">
                <p>Filtro</p>
                <select name="" id=""
                  className='wrap'
                  onChange={(e) => setFilter(e.target.value)}

                >
                  {
                    fields.map((res, index) => (
                      <option value={res} key={index}>{res}</option>
                    ))
                  }
                </select>
              </label>
            }
            <input
              type="text"
              ref={typed}
              className='wrap'
              placeholder='Filtrar busca'
              onChange={async (e) => {
                if (e.target.value === "") {
                  await setValue("")
                  queryClient.invalidateQueries([count + search])

                  return
                }
                setValue(e.target.value)
              }}
            />

            <button
              onClick={() => refetch()}
              className='write-csv wrap'>
              Pesquisar
            </button>

          </>
        }


        {
          search === "csv" && view === "view" &&
          <button
            className='write-csv wrap'
            onClick={() => setView("create")}
          >
            Novo registro
          </button>
        }
        {
          view !== "view" &&
          <button
            className='write-csv wrap'
            onClick={() => setView("view")}
          >
            Visão geral
          </button>
        }
        <p>{data && data.length}</p>

      </div>

      <div className='container-cards'>
        {
          view === "view" &&
          <>
            <span className='container'>
              {
                isFetching ? <div>Carregando...</div> :
                  data &&
                    data.length === 0 ? <div> Nada encontrado</div> :
                    data.map(response => (
                      <div
                        key={response.id}
                        className='card'
                      >
                        {
                          search !== "random" &&
                          <>
                            <button
                              className='delete-button'
                              onClick={() => deleteCsv(response.id)}>
                              x
                            </button>
                          </>
                        }
                        <h1>tipo sanguineo: {response.type}</h1>
                        <p>proteína: {response.rh_factor} </p>
                        <p>grupo: {response.group} </p>

                        {
                          search === "csv" &&
                          <button
                            className='edit-button'
                            onClick={() => {
                              setEdit(response)
                              setView("edit")
                            }}
                          > EDITAR </button>
                        }
                      </div>
                    ))
              }
            </span>
            {
              search === "random" &&
              <button onClick={() => setCount(count + 5)}>Carregar mais</button>
            }
          </>
        }
        {
          view === "create" &&
          <>
            <Create count={count} />
          </>
        }
        {
          view === "edit" &&
          <>
            <Edit data={edit} count={count} />
          </>
        }


      </div>
    </div>
  )
}

export default App
