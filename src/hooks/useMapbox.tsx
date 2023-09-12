import { useRef, MutableRefObject, useState, useEffect, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import {v4} from 'uuid';

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
    
    //mapas coords
    const mapa = useRef<mapboxgl.Map | null>(null);
    const [coords, setCoords] = useState<Coors>(puntoIncial)

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
        const {lng, lat} = ev.lngLat
        //crear un nuevo marcador
        const marker:any = new mapboxgl.Marker()

        marker.id = v4()
        console.log(marker)
        marker  
            .setLngLat([lng, lat])
            .addTo(mapa.current!)
            .setDraggable(true)

            marcadores.current[marker.id] = marker
      })
    }, [])
    
    
  return {coords, setRef}
}
