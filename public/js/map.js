(() => {
  if (typeof mapboxgl === "undefined") return;
  if (typeof mapToken !== "string" || !mapToken.trim()) return;
  const mapEl = document.getElementById("map");
  if (!mapEl) return;

  const coords = listing?.geometry?.coordinates;
  if (!Array.isArray(coords) || coords.length < 2) return;

  const lng = Number(coords[0]);
  const lat = Number(coords[1]);
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) return;
  if (lng < -180 || lng > 180 || lat < -90 || lat > 90) return;

  mapboxgl.accessToken = mapToken;
  const center = [lng, lat];

  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center,
    zoom: 9,
  });

  new mapboxgl.Marker({ color: "red" })
    .setLngLat(center)
    .setPopup(
      new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<h4>${listing?.location ?? ""}</h4><p>exact location will be provided in</p>`
      )
    )
    .addTo(map);
})();