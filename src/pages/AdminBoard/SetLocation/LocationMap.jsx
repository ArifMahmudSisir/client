import React, { useRef, useState } from "react";
import {
  GoogleMap,
  Marker,
  Autocomplete,
  useLoadScript,
} from "@react-google-maps/api";
import { FaSearch } from "react-icons/fa";
import { Spin } from "antd";

const libraries = ["places"];
const mapContainerStyle = {
  width: "100%",
  height: "400px",
};
const center = {
  lat: 40.7128, // Default latitude (e.g., New York City)
  lng: -74.006, // Default longitude
};

const LocationMap = ({ selectedPlace, setSelectedPlace }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    libraries,
  });

  const [map, setMap] = useState(null);
  const inputRef = useRef(null);

  const onLoad = (autocomplete) => {
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      const location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };

      setSelectedPlace({
        name: place.name,
        position: location,
      });

      if (map) {
        map.panTo(location);
        map.setZoom(15);
      }
      if (inputRef.current) {
        inputRef.current.value = place.name;
      }
    });
  };

  const onMarkerDragEnd = async (event) => {
    const newLat = event.latLng.lat();
    const newLng = event.latLng.lng();
    const location = { lat: newLat, lng: newLng };

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location }, (results, status) => {
      if (status === "OK" && results[0]) {
        setSelectedPlace({
          name: results[0].formatted_address,
          position: location,
        });

        if (map) {
          map.panTo(location);
        }

        // Update input field value with the new address after dragging
        if (inputRef.current) {
          inputRef.current.value = results[0].formatted_address;
        }
      } else {
        console.error("Geocoder failed due to: " + status);
      }
    });
  };

  if (loadError) return <Spin size="large" tip="Error loading maps...." />;
  if (!isLoaded) return <Spin size="large" tip="loading Maps..." />;

  return (
    <div>
      <Autocomplete onLoad={onLoad}>
        <div className="relative md:w-3/4 w-full">
          <input
            type="text"
            placeholder="Search places..."
            ref={inputRef}
            className="md:w-3/4 w-full p-2 pr-10 pl-10 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <FaSearch className="absolute left-3 top-[41%] transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </Autocomplete>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={12}
        center={selectedPlace ? selectedPlace.position : center}
        onLoad={(map) => setMap(map)}
        options={{
          disableDefaultUI: true,
        }}
      >
        {selectedPlace && selectedPlace.position && (
          <Marker
            position={selectedPlace.position}
            draggable={true}
            onDragEnd={onMarkerDragEnd}
          />
        )}
      </GoogleMap>
    </div>
  );
};

export { LocationMap };
