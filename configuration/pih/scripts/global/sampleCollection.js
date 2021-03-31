function setupSampleCollection() {
  const urlParams = new URLSearchParams(window.location.search);
  const orderUuid = urlParams.get("order");
  if (!orderUuid) {
      throw Error("URL parameter 'order' is required, and must be an order UUID");
  }
  $.get("/openmrs/ws/rest/v1/order/" + orderUuid, function(data) {
      console.log(data);
      $("#examenes").text(data.display);
  });
}
