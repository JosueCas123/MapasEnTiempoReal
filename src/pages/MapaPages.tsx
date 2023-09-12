
import mapboxgl from 'mapbox-gl';
import { useMapbox } from '../hooks/useMapbox';




const puntoIncial = {
    lng:-68.0247,
    lat:-16.6654,
    zoom:15
}

export const MapaPages = () => {
   const {coords, setRef} = useMapbox(puntoIncial)
    
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
