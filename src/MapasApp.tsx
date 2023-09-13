import { SocketProvider } from "./context/SocketContext"
import { MapaPages } from "./pages/MapaPages"


 const MapasApp = () => {
  return (

      <SocketProvider>
        <MapaPages/>
      </SocketProvider>
   
  )
}

export default MapasApp