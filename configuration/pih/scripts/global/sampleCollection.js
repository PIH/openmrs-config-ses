$(() => {
	(async () => {
	  // Sección: Arreglo de UI
	  document.querySelector("#iframe > legend").innerText = "Solicitud de Análisis";

	  // Sección: Llamadas a API - EMR
	  const urlParams = new URLSearchParams(window.location.search);
	  const encounterId = urlParams.get("encounterId");
	  const patientId = urlParams.get("patientId");
	  // Subsección: Encounter - Orders
	  const encounter = await $.get(`/openmrs/ws/rest/v1/encounter/${encounterId}`);
	  //examenes=orders.display;
	  const fechaVisitaValue = new Date(Date.parse(encounter.encounterDatetime)).toLocaleString();
	  let examenes=[];
	  //console.log(encounter);
	  $("#fecha").text(new Date(Date.parse(encounter.encounterDatetime)).toLocaleString());
	  $("#local").text(encounter.location.display);
	  $("#proyecto").text(encounter.location.display);
	  encounter.orders.forEach((orders) => {
		//console.log(orders);
		examenes.push(orders.display);
		$("#examenes").append($(`<td>${orders.display}</td>`));
	  });
	  const paciente= await $.get(`/openmrs/ws/rest/v1/patient/${patientId}`);
	  let nombresValue=paciente.person.display.split(" ")[2];
	  let apePaternoValue=paciente.person.display.split(" ")[1].slice(0,-1);
	  let apeMaternoValue=paciente.person.display.split(" ")[0];
	  let fecnac=new Date(Date.parse(paciente.person.birthdate)).toLocaleDateString('en-ZA');
	  let fechaNacimientoValue=fecnac.substring(0,10);
	  let sexoValue=paciente.person.gender;
	  $.each(paciente.identifiers, (i=1, data) => {
		  console.log(data);
		  tipoDocumentoValue = data.display.split('= ')[0];
		  $("#documento").text(tipoDocumentoValue);
		  numeroDocumentoValue = data.display.split('= ')[1];
		  $("#numerodocumento").text(numeroDocumentoValue);
	  });
	  // Sección: Llamadas a API - SEIS
	  const request = {
		Paciente: {
			TipoDocumento: tipoDocumentoValue,
			NumeroDocumento: numeroDocumentoValue,
			Nombres: nombresValue,
			ApellidoPaterno: apePaternoValue,
			ApellidoMaterno: apeMaternoValue,
			FechaNacimiento: fechaNacimientoValue,
			Sexo: sexoValue
		},
		Visita: {
			FechaVisita: fechaVisitaValue
		},
		SolicitudAnalisis: {
			Examenes: examenes
		}
	  };
	  console.log("Objeto de solicitud a API SEIS");
	  console.log(request);
	})();
  });
