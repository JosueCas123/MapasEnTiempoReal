
import mapboxgl from 'mapbox-gl';
import { useMapbox } from '../hooks/useMapbox';
import { useContext, useEffect } from 'react';
import { SocketContext } from '../context/SocketContext';




const puntoIncial = {
    lng:-68.0247,
    lat:-16.6654,
    zoom:15
}

export const MapaPages = () => {
  const {socket} = useContext(SocketContext)
   const {coords, setRef, nuevoMarcador$,movimientosMarcadores$, agregarMarcador, actualizarPosicion} = useMapbox(puntoIncial);


   //mostrar todos los maracdores activos
   useEffect(() => {
     socket.on('emitit-marcadores-activos', (marcadores) => {
     
      for(const key of Object.keys(marcadores)){
        agregarMarcador(marcadores[key], key)
      }
     })
   }, [socket, agregarMarcador])
   
    useEffect(() => {
      nuevoMarcador$.subscribe(marcador => {
        socket.emit('marcador-nuevo', marcador)
      })
    }, [nuevoMarcador$,socket])
    
    useEffect(() => {
        movimientosMarcadores$.subscribe( movimiento => {
           socket.emit('marcador-actualizado', movimiento)
        })
    }, [socket, movimientosMarcadores$])
    //Mover el marcador medienta socket
    useEffect(() => {
     socket.on('marcador-actualizado', (marcador) => {
      actualizarPosicion(marcador)
     })
    }, [socket, actualizarPosicion])
    
    //cucahar nuevos marcadores
    useEffect(() => {
      socket.on('marcador-nuevo',(marcador) => {
       agregarMarcador(marcador, marcador.id)
      })
    }, [socket, agregarMarcador])
    
  return (
    <>
        <div className='info'>
            lng:{coords.lng} | lat:{coords.lat} | zoom:{coords.zoom}
        </div>
         <div 
            ref={setRef}
            className="mapContainer"
        />
    </>
  )
}
