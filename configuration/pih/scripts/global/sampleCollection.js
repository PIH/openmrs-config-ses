$(() => {
	(async () => {
	  // Sección: Arreglo de UI
	  document.querySelector("#iframe > legend").innerText = "Solicitud de Análisis";

	  // Sección: Llamadas a API - EMR
	  const urlParams = new URLSearchParams(window.location.search);
	  const encounterId = urlParams.get("encounterId"), patientId = urlParams.get("patientId");
	  // Subsección: Encounter - Orders
	  const encounter = await $.get(`/openmrs/ws/rest/v1/encounter/${encounterId}`);
	  //examenes=orders.display;
	  let fechaVisitaValue=new Date(Date.parse(encounter.encounterDatetime)).toLocaleString();
	  //let examenes1=[orders];
	  console.log(encounter);
	  $("#fecha").text(new Date(Date.parse(encounter.encounterDatetime)).toLocaleString());
	  $("#local").text(encounter.location.display);
	  $("#proyecto").text(encounter.location.display);
	  $.each(encounter.orders, (i, orders) => {
		console.log(orders);
		examenes=orders.display;
		$("#examenes").append($(`<td>${examenes}</td>`));
	  });
	  // Subsección: Concepto - Tipo de documento
	  const tipoDocumento = await $.get(`/openmrs/ws/rest/v1/obs?patient=${patientId}&concept=b105fdb9-15de-48cd-a741-6c8b6a6bece8`);
	  //let tipoDocumentoValue = tipoDocumento.results;
	  $.each(tipoDocumento.results, (i, results) => {
		tipoDocumentoValue = results.display.split(': ')[1];
		$("#documento").text(tipoDocumentoValue);
	  });
	  // Subsección: Concepto - Número de documento
	  const numeroDocumento = await $.get(`/openmrs/ws/rest/v1/obs?patient=${patientId}&concept=87670a92-bc08-4434-9396-43a440d6f29e`);
	  //let numeroDocumentoRaw = null;
	  $.each(numeroDocumento.results, (i, results) => {
		numeroDocumentoValue = results.display.split(': ')[1];
		$("#numerodocumento").text(numeroDocumentoValue);
	  });
	  const paciente= await $.get(`/openmrs/ws/rest/v1/patient/${patientId}`);
	  let nombresValue=paciente.person.display;
	  let fecnac=new Date(Date.parse(paciente.person.birthdate)).toLocaleDateString('en-ZA');
	  let fechaNacimientoValue=fecnac.substring(0,10);
	  let sexoValue=paciente.person.gender;
	  // Sección: Llamadas a API - SEIS
	  const request = {
		Paciente: {
			TipoDocumento: tipoDocumentoValue,
			NumeroDocumento: numeroDocumentoValue,
			Nombres: nombresValue,
			ApellidoPaterno: null,
			ApellidoMaterno: null,
			FechaNacimiento: fechaNacimientoValue,
			Sexo: sexoValue
		},
		Visita: {
			FechaVisita: fechaVisitaValue
		},
		SolicitudAnalisis: {
			Examenes: null
		}
	  };
	  console.log("Objeto de solicitud a API SEIS");
	  console.log(request);
	})();
  });