import { useRef, MutableRefObject, useState, useEffect, useCallback, } from 'react';
import mapboxgl from 'mapbox-gl';
import {v4} from 'uuid';
import { Subject } from 'rxjs';

//TODO CAMBIAR API KEY
mapboxgl.accessToken = 'pk.eyJ1Ijoiam9zdWUtMTIzIiwiYSI6ImNsbWYzemlwZTFyNTQzZG1uc214cnN4ZWIifQ.FT9VQSgK84O5F91tPcbnsg';

type Coors ={
    lng:number,
    lat:number,
    zoom:number
}


export const useMapbox = (puntoIncial:Coors) => {
    const mapaDiv: MutableRefObject<HTMLDivElement | null> = useRef(null)
    // const [mapa, setMapa] = useState<mapboxgl.Map | undefined>(undefined);
    const setRef = useCallback(
      (node:any) => {
        mapaDiv.current = node
      },
      [],
    )
    //marcadores
    const marcadores:any = useRef({});
      
    //Observables deRJSX
      const movimientosMarcadores = useRef(new Subject())
      const nuevoMarcador= useRef(new Subject())

    //mapas coords
    const mapa = useRef<mapboxgl.Map | null>(null);
    const [coords, setCoords] = useState<Coors>(puntoIncial)

    //funcion para agregar marcadores
    const agregarMarcador = useCallback((ev:any, id?:string) => {
        const {lng, lat} = ev.lngLat || ev
        //crear un nuevo marcador
        const marker:any = new mapboxgl.Marker()

        marker.id = id ?? v4()
        console.log(marker)
        marker  
            .setLngLat([lng, lat])
            .addTo(mapa.current!)
            .setDraggable(true)

            //Asignar al objeto de marcadores
            marcadores.current[marker.id] = marker;
            //todo si el marcarodr tiene un id no emitir
            if (!id) {
              nuevoMarcador.current.next({
                  id: marker.id,
                  lng,
                  lat
              })
            }
            //asignar movimientos del marcador
            marker.on('drag', ({target}:any) => {
                const {id} = target
                const {lng, lat} = target.getLngLat();
                //todo: emitir evento 
                movimientosMarcadores.current.next({
                    id,
                    lng,
                    lat
                })
            })

    },[])
    //funcion para actualizar la posiocion del marcador
    const actualizarPosicion = useCallback(({id, lng, lat}:any) => {
      marcadores.current[id].setLngLat([lng, lat])
    },[])

    useEffect(() => {
        var map = new mapboxgl.Map({
            container: mapaDiv.current!,
            style: 'mapbox://styles/mapbox/streets-v11',
            center:[puntoIncial.lng, puntoIncial.lat],
            zoom:puntoIncial.zoom
          });
          mapa.current = map
    }, [puntoIncial])

    //CUANSO SE MUEVE EL MAPA
    useEffect(() => {
        mapa.current?.on('move', () =>{
           const {lng, lat} = mapa.current!.getCenter()
           console.log(lng, lat)
           setCoords({
            lng:parseFloat(lng.toFixed(4)),
            lat:parseFloat(lat.toFixed(4)),
            zoom:parseFloat(mapa.current!.getZoom().toFixed(2))
           })
        })
    
       
    }, [mapa])
    
    useEffect(() => {
      mapa.current?.on('click', (ev) => {
        agregarMarcador(ev)
      })
    }, [agregarMarcador])
    
    
  return {
    coords, 
    setRef, 
    actualizarPosicion,
    agregarMarcador,
    marcadores, 
    nuevoMarcador$:nuevoMarcador.current,
    movimientosMarcadores$: movimientosMarcadores.current
}
}
