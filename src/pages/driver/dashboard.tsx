import React, { useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';

interface ICoords {
  lat: number;
  lng: number;
}

interface IDriverProps {
  lat: number;
  lng: number;
  $hover?: any;
}

const Driver: React.FC<IDriverProps> = () => <div className="text-lg">🚖;</div>

export const Dashboard = () => {
  const [driverCoords, setDriverCoords] = useState<ICoords>({ lat: 0, lng: 0 });
  const [map, setMap] = useState<google.maps.Map>();
  const [maps, setMaps] = useState<any>();

  // @ts-ignore
  const onSucces = ({ coords: { latitude, longitude } }: Position) => {
    setDriverCoords({ lat: latitude, lng: longitude });
  };
  // @ts-ignore
  const onError = (error: PositionError) => {
    console.log(error);
  };

  useEffect(() => {
    navigator.geolocation.watchPosition(onSucces, onError, {
      enableHighAccuracy: true,
    });
  }, []);
  useEffect(() => {
    if (map && maps) {
      map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
      // const geocoder = new google.maps.Geocoder();
      // geocoder.geocode(
      //   { location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng) },
      //   (results, status) => {
      //     console.log(status, results);
      //   }
      // )
    }
  }, [driverCoords.lat, driverCoords.lng]);

  const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
    map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
    setMap(map);
    setMaps(maps);
  };

  // Google API를 이용해서 경로 만들기
  const onGetRouteClick = () => {
    if (map) {
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer({
        // polylineOptions: {
        //   strokeColor: '#000',
        //   strokeOpacity: 1,
        //   strokeWeight: 5
        // }
      });
      directionsRenderer.setMap(map);
      directionsService.route(
        {
          origin: {
            location: new google.maps.LatLng(
              driverCoords.lat,
              driverCoords.lng,
            )
          },
          destination: {
            location: new google.maps.LatLng(
              driverCoords.lat + 0.05,
              driverCoords.lng + 0.05,
            )
          },
          travelMode: google.maps.TravelMode.TRANSIT
        },
        (result) => {
          directionsRenderer.setDirections(result);
        }
      )
    }
  }

  return (
    <div>
      <div className="overflow-hidden" style={{width: window.innerWidth, height: '50vh'}}>
        <GoogleMapReact
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={onApiLoaded}
          defaultZoom={16}
          draggable={true}
          defaultCenter={{lat: 36.58, lng: 125.95}}
          bootstrapURLKeys={{ key: 'AIzaSyB_hBJq6YemWYKFq_2KqoVLzCjgW6Da7WU' }}
        ></GoogleMapReact>
      </div>
      <button onClick={onGetRouteClick}>Get route</button>
    </div>
  );
}
