
import { createContext, useState, useContext } from "react"
import { Alert } from "react-native"

const ListsContext = createContext()

export const useLists = () => {
  const context = useContext(ListsContext)
  if (!context) {
    throw new Error("useLists must be used within ListsProvider")
  }
  return context
}

export const ListsProvider = ({ children }) => {
  const [lists, setLists] = useState({
    viendo: [],
    pendiente: [],
    completado: [],
  })

  const addToList = (anime, listName) => {
    const allAnimes = [...lists.viendo, ...lists.pendiente, ...lists.completado]
    const exists = allAnimes.find((item) => item.id === anime.id)

    if (exists) {
      Alert.alert("Aviso", "Este anime ya está en una de tus listas")
      return false
    }

    setLists((prev) => ({
      ...prev,
      [listName]: [...prev[listName], anime],
    }))

    Alert.alert("Éxito", `Añadido a ${listName}`)
    return true
  }

  const removeFromList = (animeId, listName) => {
    setLists((prev) => ({
      ...prev,
      [listName]: prev[listName].filter((item) => item.id !== animeId),
    }))

    Alert.alert("Éxito", "Eliminado de la lista")
  }

  const moveToList = (animeId, fromList, toList) => {
    const anime = lists[fromList].find((item) => item.id === animeId)

    if (anime) {
      setLists((prev) => ({
        ...prev,
        [fromList]: prev[fromList].filter((item) => item.id !== animeId),
        [toList]: [...prev[toList], anime],
      }))

      Alert.alert("Éxito", `Movido a ${toList}`)
    }
  }

  const getAnimeList = (listName) => {
    return lists[listName] || []
  }

  const getTotalCount = () => {
    return lists.viendo.length + lists.pendiente.length + lists.completado.length
  }

  const isInList = (animeId) => {
    const allAnimes = [...lists.viendo, ...lists.pendiente, ...lists.completado]
    return allAnimes.some((item) => item.id === animeId)
  }

  return (
    <ListsContext.Provider
      value={{
        lists,
        addToList,
        removeFromList,
        moveToList,
        getAnimeList,
        getTotalCount,
        isInList,
      }}
    >
      {children}
    </ListsContext.Provider>
  )
}
